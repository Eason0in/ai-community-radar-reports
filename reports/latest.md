# AI 實用日報｜2026-09-12

約 3–4 分鐘閱讀。今天的共同主線是：Agent 的能力開始被包成可安裝的工具組，但真正能不能用，取決於權限、環境與可回溯的批准流程。以下分開標示社群觀察、官方公告、廠商自述與編輯推論；沒有把單一案例當成普遍 benchmark。

## 1. 社群實戰用法

### 先讓 Agent 說明「要改什麼」，再讓它碰雲端

Google Cloud 9 月 10 日推出 `google-cloud-developer` Agent Plugin，示範流程不是收到一句需求就直接建專案，而是先檢查 CLI／現有專案，再檢查 IAM 風險，提出 roadmap，最後才詢問是否執行。r/googlecloud 的早期回饋也特別提到即時文件、驗證配方、gcloud guardrails 與按需載入 100 多個 skills；這是社群訊號，不是獨立評測。

怎麼試：先把需求限定成「列出目前專案與缺少的權限」，禁止建立資源；第二輪只允許產生 plan；第三輪才給一個測試專案的最小權限。每次記錄 Agent 讀了哪些文件、呼叫哪些 gcloud 指令、哪一刻取得批准，以及如何撤銷。

編輯心得：這個模式值得借用的不是 Google Cloud 特例，而是把「認證、文件、工具和批准」綁成一個可檢查的流程。若 plugin 只增加能力，沒有把 IAM、secret 與寫入前審查一起帶進來，就只是把 prompt 換成另一層包裝。

