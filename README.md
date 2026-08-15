# AI Community Radar Reports

這是一個專門放每日排程報告的專案。每天平日早上 7:00（Asia/Taipei）自動整理 AI 開源 repo 與 MCP / tool 社群機會。

## 產出內容

- GitHub 前 3 名熱門且近期活躍的 AI 相關 repo
- 每個 repo 的用途、解決的問題、可切入的貢獻角度
- 可能還沒收錄到官方 MCP Registry 的 npm / GitHub 候選工具
- 根據當天熱門 repo 與 MCP 生態缺口提出可實作工具建議

## 每日篩選規則

- 預設只納入近 2 天有 pushed update 的 GitHub repo。
- GitHub archived repos 一律排除。
- 這個規則用在每天 7:00 的自動檢查，避免報告塞入超過 2 天沒更新的封存或過期項目。
- 可用 `REPORT_MAX_STALE_DAYS` 調整天數。

報告會用 Markdown 寫到：

- `LATEST_REPORT.md`
- `reports/YYYY-MM-DD.md`
- `reports/latest.md`

同一次產出也會建立給手機閱讀站與 Custom GPT 使用的結構化資料：

- `data/YYYY-MM-DD.json`
- `data/latest.json`

GitHub Actions 成功驗證後只會 commit 當期日報、兩個 latest Markdown 別名與 JSON archive；沒有內容變更時不建立空 commit。網站由 GitHub Pages 的 Actions artifact 發布，不會把建置後的 `docs/` 混進內容 commit。

## 手機閱讀站與 Custom GPT

啟用 repository 的 **Settings → Pages → Source: GitHub Actions** 後，每次日報會部署手機優先的 PWA。它以卡片呈現重點、GitHub 專案與行動建議，避免讀者直接閱讀原始 Markdown。

Custom GPT 應把公開的 `data/latest.json` 當作最新資料入口；它適合追問、依興趣篩選與比較專案，而日常閱讀入口仍是 Pages 網站。公開網站與 JSON 不得包含 token、個資或內部資訊。

## 排程

GitHub Actions 使用 UTC cron。台北時間週一到週五 07:00 等於 UTC 前一天 23:00，所以 workflow 使用：

```yaml
0 23 * * 0-4
```

也可以在 GitHub Actions 頁面用 `workflow_dispatch` 手動執行。

注意：schedule 只有在這些檔案被推到 GitHub repository 的 default branch 後才會由 GitHub Actions 自動觸發。

## 本機執行

```bash
npm run report
```

只檢查語法：

```bash
npm run check
```

## 可設定環境變數

- `GITHUB_TOKEN`: GitHub API token。GitHub Actions 會自動提供 `secrets.GITHUB_TOKEN`；本機未設定時，腳本會嘗試讀取 `gh auth token` 作為 fallback。
- `REPORT_TIME_ZONE`: 預設 `Asia/Taipei`。
- `REPORT_OUTPUT_DIR`: 預設 `reports`。
- `REPORT_MAX_STALE_DAYS`: GitHub repo 超過幾天沒 pushed update 就排除，預設 `2`。
- `GITHUB_LOOKBACK_DAYS`: 舊版相容變數；未設定 `REPORT_MAX_STALE_DAYS` 時會被拿來當 fallback。
- `MCP_REGISTRY_MAX_PAGES`: 官方 MCP Registry 最多取樣頁數，預設 `8`。
- `NPM_SEARCH_SIZE`: npm MCP 搜尋結果數，預設 `30`。
- `REPORT_DRY_RUN`: 設為 `true` 時只印報告，不寫檔。

## 資料來源

- GitHub Search API
- npm Registry search API
- Official MCP Registry REST API
- Glama MCP directory / methodology pages 作為人工交叉檢查入口
