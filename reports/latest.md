# AI 情報日報｜2026-09-30

約 5 分鐘閱讀。今天的主線是：AI agent 正從「回答問題」走向常駐工作者；同時，來源歸屬、部署測試、隔離與可撤銷權限，開始和模型能力一樣重要。

> 截稿時間：2026-09-30 08:05（Asia/Taipei）
> 查核範圍：優先 2026-09-28～09-30 的官方公告、原始研究、官方 repo 與第一手實作；避開 9/29 已報導且沒有新證據的 Linear CI、OpenCode、Meta Enterprise Platform、Microsoft Foundry 與 OpenAI DNS 事件。
> 證據標示：官方公告／文件是官方事實；廠商自己的 benchmark、價格與可用性會標明；論文、社群貼文與個人事故只代表其來源，不能外推成普遍結論。

## 1. 社群實戰用法

### 把 production trace 變成「針對壞行為」的 Agent 測試

- **新在哪裡：** TraceDance 論文（9/27）提出從真實部署 trace 找出決策點，再自動產生針對特定不良行為的 benchmark；不需要重播整個環境，只在原決策點評估下一步是否合乎行為 rubric。作者從 252,557 個 coding／tool-use session 建出 107 個 benchmark、4,125 個 instance，9 個 frontier LLM 的平均通過率只有 26.7%。
- **可以怎麼開始：** 先在 agent trace 保留工具名稱、輸入、結果、權限決策與當下狀態；挑一種你真的遇過的失誤，例如「工具失敗時亂猜」、「越權讀檔」或「被提示注入後繼續執行」，定義一個可判定的 rubric，再在 CI 只重播該決策點。
- **編輯心得：** 這比每週跑一次固定通用 benchmark 更接近 production：把自己的事故與客服回報轉成回歸測試，讓評測直接服務下一版 harness。
- **限制：** 這是 9/27 上傳的 arXiv 預印本；benchmark 建構與自動評分仍需抽樣人工確認，論文結果不代表所有模型或所有部署環境。

