import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowPath = new URL("../.github/workflows/daily-ai-community-radar.yml", import.meta.url);
const generatorPath = new URL("../scripts/daily-ai-community-radar.mjs", import.meta.url);

test("community radar writes only to its own archive and never deploys the daily report SPA", async () => {
  const workflow = await readFile(workflowPath, "utf8");

  assert.match(workflow, /REPORT_OUTPUT_DIR:\s*community-radar\/reports/);
  assert.match(workflow, /REPORT_DATA_DIR:\s*community-radar\/data/);
  assert.match(workflow, /git add community-radar/);
  assert.doesNotMatch(workflow, /git add LATEST_REPORT\.md reports data/);
  assert.doesNotMatch(workflow, /actions\/deploy-pages/);
  assert.doesNotMatch(workflow, /actions\/upload-pages-artifact/);
});

test("community radar derives its root latest file from the configured output directory", async () => {
  const generator = await readFile(generatorPath, "utf8");

  assert.match(generator, /latestReportPath:\s*path\.join\(path\.dirname\(outputDir\), "LATEST_REPORT\.md"\)/);
  assert.match(generator, /writeFile\(CONFIG\.latestReportPath, markdown, "utf8"\)/);
  assert.doesNotMatch(generator, /writeFile\("LATEST_REPORT\.md", markdown, "utf8"\)/);
});
