# AI 情報日報｜2026-10-07

約 4 分鐘閱讀。今天的共同主線是：模型能力再往「可操作」推進，但真正值得帶回團隊的變化，是把 agent 的權限、測試與成本變成可觀察、可驗證的工程介面。

> 截稿時間：2026-10-07 08:04（Asia/Taipei）。
> 查核範圍：優先查 2026-10-05～10-07；必要時補充近一週仍有實作價值的進展。已避開 10/06 的 Pi sampling、Orca Stop、Clef、Agent Orca、Copilot dynamic workflows、Frontier Academy、ChatGPT Ads 與 ReviewBench，除非今天有不同角度或新增證據。
> 證據標示：官方公告／文件是官方事實；模型卡、benchmark 與產品方數字是廠商或作者結果；Reddit／GitHub 是社群實作與自述，不外推成普遍結論。

## 1. 社群實戰用法

### Receipts：確認 agent 寫的測試真的抓得到 bug

- **新在哪裡：** 社群工具 [Receipts](https://github.com/syntaxixr/receipts) 會把變更後的測試跑兩次：一次保留修正，一次只把 source 還原到 base；若兩邊都綠，標成 `THEATER`，表示測試沒有證明這次修正。它支援 pytest、Vitest、Jest，也能作為 Claude Code skill、CLI 或 GitHub Action。
- **可以怎麼開始：** 在有「修 bug＋測試」的分支執行 `npx github:syntaxixr/receipts check`；先看 `PROVEN`、`THEATER`、`WEAK`，再把結果放進 PR，而不是只看 CI 綠燈。
- **編輯心得與限制：** repo 的研究頁面回報 100 個 coding-agent PR 中約 10% 的測試只因 import 了新名稱而在舊程式上失效，沒有真正跑到舊行為；這是作者研究，不是獨立大型 benchmark。它也可能被 editable install、環境變數或非支援的 runner 影響，仍要保留一般測試與人工 review。

### Paveo：把危險 shell 動作變成 fail-closed 的最後一道門

- **新在哪裡：** r/ClaudeAI 的 [Project Showcase 討論](https://www.reddit.com/r/ClaudeAI/comments/1wwli7h/claude_project_showcase_discussion_hub_updated_on/) 分享 [Paveo](https://github.com/paveo-dev/paveo)：用 PreToolUse hook 在執行前攔截 `rm -rf`、force push、`git reset --hard`、`DROP TABLE`，連 agent 修改自己 policy／hook 的行為也列入防護；作者特別強調 hook 出錯時要拒絕執行。
- **可以怎麼開始：** 先在測試 repo 執行 `pip install paveo`、`paveo init claude-code`，用 `paveo replay claude-code` 重播歷史 session，觀察攔截清單是否誤傷正常工作，再逐步加入部署、付款、寄信等高風險命令。
- **編輯心得與限制：** 作者自述兩個月、8,176 次 tool call 中會攔下 117 次 `rm -rf`；這是單一使用者的 replay 結果，不代表通用防護率。hook 只能限制看得見的命令，無法取代最小權限 token、隔離工作區與遠端審核。

## 2. 社群新工具與新玩法

### Agent Session Inspector：先看 session 成本與失敗迴圈，再改 prompt

- **新在哪裡：** [Agent Session Inspector](https://github.com/kishanmundha/agent-session-inspector) 是本機 Web UI，讀取 Claude Code、Codex、GitHub Copilot、OpenCode、Hermes 的 session，提供 prompt／thinking／tool call 時間線、token、成本估算、重試迴圈、compaction 與健康度；repo 聲稱資料不離開本機。
- **可以怎麼開始：** 用 `npx agent-session-inspector` 開啟，先挑一個最近失敗的 session，找出真正耗費 token 的工具結果、重複 retry 或過早 compaction，再只改一項規則重跑。
- **限制：** 成本是依公開價格換算的估計，不是帳單；本機 JSONL 仍可能含 prompt、路徑或敏感資料，使用前要檢查檔案權限與是否會被其他本機服務讀取。專案目前仍是早期小型 repo，不能當成完整 observability 平台。

### jcode 0.91.0：把 coding agent 的外部操作做成明確工具與速度層

- **新在哪裡：** 開源 terminal agent [jcode](https://jcode.sh/) 在 10/06 的 `v0.91.0` 加入 Google Calendar 登入與內建日曆工具，可查看、建立、更新、刪除事件；同時以 `Standard`、`Fast`、`Ultrafast` 速度層切換，並新增 `/desktop` 開啟桌面工作階段。
- **可以怎麼開始：** 從 [安裝指令](https://jcode.sh/) 開始，先只授權一個測試 Google 帳戶與最小 Calendar scope；把「查詢空檔」和「寫入事件」拆成兩個不同任務，寫入前保留人工確認。
- **編輯心得與限制：** 這是工具整合與 UX 的進步，不等於 agent 能可靠理解你的日曆規則；刪改事件、時區、重複事件與 OAuth scope 都要在沙盒帳戶驗收，速度層也應用固定任務量測成本與完成時間。

## 3. 官方新功能與推薦用法

### GPT-6 Astra：電腦使用、Codex 長 session 與資安能力同步升級

- **官方更新：** OpenAI 的 [GPT-6 Astra 公告](https://openai.com/index/gpt-6-astra/)目前標示「today」開始限量 rollout，之後陸續提供 ChatGPT Plus／Pro／Business／Enterprise、API、Azure 與 Bedrock；API 名稱為 `gpt-6-astra`，標準價格是每百萬 input tokens 10 美元、output tokens 50 美元，Fast mode 最高 2 倍速度、價格也為 2 倍。
- **推薦用法：** 先拿來做可回復的 frontend QA、表單填寫、資料整理或 Codex 長任務；Codex 的實驗性 context notes 能跨 context window 保存搜尋結果與測試狀態。高風險流程仍維持 dry-run、確認政策與終態檢查，不要把「能操作瀏覽器」直接等同「可代替人簽核」。
- **能力與限制：** OpenAI 公布的 OSWorld、Terminal-Bench、ExploitBench 等數字都是廠商結果；同一份公告也承認 Astra 的書面 reasoning 較難監控，資安保護可能暫停或停止合法工作，API 任務遇到攔截會直接停止。企業 workspace 初始為關閉，應先設小範圍 pilot、記錄誤攔率、成本與人工接管率。

### Anthropic CVP：把高能力 cyber model 依安全用途分級開放

- **官方更新：** Anthropic 於 10/06 更新 [Project Glasswing](https://www.anthropic.com/glasswing)，推出擴充版 [Cyber Verification Program](https://www.anthropic.com/glasswing)；現在有三個 access tiers，合格資安團隊可依用途申請，現有 Glasswing 成員轉入 Specialized Access tier，並可使用 Claude Opus 5.5、Sonnet 5.5、Mythos 5.1 等模型。
- **推薦用法：** 對防守團隊而言，先把漏洞掃描、修補建議、secure code review 與回歸測試放在明確 scope；每一級 access 都配專案、資產、網路與審計邊界，將「可找到問題」和「可產生 exploit」分開審批。
- **限制：** 這是 Anthropic 的 access policy 與安全計畫，不是第三方證明模型安全；官方早先對 Mythos 的「找到數千個高嚴重度漏洞」也屬公司自身觀察。申請到高權限不代表團隊已有 incident response、隔離環境或漏洞揭露流程。

## 4. 使用心得與避坑

### 先驗證「做過 agent」的定義，再比較工具與履歷

- **社群訊號：** r/SoftwareEngineerJobs 的 [10/04 討論](https://www.reddit.com/r/SoftwareEngineerJobs/comments/1wx1t3w/everyone_is_an_ai_expert/)指出，現在很多人把「用過 Claude Code」或「寫過一個 Claude app」都稱為 agentic experience；原作者的實際疑問是：真正的 agent 設計、技能／規則、MCP 連接、權限、測試與 production 維護，是否被混在同一個名詞裡。
- **可以怎麼用：** 團隊面試或內部分享不要只問用了哪個模型，改問一個完整案例：目標如何拆解、agent 能碰哪些系統、失敗如何重試或停止、如何測試副作用、誰批准最後寫入，以及怎麼量成本與品質。
- **編輯心得與限制：** 這是社群討論，不是勞動市場統計；但它提醒我們，agent 經驗應以「可控流程＋可驗證結果」描述，而不是以工具名稱或 prompt 數量包裝能力。

### 不要把產品 demo、模型 benchmark 與 production SLA 混為一談

- Astra 的 benchmark、Anthropic 的資安能力描述、Paveo 的 replay、Receipts 的研究數字，各自回答不同問題：模型在特定測試的表現、工具作者觀察到的防護、測試是否命中修正、或單一環境的風險樣本。
- 實際導入時至少分三層驗收：**模型層**看固定任務成功率與成本；**harness 層**看權限、停止、重試與 session 可觀察性；**產品層**看資料正確性、人工接管、回滾與 audit trail。缺任何一層，都不能把一次成功 demo 當成可交付能力。

來源：[OpenAI GPT-6 Astra](https://openai.com/index/gpt-6-astra/)、[Anthropic Project Glasswing](https://www.anthropic.com/glasswing)、[Receipts](https://github.com/syntaxixr/receipts)、[Paveo 的社群分享](https://www.reddit.com/r/ClaudeAI/comments/1wwli7h/claude_project_showcase_discussion_hub_updated_on/)、[Agent Session Inspector](https://github.com/kishanmundha/agent-session-inspector)、[jcode changelog](https://jcode.sh/)、[AI agent 經驗討論](https://www.reddit.com/r/SoftwareEngineerJobs/comments/1wx1t3w/everyone_is_an_ai_expert/)。

## YouTube 深度整理

### 今日無推薦

已主動查核 PAPAYA 電腦教室、Tech With Tim、Gary Chen、Matt Pocock、freeCodeCamp 等中英文 AI／工具／Agent／AI Coding 頻道；目前沒有一部同時符合「近 24–48 小時優先（必要時一週內）、觀看數超過 10,000、非 Shorts、具實測／教學／技術拆解、且有可靠字幕或逐字稿」的影片。早期高觀看但超過一週、偏新聞朗讀或缺少可靠字幕的候選均排除，避免從標題或介紹推測內容。

## 今天最值得帶回團隊的三個檢查

- **權限：** agent 能讀到哪些 token、工作區與外部服務？能不能在最小權限與測試帳戶中完成？
- **證據：** 測試是否真的在「沒有修正」的基準上失敗？session、成本與 tool call 能否回放？
- **終態：** Stop、拒絕、超時或 API 攔截後，程序、檔案、日曆事件與遠端資源是否都回到可驗證狀態？

## 今日一句話

更強的 agent 不會自動帶來更可靠的產品；可靠性要靠可觀察的 session、最小權限與能證明修正有效的測試一起補上。
