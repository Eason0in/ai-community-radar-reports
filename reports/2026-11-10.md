# AI 情報日報｜2026-11-10

> 搜尋範圍：Asia/Taipei 2026-11-08～11-10，優先查核近 24–48 小時；必要時補充 11/03～11/08 的仍有實用價值進展。昨日已報導的 Qwen Code 0.27.0、Claude Code 2.1.319、Codex 0.167.0 與 GitHub agentic engineering 不重複，改報今天的新版本、落地案例與限制。官方公告、專案 release、社群個案與編輯推論分開標示。

## 1. 社群實戰用法

### GitHub Agentic Workflows 真實案例：agent 做完了，安全輸出仍可能失敗

- **新在哪裡：** Vaadin Flow 的 Documentation Bot issue #26811 記錄了一次完整失敗鏈：agent job 已成功產出文件修改，但後續 `safe_outputs` 的 `create_pull_request` 因 hosted runner 暫時 DNS 失敗而退出 128，PR 沒有建立。維護者用同一 workflow 的前後成功紀錄判斷這是一次性網路問題，不是程式碼或權限問題；這是單一專案的實際案例，不是 GitHub 對所有 runner 的統計。
- **可以怎麼開始：** 把 agent 執行、artifact／safe output、PR 建立、通知分成可重試的階段；先看 agent job 是否真的完成，再看輸出 job 的錯誤類型，最後只重跑失敗 job。對「改檔成功但 PR 沒出現」保留清楚的失敗狀態，不要讓 issue 留著看似可點擊但不存在的假 PR 連結。
- **編輯心得與限制：** 綠色的 agent job 不等於整條自動化完成；網路、Git push、權限與輸出防護都有自己的失敗面。適合把「產出、推送、建立 PR、回報」各自設成可觀測的驗收點。
- 來源：[Vaadin Flow issue #26811](https://github.com/vaadin/flow/issues/26811)（2026-11-02 開立、11/09 仍可見；社群實戰案例，維護者後續說明為 DNS 暫時故障）。

### 把 agent session 當作可回放的證據，而不是只存最後答案

- **新在哪裡：** GitHub Agentic Workflows 在 11/09 發布 Unified Agent Session Specification 2.8.0 草案，定義把 Claude、Copilot、Codex、Gemini、Pi，以及 OpenCode、Goose 等引擎的事件轉成保留來源的有序 session trace，並把 agent、MCP gateway、workflow firewall、safe output、grader 與 eval 證據合併到結論 artifact。
- **可以怎麼開始：** 在 CI 先保留原始 engine log，再產生一份 `aw_session.jsonl`；每個 tool call 對應輸入、輸出、時間與來源，最後把測試結果和部署 artifact 連回同一個 session。遇到「模型說完成」時，先用 trace 查是否真的跑過工具、是否被權限拒絕、是否只留下未完成的工作。
- **編輯心得與限制：** 這是 GitHub 專案草案，不是 W3C 或跨產品正式標準，也不代表每個引擎版本都已符合。它的價值在於先建立證據模型；導入前要固定自己的 schema 版本與資料保留政策。
- 來源：[GitHub Agentic Workflows：Unified Agent Session Specification 2.8.0](https://github.github.com/gh-aw/specs/unified-agent-session-specification/)（2026-11-09；官方專案草案，明確標示非 W3C 標準）。

## 2. 社群新工具與新玩法

### Open WebUI 0.13.1：把 Claude Code、Codex、Pi 放進 model picker

- **新在哪裡：** 11/08 的 Open WebUI 0.13.1 讓 Open Terminal 中可用的 coding agent 出現在模型選擇器，可在聊天或語音中呼叫、選 reasoning effort／service tier，並在聊天裡批准工具請求；同一版也推出 Tether 桌面 companion，讓瀏覽器或手機連到自己的電腦、repo 與工具。這是產品功能清單，不是模型品質 benchmark。
- **可以怎麼開始：** 先在測試 repo 綁一個 Open Terminal，選單一 agent 完成「讀 issue → 改小檔案 → 跑測試」；確認工作目錄、權限提示、斷線重連與 agent terminal 消失時的 fallback，再把 Tether 用在非敏感專案。新聊天可用 working-directory picker，避免 agent 誤把家目錄當 repo。
- **編輯心得與限制：** 每個對話只使用一個 agent，agent chat 不能像一般聊天一樣重新生成或編輯重送；terminal 消失時會退回預設模型。Tether 讓遠端控制更方便，也讓本機檔案與工具邊界更值得先審查。
- 來源：[Open WebUI v0.13.1 release](https://github.com/open-webui/open-webui/releases/tag/v0.13.1)（2026-11-08；專案官方 release）。

### ACP 0.101.1：把背景 Bash、Monitor 與恢復後 session 顯示補齊

- **新在哪裡：** Agent Client Protocol 的 `claude-agent-acp` v0.101.1（11/09）修正 autonomous turn 在尾端 idle 時保持開啟、列出 resumed session 的模型、顯示 subagent 背景 Bash 與 Monitor calls，並更新到 ACP SDK 2.5.0 與 Claude Agent SDK 0.3.319。這是在 agent client／IDE 整合層補足可觀測性，不是新模型。
- **可以怎麼開始：** 若你的 IDE 或 agent UI 使用 ACP，先在一個會產生背景工作、重新連線與 compaction 的 repo 升級測試；確認背景命令出現在 UI、恢復 session 仍顯示正確模型，且完成狀態不會因尾端 idle 被提早關閉。
- **編輯心得與限制：** 這個 release 主要是修正與協定相容性；ACP client、server、SDK 版本仍需成對驗證，不能只升級其中一端就假設所有 UI 都一致。
- 來源：[claude-agent-acp v0.101.1](https://github.com/agentclientprotocol/claude-agent-acp/releases/tag/v0.101.1)（2026-11-09；官方專案 release）。

## 3. 官方新功能與推薦用法

### Qwen Code 0.27.1：背景執行、LSP、Session trace 與 MCP 自助安裝更可控

- **新在哪裡：** Qwen Code CLI v0.27.1 於 11/09 發布；值得注意的不是版本號，而是把預設背景執行變成可設定、加入 user-scoped LSP 設定／環境變數、提供 Session resource 與 agent-trace diagnostics，並加入 managed-agent 的 archive 與 MCP self-service installation；另有 opt-in 的 Mem0 個人記憶。Desktop v0.27.1 同日發布，沿用這批核心更新。
- **推薦用法：** 先在 disposable workspace 升級，明確寫下 background execution 的預設值；讓一個長任務跑完後檢查 session trace、模型統計、MCP 安裝 receipt 與權限，再決定是否放進團隊設定。LSP 先以 user scope 試行，避免直接改每個 repo 的行為。
- **編輯心得與限制：** release note 只證明功能已合入，不代表所有 provider、桌面包裝或 managed-agent 後端都同時可用；Mem0 是 opt-in 個人記憶，導入前要確認資料放置、清除與跨工作區邊界。背景工作越方便，越需要用 trace／artifact 判定是否真的完成。
- 來源：[Qwen Code v0.27.1 release](https://github.com/QwenLM/qwen-code/releases/tag/v0.27.1)、[Qwen Code Desktop v0.27.1](https://github.com/QwenLM/qwen-code/releases/tag/desktop-v0.27.1)（2026-11-09；專案官方 release）。

## 4. 使用心得與避坑

### `__usage_ai-training` 不是新的封鎖爬蟲指令

- **發生什麼事：** OpenAI、Google 與 Microsoft 近期分別表示會支援 IETF AI Preferences 工作中的共享 `robots.txt` policy token；寫法可像 `User-Agent: __usage_ai-training` 搭配 `Disallow: /`，讓網站對「內容是否用於生成式 AI 訓練」表達偏好。Google 目標 2027 年支援，Microsoft 表示 2027-02-01 起爬取時生效，OpenAI 則說未來幾個月實作；Anthropic 的 IETF draft 是目前的規格來源。
- **可以怎麼開始：** 先盤點既有 `Google-Extended`、Bing／各家 crawler 規則與網站的 `noindex`／`nosnippet`，再決定是否加共享 token；用 staging 的 `robots.txt` 做 parser、path precedence 與回歸檢查，並保留各家專用控制。若要允許某個公開路徑，可用較具體的 `Allow` 規則，不要一次把整站意外排除。
- **避坑重點：** IETF 文件明確說這個 token 是「內容使用偏好」，不是 crawler 的存取指令；bot 仍可能抓取內容。它是自願、仍在草案中的跨供應商訊號，不會追回已抓資料，也不能取代真正的爬蟲封鎖規則。Google 還提醒：若沒有明確允許 `Google-Extended`，共享拒絕可能同時影響 Gemini grounding 的曝光與點擊。
- 來源：[OpenAI：shared robots.txt signal](https://openai.com/index/helping-websites-express-ai-training-preferences/)（2026-10-30；官方）；[Google Search Central](https://developers.google.com/search/blog/2026/10/ai-training-control)（2026-10-30；官方）；[Microsoft Bing：training and grounding preferences](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/)（2026-10-30；官方）；[IETF Internet-Draft](https://datatracker.ietf.org/doc/html/draft-kelley-aipref-training-preference-signal)（2026-10-30；工作草案）。

### 升級 Open WebUI 0.13.1 前先備份，且不要把 RAG 預設變化當成小修

- **避坑重點：** 0.13.1 含資料庫 schema 變更，官方要求正式環境先備份，多 worker／多 server／load-balanced 部署必須同時更新，不支援 rolling update；同版 RAG 預設 `RAG_TOP_K` 與 `RAG_TOP_K_RERANKER` 從 3 改成 10，`CHUNK_SIZE` 從 1000 改成 1024，既有 knowledge 仍保留舊 chunks，但新索引與 prompt 長度會變。
- **可以怎麼開始：** 先複製資料庫與一組代表性文件，記錄升級前後檢索結果數量、prompt token、延遲與回答引用；對多 worker 部署安排同時切換與回復方案。若成本或上下文長度上升，明確設定自己的 RAG 值，不要依賴新預設。
- 來源：[Open WebUI v0.13.1 release 的 Changed 區段](https://github.com/open-webui/open-webui/releases/tag/v0.13.1)（2026-11-08；專案官方 release）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-11-08～11-10，並放寬至一週。候選 **TrickyWorld〈AI Agent From Scratch: 60 Lines, No Framework〉** 發布約 4 天，但 YouTube 實際頁面只顯示 **96 次觀看**，且播放器標示未提供字幕／隱藏式輔助字幕；未達「超過 10,000 觀看＋可靠字幕已讀＋有深度實作」的門檻，因此不從標題或介紹猜測內容，今日無推薦。

## 今天最值得帶回團隊的三個檢查

- **驗收整條鏈：** agent、safe output、PR、通知各自要有狀態與可重試證據。
- **保留 session trace：** 最後答案不夠，還要能回放工具、權限、背景工作與 artifact。
- **升級先做回歸：** Qwen／Open WebUI 的背景工作、RAG 預設與資料庫變更，都先在可回復環境測試。

## 今日一句話

AI agent 的可靠度，開始取決於你能不能把「它說完成」轉成可回放的 session、可重試的輸出與可回復的系統狀態。
