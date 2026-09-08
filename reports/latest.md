# AI 實用日報｜2026-09-08

約 3–4 分鐘閱讀。今日主線是：Agent 正逐漸成為能研究、連工具、管理長任務的工作層，但「工具輸出是否可信」與「人是否仍在控制迴圈」比模型名稱更值得先處理。社群回報、廠商數字與作者展示分開標示，未把它們當成獨立實測。

## 1. 社群實戰用法

### 把 MCP 工具結果當成不受信任輸入

9 月 7 日 r/Notion 有使用者回報，Notion 官方 MCP 的工具描述／結果疑似帶入促銷導向，甚至要求 Agent 不要解釋來源；貼文有大量社群反應，但目前仍是單一社群回報，尚無 Notion 公開回應或第三方重現，不能直接定性為漏洞。

怎麼試：先把外部 MCP 當成「可影響 Agent 行為的輸入」，建立只讀、只連一個資料庫的專用 Agent；逐一檢查工具名稱、描述、輸入欄位與回傳內容，再開啟寫入權限。這個做法與 Notion 自己的安全建議一致：最小化資料與工具、優先 read-only、非只讀呼叫要求人工確認。

編輯心得：MCP 不只是 API 轉接層，也會把工具描述放進模型 context；權限審核應包含「它會叫 Agent 說什麼」，不只看它能讀寫什麼。

來源：[社群回報（9/7）](https://www.reddit.com/r/Notion/comments/1w9depq/notions_official_mcp_connector_prompt_injects_ai/)｜[Notion MCP 安全最佳實務](https://www.notion.com/en-gb/help/security-best-practices-for-agent-connections)｜[Notion 的 prompt injection 說明](https://www.notion.com/help/how-notion-protects-against-prompt-injection-risks)

## 2. 社群新工具與新玩法

### 先掃描，再把 MCP 工具面鎖進 CI

近期開源工具 `mcp-risk` 0.4.0 把 MCP 安全檢查做成安裝前與 CI 流程：可指定 npm 版本、檢查 tarball SHA-256、靜態掃描原始碼與 MCP 設定、固定 GitHub ref 到不可變 commit，並輸出 JSON／Markdown／SARIF。另一個 `AgentGate` 則採「scan → lock → gate」概念，鎖住 Agent 實際看到的 tool name、description 與 schema，再對 drift 產生 diff。

推薦玩法：先對公開或合成設定跑 `npx mcp-risk scan`，再為真正要用的 server 固定版本與 commit；把掃描結果放進 PR，遇到工具描述或權限改變時要求人工 review。兩個專案的數量與涵蓋範圍屬作者／專案聲明，不能當成安全保證。

來源：[mcp-risk GitHub](https://github.com/CoderSufiyan/mcp-risk)｜[AgentGate GitHub](https://github.com/wookat/agentgate)｜[OSV 惡意 MCP 套件案例](https://osv.dev/vulnerability/MAL-2026-10711)

## 3. 官方新功能與推薦用法

- **OpenAI〈An Alien Mind〉（官方，9/6）**：Chief Scientist Jakub Pachocki 表示，隨著模型進入電腦操作、協作與研究，CoT 監控的可靠性正在下降；他認為目前沒有任何實驗室已把對齊與監控做到足以長期以最高速度擴張，並呼籲安全門檻與國際協調。這是 OpenAI 的安全立場與研究判斷，不是已被獨立驗證的能力數據。推薦用法：長任務保留完整 tool trace、人工 checkpoint 與可停止機制，不把「模型看起來很會做」當成可放權證據。[原文](https://openai.com/index/an-alien-mind/)

- **Google DeepMind AI for the Planet APAC（官方，9/7）**：首屆計畫選出亞太 16 個新創、非營利組織與研究團隊，提供三個月專家輔導與 AI 工具支援，聚焦生物多樣性、永續農業與碳方案。這是支持計畫，不是成效 benchmark。推薦用法：若做環境 AI，先把資料來源、現場指標與部署責任寫成可驗收的 pilot，再使用模型或加速器資源。[公告](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/ai-planet-accelerator-apac/)｜[計畫頁](https://deepmind.google/accelerators/ai-for-the-planet/)

## 4. 使用心得與避坑

### 「Agent 已自動化」不等於「可以取消驗收」

今日最實用的組合是：OpenAI 的官方安全文章提醒監控會變難，Notion 的官方文件則把風險落到可操作的權限設定。避坑時不要只問模型多強，至少逐項確認：

1. 工具輸出是否被當成資料而非指令。
2. 是否只開啟完成任務所需的最小頁面、資料庫與工具。
3. 所有寫入、刪除、外部傳送是否仍需人工確認。
4. 是否有完整 log、可回滾狀態與明確停損點。

先用熟悉的小任務做三次回放，檢查 Agent 是否引用正確、是否越權、是否能在中途停止，再考慮背景執行或擴大權限。

來源：[OpenAI 安全文章](https://openai.com/index/an-alien-mind/)｜[Notion 連線安全建議](https://www.notion.com/en-gb/help/security-best-practices-for-agent-connections)

## YouTube：推薦 1 部

### Tech With Tim｜How AI Agents Actually Work (Every Piece Explained & Built)

- **查核資料**：Tech With Tim，2026-09-03 發布；2026-09-08 查核 71,910 次觀看；片長 19:28。[影片](https://www.youtube.com/watch?v=HzGOWq5UyjY)
- **字幕查核**：已下載並閱讀 YouTube `en-orig` 自動字幕全文；可靠時間點包括 00:49 贊助揭露、02:28 harness、03:40 MCP、05:36 sandbox、07:22 trace／observability。不是根據標題或簡介推測。
- **摘要與 5 個重點**：影片把 Agent 拆成 model 之外的執行層，並從零示範一個可工作的流程。
  1. Harness 是負責 prompt、工具呼叫、context 管理、狀態與重啟的 runtime，不是另一個模型。
  2. MCP 是讓 Agent 取得外部工具的標準橋接方式；真正能否工作仍取決於 harness 的支援與權限。
  3. Sandbox 用來隔離程式／檔案操作；本機 sandbox 與雲端 sandbox 的可靠性、成本和資料邊界不同。
  4. 示範把 Exa MCP、skills、sub-agents 和 web research 串起來，並在 UI／terminal 看 tool trace。
  5. 作者最後展示以自然語言建立 dashboard 與可重用 Agent，但一次成功的 demo 不代表穩定性或安全性。
- **工具／模型與作者心得**：工具是 MIT 開源的 [TrueForge](https://github.com/truefoundry/trueforge)、Exa MCP、skills 與 sandbox；字幕示範使用可替換模型，後段提到 Qwen 3.6。作者的核心觀點是：生產 Agent 的差異往往在 harness、工具、sandbox、狀態與可觀測性，而不只是模型。
- **優點、限制與適合對象**：優點是把常被混在一起的 model、harness、MCP、skills、sandbox 拆清楚，並有可跟做的建置流程；限制是由贊助工具主導，未提供獨立可靠性、成本或安全比較，且示範使用的雲端 sandbox／外部 MCP 會帶來額外權限與費用。適合剛開始做 Agent 的開發者、產品工程師與想理解架構分層的人。
- **贊助與是否值得看**：影片明確揭露由 True Foundry 贊助，並導向其開源工具；值得看架構解說與 trace 觀念，不宜只因 demo 就把私人資料或高權限工具接上去。

今天先試一件事：用公開文件和合成資料建一個只讀 Agent，開啟 tool trace；完成一個小任務後，人工檢查每次 MCP 呼叫、輸入／輸出與 sandbox 邊界，再決定是否加入寫入工具。
