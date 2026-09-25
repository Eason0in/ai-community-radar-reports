# AI 情報日報｜2026-09-25

約 4 分鐘閱讀。今天的主線是：Agent 工具開始按「搜尋、抓取、操作、記憶」分層；平台也把 sandbox、telemetry、tool discovery 與持續評測補進正式工作流。真正值得複製的是可驗收的邊界，不是把所有 MCP 一次裝滿。

> 截稿時間：2026-09-25 08:05（Asia/Taipei）
> 查核範圍：優先 2026-09-23～09-25 的官方公告、官方工程文章、公開 repo 與社群實測；未重複 9/24 已報導的 Opus 5.5、Linear／real-browser-mcp、Copilot Rust migration、Claude 生物研究與 `.mcp.json` 實驗。
> 證據標示：官方資料是官方事實；公開 repo 與影片是作者第一手實作；benchmark、客戶案例與創作者心得不等於獨立驗證。

## 1. 社群實戰用法

### 把 Agent 的網路能力拆成「搜尋 → 抓頁 → 操作」三層

- **新在哪裡：** Tech With Tim 的實測把 Exa、Firecrawl、Browser Use 分成不同工作：Exa 找方向與最新結果，Firecrawl 抓已知頁面的完整內容，Browser Use 才負責點擊、填表與控制互動式瀏覽器；影片也示範 GitHub MCP 讀 issue／PR、Context7 查新文件、Mem0 跨 session 留記憶。
- **可以怎麼開始：** 先只裝一個唯讀搜尋工具，做「找 3 個官方來源」；第二步才讓 Firecrawl 抓指定頁面；最後把需要登入或操作的任務交給獨立 Browser Use session。每一步輸出 URL、時間與原始摘錄，再交給下一層，避免把整個網路內容直接塞進 Agent。
- **編輯心得：** 這個分層比「選哪個最強 Agent」更容易量測：搜尋命中率、抓頁完整度、瀏覽器成功率與總工具呼叫數可以分開看。
- **限制：** 影片是創作者示範，不是獨立 benchmark；Browser Use 片段含贊助，遠端瀏覽器、住宅 proxy、登入狀態與 API key 都會增加資料外洩與費用風險。

