# AI 情報日報｜2026-11-03

> 搜尋範圍：以 Asia/Taipei 2026-11-01～11-03 為主，補充一週內仍有直接用法的新進展。官方公告／文件是官方事實；GitHub 專案是發布者自述；廠商 benchmark、作者數字與效能均不視為獨立驗證。昨天已報題目若沒有新進展不重複。

## 1. 社群實戰用法

### AgentShark：先看 agent 的原始紀錄，再判斷「成功」是真是假

- **新在哪裡：** `naisslab/AgentShark` 是 macOS 原生的本機 agent trace inspector，把 Claude Code、Codex 等本地紀錄索引到 SQLite，從失敗 episode、被阻擋的操作、未恢復錯誤與沒有測試證據的成功宣稱開始查，欄位可追到原始 bytes；另有只讀 MCP 讓 agent 查自己的歷史紀錄。這是專案 README 的功能自述，尚無獨立可靠度評測。
- **可以怎麼開始：** 先用它讀一個已完成但結果可疑的 run：看最後宣稱、實際命令、工作目錄、stderr 與測試輸出是否同一條證據鏈，再決定要不要重跑。團隊可把「完成」改成必須附測試輸出與原始紀錄，而不是只看模型回覆。
- **編輯心得與限制：** 它的價值是可追溯性與本機隱私，不是再加一個 LLM 評審；目前是新興專案，支援格式、macOS 安裝與 trace 索引範圍仍要先在非敏感資料測試。
- 來源：[AgentShark GitHub](https://github.com/naisslab/agentshark)（截至 2026-11-03，專案原作者，高可信於功能描述；未證明實務效果）。

### Longkeep：把長專案的上下文變成 repo 內可交接的文件

- **新在哪裡：** 原 `openagents` repo 已轉址為 `longkeep`，主張把 rules、decisions、plans、session 與 delegation 記在 repo 的 Markdown，讓 Claude Code、Codex、Gemini CLI 或 Cursor 換 session、帳號或機器後仍能接續；文件是「合約」，不是某個聊天帳號的私有記憶。
- **可以怎麼開始：** 先只採用 context 模組：建立一份目前決策、不可違反的規則、下一步計畫與驗收條件；每次 agent 開工先讀它，完成後只更新已驗證的決策。涉及多 agent 時，再加 delegation，要求每個子任務留下輸入、變更、測試與 verdict。
- **編輯心得與限制：** 這個方法比追求更長 context 更可控，但 Markdown 也會過期；若沒有 owner、更新時機與 review，文件會變成另一種 stale prompt。GitHub 目前只顯示少量 stars，應視為社群早期工具，不是成熟標準。
- 來源：[Longkeep GitHub](https://github.com/wingsofsky/longkeep)（截至 2026-11-03，專案原作者，高可信於設計目標；採用成熟度未獨立驗證）。

## 2. 社群新工具與新玩法

### CleanCode：在一張 canvas 上並行協調多個 CLI coding agents

- **新在哪裡：** `chen-985211/cleancode` 是 MIT 開源的 canvas ADE，主打把 Claude Code、Codex 與其他 CLI agent 放在同一個可見工作面，平行執行、分派任務並建立可重用 workflow；repo 自述目前已有 293 次提交與 110 stars，但這些不是品質或生產力 benchmark。
- **可以怎麼開始：** 用一個低風險 repo 試跑三個角色：一個 agent 讀規格拆任務、一個只做測試或檢查、一個提出 patch；每個 agent 用獨立 worktree 或明確檔案邊界，最後由人合併與驗證。先測「可觀測的協作」是否比多開終端機更省時間，不要一開始就讓多 agent 同寫核心檔案。
- **編輯心得與限制：** canvas 解決的是協作可見度，不是衝突、權限、成本或上下文污染；平行 agent 的總 token、重工與合併成本可能更高。新工具要先檢查本機憑證、MCP 設定與資料外傳邊界。
- 來源：[CleanCode GitHub](https://github.com/chen-985211/cleancode)（截至 2026-11-03，專案原作者，高可信於功能自述；stars／commit 數不代表效果）。

### llama.cpp b12059：統一 KV cache 的多序列 attention 更進一步

- **新在哪裡：** llama.cpp 11/02 的 `b12059` pre-release 以 `flash_attn_ext_rows`、`kv_rows` 與 per-sequence cell bitmap 改善 unified KV cache 的多序列處理，讓不同序列的 slices 保留圖結構，並減少回退到 dense KQ mask 的情況；release 註記也標出由 dsh 輔助的模型／硬體測試。
- **可以怎麼開始：** 只有在本地同時跑多序列、speculative decoding 或 server batching 時才值得試。先固定模型、量化、prompt 長度、並行數與硬體，對比舊版的首 token 延遲、吞吐、記憶體與輸出一致性，再決定是否升級。
- **編輯心得與限制：** 這是 pre-release 的底層效能改動，不應把 release note 的「更有效率」直接當成你的工作負載一定變快；不同 backend、GPU、量化與 batch 形狀可能沒有同樣收益。
- 來源：[llama.cpp b12059 release](https://github.com/ggml-org/llama.cpp/releases/tag/b12059)（2026-11-02，官方 GitHub release，高可信於變更內容；效能需自行重測）。

## 3. 官方新功能與推薦用法

### OpenAI LifeVal：把「日常 agent 能不能辦完事」變成評測題

- **新在哪裡：** OpenAI 11/02 發表 LifeVal，從美國與跨國時間使用資料，加上 3,995 人的代表性調查，整理照顧、教育、財務、購物、政府服務等日常任務，測試 AI 不只會回答，是否能在瀏覽器、電腦操作與 connectors 中完成工作。頁面展示 GPT-6 Astra 在多項任務的高分，屬 OpenAI 自行建立與報告的 benchmark。
- **推薦用法：** 團隊不要只測「回答正不正確」；可把自己的真實流程拆成任務、權限、外部副作用與人工確認點，建立 10～20 題小型 task eval，記錄完成率、錯誤類型、需要人工接手的步驟與成本。先從可回復、低風險任務開始。
- **限制：** LifeVal 的任務設計、模型選擇與展示結果由 OpenAI 主導，不能直接推論到台灣服務、你的帳號權限或未展示的失敗案例；高分也不代表允許 agent 自動下單、付款或提交政府申請。
- 來源：[OpenAI LifeVal](https://openai.com/index/lifeval/)（2026-11-02，官方研究，高可信於方法與官方結果；結果為廠商 benchmark）。

### Firebase AI Logic：App Check 已進入自動強制期

- **新在哪裡：** Firebase 文件明確寫明從 11/02 起，Firebase AI Logic 專案會自動強制 App Check；沒有有效 token 的請求會被擋住，包含已發布但還沒實作 production attestation 的舊版 app。尚未準備好的專案可暫延，但最晚只能到 2027-01-21。
- **推薦用法：** 立即盤點所有使用 Firebase AI Logic 的版本：Apple 用 DeviceCheck／App Attest／reCAPTCHA Enterprise，Android 用 Play Integrity／reCAPTCHA Enterprise，Web 用 reCAPTCHA Enterprise；本地開發改用 debug provider，並觀察 verified requests 後再正式強制。不要把 Gemini API key 放進 mobile 或 web app。
- **限制：** 延後只是過渡，不是安全設定；舊版客戶若未升級會直接失去請求能力，且 App Check 仍要搭配登入、配額、WAF／監控與最小權限，不會單獨解決濫用或帳號風險。
- 來源：[Firebase release notes](https://firebase.google.com/support/releases)（2026-10-27 預告，官方文件）、[Firebase AI Logic FAQ](https://firebase.google.com/docs/ai-logic/faq-and-troubleshooting)（2026-11-02 起生效，官方文件）。

## 4. 使用心得與避坑

### Agent PR 變大不等於交付變快：先處理 review throughput

- **發生什麼事：** LinearB 11/02 發表 Agentic Studio，把軟體交付資料做成可供人與 agent 使用的 context layer，並推出 early-access 的 effort skill，依變更的商業關聯、複雜度、風險、程式品質、事故與 ownership history 調整 agent effort。其 2026 benchmark（2.7 百萬 PR、250 多個組織）自稱 AI-assisted PR 在 75 百分位比未使用 AI 的 PR 大 2.6 倍，agent PR 等待 review 超過 5 倍；這是廠商自行分析，不是獨立研究。
- **可以怎麼開始：** 先把「PR 大小、等待 review 時間、返工率、變更風險」分開量，不要只看 merged PR 數。讓 agent 先輸出小而可回復的 patch；低風險變更走快速檢查，高風險變更指定熟悉該服務的 reviewer，並把 time zone、reviewer availability 等排程因素納入分析。
- **編輯心得與限制：** context layer 有助於 agent 知道哪裡脆弱，但不會自動增加 reviewer capacity；產品展示的成本、節省與客戶案例也不能當成你的結果。最常見的避坑是把「更多生成」誤當成「更高交付能力」。
- 來源：[LinearB 發布公告](https://www.globenewswire.com/news-release/2026/11/02/3393228/0/en/linearb-launches-agentic-studio-to-give-enterprise-engineering-leaders-and-coding-agents-the-context-to-ship-better-software-faster.html)（2026-11-02，廠商公告）、[LinearB Agentic Studio](https://linearb.io/)（截至 2026-11-03，廠商產品頁）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-11-01～11-03，必要時放寬至一週；目前沒有同時能證明觀看數超過 10,000、已讀可靠字幕／逐字稿、且具實測／教學／技術拆解深度的候選，因此不從標題或介紹猜測內容，也不硬湊影片。

## 今天最值得帶回團隊的三個檢查

- **證據：** agent 的完成宣稱要能回到原始命令、測試輸出與 trace，不要只看最後一句話。
- **評測：** 用真實任務的完成率、人工接手點、副作用與成本補足 vendor benchmark，而不是只比較模型分數。
- **交付：** agent 產出越多，越要先守住 patch 大小、review capacity、App Check／憑證邊界與可回復性。

## 今日一句話

今天的重點不是再找一個更會寫 code 的 agent，而是把 agent 的記憶、觀測、評測、權限與 review 流程接成可追溯的交付系統。
