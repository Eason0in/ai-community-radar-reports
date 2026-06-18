import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const CONFIG = {
  timeZone: process.env.REPORT_TIME_ZONE || "Asia/Taipei",
  outputDir: process.env.REPORT_OUTPUT_DIR || "reports",
  dataDir: process.env.REPORT_DATA_DIR || "data",
  maxStaleDays: toPositiveInt(process.env.REPORT_MAX_STALE_DAYS || process.env.GITHUB_LOOKBACK_DAYS, 2),
  registryMaxPages: toPositiveInt(process.env.MCP_REGISTRY_MAX_PAGES, 8),
  npmSearchSize: toPositiveInt(process.env.NPM_SEARCH_SIZE, 30),
  dryRun: /^(1|true|yes)$/i.test(process.env.REPORT_DRY_RUN || ""),
  githubToken: process.env.GITHUB_TOKEN || ""
};

const USER_AGENT = "ai-community-radar/0.1";
const GITHUB_API = "https://api.github.com";
const NPM_API = "https://registry.npmjs.org/-/v1/search";
const MCP_REGISTRY_API = "https://registry.modelcontextprotocol.io/v0.1/servers";
const GLAMA_SEARCH_URL = "https://glama.ai/mcp/servers";

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

async function main() {
  const now = new Date();
  const reportDate = formatDateInTimeZone(now, CONFIG.timeZone);
  const activeSinceDate = formatDateInTimeZone(
    new Date(now.getTime() - CONFIG.maxStaleDays * 24 * 60 * 60 * 1000),
    "UTC"
  );

  const [aiRepos, mcpRepos, npmPackages, registrySample] = await Promise.all([
    findPopularAiRepos(activeSinceDate),
    findRecentMcpRepos(activeSinceDate),
    findMcpNpmPackages(),
    fetchMcpRegistrySample()
  ]);

  const registryIndex = buildRegistryIndex(registrySample);
  const topAiRepos = aiRepos.slice(0, 3).map((repo) => describeRepo(repo, registryIndex));
  const opportunities = buildOpportunities({
    topAiRepos,
    mcpRepos,
    npmPackages,
    registryIndex,
    activeSinceDate
  });

  const payload = {
    generatedAt: now.toISOString(),
    reportDate,
    timeZone: CONFIG.timeZone,
    maxStaleDays: CONFIG.maxStaleDays,
    activeSinceDate,
    sources: {
      github: "https://docs.github.com/en/rest/search/search#search-repositories",
      npm: "https://registry.npmjs.org/-/v1/search",
      mcpRegistry: MCP_REGISTRY_API,
      glama: GLAMA_SEARCH_URL
    },
    topAiRepos,
    opportunities
  };

  const markdown = renderMarkdown(payload);
  const json = `${JSON.stringify(payload, null, 2)}\n`;

  if (CONFIG.dryRun) {
    console.log(markdown);
    return;
  }

  await mkdir(CONFIG.outputDir, { recursive: true });
  await mkdir(CONFIG.dataDir, { recursive: true });

  await Promise.all([
    writeFile(path.join(CONFIG.outputDir, `${reportDate}.md`), markdown, "utf8"),
    writeFile(path.join(CONFIG.outputDir, "latest.md"), markdown, "utf8"),
    writeFile(path.join(CONFIG.dataDir, "latest.json"), json, "utf8")
  ]);

  console.log(`Wrote ${path.join(CONFIG.outputDir, `${reportDate}.md`)}`);
}

async function findPopularAiRepos(activeSinceDate) {
  const topicQueries = [
    "topic:artificial-intelligence",
    "topic:machine-learning",
    "topic:llm",
    "topic:ai-agent",
    "topic:generative-ai"
  ];

  const pages = await Promise.all(
    topicQueries.map((topic) =>
      githubSearchRepositories(`${topic} pushed:>=${activeSinceDate} archived:false`, {
        sort: "stars",
        order: "desc",
        perPage: 10
      })
    )
  );

  return uniqueByFullName(pages.flat())
    .filter((repo) => isFreshUnarchivedRepo(repo))
    .map((repo) => ({
      ...repo,
      radarScore: repo.stargazers_count + repo.forks_count * 0.25 + freshnessScore(repo.pushed_at)
    }))
    .sort((a, b) => b.radarScore - a.radarScore);
}