來源：[Tech With Tim 影片](https://www.youtube.com/watch?v=84-sHkG4AQU)；可信度：完整英文自動字幕與畫面流程已查讀，工具效果仍是作者示範。

## 2. 社群新工具與新玩法

### Public Browser：讓 Claude Code／Cursor 直接操作本機 Chrome

- **新在哪裡：** `Silbercue/public-browser` 以 CDP 連到可見 Chrome，支援真正登入的 profile、accessibility tree、multi-tab 與 `run_plan`；不需要 extension bridge 或雲端跳轉，telemetry 也標成 opt-in。對「程式修好了，但必須在已登入 staging 重現」的任務特別直接。
- **可以怎麼開始：** 先用隔離 Chrome profile，讓 Agent 只執行 `view_page`／唯讀檢查；確認 tab 沒有個資、金鑰或付款頁後，再開放 click／type。Claude Code 的 README 安裝命令是 `claude mcp add --scope user public-browser npx -y public-browser@latest`，安裝後要完整重開 session。
- **作者結果：** repo 公布的 2026 年 9 月同頁測試中，Public Browser 與 Playwright MCP 都是 30/30；作者兩次測試記錄約少 41% tool calls、約少 40% 完成時間、約少 25% list-price 成本。這些是 repo 作者結果，不是獨立驗證。
- **限制：** 它能看到你連上的 tab；README 也顯示在 response size、evaluate 與個別 latency 上並非全面勝出。真實登入 profile 不應與高風險帳號、付款或不可逆操作共用。

來源：[Public Browser GitHub repo](https://github.com/Silbercue/public-browser)；可信度：公開原始碼與測試資料，benchmark 仍屬作者結果。

## 3. 官方新功能與推薦用法

### GitHub Copilot App 把本機 sandbox 與 Agent telemetry 補上

- **官方更新：** GitHub 9/23 將 local sandboxing 放進 Copilot app public preview，可按專案限制檔案讀寫、網路與 Git／GitHub CLI credentials；9/22 也支援由 enterprise-managed settings 設定 OpenTelemetry，追蹤 model request 與 tool activity。sandbox 預設關閉，且只套用新 session 或重啟後的 session。
- **推薦用法：** 新 repo 先開 `/sandbox on`，只給必要資料夾與 outbound network；企業再把 OTel trace 接到既有監控，先保留 prompt／response content capture 關閉，確認資料治理後才逐步放寬。
- **限制：** sandbox 在 public preview，OS 無法強制時會直接失敗，不會自動退回無 sandbox；雲端或 remote host session 不適用。OTel 也不是安全邊界，仍要配合 credential scope、MCP allowlist 與人工核准。

來源：[GitHub local sandboxing](https://github.blog/changelog/2026-09-23-local-sandboxing-in-the-github-copilot-app)、[GitHub OTel](https://github.blog/changelog/2026-09-22-opentelemetry-in-the-github-copilot-app)；可信度：GitHub 官方 changelog。

### Microsoft Foundry：把 Agent 當成可持續優化的 production system

- **官方更新：** Microsoft 9/24 宣布 Foundry 擴大模型選擇、voice agents、long-running resilience、Toolboxes／tool search 與 production insights；官方指出 tool search 在自家 44,000+ 工具、7,000 查詢的公開 benchmark 上，1,000-tool toolbox 的 input token 消耗比一次載入全部工具少逾 97%，屬 Microsoft 內部評估結果。
- **推薦用法：** 先用同一份 production trace 建小型 rubric，固定比較 quality、latency、cost，再讓 tool search 按需發現工具；把「observe → evaluate → optimize → validate」設成上線前的迴圈，不要只在 demo 時選一次模型。
- **限制：** voice agents、resilient hosted agents 與 Insights 仍有 public preview 項目；tool search 的數字不能外推到你的模型、工具描述與工作負載。Microsoft 提到的 customer savings 也都是客戶／廠商案例。

來源：[Microsoft Foundry：expanded model choice, voice agents, and continuous optimization](https://azure.microsoft.com/en-us/blog/ship-agents-faster-with-expanded-model-choice-voice-agents-and-continuous-optimization/)；可信度：Microsoft 官方公告，benchmark／客戶數字標為廠商結果。

### Meta Muse 將進入 AI 眼鏡：從聊天延伸到看見與執行

- **官方更新：** Meta 9/24 表示 Muse 將在未來數月進入 AI glasses；Agent 可根據眼前物品、傳單或清單協助判讀，並連接 Notion、GitHub、Box 等服務。Muse 另有背景工作、email address 與付款 connector，但官方設計仍要求敏感動作前取得同意並提供 audit trail。
- **推薦用法：** 若功能在帳號／地區可用，先做「看見 → 整理 → 草稿」這類可逆工作；把寄信、購買、登入與付款維持人工確認，不要因為裝置在身上就把長期權限一次開滿。
- **限制：** 眼鏡 rollout、connector、付費與地區仍可能不同；這是 Meta 產品敘事與預告，不代表每項能力已在台灣可用或已證明可靠。

來源：[Meta：The Biggest News From Connect 2026](https://about.fb.com/news/2026/09/the-biggest-news-from-connect-2026/)；可信度：Meta 官方公告，發布與可用範圍仍需以帳號實際 rollout 為準。

## 4. 使用心得與避坑

### 兩個最容易被忽略的成本：工具目錄與憑證邊界

- **工具目錄：** 影片創作者提醒，工具太多會增加每次 request 的 context、讓 Agent 選錯工具；Microsoft 這次把 tool search 做成正式能力，也側面印證「按需發現」比每次載入所有 schema 更可控。先從 3–5 個工作必要工具開始，記錄誤呼叫與 token，再擴充。
- **憑證邊界：** 影片示範中有「把 API key 直接交給 coding agent」的片段，創作者也明說不應照做。正確做法是 secrets manager／環境注入、最小 scope、唯讀 token 與獨立 browser profile；不要把 token 貼在 prompt、聊天記錄或共享工作區。
- **benchmark 閱讀法：** Public Browser 的 30/30、少 41% tool calls 等數字必須連同模型、測試頁、版本、run 次數與它輸掉的指標一起看；你的驗收至少要包含成功率、總 token、成本、完成時間、錯誤動作與人工回復時間。
- **一句話避坑：** Agent 能操作，不等於 Agent 應該拿到全部權限；把 sandbox、MCP allowlist、trace、人工核准與可回滾操作一起設計。

來源：[Tech With Tim 影片](https://www.youtube.com/watch?v=84-sHkG4AQU)、[GitHub sandbox 文件](https://github.blog/changelog/2026-09-23-local-sandboxing-in-the-github-copilot-app)、[Public Browser benchmark](https://github.com/Silbercue/public-browser)；可信度：作者心得與官方規則分開標示。

## YouTube

### Tech With Tim｜Top 7 AI Agent Tools That Actually Work

- **頻道／發布／查核：** Tech With Tim；2026-09-17 發布，2026-09-25 查核 50,408 次觀看，片長 19:33；[影片連結](https://www.youtube.com/watch?v=84-sHkG4AQU)。已取得並閱讀 `en-orig` 英文字幕，不從標題或介紹猜內容。
- **摘要：** 創作者用 Codex 示範把 GitHub MCP、Browser Use、Composio、Context7、Exa、Firecrawl、Mem0 接到同一個 Agent harness，核心觀點是「工具與連線往往比換模型更能改變工作流」，但不要無限制增加工具。
- **重點：**
  1. GitHub MCP 可讀 issue／PR、建立 repo 與協助 review；授權仍需最小 scope。
  2. Browser Use 分成雲端 Agent、遠端 browser 與本機 CLI 三種用法；本機可沿用登入狀態，但需要 remote debugging。
  3. Composio 用單一 MCP 連多個 SaaS，並可動態發現工具；集中管理也集中承擔權限風險。
  4. Context7 用來補最新框架文件，避免 coding Agent 依賴過時訓練資料。
  5. Exa 偏語意搜尋，Firecrawl 偏指定頁面抓取，兩者都不同於可點擊、可填表的 Browser Use。
  6. Mem0 把偏好與工作記憶跨 session／Agent 保存，但需要帳號與資料治理。
  7. 影片把多個服務串起來，示範價值在 workflow 分工，不是證明七個服務都比替代方案好。
- **步驟／工作流程：** 選一個 harness → 先裝 GitHub MCP 做唯讀查詢 → 加 Browser Use 做獨立瀏覽器驗證 → 用 Context7 查官方文件 → 用 Exa 找來源、Firecrawl 抓指定頁 → 最後才加 Mem0。每一步都先測一個小任務與權限範圍。
- **工具／模型：** Codex 示範；GitHub MCP、Browser Use、Composio、Context7、Exa、Firecrawl、Mem0。影片沒有提供可重現的模型 benchmark。
- **作者心得：** 創作者認為正確 connections、skills、tools、memory 會拉開同級模型的實用差距；同時也承認工具過多會混淆 Agent。
- **優點：** 有畫面實測、安裝路徑、七個工具的角色分工與替代關係，適合想從單一 MCP 擴充到完整 Agent workflow 的開發者。
- **缺點／限制：** Browser Use 是贊助段落；描述欄含免費額度、affiliate／折扣碼與作者 AI Agent Builders 社群導流。示範使用真實帳號與 API key 的做法不應照抄，也沒有安全、成本或可靠性對照組。
- **適合對象：** 已會使用 Codex／Claude Code、想做 MCP 整合與瀏覽器自動化的工程師；不適合把它當成 production 安全指南的新手。
- **是否值得看：** 值得，因為能在約 20 分鐘建立工具地圖；看完先只試 GitHub MCP + Context7，完成唯讀查詢與官方文件核對，再決定是否加入 Browser Use。
- **立即可試：** 選一個非敏感 repo，要求 Agent 只列出最近 3 個 issue、用 Context7 查目前框架 API，輸出來源 URL 與版本；確認成功後再開啟任何寫入或瀏覽器操作。

可靠時間點（依影片描述）：00:00 總覽、02:15 GitHub MCP、04:24 Browser Use、08:58 Composio、11:33 Context7、13:15 Exa、14:48 Firecrawl、17:24 Mem0。

## 今日一句話

今天最值得帶走的是：把 Agent 做成可觀測、可限權、可替換工具的工作流；先讓它在小範圍證明「找得到、抓得準、停得住」，再談長時間自主執行。

## 來源總覽

- 社群實戰／影片：[Tech With Tim](https://www.youtube.com/watch?v=84-sHkG4AQU)。
- 社群工具：[Public Browser](https://github.com/Silbercue/public-browser)。
- 官方平台：[GitHub local sandboxing](https://github.blog/changelog/2026-09-23-local-sandboxing-in-the-github-copilot-app)、[GitHub OTel](https://github.blog/changelog/2026-09-22-opentelemetry-in-the-github-copilot-app)、[Microsoft Foundry](https://azure.microsoft.com/en-us/blog/ship-agents-faster-with-expanded-model-choice-voice-agents-and-continuous-optimization/)、[Meta Connect 2026](https://about.fb.com/news/2026/09/the-biggest-news-from-connect-2026/)。
- 查核原則：官方 benchmark、作者 benchmark、客戶案例與贊助示範均保留來源與限制，不當作獨立驗證。
