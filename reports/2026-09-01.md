# AI 情報日報｜2026-09-01

> 觀測區間：2026-08-30～2026-09-01（Asia/Taipei）｜資料截止：2026-09-01 08:06
>
> 今天沒有值得硬湊的新旗艦模型。真正的新變化是：ChatGPT 廣告從試驗變成全球化平台、VS Code 把多 Agent 工作階段與網頁回饋做進日常介面，而研究與社群案例都在提醒「文字上答應規則」不等於執行時真的受規則約束。

## 1. 今日最重要的 3–5 件事

### 1. ChatGPT Ads 年化營收達 10 億美元：對話脈絡正式成為廣告訊號

- **發布日期：2026-08-31。** OpenAI 宣布 ChatGPT Ads 上線不到 200 天，年化營收 run rate 達 10 億美元，已有數萬名廣告主；自助式 Ads Manager 開始擴展到印度、歐洲、中東與北非。[OpenAI 官方公告](https://openai.com/index/expanding-access-to-ai-with-chatgpt-ads/)
- OpenAI 表示廣告會與回答分開標示、不影響回答，廣告主不會取得私人對話；但廣告系統會使用**目前對話**判斷相關性，且依國家與使用者設定，可能使用更廣泛的 ChatGPT 使用脈絡做個人化。這是比「頁面旁放廣告」更深的資料治理問題。
- 官方同時稱 ChatGPT 每週活躍使用者超過 10 億；這些營收、使用者與廣告成效數字都是**公司自報**，未附獨立稽核。官方可用國家清單目前未列台灣的自助廣告採購，不代表台灣使用者一定看不到廣告。[OpenAI Ads 原則](https://openai.com/index/our-approach-to-advertising-and-expanding-access/)｜[Ads Manager 國家清單](https://help.openai.com/en/articles/20001245-ads-manager-availability)
- **今天可做：** 檢查 ChatGPT 廣告個人化設定；研究、求職、健康與採購對話不要因「廣告不影響答案」就忽略推薦來源、資料保留與利益揭露。

### 2. VS Code 8 月更新：Agent session、旁支對話與網頁批次回饋進入正式工作流

- **發布日期：2026-08-31。** GitHub 彙整 VS Code 1.132～1.135 的 Copilot 更新：Agents 視窗可並排多個對話、用 `/btw` 開共享主要 context／prompt cache 的旁支對話、從多個 VS Code 視窗連到同一 session，並能續接其他應用程式建立的 Copilot 或 Claude session。[GitHub Changelog](https://github.blog/changelog/2026-08-31-github-copilot-in-vs-code-august-2026-releases/)
- 整合瀏覽器新增「一次標註多個 HTML 元素再交給 Agent 批次修改」；聊天則能搜尋完整 transcript、查看每回合分模型 input／cached input／output token。
- `/rubber-duck` 第二意見與免 GitHub 登入 Agents 視窗仍標為實驗性；旁支對話共享 context 不等於共享所有執行狀態。多 Agent 結果仍要回到同一 diff、測試與驗收標準，不能把多一個模型當成正確性證明。

### 3. openJiuwen：長任務 harness 應隨執行證據調整，而不是固定跑完同一條流程

- **投稿日期：2026-08-28。** openJiuwen 把 coding-agent harness 的問題拆成「結構可組合」與「執行時自適應」：單 Agent、delegated sub-agent 與 swarm 共用執行語意，並讓診斷、測試結果、進度與 context 相關性動態改變後續控制。[原始論文](https://arxiv.org/abs/2608.27969)
- 作者報告在 SWE-bench Verified 達 82.6%、Terminal-Bench 2.1 達 87.19%，分別高於其選定的官方排行榜點估計 3.4 與 3.39 個百分點。這是**作者／平台團隊結果**，比較基準、成本、模型與 harness 組合仍需獨立重現。
- 可立即採用的不是照抄框架，而是：每完成一個步驟就保存新證據，依證據決定要補 context、重跑 verifier、改派子任務或停止；不要讓最初 plan 在條件已變時仍機械執行。

### 4. MuSP-Bench：模型看得懂樂理文字，不代表能理解整份樂譜與演奏音訊

- **投稿日期：2026-08-28。** MuSP-Bench 由人工撰寫 490 題，涵蓋古典鋼琴與管弦樂的樂譜、演奏、詮釋與長程推理；作者發現前沿多模態模型在完整樂譜上已有明顯困難，對演奏音訊的推理更弱。[原始論文](https://arxiv.org/abs/2608.28212)
- 這個結果不能外推成「模型不懂音樂」，但提醒評測要分開測知識、符號、視覺版面、音訊與跨模態對齊。只用短 ABC 片段、單頁譜或選擇題，會高估實際長篇多模態能力。

## 2. 新模型與產品更新

| 更新 | 已確認內容 | 限制與今天應做的事 |
| --- | --- | --- |
| [ChatGPT Ads 全球擴張](https://openai.com/index/expanding-access-to-ai-with-chatgpt-ads/) | 廣告平台年化營收 run rate 10 億美元；自助採購擴區；對話脈絡可參與廣告相關性判斷 | 公司自報數字；檢查個人化、推薦來源與敏感對話資料邊界 |
| [GitHub Copilot in VS Code 8 月更新](https://github.blog/changelog/2026-08-31-github-copilot-in-vs-code-august-2026-releases/) | 多 session、`/btw`、外部 session 續接、瀏覽器元素批註、token 明細 | 部分功能實驗性；跨 session 必須用 diff／測試／證據收斂 |
| [Copilot 舊模型 9/1 淘汰](https://github.blog/changelog/2026-07-31-upcoming-august-2026-model-deprecations-in-github-copilot/) | 昨日預告的 Gemini 3.1 Pro、部分 Claude 4.x 與 Raptor Mini 淘汰日期今天生效 | 這是昨日項目的狀態更新；只需確認 policy、模型 selector 與回歸測試，不重複展開 |
| 前沿模型發布 | 截稿前未見可由官方來源確認、且重要性高於上述變更的新旗艦模型 | 不以傳聞或改名湊數 |

## 3. 新技術、新方法

### 方法 A：把「口頭確認」改成執行前可機器檢查的 gate

若任務要求只能用指定來源、不可修改某區域或必須先核准，先把條件轉成 manifest：允許來源雜湊、可寫路徑、禁止動作、所需核准與驗證命令。每次工具呼叫前檢查 manifest；不確定時輸出 `UNVERIFIED/BLOCKED`，不要一邊說理解、一邊照常執行。

### 方法 B：讓 harness 用新證據重排工作，不讓 plan 成為承諾債

每個步驟輸出 `evidence`、`state_change`、`next_options`、`stop_condition`。測試失敗要改變後續路徑；新診斷與既有假設衝突時，應回到假設層，而不是繼續堆 patch。openJiuwen 的分數先視為作者結果，但「runtime evidence 應改變控制流」本身可直接驗證。

### 方法 C：多模態評測按訊號拆層

對音訊、文件或畫面任務，分別測：內容抽取、跨頁／跨時間連結、推論、引用與不確定性。先建立單模態基線，再測跨模態；若只有最後答案分數，就無法知道錯在 OCR／ASR、對齊、記憶還是推理。

## 4. 社群實戰心得

以下都是 8 月 31 日建立的公開 issue，屬**使用者回報，尚未獲維護者確認根因**。

### Codex：模型會重述限制，但後續 action 未必持續受限

- Codex issue #41851 整理一個長篇多模態／圖片流程的六次受控嘗試：固定來源與明確限制被文字確認後，後續生成仍間歇回到錯誤輸出家族；第六次甚至在直接糾正後重複錯誤。[openai/codex #41851](https://github.com/openai/codex/issues/41851)
- 回報者明確沒有主張未知的伺服器內部機制，也尚未完成原定十次測試，因此不能估計普遍失敗率。實務上應把關鍵限制放到 action 前 gate，並保存輸入綁定與輸出分類證據。

### Claude Code：同一份 Skill 的斜線命令與 Skill tool 可能讀到不同快照

- Claude Code issue #90904 提供一次 byte-exact 證據：同 session 內，Skill tool 讀到磁碟現況；兩分多鐘後手打斜線命令卻注入 83 分鐘前、只存在 14.4 秒的中間編輯版本。回報推測 typed path 的 cache invalidation 漏掉最後一次快速修改，但未宣稱已確認根因。[anthropics/claude-code #90904](https://github.com/anthropics/claude-code/issues/90904)
- 回報亦指出長駐 process 可能仍執行已被更新器刪除的舊 binary，`claude --version` 不一定等於執行中版本。修改共用 skill 後，應重啟相關 process，並以 hash 或輸出 marker 確認兩種 invocation path 讀到同一內容。

## 5. YouTube 深度整理

本次主動搜尋 PAPAYA 電腦教室、Tech With Tim、IBM Technology、Better Stack、Gary Chen、freeCodeCamp、Matthew Berman 及其他中英文候選。PAPAYA 沒有新的 24～48 小時公開片；Alex Ziskind 的破萬候選沒有可可靠解析字幕，Milan Jovanović 影片雖破萬但高度置入，均未列入。以下兩片皆完整閱讀可靠字幕後才整理。

### 影片 1：IBM Technology｜How AI Is Changing Code Reviews & Software Development

- **發布日期／觀看／長度：** 2026-08-31｜26,469 次（08:06 查核）｜14:09
- **連結／逐字稿：** [YouTube 原片](https://www.youtube.com/watch?v=c57vAe-mMLo)｜已完整閱讀人工英文字幕
- **摘要：** 以 Fagan inspection、pair programming、pull request、CI/CD 到 AI 的演進，主張 code review 的焦點應從逐行 implementation 轉向 intent、需求、執行證據與 business outcome。
- **重點：** ① 傳統 review 先看 syntax；② PR 時代靠多人 consensus；③ CI/CD 加入品質、資安與 compliance；④ AI 可做廣泛分析，但 context、取捨與判斷仍由人負責；⑤ 最終驗收應有 tests、automated checks 與 runtime evidence；⑥ 問「是否建出正確產品」不能取代「是否安全、可維護」。
- **工作流程：** 定義意圖與需求 → AI／人共同產生變更 → 自動化品質與合規檢查 → 收集 runtime evidence → 人類判斷取捨與 business impact → 核准。
- **工具／模型：** 影片是方法論拆解，未展示特定模型或可重現 repo；泛指 LLM、PR 與 CI/CD。
- **作者觀點、優缺點與限制：** 「outcome review」是講者觀點，不是經驗研究。優點是把 AI 生成速度拉回可驗收結果；缺點是沒有 demo、量化資料或失敗案例，且容易被誤讀為不必看 implementation。
- **適合對象／是否值得看：** 適合 tech lead、reviewer 與正在改寫 SDLC 的團隊；值得看作 14 分鐘討論框架，但不能當成落地規格。
- **立即可試：** 在 PR template 加四格：意圖、可驗收結果、自動證據、人工取捨；若任何一格空白，就不因 AI 已完成 patch 而合併。
- **商業揭露：** IBM Technology 品牌內容，說明欄導流 IBM AI code review 資源與 newsletter；未見第三方贊助口播。

### 影片 2：Tech With Tim｜Local AI Explained: How to Run AI Models on Your Computer

- **發布日期／觀看／長度：** 2026-08-31｜24,980 次（08:06 查核）｜24:27
- **連結／逐字稿：** [YouTube 原片](https://www.youtube.com/watch?v=edIHPoWgIKU)｜已完整閱讀人工 `en-CA` 字幕
- **摘要：** 從 weights、parameter、quantization、inference engine、VRAM／統一記憶體開始，再用 LM Studio、Ollama、Docker Model Runner 與 Python／llama.cpp 示範四種本機推論入口。
- **重點：** ① 模型檔與推論引擎是兩件事；② 量化降低記憶體但不是「幾乎永遠零損失」；③ 容量決定放得下多大的模型，頻寬影響生成速度；④ context／KV cache 也占記憶體；⑤ GUI、CLI、容器與直接程式碼是不同控制層；⑥ OpenAI-compatible 只代表部分介面相容，不保證所有工具、狀態與模型行為等價。
- **實作流程：** 盤點 VRAM／統一記憶體 → 選模型能力與量化 → 留出 context 空間 → 用 LM Studio／Ollama／DMR 下載並載入 → 跑固定 prompt → 記錄首 token、tokens/s、RAM／VRAM 與答案品質 → 再決定是否串接應用程式。
- **工具／模型：** LM Studio、Ollama、Docker Model Runner、llama.cpp、Python，以及示範中的 Gemma、Qwen、Nemotron 等模型。
- **官方校正：** LM Studio 官方建議 16GB RAM，8GB 機器應用小模型與較短 context；Ollama 本機 API 預設 `localhost:11434` 且只相容 OpenAI API 的部分功能；Docker Model Runner 已不是單純實驗功能，支援 llama.cpp／vLLM／Diffusers，但本機 API 預設沒有 authentication，能連到它的 client 可送推論與模型管理請求。[LM Studio 系統需求](https://lmstudio.ai/docs/app/system-requirements)｜[Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)｜[Docker Model Runner](https://docs.docker.com/ai/model-runner/)
- **作者觀點、優缺點與限制：** 優點是四層入口一次看懂，且實際展示下載、載入、API 與 code；缺點是多處用粗略參數數量推估硬體、把量化品質損失說得太輕，並把「本機」簡化成資料完全不外流。實際上模型下載、telemetry、cloud fallback、MCP／外部工具與未驗證 local API 都可能形成網路邊界。
- **適合對象／是否值得看：** 適合第一次跑本機模型的開發者；值得看，但硬體、port、安全與隱私要以當前官方文件為準。
- **立即可試：** 先用最小模型跑同一組五題，記錄品質與資源；只 bind `localhost`，不要先開區網；加入 32K／64K context 後再看記憶體是否溢出與 CPU offload。
- **商業揭露：** 09:43～11:04 為 MindsHub Cowork 明確贊助段；說明欄另含 Hostinger、Wispr Flow 等 referral／導流與作者課程。

## 6. 今天值得嘗試

### 40 分鐘「限制真的有被執行嗎？」稽核

1. 選一個可寫檔或調工具的 Agent 任務，定義三條限制：允許來源、可寫路徑、禁止動作。
2. 將限制寫成 JSON manifest，不只放在自然語言 prompt。
3. 先請 Agent 重述限制，再跑相同任務三次；保存每次輸入綁定、工具呼叫、diff 與 verifier 結果。
4. 讓一個來源檔在執行中更新；檢查 Agent 是否讀到新 hash，還是沿用舊 cache。
5. 任一限制無法驗證時，要求流程停在 `UNVERIFIED/BLOCKED`，不要自動猜測或擴權。

可直接使用的 gate 格式：

```json
{
  "allowed_sources": [{"path": "input/approved.md", "sha256": "..."}],
  "writable_paths": ["output/"],
  "forbidden_actions": ["network_upload", "account_change"],
  "required_checks": ["test", "diff_review"],
  "on_mismatch": "UNVERIFIED/BLOCKED"
}
```

## 7. 來源與可信度說明

- **官方／第一方：** OpenAI 公告與 Help Center、GitHub Changelog、LM Studio／Ollama／Docker 官方文件。產品狀態以這一層為主；OpenAI 的營收、使用者與廣告成效仍是公司自報。
- **研究：** openJiuwen、MuSP-Bench 都是 8 月 28 日預印本；分數、比較與失敗結論需在原資料、模型與成本條件下獨立重現。
- **社群案例：** Codex #41851、Claude Code #90904 有具體流程或 byte-level 證據，但仍是開放 issue，沒有維護者確認根因或普遍影響範圍。
- **影片：** 只收錄查核時超過 10,000 次、已完整閱讀可靠字幕且有實作／方法價值者；品牌、贊助、referral 與作者觀點分開標示。
- **昨日去重：** 不重複 8 月 31 日已整理的 Cursor 模型供應、CorporateBench、KPMG 提示詞研究、Codex MSIX、Claude 圖片快取與兩部影片；Copilot 舊模型只因今天正式到達淘汰日而做一列狀態更新。

