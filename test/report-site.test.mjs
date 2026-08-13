import assert from "node:assert/strict";
import test from "node:test";

import { buildPublicReport, renderReportPage } from "../scripts/report-site.mjs";

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
