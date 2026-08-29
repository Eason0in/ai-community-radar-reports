import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TIER_LABELS = {
  primary: "7 日內新建或重大更新",
  active: "48 小時內活躍",
  supplemental: "補充發現"
};

export function buildPublicReport(payload, { githubProjects = payload.topAiRepos || [] } = {}) {
  const projects = githubProjects
    .filter((project) => Number(project.stars) >= 100)
    .slice(0, 5)
    .map((project) => ({
      name: project.name,
      url: project.url,
      stars: Number(project.stars),
      language: project.language || "未標示",
      activityAt: project.activityAt || project.updatedAt,
      reason: project.reason || project.what || "近期值得關注的 AI 開源專案。",
      what: project.what || project.description || "近期值得關注的 AI 開源專案。",
      problem: project.problem || "降低 AI 工具與工作流的實作成本。",
      contribution: project.contribution || "先閱讀文件並以小範圍 issue 或文件修正驗證。",
      tier: project.discoveryTier || "primary",
      tierLabel: TIER_LABELS[project.discoveryTier || "primary"]
    }));

  return {
    schemaVersion: 1,
    date: payload.reportDate,
    generatedAt: payload.generatedAt,
    timeZone: payload.timeZone,
    summary: `今日收錄 ${projects.length} 個 GitHub AI 專案與 ${payload.opportunities?.buildIdeas?.length || 0} 個可嘗試方向。`,
    githubProjects: projects,
    actions: [
      "挑一個專案先讀 README 與最近 release，再決定是否試用。",
      "把有價值的發現記錄成可驗證的工作流，而不是只收藏連結。"
    ],
    sourceUrl: "https://github.com/Eason0in/ai-community-radar-reports"
  };
}

export function renderReportPage(report) {
  const cards = report.githubProjects.map((project) => `
    <article class="card">
      <div class="eyebrow">GitHub 專案 · ${escapeHtml(project.tierLabel)}</div>
      <h2><a href="${escapeAttribute(project.url)}">${escapeHtml(project.name)}</a></h2>
      <p class="meta">★ ${project.stars.toLocaleString("en-US")} · ${escapeHtml(project.language)} · ${formatDate(project.activityAt)}</p>
      <p>${escapeHtml(project.what)}</p>
      <details><summary>為何值得注意</summary><p>${escapeHtml(project.reason)}</p><p><strong>解決問題：</strong>${escapeHtml(project.problem)}</p><p><strong>可嘗試：</strong>${escapeHtml(project.contribution)}</p></details>
    </article>`).join("");

  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0b1020"><link rel="manifest" href="./manifest.webmanifest"><link rel="stylesheet" href="./styles.css"><title>AI 情報日報 · ${escapeHtml(report.date)}</title></head>
<body><main><header><p class="eyebrow">AI 情報日報</p><h1>今天值得知道的 AI 訊號</h1><p class="lede">${escapeHtml(report.summary)}</p><p class="meta">${escapeHtml(report.date)} · ${escapeHtml(report.timeZone)}</p></header>
<section><h2>GitHub 有趣專案</h2>${cards || "<p>今日沒有符合條件的專案。</p>"}</section>
<section class="card"><h2>今天值得嘗試</h2><ol>${report.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ol></section>
<footer><a href="./data/latest.json">結構化資料</a> · <a href="https://github.com/Eason0in/ai-community-radar-reports">完整日報與歷史</a></footer></main><script>if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js')</script></body></html>`;
}

export function renderSpaShell() {
  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0b1020"><link rel="manifest" href="./manifest.webmanifest"><link rel="stylesheet" href="./styles.css"><title>AI 情報日報</title></head>
<body><div id="app"></div><script type="module" src="./app.js"></script></body></html>`;
}

export async function buildSite({ dataDir = "data", outputDir = "docs", reportPath = "reports/latest.md" } = {}) {
  const [existingReport, markdown] = await Promise.all([
    readLatestData(dataDir),
    readFile(reportPath, "utf8")
  ]);
  const latest = {
    ...existingReport,
    schemaVersion: 2,
    date: reportDateFrom(markdown) || existingReport.date,
    markdown
  };
  await mkdir(path.join(outputDir, "data"), { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), renderSpaShell());
  await writeFile(path.join(outputDir, "data", "latest.json"), `${JSON.stringify(latest, null, 2)}\n`);
  await writeFile(path.join(outputDir, "app.js"), SPA_APP);
  await writeFile(path.join(outputDir, "styles.css"), CSS);
  await writeFile(path.join(outputDir, "manifest.webmanifest"), JSON.stringify({ name: "AI 情報日報", short_name: "AI 日報", start_url: "./", display: "standalone", background_color: "#0b1020", theme_color: "#0b1020" }));
  await writeFile(path.join(outputDir, "sw.js"), SERVICE_WORKER);
}

async function readLatestData(dataDir) {
  try {
    return JSON.parse(await readFile(path.join(dataDir, "latest.json"), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

function reportDateFrom(markdown) {
  return markdown.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] || "";
}

function formatDate(value) { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "日期未標示" : date.toLocaleDateString("zh-TW", { month: "numeric", day: "numeric" }); }
function escapeHtml(value) { return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
function escapeAttribute(value) { return escapeHtml(value); }

const SPA_APP = `const app = document.querySelector("#app");

bootstrap().catch((error) => app.replaceChildren(node("p", "error", "無法載入日報：" + error.message)));

async function bootstrap() {
  const response = await fetch("./data/latest.json", { cache: "no-store" });
  if (!response.ok) throw new Error("HTTP " + response.status);
  const report = await response.json();
  document.title = "AI 情報日報 · " + (report.date || "最新");
  const main = node("main", "app-shell");
  main.append(node("header", "report-header", "AI 情報日報 · " + (report.date || "最新日報")), markdown(report.markdown || "目前沒有可顯示的日報內容。"));
  app.replaceChildren(main);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
}

function markdown(source) {
  const article = node("article", "report-content");
  const lines = source.replace(/\\r/g, "").split("\\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^(#{1,3})\\s+(.+)$/);
    const item = line.match(/^[-*+]\\s+(.+)$/);
    if (/^\\|/.test(line) && /^\\|?\\s*:?-{3,}/.test(lines[index + 1] || "")) {
      const table = document.createElement("table");
      table.append(tableRow(line, "th"));
      index += 2;
      while (/^\\|/.test(lines[index] || "")) {
        table.append(tableRow(lines[index], "td"));
        index += 1;
      }
      index -= 1;
      article.append(table);
      continue;
    }
    if (heading) article.append(node("h" + Math.min(heading[1].length + 1, 4), "", heading[2]));
    else if (item) {
      const list = document.createElement("ul");
      while (index < lines.length && /^[-*+]\\s+/.test(lines[index])) {
        list.append(node("li", "", lines[index].replace(/^[-*+]\\s+/, "")));
        index += 1;
      }
      index -= 1;
      article.append(list);
    }
    else if (line.trim() && !/^\\|?\\s*:?-{3,}/.test(line)) article.append(node("p", "", line));
  }
  return article;
}

function tableRow(line, cellTag) {
  const row = document.createElement("tr");
  for (const value of line.trim().replace(/^\\||\\|$/g, "").split("|")) {
    row.append(node(cellTag, "", value.trim()));
  }
  return row;
}

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) appendInline(element, text);
  return element;
}

