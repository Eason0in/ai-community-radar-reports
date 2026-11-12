# AI 情報日報｜2026-11-12

> 搜尋範圍：Asia/Taipei 2026-11-10～11-12，優先查核近 24–48 小時；必要時補充 11/08～11/10 仍有實用價值的更新。上一期已報導的 Qwen Code 0.27.1、Open WebUI 0.13.1、Agent Session Specification 與 shared robots.txt 偏好訊號不重複。官方公告、專案 release、社群實例與編輯推論分開標示。

## 1. 社群實戰用法

### 把 issue triage agent 做成「可拒絕、可回報不完整」的工作流

- **新在哪裡：** `microsoft/mcp` 的公開 workflow 是一個可讀的 agentic CI 範例：只處理 issue，不碰 PR；先讀目前的 labels、issue type、priority 與 CODEOWNERS，再用最小權限的 GitHub toolset，最後只允許加標籤、設定欄位、留言或 `report-incomplete` 等受限輸出。它把「模型判斷」與「可寫入的結果」分開，並要求資料不足時回報不完整，而不是猜。
- **可以怎麼開始：** 先在測試 repo 複製這個形狀：`issues` trigger → 明確的 `if` 篩選 → `permissions` 最小化 → 先讀現況 → 只開放有限 safe outputs。把 priority 選項、CODEOWNERS 與既有 labels 當成每次執行都要重新讀的資料，不要硬編碼。
- **編輯心得與限制：** 這是 Microsoft MCP repo 的單一實作，不是所有 issue triage 都適用的標準；模型、權限與 safe-output schema 仍要按自己的 repo 驗證。真正值得借鑑的是「拒絕猜測」與「只允許窄輸出」兩個邊界。
- 來源：[microsoft/mcp 的 Issue Triage Agent workflow](https://github.com/microsoft/mcp/blob/main/.github/workflows/issue-triage-agent.md)（目前可讀的官方 repo 範例；可信度：原始設定檔）。

### 長駐 MCP agent 的 OAuth 斷線，不一定能靠重啟解決

- **社群實例：** Hermes Agent 的 issue 記錄 OAuth-backed MCP 在 keepalive／網路中斷後觸發 `anyio.Lock` cross-task 錯誤；連線可能一直死掉，token refresh 停止，最後連重啟都可能要求人工重新登入。作者提供多次環境、版本與 log 對照，並追到 MCP Python SDK 的相關 issue。
- **可以怎麼開始：** 把「WAN／DNS 短暫中斷 → MCP reconnect → token refresh → 重新啟動」加入 staging chaos test；監控每個 server 的 refresh timestamp 與實際 tool call，不只看 process 還活著。長駐服務要保留人工 re-auth 的明確操作路徑。
- **限制：** 這是第三方 agent 的 issue 與上游追蹤，不代表所有 MCP OAuth client 都有相同 bug；不要把單一 stack trace 當成已完成修補。
- 來源：[Hermes Agent OAuth MCP deadlock issue](https://github.com/NousResearch/hermes-agent/issues/38193)（2026-07 起的實際案例，11 月仍可查閱；可信度：社群維護者與多次環境回報）。

## 2. 社群新工具與新玩法

### Agent Reach：把多個難讀平台包成 agent 可呼叫的渠道

- **新在哪裡：** 社群專案 [Agent-Reach](https://github.com/Panniantong/Agent-Reach) 近期仍快速更新，主打用單一 CLI 讀取與搜尋 GitHub、YouTube 字幕、Bilibili、V2EX、Reddit 等來源；README 也列出登入平台、專用瀏覽器與各渠道的 fallback 工具。GitHub 頁面目前顯示約 111k stars，但 stars 不是品質保證。
- **可以怎麼開始：** 先只開預設的 GitHub、網頁、YouTube、Bilibili、V2EX 渠道，試跑 `agent-reach channels`，再用 `agent-reach read <URL>` 驗證輸出；需要登入的平台先用小號與獨立瀏覽器，不要一開始開啟全部實驗渠道。
- **作者心得與限制：** 專案主張只讀、不代替使用者登入，並以首選／備選工具處理網站改版；但它會處理登入 session，且 README 明確警告 PyPI 上同名套件不是本專案。只從作者提供的 GitHub 安裝文件安裝，API key 在本機設定，不貼到對話。
- 來源：[Agent Reach README](https://github.com/Panniantong/Agent-Reach)（專案作者文件，2026-11-08 前後仍有更新；可信度：原始 repo，安全聲明仍需自行審核）。

### Qwen Code 1.0 Preview：從 Node CLI 走向跨平台原生 agent 包

- **新在哪裡：** Qwen Code 於 11/11 發布 `v1.0.0-preview`，把 Qoder 與 Qwen Code 的 agent 能力合併，支援 Qwen／Qoder 帳號、多模型 provider、相容 endpoint、session resume、非互動執行，並提供 macOS、Linux、Windows 原生套件，不必另裝 Node.js。前一天的 `v0.27.2` 也加入 Web Shell 的 WeChat／QQ／Email channel、approval 通知、token／cache hit 顯示、以及從原 Runtime 匯入 Skill。
- **可以怎麼開始：** Preview 先裝在 disposable repo；用一個可中斷的小任務驗證「啟動 → session resume → non-interactive script → 測試結果」，再測 channel、approval 與 Skill import。把舊版設定與工作區備份好，並記下原本的 provider endpoint。
- **限制：** 官方明確說 preview 的介面、設定與行為可能改變；`v0.27.2` 還標示 breaking dependency upgrade，不適合直接替換團隊固定版本。
- 來源：[Qwen Code v1.0.0-preview](https://github.com/QwenLM/qwen-code/releases/tag/v1.0.0-preview)、[v0.27.2](https://github.com/QwenLM/qwen-code/releases/tag/v0.27.2)（2026-11-11、11-10；可信度：官方 release）。

## 3. 官方新功能與推薦用法

### Gemini 4 Carbon：重型 agent 任務可用，但先看成本與工作流

- **新在哪裡：** Google 於 11/10 開放 Gemini 4 Carbon；API、AI Studio、Gemini for business 的介紹價為每百萬 input tokens $2、output tokens $10，並在 Antigravity 預覽 `/swarm`，讓 Carbon 負責架構、協調或審計，較快模型跑平行工作區與 adversarial verifier。GitHub 也在 11/10 將 Carbon GA 納入 Copilot 的 coding agent、CLI、VS Code、Xcode、JetBrains 等入口，但採漸進 rollout。
- **推薦用法：** 把 Carbon 放在「需要多輪驗證、長程除錯、跨文件視覺理解」的少數任務；一般 coding 先用較快模型。若試 `/swarm`，為每個子 agent 設定獨立 workspace、明確驗收測試與總 token budget。
- **評測解讀：** Google 與 Artificial Analysis 同日推出 MKA，200 個私有任務涵蓋 10 個產業、每題約 70 個 rubric checks；Google 表示 Carbon 在該測試品質第 2、平均每任務成本比最高分模型低 6 倍。這是合作 benchmark 與廠商公告中的結果，不等於你的 repo 或企業文件會得到相同排名；官方也說 Carbon 使用的 token 比 Argon 多。
- 來源：[Google：Gemini 4 Carbon is now available](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/)、[Google：MKA benchmark](https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/)、[GitHub Changelog：Gemini 4 Carbon in Copilot](https://github.blog/changelog/2026-11-10-gemini-4-carbon-in-github-copilot/)（2026-11-10；可信度：官方公告；benchmark 數字標示為 Google／合作方結果）。

### Claude Fable 5.2／Mythos 5.2：高難度工作上移，日常任務不必直接用最大模型

- **新在哪裡：** Anthropic 於 11/09 發布 Fable 5.2 與受驗證機構使用的 Mythos 5.2；官方列出的價格是每百萬 input tokens $8、output tokens $40，fast mode 為 $16／$80。Claude Code `v2.1.321` 加入 `claude-fable-5-2`，`v2.1.322` 再補 Vertex 的 fast mode fallback。
- **推薦用法：** 先用 Opus 5.5 做一般 coding／knowledge work，只有在長程規劃、棘手 migration、科學或高難度工程需要時才升到 Fable；讓 Fable 當 advisor／orchestrator，簡單子任務交給較小模型。
- **限制與可信度：** Anthropic 自己的 benchmark、內部 coding 數據與客戶引述都屬官方或廠商提供，不能當獨立保證。Mythos 並非一般帳號即有；Fable 對高風險 cyber／biology 工作仍有 safeguards，遇到限制時不要以「換 prompt」繞過。
- 來源：[Anthropic：Claude Fable 5.2 and Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)、[Claude Code v2.1.321／v2.1.322 release](https://github.com/anthropics/claude-code/releases)（2026-11-09、11-10；可信度：官方公告與官方 release）。

## 4. 使用心得與避坑

### MCP 官方 servers v2.4.0：這次要當安全升級處理

- **發生什麼事：** MCP servers `v2.4.0` 於 11/11 修補三個 server 的六個漏洞：filesystem 升到 `2.3.0`，git 與 fetch 升到 `2026.11.11`。修補包含 filesystem symlink race／特殊檔案讀取、fetch 對 IPv6 site-local 的錯誤判斷，以及用 `//private` 或 `/x/../private` 穿過 robots.txt path guard 的問題。
- **立即檢查：** 盤點所有 agent image、MCP host 與 lockfile 中的 `@modelcontextprotocol/server-filesystem`、`mcp-server-git`、`mcp-server-fetch`；若仍是 date-versioned filesystem，官方提醒套件管理器可能不會自動把 `2.3.0` 視為較新版本，要明確安裝 `@modelcontextprotocol/server-filesystem@2.3.0`。升級後重跑 path traversal、symlink、特殊檔案與私有 IP 測試。
- **限制：** 這是 upstream release 的修補範圍，不代表你的第三方 MCP server 已安全；MCP tool 的權限、網路出口與 secrets 仍要單獨審查。
- 來源：[Model Context Protocol servers v2.4.0](https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0)（2026-11-11；可信度：官方 release 與安全修補說明）。

### Copilot cloud sandbox 開始計費：先把 agent 成本當共享預算看

- **避坑重點：** GitHub 的跨裝置 Copilot cloud experience 在 11 月開始計算 cloud sandbox 用量；Free usage 會從共享的 Actions compute entitlement 扣除，該額度也與 standard runners、部分 larger runners 共用，不是無限的「免費 agent」。不同產品仍按自己的 published meter 計價。
- **可以怎麼開始：** 先為團隊設定 sandbox／Actions 的月度上限，將長任務、平行 agent、重新 resume 與大型 runner 分開記錄；在 cloud session 啟用 MCP、connector 或自訂 skill 前，先確認 repository scope、SSO、寫入權限與企業 allowlist。
- **限制：** 這是 GitHub 產品公告的計費與權限說明，不是你的帳單估算；實際費用仍取決於方案、billing cycle、工作階段與模型／執行環境。
- 來源：[GitHub：connected Copilot cloud experience](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/)（公告 2026-10-28、計費於 11 月開始；可信度：官方 Changelog）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室，以及中英文 AI／工具／Agent／AI Coding 頻道，優先檢查 2026-11-10～11-12、必要時放寬至一週。搜尋到的候選沒有能同時完成「超過 10,000 觀看、可讀回可靠字幕／逐字稿、不是純新聞朗讀、且有實測或技術拆解」四項查核；因此不從標題或影片介紹猜測內容，今日無推薦。

## 今天最值得帶回團隊的三個檢查

- **升級 MCP：** 先盤點 filesystem、git、fetch 的實際版本，特別檢查 date-versioned npm 套件是否被錯過更新。
- **分層模型：** Carbon／Fable 這類重型模型留給需要長程驗證的任務，並記錄每任務成本與通過率。
- **收緊 agent 邊界：** 參考 issue triage workflow 的最小權限、現況重讀與 `report-incomplete`，不要讓 agent 在資料不足時猜欄位或擴大寫入。

## 今日一句話

AI agent 的下一個門檻不是再多一個模型，而是把跨平台 session、MCP 安全版本、模型成本與可拒絕的輸出邊界一起管好。
