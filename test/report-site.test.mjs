import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildPublicReport, buildSite, renderReportPage } from "../scripts/report-site.mjs";

const payload = {
  reportDate: "2026-08-13",
  generatedAt: "2026-08-13T00:00:00.000Z",
  timeZone: "Asia/Taipei",
  topAiRepos: [
    {
      name: "acme/fresh-ai",
      url: "https://github.com/acme/fresh-ai",
      stars: 420,
      forks: 12,
      language: "TypeScript",
      updatedAt: "2026-08-12T12:00:00Z",
      what: "可用的 AI 工具。",
      problem: "降低重複整合成本。",
      contribution: "可補文件。",
      topics: ["ai", "agent"]
    }
  ],
  opportunities: {
    possibleUnlisted: [],
    buildIdeas: []
  }
};

test("buildPublicReport keeps qualifying GitHub projects and labels the primary freshness rule", () => {
  const report = buildPublicReport(payload, {
    githubProjects: [
      {
        name: "acme/fresh-ai",
        url: "https://github.com/acme/fresh-ai",
        stars: 420,
        activityAt: "2026-08-12T12:00:00Z",
        discoveryTier: "primary",
        reason: "7 日內有重大更新"
      },
      {
        name: "acme/small-ai",
        url: "https://github.com/acme/small-ai",
        stars: 99,
        activityAt: "2026-08-12T12:00:00Z",
        discoveryTier: "primary",
        reason: "星數不足"
      }
    ]
  });

  assert.equal(report.date, "2026-08-13");
  assert.deepEqual(report.githubProjects.map((project) => project.name), ["acme/fresh-ai"]);
  assert.equal(report.githubProjects[0].tierLabel, "7 日內新建或重大更新");
});

test("renderReportPage uses readable cards instead of raw Markdown syntax", () => {
  const html = renderReportPage(buildPublicReport(payload, {
    githubProjects: [
      {
        name: "acme/fresh-ai",
        url: "https://github.com/acme/fresh-ai",
        stars: 420,
        activityAt: "2026-08-12T12:00:00Z",
        discoveryTier: "primary",
        reason: "7 日內有重大更新"
      }
    ]
  }));

  assert.match(html, /<article class="card">/);
  assert.match(html, /acme\/fresh-ai/);
  assert.doesNotMatch(html, /\*\*/);
});

test("buildSite packages the latest Markdown daily report as SPA data", async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "daily-report-spa-"));
  const reportsDir = path.join(fixtureDir, "reports");
  const outputDir = path.join(fixtureDir, "docs");
  await writeFile(path.join(fixtureDir, "placeholder"), "");
  await (await import("node:fs/promises")).mkdir(reportsDir);
  await writeFile(path.join(reportsDir, "latest.md"), "# AI 情報日報，2026-08-19\n\n## 1. 今日重點\n\n- 這是最新內容。\n");

  await buildSite({ reportPath: path.join(reportsDir, "latest.md"), outputDir });

  const latest = JSON.parse(await readFile(path.join(outputDir, "data", "latest.json"), "utf8"));
  assert.equal(latest.date, "2026-08-19");
  assert.match(latest.markdown, /這是最新內容/);
});

test("buildSite emits a client-rendered SPA shell for the latest report", async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "daily-report-spa-"));
  const reportsDir = path.join(fixtureDir, "reports");
  const outputDir = path.join(fixtureDir, "docs");
  await (await import("node:fs/promises")).mkdir(reportsDir);
  await writeFile(path.join(reportsDir, "latest.md"), "# AI 情報日報，2026-08-19\n\n## 1. 今日重點\n\n- 最新內容。\n");

  await buildSite({ reportPath: path.join(reportsDir, "latest.md"), outputDir });

  const [index, app] = await Promise.all([
    readFile(path.join(outputDir, "index.html"), "utf8"),
    readFile(path.join(outputDir, "app.js"), "utf8")
  ]);
  assert.match(index, /<div id="app"><\/div>/);
  assert.match(index, /<script type="module" src="\.\/app\.js"><\/script>/);
  assert.match(app, /fetch\("\.\/data\/latest\.json"/);
});

test("buildSite SPA preserves Markdown tables and source links as web elements", async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "daily-report-spa-"));
  const reportsDir = path.join(fixtureDir, "reports");
  const outputDir = path.join(fixtureDir, "docs");
  await (await import("node:fs/promises")).mkdir(reportsDir);
  await writeFile(path.join(reportsDir, "latest.md"), "# AI 情報日報，2026-08-19\n\n| 來源 | 狀態 |\n| --- | --- |\n| [官方文件](https://example.com) | 已查核 |\n");

  await buildSite({ reportPath: path.join(reportsDir, "latest.md"), outputDir });

  const app = await readFile(path.join(outputDir, "app.js"), "utf8");
  assert.match(app, /document\.createElement\("table"\)/);
  assert.match(app, /document\.createElement\("a"\)/);
});

test("buildSite gives report links accessible contrast on the dark card", async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "daily-report-spa-"));
  const reportsDir = path.join(fixtureDir, "reports");
  const outputDir = path.join(fixtureDir, "docs");
  await (await import("node:fs/promises")).mkdir(reportsDir);
  await writeFile(path.join(reportsDir, "latest.md"), "# AI 情報日報，2026-08-28\n\n[來源](https://example.com)\n");

  await buildSite({ reportPath: path.join(reportsDir, "latest.md"), outputDir });

  const styles = await readFile(path.join(outputDir, "styles.css"), "utf8");
  const cardColor = styles.match(/\.report-content\{[^}]*background:(#[0-9a-f]{6})/i)?.[1];
  const linkRule = styles.match(/\.report-content a\{([^}]*)\}/i)?.[1] || "";
  const linkColor = linkRule.match(/color:(#[0-9a-f]{6})/i)?.[1];
  const visitedRule = styles.match(/\.report-content a:visited\{([^}]*)\}/i)?.[1] || "";
  const visitedColor = visitedRule.match(/color:(#[0-9a-f]{6})/i)?.[1];

  assert.ok(cardColor, "report card background color should be declared");
  assert.ok(linkColor, "report links should have an explicit color");
  assert.ok(visitedColor, "visited report links should have an explicit color");
  assert.ok(contrastRatio(linkColor, cardColor) >= 4.5, "report link contrast should meet WCAG AA");
  assert.ok(contrastRatio(visitedColor, cardColor) >= 4.5, "visited report link contrast should meet WCAG AA");
  assert.match(linkRule, /text-decoration/);
});

test("buildSite refreshes cached assets after the link style changes", async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "daily-report-spa-"));
  const reportsDir = path.join(fixtureDir, "reports");
  const outputDir = path.join(fixtureDir, "docs");
  await (await import("node:fs/promises")).mkdir(reportsDir);
  await writeFile(path.join(reportsDir, "latest.md"), "# AI 情報日報，2026-08-28\n");

  await buildSite({ reportPath: path.join(reportsDir, "latest.md"), outputDir });

  const serviceWorker = await readFile(path.join(outputDir, "sw.js"), "utf8");
  assert.match(serviceWorker, /CACHE = "ai-report-spa-v3"/);
  assert.match(serviceWorker, /caches\.delete\(key\)/);
});

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
  const [red, green, blue] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}
