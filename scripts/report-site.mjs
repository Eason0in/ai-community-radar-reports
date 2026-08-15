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

export async function buildSite({ dataDir = "data", outputDir = "docs" } = {}) {
  const latest = JSON.parse(await readFile(path.join(dataDir, "latest.json"), "utf8"));
  await mkdir(path.join(outputDir, "data"), { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), renderReportPage(latest));
  await writeFile(path.join(outputDir, "data", "latest.json"), `${JSON.stringify(latest, null, 2)}\n`);
  await writeFile(path.join(outputDir, "styles.css"), CSS);
  await writeFile(path.join(outputDir, "manifest.webmanifest"), JSON.stringify({ name: "AI 情報日報", short_name: "AI 日報", start_url: "./", display: "standalone", background_color: "#0b1020", theme_color: "#0b1020" }));
  await writeFile(path.join(outputDir, "sw.js"), "self.addEventListener('install',e=>e.waitUntil(caches.open('ai-radar-v1').then(c=>c.addAll(['./','./styles.css','./data/latest.json']))));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));");
}

function formatDate(value) { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "日期未標示" : date.toLocaleDateString("zh-TW", { month: "numeric", day: "numeric" }); }
function escapeHtml(value) { return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
function escapeAttribute(value) { return escapeHtml(value); }

const CSS = `:root{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC",sans-serif;color:#eef2ff;background:#0b1020}*{box-sizing:border-box}body{margin:0;background:linear-gradient(160deg,#111a37,#0b1020 45%);min-height:100vh}main{width:min(100%,720px);margin:auto;padding:32px 18px 48px}header{padding:20px 2px 28px}h1{font-size:clamp(2rem,8vw,3.1rem);line-height:1.1;margin:.3rem 0 1rem}h2{font-size:1.25rem;margin:0 0 .8rem}.eyebrow{color:#8fb2ff;font-size:.85rem;font-weight:700;letter-spacing:.06em}.lede{font-size:1.12rem;line-height:1.7;color:#d3dcf6}.meta{color:#aebbdc;font-size:.9rem}.card{background:#171f3b;border:1px solid #2a3762;border-radius:18px;padding:20px;margin:14px 0;box-shadow:0 12px 30px #0003}.card p,.card li{font-size:1.05rem;line-height:1.75}.card a,footer a{color:#a9c5ff;text-decoration:none}.card a:hover{text-decoration:underline}details{border-top:1px solid #34416b;margin-top:16px;padding-top:14px}summary{cursor:pointer;font-weight:700}footer{padding:26px 2px;color:#aebbdc;font-size:.9rem}`;

if (process.argv[1] && process.argv[1].endsWith("report-site.mjs")) buildSite();