來源：[Google Cloud 官方公告（2026-09-10）](https://cloud.google.com/blog/topics/developers-practitioners/introducing-the-google-cloud-developer-plugin-for-ai-coding-agents)｜[社群回饋（2026-09-10）](https://www.reddit.com/r/googlecloud/comments/1wcyzyr/introducing_the_google_cloud_developer_plugin_for/)

## 2. 社群新工具與新玩法

### Plugin 開始變成「技能＋MCP＋規則」的可攜式套件

Google 的 `google-cloud-developer` 是依 Agent Plugins 開放規格打包的技能與 MCP 設定，包含認證、授權、專案管理、gcloud 操作護欄與 Developer Knowledge MCP。官方提供 Antigravity CLI、Claude Code、Codex CLI 的安裝方式；例如 Codex CLI 可用 `codex plugin marketplace add google/skills` 再加入 plugin。限制是：這仍會接觸你的雲端身份與資源，安裝來源、manifest、權限範圍都要先讀。

另一個值得留意的是 LangChain `deepagents` code library 0.1.68（9/10）：新增推薦的 GLM 5.3 code workflow、Fireworks GLM-5.3／Flash 計價支援，並修正 effort 變更未納入 OpenAI／Anthropic cache identity，以及 workspace 切換未先確認就重啟 server 的問題。這些是 changelog 層級的功能與修正，不等於你的專案一定更快或更便宜。

可立即試：只挑一個低風險 repo，先安裝一個 plugin 或升級 library；用固定的「讀文件 → dry-run → 人工批准 → 執行 → 讀回」五步記錄 token、重試、權限請求和 diff，再決定是否擴大套件範圍。

來源：[Google Agent Skills／plugin 安裝說明](https://github.com/google/skills)｜[deepagents 0.1.68 changelog](https://github.com/langchain-ai/deepagents/blob/main/libs/code/CHANGELOG.md#0168)

## 3. 官方新功能與推薦用法

### OpenAI 把 Codex 式長任務 harness 放進 Agents API

OpenAI 9 月 10 日推出 Agents API public beta：可指定模型、工具、MCP、環境與多 Agent，並由 API 提供 context compaction、tool search、programmatic tool calling、subagents 與持久化工作環境。這是官方產品描述；頁面中的客戶改善幅度仍是廠商案例，不是獨立 benchmark。

推薦用法：先把任務拆成可回收的子工作，讓一個 subagent 只讀資料、一個產出草稿，主 Agent 只做整合；把 `/workspace/outputs` 當唯一產物出口，任何外部寫入仍停在人工批准。先量「完成率、返工、token、人工審查分鐘」四個自己的指標，不要直接沿用官方案例數字。

### GPT‑Live‑1 API 適合先做「可被打斷」的語音流程

同日的 GPT‑Live‑1 API 是 full-duplex 語音模型，可同時聽與說，處理打斷、背景噪音與長對話，也能把較深的推理和工具呼叫交給後端文字模型。官方早期評估稱 Speak 的中斷次數下降近 80%，屬 OpenAI／客戶案例；實際延遲與辨識率仍要在自己的電話、環境噪音和語言上測。

可立即試：做一個不涉及付款的語音預約 demo，刻意在 Agent 回答中途插話、改日期、加入背景噪音；只允許它產生預約草稿，不准直接送出。記錄 turn detection、重複確認、工具呼叫與中斷後是否遺失上下文。

### Data agent 把「查數字」延伸成可審查的 dashboard

ChatGPT Work 的 Data agent 可連接 Redshift、BigQuery、Snowflake、Databricks、MongoDB 等核准資料來源，依既有 table／row／column 權限分析，產生互動 dashboard，並可在批准後透過 Slack 或 email 傳遞結果。推薦從一個 KPI 變動開始，要求它列出來源、定義、比較期間、可能原因與下一個查核，而不是直接問「給我結論」。

來源：[Agents API](https://openai.com/index/introducing-the-agents-api/)｜[GPT‑Live‑1 API](https://openai.com/index/introducing-gpt-live-1-in-the-api/)｜[Data agent](https://openai.com/index/put-data-to-work/)

## 4. 使用心得與避坑

### 「有 sandbox」不等於「網路與程序都隔離」

DeepSeek Harness 的官方 sandbox 文件把 `read-only`、`workspace-write` 和 `danger-full-access` 定義成檔案效果政策，並明確說 network 與 process visibility 不在這個詞彙內；`danger-full-access` 會繞過 confinement。9 月 9 日披露的 CVE-2026-82533 則被 The Hacker News 報導為：特定安裝下，Agent 可透過本機 web 介面關掉自己的檔案 sandbox；這是安全研究／媒體報導，不是我把它推論成所有版本都受影響。

使用前先做三件事：確認實際版本與修補版本；把 localhost 控制介面、瀏覽器與網路 egress 分開限制；用一個不含 token 的不可信 repo 重跑「讀檔、寫檔、啟網路、啟子程序」四項測試。若文件只寫 file sandbox，就不要把它當成防 prompt injection、credential 外洩或網路存取的完整保證。

來源：[DeepSeek Harness sandbox 官方文件](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/sandbox.md)｜[漏洞報導與修補時間線（The Hacker News，2026-09-09）](https://thehackernews.com/2026/09/deepseek-harness-flaw-let-ai-agents.html)

## YouTube：Tech With Tim《Build a Local AI Agent in 10 Minutes using Python》

- 頻道／片名：Tech With Tim｜[Build a Local AI Agent in 10 Minutes using Python](https://www.youtube.com/watch?v=ByWCsa8DbF8)
- 發布日期／查核：2026-09-11；2026-09-12 查核 17,071 次觀看，片長 8:08；已讀取可用的 `en-CA` 字幕。字幕把 Ollama、Qwen、Pydantic AI 的專有名詞多次誤聽，以下已依上下文與官方文件校正。
- 摘要：用 Ollama 在本機拉一個小模型，再以 Python／Pydantic AI 接到 `localhost:11434`，把時間、計算、讀寫筆記做成 Agent tools，最後用互動式 while loop 驗證工具呼叫。
- 3–7 個重點：
  1. 模型大小要配合 VRAM 或 Mac unified memory；影片建議先從 Qwen 3.5 的小模型開始。
  2. 先用 `ollama pull` 下載模型，再用 `ollama run` 確認速度與可用性。
  3. Agent 的核心不是聊天，而是「模型＋system prompt＋可呼叫的 Python functions」。
  4. 影片示範 current time、calculator、save note、read note 四個工具。
  5. 本機推理可降低雲端依賴，但模型越大通常越慢；影片沒有做品質、成本或安全比較。
- 工作流程／時間點：00:08 安裝 Ollama 與依硬體選模型；01:57 pull／run 模型；03:54 建立 `agent.py` 並連到本機 API；05:14 宣告工具；06:32 用互動 loop 測試存取筆記與查時間。
- 工具／模型：Ollama、Qwen 3.5／Qwen 3、小型本機模型、Python、Pydantic AI、VS Code；官方可對照 [Ollama API 文件](https://docs.ollama.com/api/introduction) 與 [Pydantic AI 的 Ollama／OpenAI-compatible model 文件](https://pydantic.dev/docs/ai/models/openai/)。
- 作者心得與限制：作者強調本機速度與簡單可懂；片尾導向自己的免費社群並表示未來可能改變免費條件，屬自我推廣，未見本片明確贊助段。程式碼未完整放在影片頁面；示範工具直接讀寫檔案，沒有權限、schema validation、approval、測試或 prompt-injection 防護。
- 適合對象／是否值得看：適合想在自己的 Mac／PC 上做第一個 local tool-calling prototype 的人；值得看入門流程，不適合拿來當 production agent 或安全設計指南。
- 今天可試：只建立 `get_time` 和純計算兩個無副作用工具，先確認 Ollama 本機 API、延遲與模型是否放得進記憶體；不要照抄影片的任意檔案寫入，等有明確 workspace、測試與人工批准再加。

今天先做：選一個不含機密的小任務，讓 Agent 先產生 plan，再用最小權限執行；保存工具呼叫、批准點、原始資料與最終 diff，明天才有可比較的實測證據。