async function findRecentMcpRepos(activeSinceDate) {
  const queries = [
    `topic:mcp pushed:>=${activeSinceDate} archived:false`,
    `topic:model-context-protocol pushed:>=${activeSinceDate} archived:false`,
    `"model context protocol" pushed:>=${activeSinceDate} archived:false`,
    `"mcp server" pushed:>=${activeSinceDate} archived:false`
  ];

  const pages = await Promise.all(
    queries.map((query) =>
      githubSearchRepositories(query, {
        sort: "updated",
        order: "desc",
        perPage: 10
      })
    )
  );

  return uniqueByFullName(pages.flat())
    .filter((repo) => isFreshUnarchivedRepo(repo))
    .filter((repo) => !isLikelyTemplate(repo))
    .filter((repo) => isLikelyActionableMcpRepo(repo))
    .sort((a, b) => Date.parse(b.pushed_at || 0) - Date.parse(a.pushed_at || 0));
}

async function findMcpNpmPackages() {
  const url = new URL(NPM_API);
  url.searchParams.set("text", "mcp modelcontextprotocol model-context-protocol");
  url.searchParams.set("size", String(CONFIG.npmSearchSize));
  url.searchParams.set("quality", "0.25");
  url.searchParams.set("popularity", "0.45");
  url.searchParams.set("maintenance", "0.30");

  const body = await fetchJson(url);
  return (body.objects || []).map((item) => ({
    name: item.package?.name || "",
    version: item.package?.version || "",
    description: cleanText(item.package?.description || ""),
    date: item.package?.date || "",
    npmUrl: item.package?.links?.npm || `https://www.npmjs.com/package/${item.package?.name || ""}`,
    repositoryUrl: normalizeRepositoryUrl(item.package?.links?.repository || ""),
    score: item.score?.final || 0,
    keywords: item.package?.keywords || []
  })).filter((item) => item.name);
}

async function fetchMcpRegistrySample() {
  const servers = [];
  let cursor = "";

  for (let page = 0; page < CONFIG.registryMaxPages; page += 1) {
    const url = new URL(MCP_REGISTRY_API);
    url.searchParams.set("limit", "100");
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const body = await fetchJson(url);
    servers.push(...(body.servers || []));

    cursor = body.metadata?.nextCursor || "";
    if (!cursor) {
      break;
    }
  }

  return servers;
}

async function githubSearchRepositories(query, { sort, order, perPage }) {
  const url = new URL(`${GITHUB_API}/search/repositories`);
  url.searchParams.set("q", query);
  url.searchParams.set("sort", sort);
  url.searchParams.set("order", order);
  url.searchParams.set("per_page", String(perPage));

  const body = await fetchJson(url, { headers: githubHeaders() });
  return body.items || [];
}

