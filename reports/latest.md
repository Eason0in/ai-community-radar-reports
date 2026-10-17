# AI 情報日報｜2026-10-17

約 4 分鐘閱讀。今天的主線是：AI coding agent 的價值開始從「寫得出來」轉向「能不能證明自己真的修對、做過什麼、能否在長流程中守住權限」。

> 截稿時間：2026-10-17 08:00（Asia/Taipei）。
> 查核範圍：優先 2026-10-15～10-17；補充最近一週仍有用的新工具與研究，避開 10/16 已報導且沒有新證據的 Muse Spark Open、Nemotron 3.5、Google AI Search 與 METR 評估。
> 證據標示：官方公告／文件是官方事實；GitHub 專案數據是作者或專案自述；Reddit 是社群經驗；論文結果不是產品保證。

## 1. 社群實戰用法

### 先證明測試抓得到 bug，再接受 agent 的綠燈

- **新在哪裡：** 本週 r/ChatGPTCoding 的 agent 工具討論把「測試有跑」推進成「測試真的抓到 bug」：不要讓 agent 只放寬 assertion、加 try/catch 或 skip 測試來換綠燈；動到測試要明說，回報通過時要附真實輸出，證明不了就留下失敗並解釋。
- **可以怎麼開始：** 把「修程式」與「驗證測試」分成兩個 gate。每次 agent 改測試後，先在修復版跑一次，再把被修的 source 還原到 base、保留新測試重跑；若兩邊都綠，這個測試只是 **THEATER**，不能當修復證據。
- **編輯心得與限制：** 這是社群實戰，不是獨立大樣本研究；但它抓到的 failure mode 很具體。可用 [Receipts](https://github.com/syntaxixr/receipts) 自動做這個雙跑，仍要注意 editable install、匯入新名稱造成的 WEAK 判定與測試環境差異。
- 來源：[r/ChatGPTCoding：Weekly Self Promotion Thread](https://www.reddit.com/r/ChatGPTCoding/comments/1x5v32d/weekly_self_promotion_thread/)（2026-10-14；社群經驗）、[Receipts README](https://github.com/syntaxixr/receipts)（作者工具與研究資料）。

### 用 session replay 做 agent 的事後 code review

- **新在哪裡：** 社群分享的方向不再只看最後 diff，而是回放 agent 讀了哪些檔案、重試哪些指令、哪個 MCP 失敗、context 何時塞滿、subagent 是否空回。這把「模型說它做過」改成可檢查的工作紀錄。
- **可以怎麼開始：** 在本機用 [agentplay](https://github.com/Entelligence-AI/agentplay) 建立最近 12 小時的 session map，先看失敗重試、無效讀檔與工具錯誤，再把一個重複失敗點寫回 AGENTS.md／CLAUDE.md 或 CI gate；分享前使用 `--path-mode dirs_only`，避免把私人路徑帶出去。
- **編輯心得與限制：** replay 只能讓行為可見，不能證明輸出正確；Cursor 目前沒有 token／成本數字，且 title、prompt 與路徑仍屬敏感資料。先在本機 read-only 使用，不要把原始 session 上傳第三方服務。
- 來源：[agentplay GitHub](https://github.com/Entelligence-AI/agentplay)（2026-10-15～16 社群新工具；Apache-2.0、local-first）。

## 2. 社群新工具與新玩法

### Receipts：把「測試有跑」提升成「測試證明修復」

- **新在哪裡：** Receipts 是 Claude Code plugin、CLI 與 GitHub Action；它只使用專案自己的 pytest、vitest 或 jest，不呼叫 LLM，也不把程式送出。它把變更的測試跑在新程式與還原 source 的 base 上，再給出 PROVEN、GUARD、THEATER、WEAK 等 verdict。
- **可以怎麼開始：** 在有修復與測試的 branch 先跑 `npx github:syntaxixr/receipts check`；若要放進 CI，使用 `pull_request` 而非 `pull_request_target`，並把 `persist-credentials: false`、runner 與測試環境鎖定。先觀察報告，再考慮開啟 opt-in stop hook。
- **編輯心得與限制：** 專案目前規模仍小，README 的「181 個變更」與 10% agent PR WEAK 數字是作者研究，不是通用失敗率。它也會在工作樹內交換檔案，務必確認中斷後能 restore，不能把 verdict 當成完整 code review。
- 來源：[Receipts GitHub](https://github.com/syntaxixr/receipts)（2026-10-15；作者工具／作者研究，MIT）。

### vibe-testing：讓 coding agent 真的操作瀏覽器並留下 QA 報告

- **新在哪裡：** [vibe-testing](https://github.com/AishwaryShrivastav/vibe-testing) 用程式碼掃描、14 個 MCP tools、Playwright 與 regression memory，從真實 route／欄位名稱生成情境，執行後產生含每一步截圖的 HTML 報告；也能不接 editor 直接用 CLI。
- **可以怎麼開始：** 先在 staging 跑 `npx vibe-testing@latest init`，檢查它產生的 `VIBE.md`、`vibe.config.json` 與測試帳號，再從一條 checkout 或登入流程開始；每次 UI 變更後把報告與既有 regression 比對。
- **編輯心得與限制：** 自動探索不是業務驗收；它需要 Node 20+ 與 Chromium，且 `init` 會寫入全域 editor 設定。不要直接在 production 使用真實付款／管理者帳號，也不要把測試憑證放進 prompt 或報告。
- 來源：[vibe-testing README](https://github.com/AishwaryShrivastav/vibe-testing)（2026-10-15；社群自製工具與作者文件，MIT）。

## 3. 官方新功能與推薦用法

### Apple Xcode 26.3：Codex／Claude 直接用 MCP 操作專案

- **新在哪裡：** Apple 的官方 Tech Talk 展示 Xcode 26.3 讓 Claude Agent、OpenAI Codex 等外部 agent 透過 MCP 讀專案、搜尋 Apple 文件、加 entitlement、建置與依錯誤迭代；Xcode 也可一鍵下載並自動更新這些 agent。
- **推薦用法：** 把需求縮成一個可驗收 slice，例如「Landmarks 加 WeatherKit 七日預報」；讓 agent 先列要改的檔案與權限，再執行 build／測試，最後由人檢查 entitlement、網路權限、API 成本與 UI。把「能 build」視為 draft，不是 merge approval。
- **限制：** 官方影片是 Apple 自己的 demo，400 多行與「幾分鐘完成」不是獨立 benchmark；Apple 也明說模型可能第一次 build 不過。MCP 讓工具更強，也讓錯誤 prompt、過寬權限與外部服務金鑰更值得先隔離。
- 來源：[Apple Developer：Meet agentic coding in Xcode](https://developer.apple.com/videos/play/tech-talks/111428/)（官方 Tech Talk，頁面讀取 2026-10-17）、[Xcode：Setting up coding intelligence](https://developer.apple.com/documentation/Xcode/setting-up-coding-intelligence)（官方文件）。

### GitHub Agentic Workflows v0.91.8：把 trace、memory 與 sandbox 納入同一條線

- **新在哪裡：** 10/11 的 v0.91.8 新增跨 Copilot、Codex、Claude、Gemini、Pi、Kiro、Aider 與 AGY 的統一 session timeline、`code-read-precision` trajectory grader、memory 的 JSON Schema 驗證、model routing mismatch 診斷，並修補 custom grader sandbox escape、workflow YAML 與暫存檔處理。
- **推薦用法：** 先升級後用一個低風險夜間文件 workflow 試跑：開啟 trace／model／cost attribution，把 memory schema 放進 review，要求每個 red-team finding 附 evidence；再逐步擴到能寫 issue 或 PR 的工作流。
- **限制：** 這是 GitHub Agentic Workflows 專案自身的 release note，不等於所有 GitHub Copilot workflow 都自動獲得相同隔離；sandbox、safe outputs、permissions 與 trigger 仍須逐 repo 檢查。
- 來源：[GitHub gh-aw v0.91.8 release](https://github.com/github/gh-aw/releases/tag/v0.91.8)（2026-10-11；官方 release）、[GitHub weekly update](https://github.github.io/gh-aw/blog/2026-10-12-weekly-update/)（2026-10-12；官方專案週報）。

### OpenAI Rosalind Academic Plan：研究型模型以 trusted access 取代全面開放

- **新在哪裡：** OpenAI 10/15 公布 Rosalind Academic Plan：符合資格的美國大學研究室最多 30 個 Business Standard seats、最長 12 個月免費，另可申請 GPT-Rosalind 與 Rosalind Workbench；研究資料預設不拿來訓練模型。
- **推薦用法：** 生命科學研究室可用「文獻／候選比較 → 工具查證 → 實驗前安全審核」的流程試用，保留模型輸出、原始資料與研究者判斷，並讓 PI 管理成員權限。先把它當研究助理，不要讓模型直接執行濕實驗或高風險決策。
- **限制：** 目前只開放美國大學 academic labs，須 trusted-access 審核，沒有 API access；官方範例也展示模型會拒絕高風險病原體的序列級設計與操作協議。這是資格與安全邊界，不是一般使用者可立即申請的免費 API。
- 來源：[OpenAI：Bringing GPT-Rosalind to academic research labs](https://openai.com/index/introducing-the-rosalind-academic-plan/)（2026-10-15；官方公告）。

## 4. 使用心得與避坑

### 單回合防護，不足以代表長程 agent 安全

- **新證據：** ICML 2026 的 AgentLAB 以 28 個 agentic environments、644 個 security test cases 測試 intent hijacking、tool chaining、task injection、objective drifting 與 memory poisoning；論文報告現有 agent 對長程攻擊仍高度脆弱，針對 single-turn 的防禦不能可靠地攔住 multi-turn 威脅。
- **可以怎麼開始：** 對任何會讀信、改 code、呼叫 MCP 或保留 memory 的 agent，做固定的「跨回合」回放：第二步加入任務注入、第三步改變目標、最後一步要求外送或刪除；每一步都要有 scope、human approval、network allowlist、可還原 checkpoint 與完整 trace。
- **編輯心得與限制：** AgentLAB 是研究 benchmark，不是你公司環境的風險分數；真實系統的工具、權限與網路配置會改變結果。重點不是把一個 benchmark 分數當 SLA，而是把長程 failure mode 變成自己的 regression cases。
- 來源：[PMLR：AgentLAB](https://proceedings.mlr.press/v306/jiang26as.html)（2026 ICML 論文；研究證據）。

### 免費安全掃描不等於自動修好開源專案

- **新證據：** Anthropic 10/8 的 Cyber Mission 推出 OSS Scanner，向開源專案提供定期安全掃描；同一公告也承認，找出漏洞後的驗證、排序與修補仍是困難，且關鍵基礎設施不能任意停機更新。
- **可以怎麼開始：** 把 scanner 當 triage：先在隔離 branch 收集 finding，要求重現步驟、受影響版本、可信度與人工 owner，再用原始測試、SAST／依賴掃描與 reviewer 確認修復。agent 只能提出 patch，不應自行 merge 或接觸 production secret。
- **編輯心得與限制：** 這是 Anthropic 的官方服務宣告，不是第三方準確率評估；免費、強模型與「regular scans」都不能取代維護者責任、漏洞披露流程與可重現測試。
- 來源：[Anthropic：Introducing the Anthropic Cyber Mission](https://www.anthropic.com/news/anthropic-cyber-mission)（2026-10-08；官方公告）。

## YouTube 深度整理

### 今日無推薦

已主動查核 PAPAYA 電腦教室、Tech With Tim、Gary Chen、Matthew Berman 與其他 AI 工具／Agent／AI Coding 候選。PAPAYA 的最新公開候選已超過必要的一週窗口；近 24–48 小時候選沒有同時滿足「觀看數超過 10,000、可靠字幕／逐字稿、非純新聞、實測或技術拆解」的條件，因此不硬湊推薦。

## 今天最值得帶回團隊的三個檢查

- **證據：** agent 的測試是否在 base code 上失敗、在修復版上通過？
- **可見性：** 是否保留 session trace、工具錯誤、模型／成本與 memory 變更？
- **權限：** 長流程 agent 是否有最小權限、網路 allowlist、人工批准與可還原 checkpoint？

## 今日一句話

今天最實用的 AI 進展不是再多一個「會寫 code」的模型，而是把 agent 的測試、session、權限與錯誤證據都拉進同一條可審查的工程流程。

來源：[Receipts](https://github.com/syntaxixr/receipts)、[agentplay](https://github.com/Entelligence-AI/agentplay)、[Apple Xcode agentic coding](https://developer.apple.com/videos/play/tech-talks/111428/)、[GitHub Agentic Workflows v0.91.8](https://github.com/github/gh-aw/releases/tag/v0.91.8)、[OpenAI Rosalind Academic Plan](https://openai.com/index/introducing-the-rosalind-academic-plan/)、[AgentLAB](https://proceedings.mlr.press/v306/jiang26as.html)。