function appendInline(element, text) {
  let position = 0;
  const links = /\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)/g;
  for (const match of text.matchAll(links)) {
    element.append(document.createTextNode(text.slice(position, match.index)));
    const link = document.createElement("a");
    link.href = match[2];
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = match[1];
    element.append(link);
    position = match.index + match[0].length;
  }
  element.append(document.createTextNode(text.slice(position)));
}
`;

const SERVICE_WORKER = `const CACHE = "ai-report-spa-v3";
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["./", "./styles.css", "./app.js"]))));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  if (new URL(event.request.url).pathname.endsWith("/data/latest.json")) {
    event.respondWith(fetch(event.request).then((response) => { caches.open(CACHE).then((cache) => cache.put(event.request, response.clone())); return response; }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
`;

const CSS = `:root{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC",sans-serif;color:#eef2ff;background:#0b1020}*{box-sizing:border-box}body{margin:0;background:linear-gradient(160deg,#111a37,#0b1020 45%);min-height:100vh}.app-shell{width:min(100%,720px);margin:auto;padding:28px 18px 48px}.report-header{color:#8fb2ff;font-size:.9rem;font-weight:700;letter-spacing:.06em;padding:8px 2px 20px}.report-content{background:#171f3b;border:1px solid #2a3762;border-radius:18px;padding:22px;box-shadow:0 12px 30px #0003}.report-content a{color:#8fb2ff;text-decoration-color:#8fb2ff;text-underline-offset:.16em}.report-content a:visited{color:#c4b5fd}.report-content a:hover,.report-content a:focus-visible{color:#bfd2ff;text-decoration-thickness:2px}.report-content h2{font-size:clamp(1.6rem,6vw,2.3rem);line-height:1.25;margin:0 0 1.2rem}.report-content h3{font-size:1.35rem;margin:2.2rem 0 .7rem;padding-top:.4rem;border-top:1px solid #34416b}.report-content h4{font-size:1.1rem;margin:1.5rem 0 .5rem}.report-content p,.report-content li{font-size:1.03rem;line-height:1.8;overflow-wrap:anywhere}.report-content li{margin-left:1.2rem}.error{padding:2rem;color:#ffd0d0}`;

if (process.argv[1] && process.argv[1].endsWith("report-site.mjs")) buildSite();