async function fetchJson(url, options = {}) {
  const headers = {
    "Accept": "application/json",
    "User-Agent": USER_AGENT,
    ...options.headers
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
        throw new Error(`GitHub rate limit reached for ${url}`);
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status} for ${url}: ${text.slice(0, 300)}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await sleep(500 * attempt);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

function githubHeaders() {
  const headers = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (CONFIG.githubToken) {
    headers.Authorization = `Bearer ${CONFIG.githubToken}`;
  }

  return headers;
}

function buildRegistryIndex(entries) {
  const values = new Set();
  const packages = new Set();
  const repos = new Set();

  for (const entry of entries) {
    const server = entry.server || entry;
    addIndexValue(values, server.name);
    addIndexValue(values, server.title);
    addIndexValue(values, server.description);

    for (const pkg of server.packages || entry.packages || []) {
      addIndexValue(values, pkg.identifier);
      addIndexValue(values, pkg.registryType);
      if (pkg.identifier) {
        packages.add(pkg.identifier.toLowerCase());
      }
    }

    const repoUrl = normalizeRepositoryUrl(
      server.repository?.url ||
        server.source?.url ||
        server.homepage ||
        entry.repository?.url ||
        ""
    );
    if (repoUrl) {
      repos.add(repoUrl.toLowerCase());
      addIndexValue(values, repoUrl);
    }
  }

  return {
    values,
    packages,
    repos,
    sampledServers: entries.length
  };
}

function describeRepo(repo, registryIndex) {
  const topics = repo.topics || [];
  const description = cleanText(repo.description || "");
  const what = inferWhatItDoes(repo, description, topics);
  const problem = inferProblemSolved(repo, description, topics);
  const contribution = inferContributionAngle(repo, registryIndex);

  return {
    name: repo.full_name,
    url: repo.html_url,
    description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || "unknown",
    topics,
    updatedAt: repo.pushed_at,
    what,
    problem,
    contribution,
    glamaSearchUrl: `${GLAMA_SEARCH_URL}?q=${encodeURIComponent(repo.name)}`
  };
}

function buildOpportunities({ topAiRepos, mcpRepos, npmPackages, registryIndex, activeSinceDate }) {
  const unlistedNpm = npmPackages
    .filter((pkg) => isActionableMcpPackage(pkg))
    .filter((pkg) => !registryIndex.packages.has(pkg.name.toLowerCase()))
    .slice(0, 5)
    .map((pkg) => ({
      type: "npm-package",
      name: pkg.name,
      url: pkg.npmUrl,
      repositoryUrl: pkg.repositoryUrl,
      description: pkg.description || "No description.",
      reason: "npm 上已有人釋出 MCP server / tool 相關 package，但在本次官方 MCP Registry 取樣中沒有命中，可確認是否適合整理、補文件或提交 registry。",
      nextStep: "確認 package 是否真的可用；若品質足夠，協助補 server.json、README install block、Glama/官方 registry 上架流程。"
    }));

  const unlistedRepos = mcpRepos
    .filter((repo) => !isRepoKnownInRegistry(repo, registryIndex))
    .slice(0, 5)
    .map((repo) => ({
      type: "github-repo",
      name: repo.full_name,
      url: repo.html_url,
      description: cleanText(repo.description || "No description."),
      reason: `GitHub 上近 ${CONFIG.maxStaleDays} 天仍有更新、且不是 archived 的 MCP 相關 repo，但在本次官方 MCP Registry 取樣中沒有命中。`,
      nextStep: "先跑通 server、檢查工具 schema 描述，再幫作者補 registry submission 或整理成可安裝 npm package。"
    }));

  const buildIdeas = [
    ...topAiRepos.slice(0, 3).map((repo) => ({
      type: "build-idea",
      name: `${repo.name} MCP companion`,
      url: repo.url,
      description: `為 ${repo.name} 做一個 MCP companion，讓 agent 可以查詢專案能力、範例、設定檔、常見錯誤與 release note。`,
      reason: "熱門 AI repo 通常文件量大、設定組合多；MCP 化後可直接服務 Cursor、Claude Code、Codex、ChatGPT 等 agent 工作流。",
      nextStep: "先做 read-only tools：search_docs、list_examples、explain_config、troubleshoot_error；穩定後再補 scaffold 或 patch 類工具。"
    })),
    {
      type: "build-idea",
      name: "MCP Registry Gap Finder",
      url: "https://registry.modelcontextprotocol.io",
      description: "每天比對 GitHub/npm 的 MCP 新專案與官方 registry / Glama 收錄狀態，產出可上架、可修文件、可合併同類工具清單。",
      reason: "MCP 生態成長快，開發者需要有人把可用但沒被發現的工具整理出來。",
      nextStep: "把本報告的取樣邏輯抽成 MCP server，提供 find_unlisted_servers、score_listing_readiness、generate_submission_checklist。"
    },
    {
      type: "build-idea",
      name: "Tool Definition Quality Linter",
      url: "https://glama.ai/mcp/methodology",
      description: "針對 MCP tools 的 description、input schema、side effects、readOnly/destructive/idempotent hints 做本機 lint。",
      reason: "工具描述品質會直接影響 agent 是否敢用、會不會誤用；這是很多 MCP 專案都需要的貢獻。",
      nextStep: "先支援 JSON schema / FastMCP introspection output，輸出 GitHub PR comment 與修正文案建議。"
    }
  ].slice(0, 6);

  return {
    activeSinceDate,
    maxStaleDays: CONFIG.maxStaleDays,
    registrySampledServers: registryIndex.sampledServers,
    possibleUnlisted: [...unlistedNpm, ...unlistedRepos].slice(0, 8),
    buildIdeas
  };
}

function inferWhatItDoes(repo, description, topics) {
  if (description) {
    return description.endsWith(".") ? description : `${description}.`;
  }

  if (topics.includes("llm")) {
    return "提供與大型語言模型相關的工具、框架或應用元件。";
  }

  if (topics.includes("machine-learning")) {
    return "提供機器學習模型、訓練、推論或資料處理相關能力。";
  }

  return `${repo.full_name} 是近期活躍的 AI 相關開源專案。`;
}

function inferProblemSolved(repo, description, topics) {
  const haystack = `${description} ${topics.join(" ")}`.toLowerCase();

  if (haystack.includes("agent")) {
    return "降低建置 AI agent、工具調用、任務規劃或多步驟自動化的成本。";
  }

  if (haystack.includes("rag") || haystack.includes("retrieval")) {
    return "改善知識檢索、文件問答與模型回答需要可追溯資料來源的問題。";
  }

  if (haystack.includes("inference") || haystack.includes("serving")) {
    return "讓模型部署、推論服務與效能調校更容易落地。";
  }

  if (haystack.includes("ui") || haystack.includes("web")) {
    return "協助開發者更快把 AI 能力做成可用的產品介面或工作流。";
  }

  if (haystack.includes("dataset") || haystack.includes("data")) {
    return "處理 AI 專案常見的資料整理、資料品質或資料使用流程問題。";
  }

  return "解決 AI 應用開發中重複整合、理解成本高或從 prototype 到可用工具落差大的問題。";
}

function inferContributionAngle(repo, registryIndex) {
  if (!isRepoKnownInRegistry({ full_name: repo.name, html_url: repo.url, name: repo.name.split("/").at(-1) }, registryIndex)) {
    return "可先做 read-only MCP companion 或文件搜尋工具，若 repo 沒有官方 MCP integration，這會是低風險且有社群價值的切入點。";
  }

  return "如果已有 MCP 收錄，可從工具描述品質、範例、安裝流程、測試與 Glama/registry metadata 補強。";
}

function renderMarkdown(payload) {
  const lines = [];

  lines.push(`# AI Community Radar - ${payload.reportDate}`);
  lines.push("");
  lines.push(`Generated: ${payload.generatedAt}`);
  lines.push(`Timezone: ${payload.timeZone}`);
  lines.push(`Active cutoff: updated since ${payload.activeSinceDate}; archived GitHub repos excluded`);
  lines.push(`Max stale age: ${payload.maxStaleDays} days`);
  lines.push("");
  lines.push("## 1. GitHub 熱門 AI Repo Top 3");
  lines.push("");

  payload.topAiRepos.forEach((repo, index) => {
    lines.push(`### ${index + 1}. [${repo.name}](${repo.url})`);
    lines.push("");
    lines.push(`- Stars: ${formatNumber(repo.stars)} | Forks: ${formatNumber(repo.forks)} | Language: ${repo.language} | Updated: ${repo.updatedAt}`);
    if (repo.topics.length) {
      lines.push(`- Topics: ${repo.topics.slice(0, 8).join(", ")}`);
    }
    lines.push(`- 可以做什麼: ${repo.what}`);
    lines.push(`- 解決什麼問題: ${repo.problem}`);
    lines.push(`- 可貢獻切角: ${repo.contribution}`);
    lines.push(`- Glama 交叉查詢: ${repo.glamaSearchUrl}`);
    lines.push("");
  });

  lines.push("## 2. MCP / Tool 社群機會");
  lines.push("");
  lines.push(`Registry sample: ${formatNumber(payload.opportunities.registrySampledServers)} servers`);
  lines.push(`Active baseline since: ${payload.opportunities.activeSinceDate}`);
  lines.push("");
  lines.push("### 可能還沒上官方 MCP Registry 的候選");
  lines.push("");

  if (payload.opportunities.possibleUnlisted.length === 0) {
    lines.push("- 今天沒有在取樣範圍內找到明顯候選。");
  } else {
    payload.opportunities.possibleUnlisted.forEach((item) => {
      lines.push(`- [${item.name}](${item.url})`);
      lines.push(`  - 類型: ${item.type}`);
      lines.push(`  - 說明: ${item.description}`);
      lines.push(`  - 為什麼值得看: ${item.reason}`);
      lines.push(`  - 下一步: ${item.nextStep}`);
      if (item.repositoryUrl) {
        lines.push(`  - Repo: ${item.repositoryUrl}`);
      }
    });
  }

  lines.push("");
  lines.push("### 建議可以實作的工具");
  lines.push("");

  payload.opportunities.buildIdeas.forEach((idea) => {
    lines.push(`- [${idea.name}](${idea.url})`);
    lines.push(`  - 可以做什麼: ${idea.description}`);
    lines.push(`  - 為什麼有人會用: ${idea.reason}`);
    lines.push(`  - MVP: ${idea.nextStep}`);
  });

  lines.push("");
  lines.push("## 資料限制");
  lines.push("");
  lines.push("- GitHub 熱門度以近期活躍且 stars 高的 AI topic repo 估算，不等同 GitHub Trending 官方頁面。");
  lines.push(`- 每日檢查排除 GitHub archived repos，以及超過 ${payload.maxStaleDays} 天沒有 pushed update 的 GitHub 項目。`);
  lines.push("- 官方 MCP Registry 以分頁取樣比對，未命中代表值得人工確認，不代表百分之百未上架。");
  lines.push("- Glama 作為人工交叉檢查入口；若後續需要更精準，可再接 Glama public API 的完整查詢結果。");
  lines.push("");
  lines.push("## Sources");
  lines.push("");
  lines.push(`- GitHub Search API: ${payload.sources.github}`);
  lines.push(`- npm Registry search API: ${payload.sources.npm}`);
  lines.push(`- Official MCP Registry API: ${payload.sources.mcpRegistry}`);
  lines.push(`- Glama MCP directory: ${payload.sources.glama}`);
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function isRepoKnownInRegistry(repo, registryIndex) {
  const repoUrl = normalizeRepositoryUrl(repo.html_url || repo.url || "");
  const fullName = (repo.full_name || repo.name || "").toLowerCase();
  const shortName = fullName.split("/").at(-1) || fullName;

  if (repoUrl && registryIndex.repos.has(repoUrl.toLowerCase())) {
    return true;
  }

  if (fullName && registryIndex.values.has(fullName)) {
    return true;
  }

  if (shortName && registryIndex.values.has(shortName)) {
    return true;
  }

  return false;
}

function addIndexValue(set, value) {
  const text = cleanText(value || "").toLowerCase();
  if (!text) {
    return;
  }

  set.add(text);
}

function uniqueByFullName(repos) {
  const seen = new Map();
  for (const repo of repos) {
    if (!repo?.full_name || seen.has(repo.full_name)) {
      continue;
    }
    seen.set(repo.full_name, repo);
  }
  return [...seen.values()];
}

function isFreshUnarchivedRepo(repo) {
  if (repo.archived) {
    return false;
  }

  const pushedAt = Date.parse(repo.pushed_at || repo.updated_at || "");
  if (!Number.isFinite(pushedAt)) {
    return false;
  }

  const ageDays = (Date.now() - pushedAt) / (24 * 60 * 60 * 1000);
  return ageDays <= CONFIG.maxStaleDays;
}

function isLikelyTemplate(repo) {
  const text = `${repo.full_name || ""} ${repo.description || ""}`.toLowerCase();
  return text.includes("template") || text.includes("example only");
}

function isLikelyActionableMcpRepo(repo) {
  const text = `${repo.full_name || ""} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();

  if (text.includes("official") && text.includes("directory")) {
    return false;
  }

  return text.includes("mcp") || text.includes("model context protocol") || text.includes("model-context-protocol");
}

function isActionableMcpPackage(pkg) {
  const name = (pkg.name || "").toLowerCase();
  const text = `${pkg.name || ""} ${pkg.description || ""} ${(pkg.keywords || []).join(" ")}`.toLowerCase();

  if (name.startsWith("@modelcontextprotocol/")) {
    return false;
  }

  if ((pkg.repositoryUrl || "").toLowerCase().includes("github.com/modelcontextprotocol/")) {
    return false;
  }

  if (/\bsdk\b/.test(text) || name.includes("sdk")) {
    return false;
  }

  if (/\b(sdk|client|middleware|adapter)\b/.test(text) && !/\b(server|tool|connector|gateway|agent|automation)\b/.test(text)) {
    return false;
  }

  return (
    /\bmcp\b/.test(text) &&
    (
      /\b(server|tool|connector|gateway|agent|automation|workflow|integration)\b/.test(text) ||
      /(^|\/)(mcp-|.*-mcp|.*mcp-server)/.test(name)
    )
  );
}

function freshnessScore(dateText) {
  const ts = Date.parse(dateText || "");
  if (!Number.isFinite(ts)) {
    return 0;
  }
  const ageDays = Math.max(0, (Date.now() - ts) / (24 * 60 * 60 * 1000));
  return Math.max(0, 30 - ageDays) * 20;
}

function normalizeRepositoryUrl(url) {
  if (!url) {
    return "";
  }

  let normalized = String(url).trim();
  normalized = normalized.replace(/^git\+/, "");
  normalized = normalized.replace(/^git:\/\//, "https://");
  normalized = normalized.replace(/^ssh:\/\/git@github\.com\//, "https://github.com/");
  normalized = normalized.replace(/^git@github\.com:/, "https://github.com/");
  normalized = normalized.replace(/\.git$/, "");
  normalized = normalized.replace(/\/$/, "");
  return normalized;
}

function cleanText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