來源：[TraceDance 原始論文](https://arxiv.org/abs/2609.33295)（2026-09-27）；可信度：原始研究，尚未經同行評審。

## 2. 社群新工具與新玩法

### Holo4：同一個 agent 跨 GUI、程式碼、MCP 與 API 工作

- **新在哪裡：** H Company 9/28 發布 Holo4 27B dense、35B-A3B MoE 與 Holotron4 Nano；模型可在桌面、瀏覽器、Android、code sandbox、MCP 與 business API 間選擇介面，不必為每種環境換一個 agent。權重提供 BF16、FP8、NVFP4、GGUF，並附公開 trajectories。
- **可以怎麼開始：** 先下載 27B／35B 權重，在隔離 sandbox 做三個小測試：一個 GUI 任務、一個需要寫程式的任務、一個 MCP tool-call 任務；把每一步 trajectory 與失敗原因留下，不要直接接生產帳號。
- **編輯心得：** 它最有價值的不是「又一個 27B」，而是把跨介面切換當成模型能力；若工作流程常在瀏覽器、terminal 與 API 之間跳轉，這個設計值得實測。
- **限制：** OSWorld 2.0、AutomationBench 與成本數字是 H Company 自己的結果或不同 harness 的公開結果，必須標為廠商／跨 harness 比較；官方也承認公開 benchmark 與 private set 不同，不能直接當成你的團隊成功率。

來源：[H Company Holo4 原始發布](https://hcompany.ai/newsroom/holo4)（2026-09-28）、[Hugging Face 模型集合](https://huggingface.co/collections/Hcompany/holo4)；可信度：廠商發布與廠商 benchmark，需自行重跑。

### MCP 不只驗「答案對不對」，還要驗「是不是這個來源說的」

- **新在哪裡：** Multiverse Computing 團隊 9/29 分享 ProvenanceGuard：它保留每個 MCP tool output 的 source ID，將答案拆成 claims，逐一檢查支持來源、答案聲稱的來源是否一致，必要時修復後再驗證。這針對的是「事實在資料池裡是真的，但答案把它歸給錯的工具」的 cross-source conflation。
- **可以怎麼開始：** 在 MCP gateway 記錄 tool name、source ID、輸出與 claim 的關聯；把 post-generation verifier 放在回覆送出前，遇到日期、金額、帳號或病患資料等 literal value 不在指定來源時直接 block 或要求重查。
- **編輯心得：** RAG 的 faithfulness 分數不等於可稽核性；多工具 agent 尤其要把「哪個系統提供這個欄位」留在答案與 log 裡。
- **限制：** 目前是團隊文章與原始論文預印本，示範使用 MiniLM、DeBERTa NLI 與 local LLM，不代表任何 MCP server 接上去就自動安全。

來源：[ProvenanceGuard 團隊文章](https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source)（2026-09-29）、[論文入口](https://arxiv.org/abs/2606.18037)；可信度：作者第一手研究，需看完整論文與自行評估。

## 3. 官方新功能與推薦用法

### OpenAI DevDay：常駐 Dots、低價 Sol、雲端 Codex 與 MCP events 同時推出

- **官方更新：** OpenAI 9/29 DevDay recap 一次公布多項能力：Dots 是使用 GPT-6 Astra、擁有獨立 cloud computer、可在 ChatGPT／Slack／Teams 工作的常駐 agent；Codex 可從手機或任何裝置進雲端執行，CLI 新增 voice、`/agents`、resume 與 worktree 工作流；Agents API 加入 computer use、tool search、multi-agent 與 context compaction；plugin automation 可接 proposed MCP Events。
- **推薦用法：** 先把 Dots 當低風險讀取與整理助理：只接非敏感 app，Custom Rules 明確設定「可自動做、需核准、禁止」三層；Codex 則用 reusable environment 固定依賴、權限與網路，再讓它從小型 PR 開始。
- **編輯心得：** 這次真正的變化不是單一模型，而是「人在聊天介面、agent 在背景工作、工具用事件喚醒」開始被包成同一個產品面。
- **限制：** Dots 只在 eligible markets rollout，Enterprise／Edu／Healthcare beta 預設關閉；背景任務仍可能出錯，且從 Codex 或 Work 啟動的任務照樣消耗用量。OpenAI 自己也要求檢查有後果的工作。

來源：[DevDay 2026 官方總覽](https://openai.com/index/devday-2026-recap/)（2026-09-29）、[Dots 官方說明](https://openai.com/index/introducing-dots/)；可信度：官方公告，可用性依帳號、方案與地區而異。

### GPT-6.1 Sol：把 agentic coding 的成本往下壓

- **官方更新：** GPT-6.1 Sol 今日可用於 ChatGPT Work／Codex 與 API，標準 API 價格為每百萬 input $2、cached input $0.10、output $10；OpenAI 宣稱在 agentic coding、computer use 與專業工作接近 Astra，但以約五分之一的 Astra 標準 token 價格運作。
- **推薦用法：** 將 Sol 放在大量、可重試、需要長 context 的中等難度工作，例如測試補齊、文件查找、格式轉換與第一輪 PR review；把最難的研究或高風險變更保留給更強模型，並以「每個任務成本＋通過率」而不是單看 token 單價決策。
- **限制：** DeepSWE、AutomationBench、OSWorld、Terminal-Bench 等數字是 OpenAI 的測試結果，且競品數字取自公開報告、harness／effort 不完全一致；官方也說這些困難集不代表一般使用情境。這些 benchmark 必須標成廠商結果。

來源：[GPT-6.1 Sol 官方發布與定價](https://openai.com/index/introducing-gpt-6-1-sol/)（2026-09-29）；可信度：官方產品與廠商 benchmark，實際成本仍須用自己的 workload 驗證。

### NVIDIA OpenShell：把 agent 邊界放在模型與 harness 外面

- **官方更新：** NVIDIA 9/28 發布 Open Agent Safety Platform；其中 OpenShell 是開源 runtime，對檔案、system call、網路連線與 credentials 做 policy enforcement，Sentry 則是 BlueField-4 DPU 上的 out-of-band watchdog，可在越界時隔離 agent。OpenShell README 已提供本機 sandbox、policy advisor／prover 與 OpenCode quickstart。
- **推薦用法：** 在 Linux、Apple Silicon macOS 或 WSL2 先建立空白 sandbox，明確只放測試 repo、允許的 inference endpoint 與必要套件；故意測一次讀錯檔、連錯網域、請求新 credential，確認 policy 會阻擋且留下 audit event，再接 coding agent。
- **限制：** 這是 NVIDIA 的平台與 reference design，硬體 watchdog 與完整部署有自己的環境需求；README 也提醒 retrieved materials 的授權、安全與適用性要自行審查，不要把「有 sandbox」當成完成安全驗收。

來源：[NVIDIA 官方公告](https://nvidianews.nvidia.com/news/open-agent-safety-platform)（2026-09-28）、[OpenShell GitHub](https://github.com/NVIDIA/OpenShell)；可信度：官方公告與開源 repo，仍需做本機 threat model 與攻擊測試。

## 4. 使用心得與避坑

### 48,000 個檔案事故：先驗證路徑，再讓 Agent 執行清理

- **發生什麼：** 一名 Reddit 使用者 9/20 回報，Claude Code 的子 agent 在重建 Windows 測試 mirror 時清理 junction，疑似沿著 junction 進入 live working tree，約 103 秒刪掉 48,218 個檔案並破壞 Git object store；原始貼文後來被移除，外部報導也明確指出沒有獨立 forensic investigation。
- **可以怎麼避：** Agent 進行任何 copy、clean、move、delete 前，先在 disposable worktree／container 執行 `pwd`、`realpath`、junction／symlink 列表與預計影響檔案數；刪除動作加 dry-run、上限與人工核准，Git history 推到遠端且備份不能和工作樹共用同一個失效邊界。
- **編輯心得：** 這不是「某模型一定會刪檔」的證據，而是 agent 的速度會把路徑解析錯誤放大成災難。版本控制、遠端備份與外部 sandbox 是基本控制，不是額外的企業流程。
- **限制：** 事件細節來自當事人自己的 Reddit 貼文與轉述，不能當成 Anthropic 已確認的產品缺陷；真正可泛化的結論只有「不可逆操作要有獨立邊界與可恢復備份」。

來源：[原始 Reddit 討論（貼文已移除）](https://www.reddit.com/r/ClaudeAI/comments/1wl5cgo/removed/)、[r/technology 討論](https://www.reddit.com/r/technology/comments/1wpgktp/)、[TechRadar 轉述](https://www.techradar.com/pro/security/i-broke-something-a-claude-code-ai-agent-deleted-48-000-files-in-just-over-100-seconds-and-then-apologized-for-doing-so)（2026-09-24～09-28）；可信度：社群第一手回報與媒體轉述，未經獨立鑑識。

### 今天最值得帶回團隊的三個檢查

- **來源檢查：** 多工具回答要保留 source ID，不能只證明「某處有這個事實」。
- **行為檢查：** 從真實 trace 抽出最常見的失誤，做 decision-point regression，而不是只追逐通用 benchmark。
- **邊界檢查：** Agent 要碰檔案、網路或 credentials 前，先在隔離環境證明 deny path、approval path、audit path 都會工作。

## YouTube

### 今日無推薦

已主動查核 PAPAYA 電腦教室、Tech With Tim、Gary Chen、IBM Technology、Matthew Berman、Matt Wolfe 與近期 AI coding／Agent 候選；目前沒有影片同時符合最近 24–48 小時（必要時一週）、觀看數超過 10,000、可靠字幕／逐字稿、非 Shorts、且具實測／教學／技術拆解深度的門檻。OpenAI DevDay 直播與新聞整理未列入，因為偏發表會內容，不符合本欄的深度實作標準。

## 今日一句話

Agent 的下一個競爭點不是誰能多做一個 demo，而是誰能把來源、決策、權限與失敗都留下可重播、可阻擋、可恢復的證據。

## 來源總覽

- 研究：[TraceDance](https://arxiv.org/abs/2609.33295)、[ProvenanceGuard](https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source)。
- 新工具：[Holo4](https://hcompany.ai/newsroom/holo4)、[OpenShell](https://github.com/NVIDIA/OpenShell)。
- 官方更新：[OpenAI DevDay recap](https://openai.com/index/devday-2026-recap/)、[Dots](https://openai.com/index/introducing-dots/)、[GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/)、[NVIDIA Open Agent Safety Platform](https://nvidianews.nvidia.com/news/open-agent-safety-platform)。
- 社群避坑：[Claude Code／48,000 檔案事故原始討論](https://www.reddit.com/r/ClaudeAI/comments/1wl5cgo/removed/)。
