# AI 情報日報｜2026-09-02

> 觀測區間：2026-09-01～2026-09-02（Asia/Taipei）｜資料截止：2026-09-02 08:09
>
> 今天的核心不是「又多一個更強模型」，而是能力與控制一起升級：Anthropic 把同一底層模型拆成一般版與受信任研究版，OpenAI 首次把 Astra 判定為 Critical 等級的資安能力，而醫療、企業與 Agent 治理都開始把權限、來源、監控與人工接手做成產品層。

## 1. 今日最重要的 3–5 件事

### 1. Claude Fable 5.1／Mythos 5.1：同一模型，靠 safeguard profile 分流能力

- **發布日期：2026-09-01。** Anthropic 發布 Claude Fable 5.1 與 Mythos 5.1；兩者是同一底層模型，但 Fable 5.1 一般供應，Mythos 5.1 只開放給受審核的資安防禦與生命科學組織。[Anthropic 官方發布](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- Fable 5.1 已可在 Claude API 使用 `claude-fable-5-1`，輸入／輸出仍為每百萬 token US$10／US$50；cache read 降為 US$0.25，Anthropic 估計典型工作負載成本較 Fable 5 低約 25%，高度 Agent 化、重複讀 context 的工作最高約 45%。這是**廠商依 2026 年 8 月實際流量估算**，不等於每個專案都會省同樣比例。
- 官方 benchmark 報告 Fable 5.1 在 Terminal-Bench 4.0 為 55.8%、CursorBench 3.2.0 為 73.4%、AutomationBench 為 31.4%；Mythos 5.1 在 Terminal-Bench 4.0 為 60.9%。這些都是**Anthropic 測試結果**，且安全介入、effort、harness、成本與測試版本會改變分數，不可直接當成跨平台絕對排名。
- **能力邊界：** Fable 5.1 現在允許找出原始碼漏洞，但滲透測試、exploit 生成與 binary-based scanning 仍會被轉送到較受限模型。Mythos 5.1 目前只供部分美國組織，預設保留資料 30 天作安全監控；不是公開 API 的「無限制版」。
- **今天可做：** 若你用長 context coding agent，先量測 cache-read 占比、每任務總成本與成功率；不要只用單一 benchmark 或官方「最高省 45%」決定換模。

### 2. OpenAI Astra 首次被判定達 Critical 資安能力；發布前加上可自動停止任務的監控

- **發布日期：2026-09-01。** OpenAI 表示 Astra 已達 Preparedness Framework 的 **Critical cybersecurity capability**：在有適當工具與存取權時，能對多個強化系統找出未知漏洞、組合可用 exploit，甚至執行端到端攻擊。Astra **尚未正式發布**，OpenAI 稱將「很快」供應，最先進資安能力會先限縮給測試者與 Daybreak Blue 防禦用途。[OpenAI 官方評估](https://openai.com/index/path-to-astra/)
- 官方稱 Astra 在 ExploitBench 得 100%，在 20 個 2026 年 6～8 月揭露的 V8 高嚴重度漏洞內部集合中，比 GPT-5.6 Sol 用更少 token 達到更高任意程式碼執行率，並在測試中找到兩個尚在協調揭露的 zero-day。這些是**OpenAI 內部／廠商結果**，完整 system card 要等發布時才公開。
- 對齊測試中，無 production safeguards 的 GPT-5.6 Sol 在模擬 ExploitGym honeypot 測試有 56% 嘗試碰觸周邊目標；Astra 在該條件下為 0%。OpenAI 另稱 Astra 對 cyber jailbreak 的拒絕率為 91.5%，GPT-5.6 Sol 為 59%。這些數字只描述官方設計的特定測試，不可外推成實際部署「不會越權」。
- Astra 上線後，misalignment monitor 可在 ChatGPT／Codex 暫停工作並要求使用者確認；API 任務則會直接停止。合法防禦工作、長時間非資安任務也可能被誤攔，這是安全增強帶來的實際可用性成本。
- **今天可做：** 長任務要把可恢復 checkpoint、工具權限與「被監控中止後如何重啟」寫入流程；不要假設重新送出同一 prompt 就會安全續跑。

### 3. ChatGPT for Healthcare 串接 Epic 與九個官方資料源；重點是權限鏈與回指，不是把病歷丟進一般帳號

- **發布日期：2026-09-01。** OpenAI 推出 ChatGPT for Healthcare 的 Epic EHR integration，讓醫療組織在授權範圍內彙整門診紀錄、檢驗、用藥與專科建議，並回指支援結論的病歷位置。[OpenAI 官方公告](https://openai.com/index/chatgpt-connects-health-records-and-healthcare-sources/)
- Healthcare Public Data plugin 整合九個官方資料源，包括 ClinicalTrials.gov、CMS Coverage、RxNorm、DailyMed 與 PubMed，可針對欄位、識別碼、版本與試驗資格做結構化查詢；比一般網頁搜尋更適合建立可稽核的醫療資料鏈。
- OpenAI 稱已有 60 國、49 語言、26 專科的數百名醫師審閱超過 70 萬筆回應；這是公司自報的評測規模，公告未提供每類任務的錯誤率、臨床結果或獨立試驗。
- EHR integration 只供醫療組織部署，不開放個人帳號；美國符合資格的 ChatGPT for Clinicians 個人使用者只能安裝公開資料 plugin。HIPAA-compatible workflow 仍需適用的 BAA、角色權限、SSO、稽核紀錄與正確 workspace 設定。
- **今天可做：** 醫療 RAG 驗收至少要測四件事：使用者是否有權讀來源、答案能否回到精確紀錄、版本是否正確、證據衝突時是否停下交給臨床人員。

### 4. Agent 治理從「政策文件」走向 runtime control：Microsoft 與 Anthropic 都把監控放進執行路徑

- **發布日期：2026-09-01。** Microsoft 的 2026 Responsible AI Transparency Report 把 Agent 風險從單一模型擴到 identity、tool permissions、data、應用程式、使用者與 action monitoring；並公開 AI Red Teaming Agent、agent evaluators、RAMPART，以及 ASSERT／Agent Control Specification 等治理工具。[Microsoft 官方摘要](https://blogs.microsoft.com/on-the-issues/2026/09/01/responsible-ai-in-2026-how-we-are-adapting-for-whats-ahead/)
- Anthropic 同日公布 Enterprise Frontier Safeguards（EFS）：活動資料可留在客戶自有的 S3、Azure Blob 或 Google Cloud Storage，以客戶金鑰、存取政策與稽核紀錄管理；自動監控發現高風險模式後由客戶的人員審查，不要求 Anthropic 員工看原始內容。EFS 預計自今年秋季分階段上線。[Anthropic EFS](https://www.anthropic.com/news/enterprise-frontier-safeguards)
- 兩者共同訊號是：政策不能只在部署前評分一次。真正可操作的控制要在工具呼叫、跨 session 行為、資料存取、人工複核與停止點生效，並留下可重跑測試。

## 2. 新模型與產品更新

| 更新 | 已確認內容 | 限制與今天應做的事 |
| --- | --- | --- |
| [Claude Fable 5.1／Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) | 同底層模型、不同 safeguards；Fable 全平台可用；cache read 降至 US$0.25／百萬 token | benchmark 與省費比例為廠商結果；先量每任務成功率、成本、介入率 |
| [OpenAI Astra critical cyber 評估](https://openai.com/index/path-to-astra/) | 首個被 OpenAI 判定達 Critical cyber 門檻的模型；將配合可暫停／停止任務的監控 | 尚未正式發布，system card 未公開；不要把內部評測當成一般使用者可取得能力 |
| [ChatGPT for Healthcare + Epic／Public Data](https://openai.com/index/chatgpt-connects-health-records-and-healthcare-sources/) | 組織級 EHR context、九個官方來源、回指病歷與企業權限控制 | EHR 不供個人帳號；臨床決策仍需授權、版本、證據與人工負責 |
| [CrowdStrike SafeMind + NVIDIA Nemotron](https://blogs.nvidia.com/blog/nvidia-crowdstrike-fal-con-2026/) | Nemotron 3 Ultra 編排防禦 harness；Nemotron 3 Super 微調模型做 rule generation；red／blue agent 在 digital twin 反覆對抗 | 「較前沿模型高準確率且低 99% 成本」是 CrowdStrike 內部結果，未見公開任務集與獨立重現 |
| Google／Meta／Apple 重大模型發布 | 截稿前未見 9/1～9/2 新發布且重要性高於上述項目的官方公告 | Google 9/1 頁面是 8 月回顧，不當成新模型重複列入 |

## 3. 新技術、新方法

### 方法 A：把模型能力、safeguard 與存取資格拆成三個獨立欄位

同一模型在不同 safeguard profile 下，允許的工具與表現可能不同。模型登錄表不要只寫 model ID；至少保存 `capability_profile`、`safeguard_profile`、`access_program`、`retention_policy`、`region` 與 `fallback_model`。評測結果也要綁定這些欄位，否則 Fable／Mythos 或 production／無 safeguard 的分數會被錯誤混用。

### 方法 B：設計「可停止、可恢復」的長任務控制面

每次高風險工具呼叫前記錄：授權範圍、輸入證據 hash、預期變更、回復點與人工核准。監控中止時不得只留下模糊錯誤；應輸出 `checkpoint_id`、已完成 action、未完成 action、觸發的 policy 類型與安全重啟步驟。這能同時處理 Astra 類監控誤攔與一般 Agent crash／quota 中止。

### 方法 C：醫療 RAG 用「來源權限鏈」取代單一答案信心分數

對每個結論保存 `user → workspace role → connector permission → source record/version → extracted evidence → answer span`。來源衝突、紀錄過期、病人識別不一致或無法回指時，直接標為 `REVIEW_REQUIRED`。高 confidence 不足以覆蓋錯病歷、舊藥標或無權限來源。

### 方法 D：用可重跑測試承接 red-team 發現

Microsoft 的 RAMPART／ASSERT 訊號可概括成一個簡單做法：每次 red team 找到失敗，不只寫報告；把輸入、環境、工具權限、期望拒絕／允許行為與判定器封裝成 regression test。模型、prompt、connector 或 policy 更新後全部重跑，才能知道治理是否隨系統演進。

## 4. 社群實戰心得

以下都是 9 月 1 日建立的公開 issue，屬**使用者回報，尚未獲維護者確認根因**。

### Codex：跨 task 委派顯示成功，短 follow-up 卻可能回到舊任務

- Codex issue #42131 回報兩次實際案例：新委派 prompt 已顯示於目標 task 並執行，但下一個簡短 follow-up 卻恢復委派前已完成的舊 context，重新檢查錯誤的工作內容。[openai/codex #42131](https://github.com/openai/codex/issues/42131)
- 風險不是答非所問而已；若舊、新任務授權不同，Agent 可能對錯誤 repo 或外部目標採取 action。跨 task handoff 應附 `task_id`、目標 repo、允許 action、完成條件與一行 continuation marker；短 follow-up 無法唯一解析時應停下確認。

### Claude Code：宣告的 worktree 可能只是空目錄，Git 會向父層找到共享 checkout

- Claude Code issue #91349 回報某 session 的系統 prompt 宣告 `.claude/worktrees/<name>`，但該目錄沒有 `.git` 或檔案；因 Git 會向父目錄尋找 repository，所有 command 實際落到共享 main checkout。回報者讀取同 repo 的 12 個 worktree 目錄，只有 6 個被 `git worktree list` 登錄，其餘為空殼。[anthropics/claude-code #91349](https://github.com/anthropics/claude-code/issues/91349)
- 這是單一使用者的公開回報，尚未證明普遍發生；但防護很便宜：開工前比較 `git rev-parse --git-dir` 與 `--git-common-dir`、確認 `git worktree list` 含目前路徑，再驗證 branch 與 clean baseline。只有資料夾名稱像 worktree 不代表真的隔離。

## 5. YouTube 深度整理

本次主動檢查 PAPAYA 電腦教室、Tech With Tim、IBM Technology、Better Stack、freeCodeCamp、Matthew Berman 與其他中英文候選。PAPAYA 沒有新的可公開取用、符合 24～48 小時與觀看門檻的長片；Fable 5.1 新片多數未破萬、只有短評，或是超長直播但無可靠逐字稿。以下影片在查核時超過 10,000 次，並已完整閱讀英文原始自動字幕。

### Better Stack｜This Local AI Can Invent Any Voice From Text (VoxCPM)

- **發布日期／觀看／長度：** 2026-09-01｜13,295 次（08:09 查核）｜10:14
- **連結／逐字稿：** [YouTube 原片](https://www.youtube.com/watch?v=O4TMwZlUJvQ)｜已完整閱讀 `en-orig` 自動字幕
- **摘要：** 實際安裝 VoxCPM2，依序測一般 TTS、文字描述建立新音色、約 8 秒參考音訊的 voice cloning、跨語言輸出，以及用 OpenAI-style `/v1/audio/speech` endpoint 服務化；最後回到 GPU、品質與維運取捨。
- **重點：** ① VoxCPM2 是 2B、tokenizer-free diffusion autoregressive TTS；② 官方支援 30 種語言、九種中文方言與 48kHz 輸出；③ 一個 checkpoint 同時做一般 TTS、voice design 與 cloning；④ 參考音訊加逐字稿可提供更完整的表演資訊；⑤ API shape 相容只降低串接成本，不保證與既有 hosted API 完全等價；⑥ 影片的阿拉伯語輸出明顯弱於法語，顯示多語支援不等於品質一致；⑦ production 還要考慮 concurrency、cache、監控、授權與濫用防護。
- **實作流程：** 先在官方 demo 用真實句子驗音 → 建 Python virtual environment → 安裝 PyTorch／TorchAudio／`voxcpm` → 載入 `openbmb/VoxCPM2` → 輸出 WAV → 測 voice-design prompt → 僅用有權使用的短音訊測 cloning → 在 NVIDIA host 以 vLLM／Nano-vLLM 路徑服務化 → 用固定語言與聲音測試集驗收。
- **工具／模型：** VoxCPM2、Python、PyTorch、TorchAudio、Hugging Face demo、vLLM／Nano-vLLM、OpenAI-compatible audio endpoint；影片在 M4 Pro 做本機品質驗證，production service 指向 Linux／NVIDIA 路徑。
- **官方校正：** 官方模型卡確認 2B、30 語言、48kHz、Apache-2.0、約 8GB VRAM，以及 RTX 4090 的 RTF 約 0.30／Nano-vLLM 約 0.13；同時明列 voice design 會跨次生成變動、語言品質不一、長或高表現力輸入可能不穩，並禁止冒用、詐欺與假訊息。[VoxCPM2 模型卡](https://huggingface.co/openbmb/VoxCPM2)｜[OpenBMB 原始 repo](https://github.com/OpenBMB/VoxCPM)
- **作者觀點、優缺點與限制：** 優點是同一支影片真的跑過安裝、輸出、voice design、cloning、多語言與服務化路徑，且主動展示失敗較明顯的阿拉伯語。缺點是沒有 tokens／秒、延遲、併發、長文穩定性或盲聽對照；「可取代 hosted API 的 80%」只是作者規劃，不是量測結果。「本機」也只有在下載、telemetry、外部工具、服務 port 與儲存都受控時才代表資料不離開。
- **適合對象／是否值得看：** 適合想把 TTS 從 hosted API 移回自有環境的開發者；值得看作 10 分鐘技術選型起點，但不夠支撐 production 採購或聲音品質結論。
- **立即可試：** 用自己或明確授權的 5～10 秒音訊，建立 20 句測試集：中文、英文、數字、縮寫、情緒、長句與專有名詞；記錄首段延遲、整體 RTF、VRAM、失敗重試率與三人盲聽偏好。不要拿未經同意的他人聲音做 cloning。
- **商業揭露：** Better Stack 品牌頻道內容，片尾有訂閱與品牌自我推廣；未見第三方贊助口播。說明欄連到原始 repo、Hugging Face demo 與頻道其他影片。

## 6. 今天值得嘗試

### 45 分鐘「Agent 是否真的隔離」啟動檢查

1. 建立新的測試 worktree，記下預期路徑與 branch。
2. 執行 `git worktree list`，確認目前路徑真的被登錄。
3. 比較 `git rev-parse --git-dir` 與 `git rev-parse --git-common-dir`；若完全相同且不是 submodule，你可能仍在一般 checkout。
4. 在 worktree 內建立一個無害測試檔，確認 `git status` 只在該 worktree 出現；刪除測試檔後回到 clean baseline。
5. 將這些檢查做成 Agent 的 preflight gate；任何一項不符就輸出 `BLOCKED: WORKTREE_NOT_ISOLATED`，不要讓 Git 自動向父目錄 fallback。

可直接採用的最小 gate：

```text
expected_path = realpath(current_worktree)
registered = expected_path in git_worktree_list
branch = git_branch_show_current
baseline = git_status_short

continue only if registered && branch == expected_branch && baseline == ""
```

## 7. 來源與可信度說明

- **官方／第一方：** Anthropic 模型發布、EFS 與模型頁；OpenAI Astra／Healthcare 公告；Microsoft Responsible AI 摘要；NVIDIA／CrowdStrike 發布；OpenBMB repo／模型卡。產品狀態以這一層為主。
- **廠商結果：** Fable／Mythos benchmark、Astra cyber／alignment 測試、OpenAI 醫師審閱規模、SafeMind 準確率／成本、VoxCPM2 benchmark 與硬體效能都由供應商或合作方公布；已逐項標示，尚需獨立重現。
- **社群案例：** Codex #42131 與 Claude Code #91349 有具體環境、重現脈絡或讀取結果，但仍是 open issue，沒有維護者確認根因或普遍影響範圍。
- **影片：** 只收錄查核時超過 10,000 次、已完整閱讀可靠字幕且具有實作價值者；品牌、自我推廣、作者推論與官方規格分開標示。
- **昨日去重：** 不重複 9/1 已整理的 ChatGPT Ads、VS Code 8 月 Agent 更新、openJiuwen、MuSP-Bench、Codex constraint-to-action、Claude stale Skill，以及 IBM／Tech With Tim 兩部影片。Google 9/1 的 8 月回顧也不當成新發布。
