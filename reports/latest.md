# AI 情報日報｜2026-10-10

約 4 分鐘閱讀。今天的主線是：coding agent 的瓶頸已不只在模型能力，而在任務拆解、權限隔離、使用者介面與「真的把系統改對」的證據鏈。

> 截稿時間：2026-10-10 07:59（Asia/Taipei）。
> 查核範圍：優先 2026-10-08～10-10；延伸至最近一週的 ThinkingBox、CABRA 與社群工具。已避開 10/09 已報導且沒有新證據的混合本機／雲端路由、LightOnOCR-3、Copilot 本機模型、Google Gemini agent 與 Codex steering。
> 證據標示：官方公告／文件是官方事實；廠商、作者或研究團隊的數字保留其來源身分，不外推成獨立驗證；社群文章與實驗是作者觀點或個案。

## 1. 社群實戰用法

### Cockroach Labs 的「MOLT Sinai」：用教學醫院流程管住 coding agent

- **新在哪裡：** Cockroach Labs 10/09 公開五個月實戰：把 agent 分成 Triage Nurse、Fellow、Review Attending、Discharge Nurse 等角色，所有工作先進 GitHub Issue，再以 label 觸發下一個階段。Db2 migration 從需求到可合併程式不到兩天；文章稱同類 Oracle 工作過去約九個月、約 16 萬美元工程時間，這次 token bill 為 4,172 美元。五個月處理超過百萬行程式、僅 7 次 revert；另有 32 個子 issue、27 個合併 PR、55 次 reviewer 退回、2 次升級給人。
- **可以怎麼開始：** 把流程拆成「workup → plan review → treatment → tests → discharge」；規定沒有計畫不能寫 code，計畫必須列檔案、測試、風險與未決問題，另一個 agent 只負責找錯。CI、review thread、commit history 與測試結果由最後的 discharge gate 統一核對；遇到卡住就用結構化 handoff 升級，不讓 agent 無限重試。
- **編輯心得與限制：** 這是 Cockroach Labs 的單一公司結果，不是跨團隊 benchmark；它用更長等待、更高協調成本換可靠性，也承認有教學醫院式的 bureaucracy。適合資料庫 migration、資安修補等錯誤代價高的工作，不適合每個小改動都套完整流程。
- 來源：[Cockroach Labs：MOLT Sinai 實戰](https://www.cockroachlabs.com/blog/experiment-running-hospital-code/)（2026-10-09；公司案例與公司數據）。

### 「Agent 不是 model」：Michael Lynch 把失望拆成可修的系統問題

- **新在哪裡：** Michael Lynch 10/09 的實測文章把 coding agent 與底層模型分開：他觀察到 OpenCode 會把可平行的工作逐一執行、Claude Code 很少依任務難度換模型、計畫常是低階細節清單，agent 也可能因等待一個枝微末節的回答而整晚停工。他的結論是目前缺的是任務管理、模型路由、自我說明與真正的 OS 級 sandbox，不是再堆一層 prompt。
- **可以怎麼開始：** 先把任務標成「讀取／搜尋、規劃、修改、審查」四類，為每類記錄使用的模型、耗時、token、工具錯誤與是否需要人工接管；對寫入與網路操作使用 repo／VM 邊界，將「完成」定義成測試與 postcondition，而不是 agent 自己說 done。
- **編輯心得與限制：** 這是作者長期使用經驗與設計願望，不是統一測試；但它與 ThinkingBox、CABRA 的結果方向一致：agent harness 的排程、context、權限和驗證會決定模型能力能否落地。
- 來源：[Michael Lynch：Why Are Coding Agents So Dumb?](https://mtlynch.io/why-are-coding-agents-so-dumb/)（2026-10-09；作者實測／觀點）。

## 2. 社群新工具與新玩法

### memdebug：把 agent memory 當成可稽核的檔案狀態

- **新在哪裡：** `memdebug` 是 10/09 在 Hacker News 出現的 local-first、agent-neutral 工具；它會對 Claude Code、Open WebUI、Mem0 或一般 Markdown 記憶做 snapshot，建立 tamper-evident ledger，顯示誰改了什麼、標記可疑文字，並支援把記憶回滾到舊 snapshot。它是 observer，不會攔截 agent，也不能即時阻擋攻擊。
- **可以怎麼開始：** 在測試資料夾先跑 `pipx install memdebug`、`memdebug demo`，確認流程後再 `memdebug setup`、`memdebug check`；把 memory 檔案和 agent session log 一起保存，發現外部文件或 prompt injection 改寫記憶時，先比對 ledger 再決定是否 rollback。
- **編輯心得與限制：** 目前標示 alpha，跨 agent 的「是哪個對話寫入」通常無法證明；它保護的是可追溯性，不是 runtime guard。不要把 rollback 當成已經阻止資料外洩。
- 來源：[memdebug GitHub](https://github.com/juraj-jumic/memdebug)（2026-10-09 社群出現；README 與 threat model 為原始說明）、[Hacker News item](https://news.ycombinator.com/item?id=50026431)。

### Mudroom：在 macOS VM 裡跑 agent，先看 diff 再套回真專案

- **新在哪裡：** Mudroom 是 10/09 在 Hacker News 出現的 macOS app／CLI 原型：把 Claude Code、Codex、Gemini CLI、OpenCode 或 Aider 放進 Linux micro-VM，在 copy-on-write clone 裡執行；真實資料夾不掛進去，網路可限制允許的 host，完成後只把想要的 diff 套回。
- **可以怎麼開始：** Apple Silicon、macOS 26+ 可先閱讀 repo 的 setup，再對低風險 issue 建立 session；固定「agent 先跑、人工 review diff、只 apply 部分 hunks」的節奏。Docker／Podman backend 與 Apple VM 的隔離強度不同，先確認自己的網路與憑證邊界。
- **編輯心得與限制：** 專案明確標示 early prototype；Windows 不支援，Linux／Intel Mac 只有 CLI 與 Docker／Podman 路徑。它降低檔案破壞半徑，但不會替你驗證程式正確，也不應把任意網路權限開給 agent。
- 來源：[Mudroom GitHub](https://github.com/Kernel-Hunter/mudroom)（README／限制）、[Hacker News item](https://news.ycombinator.com/item?id=50024858)（2026-10-09 社群發現）。

### Agentplane：把多個 coding agent 的流程證據放回 Git

- **新在哪裡：** Agentplane 是一個 Git-native control plane，不是模型或黑箱 runtime；它把 intent、plan、verification、rollback、review 狀態與 machine-readable Agent Change Record 放在 `.agentplane/`，並讓 Claude Code、Codex、Cursor、Aider 共用同一套任務生命週期。
- **可以怎麼開始：** 先只在一個非生產 repo 使用 `direct` workflow，要求每個任務產生變更紀錄與驗證結果，再視需要切換 `branch_pr`；把 CLI 版本 pin 起來，審查 release notes，避免 provider CLI 旗標更新造成假綠燈。
- **編輯心得與限制：** repo 自己標示 pre-1.0、持續開發；它能保存流程證據，不能取代 CI、人工風險決策或真正的測試。
- 來源：[Agentplane GitHub](https://github.com/basilisk-labs/agentplane)（2026-10-09 查核；原始 README）。

## 3. 官方新功能與推薦用法

### Microsoft Dynamics 365：把 CRM context 帶到 Teams 與 Copilot 裡

- **官方更新：** Microsoft 10/08 宣布 Dynamics 365 CRM in Teams public preview；團隊把 Teams channel 連到 customer account 後，agent 可提供會前簡報、case 通知與 account 更新。另有 30 個 CRM skills：在 Cowork 為 GA，Autopilot 是 private preview，Code 走 Frontier Program；Service Agent 也在 Microsoft 365 的 Outlook、Teams、Word、Excel、PowerPoint 中提供受控的查詢、草稿與建案流程。
- **推薦用法：** 不要直接讓 agent 自動改 CRM。先選「會前摘要」或「客服信件草稿」這類可讀取、可人工核准的工作，明確限定 account scope、MCP tool、資料保留與寫入前 approval；等 audit 與回滾流程穩定，再開放建案或更新紀錄。
- **編輯心得與限制：** public preview、private preview、Frontier Program 的可用性不同；Microsoft 的客戶案例與生產力說法是官方／客戶結果，不是獨立評測。CRM context 接進聊天後，權限與資料生命週期會比 prompt 設計更重要。
- 來源：[Microsoft：Bringing CRM into the flow of work](https://www.microsoft.com/en-us/copilot/blog/2026/10/08/bringing-crm-into-the-flow-of-work-and-agents-into-business-process-for-sales-and-service-teams/)（2026-10-08）。

### Harness 收購 Augment Code 資產：從 code agent 走向整條 SDLC

- **官方更新：** Harness 10/08 宣布收購 Augment Code 的 Cosmos、Auggie CLI、Code Context Engine 等選定資產；Cosmos 將成為 Harness Cosmos Software Factory Agent，從需求、ticket 或 bug 開始，交由多個 agent 在隔離 VM 裡規劃、寫 code、測試並開 PR，再交給 delivery、security、runtime protection 與 cost management agents。
- **推薦用法：** 若團隊想試 software factory，先把「idea → merge-ready PR」和「merge → deploy」分成兩個可驗收邊界；每個 agent 只拿必要 repo／環境權限，對 model routing、budget、測試、security scan 和最後 merge 保留紀錄與人工 gate。
- **編輯心得與限制：** 這是 Harness 的收購與產品方向公告，尚不能當成整合後效果已被證明；文中企業數字標為 Harness 宣稱。最需要觀察的是跨 agent handoff 是否保留測試、incident、security requirement 與成本 context，而不是 agent 數量。
- 來源：[Harness：Acquires Augment Code](https://www.harness.io/press-and-news/harness-acquires-augment-code)（2026-10-08；公司公告／PR Newswire）。

## 4. 使用心得與避坑

### ThinkingBox：agent 說成功，不等於資料真的改對

- **已確認問題：** Microsoft 與 Hugging Face 的 ThinkingBox 10/03 公開 benchmark，讓 agent 在 507 個有狀態的商務工作流中重複執行 20 次，最後檢查資料庫與 side effect，而非只看工具呼叫或回覆。共同集合的 121,680 次有效試驗中，79,853 次未通過 executable checks；其中 67.24% 仍乾淨結束、沒有 final tool error，卻留下錯誤狀態。失敗案例中，77.61% 有錯誤欄位、43.30% 有額外 side effect、25.36% 缺少必要 effect，數字可能重疊。
- **可以怎麼避坑：** 對每個 state-changing tool 定義 before／after postcondition、affected rows、expected version、idempotency key 與 rollback；重試時不要只看 agent 最後一句話，至少保存一次成功率與 repeated pass／all-pass 指標。沒有可檢查的 postcondition，就回報 uncertainty，不要回報 done。
- **編輯心得與限制：** 這是官方聯合 benchmark，資料與 workflow 是 synthetic reconstruction；模型、價格快照與實驗設定會影響結果，也不是你自己的 production evidence。它最值得帶走的是評估方法：系統狀態才是 outcome，重複試驗才接近 reliability。
- 來源：[Hugging Face／Microsoft：ThinkingBox](https://huggingface.co/blog/microsoft/thinkingbox)（2026-10-03）、[ThinkingBox framework](https://github.com/microsoft/thinkingbox)、[ThinkingBox-Bench release](https://github.com/microsoft/thinkingbox-data/tree/main/releases/thinkingbox_bench_v1)。

### CABRA：不要用改了幾行 code 估算 agent 難度

- **研究重點：** Microsoft 的 CABRA repository 對 6,840 個受控 code-editing tasks 評估 8 個 LLM 與 6 個 Copilot agent 設定，沿 function traversal、search、runtime resolution、instruction following 四軸控制難度。結果指出：工具可以讓 agent 在大型搜尋任務維持高表現，但需要理解 code 才能正確修改的任務仍會失敗；SWE-bench 的 tool-call 數比修改行數更能預測準確率。
- **可以怎麼開始：** 評估 coding agent 時把「找對檔案、理解跨函式資料流、辨認 runtime 行為、遵守指令」拆成獨立測試；保留 tool trace、context 大小與最終 diff，別只報 LOC 或一次成功率。
- **編輯心得與限制：** CABRA 是研究團隊的受控／synthetic framework，不代表所有真實 repo；它適合診斷能力瓶頸，不適合單獨當 production readiness 分數。
- 來源：[CABRA GitHub](https://github.com/microsoft/CABRA)（研究原始 repo）、[arXiv 2610.10610](https://arxiv.org/abs/2610.10610)（2026-10-07）。

### 四個 agent 花 400 美元做 PDF editor：UI 的小摩擦仍要人找

- **實測：** nielstron 10/08 發布小型實驗，讓 Gemini 3.8 Flash、GPT Astra 6、Opus 5、Fable 5 各自拿 100 美元預算，在 VM 中做可用 PDF editor。作者在多次點擊後看到圖片放置、行動版觸控、文字編輯、旋轉、暗色模式與匯出等問題；agent 能做出 viewer 和基本工具，但很少主動注意 native install、搜尋設定、流暢度與細碎 UX。
- **可以怎麼避坑：** 對 UI agent 任務加入真實使用者旅程：開啟檔案、拖曳、取消、重試、手機尺寸、慢網路、匯出後重新開啟；每個旅程要有可觀察的 acceptance check，並讓人實際操作一次。單看 screenshot、通過 build 或 agent 自評，都不足以代表好用。
- **限制：** 這是作者的小樣本觀察，不是模型排行榜；預算、prompt、harness 與手動檢查方式都會影響結果。
- 來源：[The Remaining Shortcomings of Coding Agents](https://blog.nielstron.de/2026/10/08/the-remaining-shortcomings-of-coding-agents/)（2026-10-08 發布、10/09 更新；作者實驗）。

## YouTube 深度整理

### 今日無推薦

今天主動查核 PAPAYA 電腦教室、Tech With Tim、Gary Chen、IBM Technology、Matthew Berman、freeCodeCamp 等中英文 AI／工具／Agent／AI Coding 頻道；候選沒有同時符合「最近 24–48 小時（必要時一週）、觀看數超過 10,000、可讀字幕或逐字稿、非 Shorts、不是純新聞朗讀、且有實測／教學／技術拆解」的影片，因此不以標題或介紹猜測內容，也不硬湊推薦。

## 今天最值得帶回團隊的三個檢查

- **流程：** agent 的 plan、review、測試、handoff 與 rollback 是否是可查的狀態，而不是散落在對話裡？
- **結果：** state-changing tool 是否有明確 postcondition、重試安全性與 repeated reliability 指標？
- **體驗：** 是否讓真實人類走過慢、錯、取消、手機與重新開啟等旅程，而不是只看 agent 說完成？

## 今日一句話

Agent 的下一個競爭點，不是把「done」說得更像人，而是讓程式、資料庫、介面與審查紀錄都能證明它真的做對了。

來源：[Cockroach Labs MOLT Sinai](https://www.cockroachlabs.com/blog/experiment-running-hospital-code/)、[ThinkingBox](https://huggingface.co/blog/microsoft/thinkingbox)、[CABRA](https://github.com/microsoft/CABRA)、[Microsoft Dynamics 365](https://www.microsoft.com/en-us/copilot/blog/2026/10/08/bringing-crm-into-the-flow-of-work-and-agents-into-business-process-for-sales-and-service-teams/)、[Harness Cosmos](https://www.harness.io/press-and-news/harness-acquires-augment-code)、[memdebug](https://github.com/juraj-jumic/memdebug)、[Mudroom](https://github.com/Kernel-Hunter/mudroom)、[Agentplane](https://github.com/basilisk-labs/agentplane)、[Michael Lynch](https://mtlynch.io/why-are-coding-agents-so-dumb/)、[PDF editor 實驗](https://blog.nielstron.de/2026/10/08/the-remaining-shortcomings-of-coding-agents/)。
