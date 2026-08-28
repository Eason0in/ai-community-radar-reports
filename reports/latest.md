# AI 情報日報｜2026-08-28

> 觀測區間：2026-08-26～2026-08-28（Asia/Taipei）｜資料截止：2026-08-28 08:12
>
> 今天的主線是「把展示能力變成可控的生產流程」：Google 把影片模型做成可多輪編輯的 API，NVIDIA 開始交付專為 Agent 周邊工作負載設計的 CPU；同時，新研究與實測都指向同一件事——任務規格、評測流量、除錯方法與權限邊界，往往比單一排行榜名次更能決定實際結果。

## 1. 今日最重要的 3–5 件事

### 1. Gemini Omni 1.1 Flash 上線：影片產製從一次生成走向可延伸、可插值、可多輪編輯

- **發布日期：2026-08-27。** Google 推出 `gemini-omni-1.1-flash`，已可透過 Gemini API／Google AI Studio 使用；支援文字、圖片、音訊與影片輸入，並能以 `previous_interaction_id` 延續前一輪影片狀態。[Google 官方公告](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/)｜[Gemini API 官方文件](https://ai.google.dev/gemini-api/docs/omni)
- 新控制包括：首尾影格插值、以參考圖片／影片維持主體、360p 低成本預覽、720p 原生輸出、1080p／4K 放大，以及每次延伸 10 秒、累計最長 40 秒。延伸會讀取前 10 秒內容，比只看最後影格更有利於動作與敘事連續。
- **限制很具體：** 上傳後供編輯／延伸的影片須不超過 10 秒；只能接在片尾，不能在中段插入；不能替已有說話者的上傳片段續接新台詞；不支援音訊參考、多影片聯合推理、system instruction、temperature、negative prompt 等控制；非英文尚未正式評估。
- 1080p 與 4K 是放大輸出，不等於模型原生產生相同解析度的細節。所有生成影片都有不可見的 SynthID 浮水印。Google 稱其達到 production-ready，仍屬廠商定位；一致性與「世界知識」品質尚需在自己的素材上實測。

### 2. NVIDIA Vera 開始出貨：Agent 的瓶頸不只在 GPU，也在工具呼叫、沙箱與長上下文周邊工作

- **更新日期：2026-08-27。** NVIDIA 將 5 月的 Vera 介紹更新為「開始規模出貨」，並表示 AWS 已收到首套 Vera CPU server 與 Vera Rubin GPU；先前也已向 Anthropic、OpenAI、SpaceXAI 與 OCI 交付系統。[NVIDIA 官方文章](https://blogs.nvidia.com/blog/vera-cpu-delivery/)
- Vera 是 NVIDIA 首款自研 CPU，規格為 88 個 Olympus 核心、1.2 TB/s 記憶體頻寬，定位在 Agent orchestration、工具呼叫、RL、資料分析、沙箱與長上下文狀態管理；在 Vera Rubin NVL72 中，會透過第二代 NVLink-C2C 連接兩顆 Rubin GPU。
- NVIDIA 宣稱 Vera 在 Agent 工作負載有最高 1.8 倍單核心效能，並能以傳統基礎設施兩倍能源效率餵飽 GPU；這些都是**廠商結果**，文章沒有提供可獨立重現的完整工作負載、基準平台與價格。
- **工程判讀：** 當 Agent 同時跑 shell、測試、瀏覽器、資料庫與多個沙箱時，CPU、記憶體頻寬、程序建立與 I/O 排程確實會成為端到端瓶頸；但「專為 Agent」不應取代在真實 workload 上分開量測 GPU 利用率、CPU 飽和、P95 工具延遲與每個成功任務成本。

### 3. OpenAI／Bocconi 隨機實驗：ChatGPT 讓答案更像專家，因果推理訓練讓想法更分散

- **發布日期：2026-08-27。** 一項預先註冊的 2×2 隨機對照實驗，將 1,053 名大一學生按班級分成因果推理訓練、ChatGPT Edu（GPT-4o）、兩者皆有、兩者皆無四組；學生在 45 分鐘內完成一項行銷建議任務。[OpenAI 摘要](https://openai.com/index/what-students-gain-from-chatgpt-critical-thinking-training/)｜[原始論文 PDF](https://cdn.openai.com/pdf/novices-and-llm-august-2026.pdf)
- ChatGPT 組在五分量表比控制組高約 0.86 分，文字更連貫、點子數更多，也更接近三名領域專家的建議；因果推理訓練則提高機制說明、可否證性與組內／組間點子多樣性，但傳統評分表沒有獎勵這些差異。
- 兩者結合後，學生仍保留因果推理帶來的多樣性，也有 ChatGPT 帶來的連貫性；這支持「AI 輔助與思考訓練可以互補」，不支持「用了 AI 就不必教推理」。
- **限制：** 只有一所歐洲大學、一種短時限行銷任務與 GPT-4o；評分者多為碩士生，且量表本身偏好典型解答。結果不能外推到程式設計、長期學習、考試誠信或所有學生族群。OpenAI 是合作研究者之一，應以論文設計與資料而非公司摘要為準。

### 4. Agent 研究同時提醒：規格太薄會更貴，失敗後整段重跑也不等於真正修好

- **arXiv 投稿日期：2026-08-26。** 一項 2,700 次 Kimi K3 coding-agent 實驗指出，把完整任務規格縮成只有 user story，平均 token 用量增加 29.7%；不同任務的 prompt 敏感度介於 13%～115%。作者也用一次便宜探測，在未見任務上把不同規格／thinking effort 的 token 成本分布預測到 36% 誤差內。[任務規格與成本原始論文](https://arxiv.org/abs/2608.25399)
- 同日的 SymTrace／SymFail 研究保存失敗軌跡、在指定 anchor 前重播、只重產生後段；536 條人工標註失敗軌跡中，既有無引導重跑的失敗重現率為 67.97%，修復率只有 6.90%，依症狀介入則修好 20.15%。[Repair or Resample 原始論文](https://arxiv.org/abs/2608.25920)
- **實務結論：** 好規格不是多寫背景，而是先寫驗收條件、不可變約束、可用工具與失敗訊號；除錯則要固定失敗前狀態，從最早可疑節點重播。若每次都換 seed、換前文、整段重跑，看見「這次過了」也無法知道是修復還是抽樣運氣。
- 兩者皆是作者預印本；第一項只測一個模型與特定 coding 任務，第二項的框架與資料集也不等於所有 Agent 系統。百分比不能直接當成產品承諾。

## 2. 新模型與產品更新

| 更新 | 已確認內容 | 限制與判讀 |
| --- | --- | --- |
| [Gemini Omni 1.1 Flash](https://ai.google.dev/gemini-api/docs/omni) | API、AI Studio、Gemini Enterprise Agent Platform；Flow 全球 Plus／Pro／Ultra 方案也開始提供 | 4K 為放大；上傳影片編輯有地區與 10 秒限制，非英文未正式評估 |
| [Gemini Notebook Expert Intelligence](https://blog.google/innovation-and-ai/products/gemini-notebook/expert-intelligence-leading-sources/) | 2026-08-27 上線；可把已購買的 Google Play Books 電子書加入 Notebook，首波超過 100,000 本，並可和私人資料一起查詢 | 協作者若未購書就不能使用該書內容；出版社／作者合作與引用接地不代表回答必然正確 |
| [Google Search AI Mode 旅遊](https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/) | 航班價格追蹤擴至 180 多個國家／地區；里程／點數查價全球提供；美國英文版開始推出飯店直接預訂 | 歐洲經濟區有功能限制；飯店或訂房平台才是 merchant of record，客服與取消責任不在 AI 回答本身 |
| [NVIDIA Vera](https://blogs.nvidia.com/blog/vera-cpu-delivery/) | 開始向雲端商與 AI lab 交付；OCI 稱將於 2026 年部署數十萬顆 | 效能／能源數字為 NVIDIA 口徑，尚缺公開價格與第三方端到端評測 |

**大型廠商掃描：** 截稿前未找到 Anthropic、Microsoft、Meta、Apple 在最近 24 小時發布且重要性高於上述項目的全新前沿模型公告。8 月 26 日已報導的 Hugging Face 入侵調查、WebMCP、Jalapeño、handoff constraint weakening、SMITH 與 AtlasNav 沒有足以重複報導的新進展。

## 3. 新技術、新方法

### 用「完整規格最小集」降低 coding-agent 的探索成本

任務規格研究可直接轉成四個欄位：

```yaml
goal: 可觀察的使用者結果
constraints: 不可變介面、權限與不得修改範圍
verification: 必跑測試、檔案比對或公開端點
failure_evidence: 失敗時必須保留的 log、diff 與最小重現
```

這不是要求先寫長篇設計書，而是把 Agent 最常反覆猜測的部分提前固定。量測時應同時記錄 token、工具呼叫數、重試次數與成功率；只看單次 token 可能會把「便宜但失敗」誤判成高效率。

### 除錯採 anchor replay，不要把整段 resample 當修復

保存每一步輸入、工具結果、工作目錄、commit／檔案雜湊與隨機設定；先找到最早出現錯誤狀態的節點，再固定上游，只重跑下游。若替換某個決策後能穩定修復多次，才較接近因果修復。這也能避免新版模型、網路回應或外部檔案變動讓「昨天過、今天壞」無從追查。

### AsymSpec：讓小 drafter 看完整 context，大 verifier 只看壓縮 context

- **投稿日期：2026-08-26。** AsymSpec 打破 speculative decoding 要求 drafter／verifier 共用相同 context 的假設：輕量 drafter 讀完整輸入，大型 verifier 讀壓縮版本，再用 contrastive logit fusion 與 divergence-aware gate 決定接受草稿。[AsymSpec 原始論文](https://arxiv.org/abs/2608.26004)
- 作者在四種 Agent 能力與兩個端到端 benchmark 報告，平均保留約 90% 的完整上下文準確率；孤立文字能力的吞吐量提高 1.3～1.7 倍、計算成本為 0.2～0.3 倍。
- 論文已列為 EMNLP 2026 主會議，但上述仍是作者實驗；不同壓縮器、KV cache、工具回傳大小與硬體會改變收益。可借用的核心是「不同角色不一定需要相同 context」，不是直接套用其數字。

## 4. 社群實戰心得

以下皆為 8 月 27 日建立的公開 GitHub issue，屬**使用者回報，並非維護者已確認根因或正式公告**。

### 安全檢查工具可能反而把 OAuth token 寫進 transcript

- Claude Code 使用者提供詳細重現：`security-guidance` plugin 的停止前審查把未追蹤的 `~/.claude/.credentials.json` 納入 diff，然後在 finding 中逐字回顯 access／refresh token，再以 system reminder 注入對話 transcript。[Claude Code issue #90010](https://github.com/anthropics/claude-code/issues/90010)
- 回報者的本機 guard 擋下送往模型的提示，但 token 已顯示在終端；重新登入後，憑證改存 macOS Keychain，檔案未重建。這是單一環境觀察，尚不能證明所有版本／平台都有相同行為。
- **先做的防護：** 不把 `~/.claude` 當一般原始碼 repo；若必須納入 dotfiles，至少忽略 `.credentials.json`，secret scanner 只回報種類、檔案與遮罩後前綴，不回顯秘密值。若 transcript 已留下完整 token，應旋轉憑證，而不是只刪文字。

### 兩個 session 共用同一 worktree，可能無聲覆蓋未提交內容

- 另一回報稱，從同一 host session 快速啟動兩個 worktree task 後，兩者指向相同 `.claude/worktrees/...` 路徑；其中一個切換 branch 時覆蓋另一個未提交修改，事後 `git status` 仍看似乾淨。issue 已標示 duplicate／data-loss，但仍為 open。[Claude Code issue #90146](https://github.com/anthropics/claude-code/issues/90146)
- **防護：** 每個 task 啟動後先輸出並核對絕對 worktree 路徑與 `git worktree list`；重複路徑立即停止；重要中間成果先建立小 commit 或 patch。名稱看起來不同不代表路徑已原子保留。

### Codex Windows 的 GPT-5.6 本機工具握手回報增加

- Codex issue #41049 集中多位 Windows 使用者回報 `code-mode host exited during handshake`，症狀是 GPT-5.6 無法穩定讀寫檔案／執行工具，而切到 GPT-5.5 可暫時恢復；issue 仍為 open，沒有維護者確認根因。[Codex issue #41049](https://github.com/openai/codex/issues/41049)
- **防護：** 先保留 app 版本、模型、Feedback ID 與本機 log，並以同一專案切換模型做 A/B；不要把第三方鏡像安裝包當成正式回滾管道。能在 5.5 工作只是一項使用者層級 workaround，不證明模型本身是根因。

## 5. YouTube 深度整理

### Tech With Tim｜Codex vs Claude - an Honest Comparison

- **發布日期：** 2026-08-27
- **觀看次數：** 18,191（2026-08-28 08:12 Asia/Taipei 重新查核，超過 10,000）
- **長度／逐字稿：** 22:56；已完整閱讀 YouTube 英文原始自動字幕
- **連結：** [YouTube 原片](https://www.youtube.com/watch?v=sbuwHi1Sz6k)
- **贊助揭露：** 有。約 03:10～04:22 為 Boot.dev 付費贊助；說明欄另含自家課程、電子報與聯盟連結。

**摘要與重點**

1. 作者先區分模型與 agentic harness：context、工具、權限、編輯與測試流程會改變結果，因此不能只拿模型榜單決定 Codex／Claude Code 勝負。
2. 他用相同提示做五項單次實測：陌生 repo 解說、從零做 habit tracker、拆分 5,040 行 Python 檔、修 planted bug、審查含三個已知 bug 的 PR。
3. 影片觀察是 GPT-5.6 Sol 多半更快、更精簡；Claude Opus 5 花更多時間，卻常多寫測試、驗證工具與說明。這是作者在小樣本、特定 harness／effort 下的示範，不是模型普遍優劣。
4. Senior SWE-Bench 官方榜目前確實顯示 Fable 5、Opus 5、GPT-5.6 Sol 的 tasteful pass@1 都是 34.7%，但只有 100 個長時程任務，且三者 reasoning effort 不同。[Senior SWE-Bench 官方榜](https://senior-swe-bench.snorkel.ai/)
5. **需要更正：** 影片仍說 Sol API 為 US$5／US$30；官方目前促銷價是 input US$4、output US$20／百萬 token，至少維持到 11 月 21 日。[OpenAI 官方模型頁](https://developers.openai.com/api/docs/models/gpt-5.6-sol)
6. **需要更正：** 影片稱 Opus 5 訂閱需 Max；Anthropic 官方寫明 Opus 5 可供 Pro、Max、Team、Enterprise 使用。方案實際額度會變動，不應用社群估算訊息數做採購保證。[Anthropic Opus 5 官方頁](https://www.anthropic.com/claude/opus)

**影片中的工作流程：** 固定 repo 快照與提示 → 分別執行同一任務 → 計時 → 跑測試／人工檢查 → 比較完成度、額外驗證、速度與方案成本。工具／模型為 Codex CLI、Claude Code CLI、GPT-5.6 Sol／Terra／Luna，以及 Claude Fable／Opus／Sonnet／Haiku。

**作者心得：** 想要速度、精簡修改與較高額度時偏向 Codex；重視主動補測試與深度時偏向 Claude Code；有預算可讓兩者互審。這是作者觀點，不能取代自己的 repo 評測。

**優點：** 真正展示五種任務與產物；把 harness、速度、測試深度、價格分開；承認廠商 benchmark 會挑有利指標。**缺點與限制：** 單次執行、任務偏小、沒有公開完整可重跑 harness；訂閱／價格資訊已有兩處過時；「多寫」不一定等於較好，也可能是 scope creep。

**適合對象：** 正在選 Codex／Claude Code，願意自己重跑代表性任務的開發者。**是否值得看：** **有條件值得。** 看實測方法與行為差異，不要照抄價格、額度或全域勝負。

**可靠時間點：** 00:57 harness；03:10 贊助；07:05 Senior SWE-Bench；13:08 repo 分析；15:02 從零建置；16:46 大檔重構；18:19 bug；19:15 PR review；20:45 選擇建議。

**可立即嘗試：** 從自己的 backlog 挑一個 bug 與一個 refactor，固定 commit、prompt、reasoning effort、工具權限與 timeout，各跑三次；以測試通過、人工修改分鐘數、patch size、token／費用與 P95 完成時間比較，而不是問「哪個模型最好」。

### IBM Technology｜LLM & AI Agent Benchmarks vs Reality: Why AI Applications Break

- **發布日期：** 2026-08-27
- **觀看次數：** 15,636（2026-08-28 08:12 Asia/Taipei 重新查核，超過 10,000）
- **長度／逐字稿：** 15:01；已完整閱讀人工英文字幕
- **連結：** [YouTube 原片](https://www.youtube.com/watch?v=nVImVgKpoOY)
- **贊助揭露：** 未見付費贊助；屬 IBM 品牌教育內容，說明欄導向 IBM benchmark 資源與電子報，且揭露逐字稿／metadata 製作使用 AI。

**摘要與重點**

1. 模型評測只回答能力的一部分；生產系統還要同時量 accuracy、latency、throughput、cost，通常無法三者都最大化。
2. 有標準答案時可用 MMLU／MMMU、SWE-bench／Terminal-Bench 等 reference 或 execution-based eval；開放式客服回應則需 rubric、LLM-as-judge 與人類領域專家校準。
3. 系統效能要拆成 time to first token、inter-token latency、完整 request latency、throughput；prefill 偏計算密集，decode 偏記憶體密集，因此 prompt／output 長度會改變瓶頸。
4. 測試流量必須像真實 workload：聊天、RAG、coding agent 的輸入輸出形狀不同；容量規劃要找吞吐增加後 P99 latency 開始急升的轉折點。
5. Agent 不是一次 model call；意圖辨識、routing、工具選擇、retrieval、程式執行、格式、安全與最終答案每一層都要有自己的 eval，否則只評最後文字找不到失敗位置。

**影片中的工作流程：** 先定義業務成功與安全 rubric → 建模型層 eval → 以真實 token 分布與併發流量壓測 → 設 P95／P99 SLO → 對 Agent 每個節點記錄中間結果與通過條件 → 用領域專家校準 LLM judge。工具／模型採通用說明，提到 MMLU／MMMU、SWE-bench、Terminal-Bench、RAG、MCP 與向量資料庫，沒有提供特定 IBM 產品實作。

**作者心得：** leaderboard 是起點；真正評測必須用自己的資料、流量與成功定義。**優點：** 把模型品質與服務系統分開，提供可直接套用的指標與 Agent 分層。**缺點與限制：** 偏概念教學，沒有程式碼、公開測試資料或實測數字；「通常只能最佳化三者中的兩者」是溝通模型，不是不可違反的定律。

**適合對象：** 正要把 RAG／Agent 從 demo 上線、需要設 SLO 與 eval pipeline 的工程師。**是否值得看：** **值得。** 15 分鐘可建立正確評測框架，但後續仍要自己實作 tracing、資料集與負載測試。

**可靠時間點：** 01:02 accuracy／performance／cost；02:08 模型評測；04:29 LLM-as-judge；06:23 系統評測；08:01 workload shape；09:00 SLO；10:49 Agent 分層；13:15 整體框架。

**可立即嘗試：** 為現有 Agent 加一張最小表格：每個節點記 `input_size`、`tool`、`status`、`latency_ms`、`tokens`、`cost`、`verifier`；先用 20 條真實但去識別化任務跑 P50／P95，再決定要換模型、改 retrieval 還是修工具。

**未收錄說明：** 已主動檢查 PAPAYA 電腦教室、Gary Chen、Better Stack、Matthew Berman、Tech With Tim、IBM Technology 等中英文來源。PAPAYA 最新項目為會員限定，無法完成公開觀看數與逐字稿查核；Gary Chen 的 ChatGPT Chrome 實測雖達 18,404 次且有人工繁中字幕，但與昨日 WebMCP／browser-agent 主題接近；Better Stack 的 audio.cpp 類工具已於先前日報整理。其餘候選未破萬、主題重複或偏新聞朗讀，因此不湊第三部。

## 6. 今天值得嘗試

### 45 分鐘：建立一個「任務規格 × 模型 × 系統」最小評測

選一個可在本機、無敏感資料的既有 bug：

1. 固定同一個 commit／worktree，準備「完整四欄規格」與「只有一句 user story」兩版提示。
2. 各跑同一模型兩次；若有第二個 coding agent，再以相同權限、effort、timeout 各跑一次。
3. 記錄 token、工具呼叫、總時間、首次有效動作時間、測試通過數、patch size、人工修正分鐘數。
4. 失敗時保存最早錯誤節點前的 transcript、工具結果與檔案雜湊，只從該 anchor 後重跑；不要整段重新抽樣後就算修好。
5. 最後比較 `總成本 ÷ 通過 verifier 的任務數`。如果完整規格同時降低 token 與修正時間，就把四欄範本寫進 repo；若沒有，縮短其中沒有決策價值的背景。

成功條件不是「某模型贏」，而是能回答：成本花在哪一層、失敗從哪一步開始、換 prompt／模型／工具哪一項才真的改善結果。

## 7. 來源與可信度說明

- **第一手官方資料：** Google Omni 公告與 API 文件、NVIDIA Vera 更新、OpenAI／Bocconi 論文、Google Search／Gemini Notebook 公告、OpenAI／Anthropic 模型與價格頁。
- **廠商結果：** NVIDIA 的 1.8 倍單核心與兩倍能源效率、Google 的 production-ready／一致性描述均明確視為廠商口徑；未把它們當第三方 benchmark。
- **原始研究：** 任務規格 token 成本、Repair or Resample、AsymSpec 均連到 arXiv 原文；前兩者為預印本，AsymSpec 標示 EMNLP 2026 主會議。研究結果只適用其模型、任務、框架與硬體設定。
- **社群訊號：** 三個 GitHub issue 只代表回報者環境。本文保留 open／duplicate 狀態與「根因未確認」，防護建議以隔離、遮罩、可恢復與保存證據為主。
- **YouTube：** Tech With Tim 與 IBM Technology 影片均於截稿前重新查核超過 10,000 次，已全文閱讀可靠字幕；Tech With Tim 的價格／方案說法已用 OpenAI、Anthropic 與 Senior SWE-Bench 官方頁校正。贊助、品牌內容、作者實測與官方事實分開標示。
- **去重：** 未重複昨日 Hugging Face 入侵、WebMCP、Jalapeño、handoff constraint weakening、SMITH／AtlasNav 與既有 YouTube；只保留 8 月 27 日新公告、研究或新社群證據。

---

**今天的結論：** 生成與 Agent 產品都在快速擴張，但可靠落地的分水嶺不是「榜上第一」，而是規格是否讓模型少猜、評測是否貼近真實流量、失敗是否能從固定 anchor 重現，以及任何工具是否會把權限或秘密值帶進不該出現的 transcript。先把這四件事量化，再談換模型與擴大自治。
