# AI 情報日報｜2026-10-09

約 4 分鐘閱讀。今天的主線是：agent 正把「哪個模型執行、在哪裡執行、誰能看到與停止」變成產品本身；真正要帶回團隊的不是更長的 prompt，而是路由、隔離、身份與可回溯證據。

> 截稿時間：2026-10-09 08:02（Asia/Taipei）。
> 查核範圍：優先 2026-10-07～10-09；已避開 10/08 已報導且沒有新證據的 GPT‑6 Intelligent UI、Claude Haiku 5.5 定價、Codemode、Strands Decider 2B 與 nanoMuse。
> 證據標示：官方公告／文件是官方事實；廠商 benchmark、價格與客戶案例標為廠商／客戶結果；影片與社群文章是實測或作者觀點，不外推成普遍結論。

## 1. 社群實戰用法

### 混合路由：雲端負責規劃，本機 agent 批次讀 code

- **新在哪裡：** Sam Witteveen 在 10/08 影片中拆解 Microsoft Windows／Surface 示範：簡單工作由本機 MAI-Code-1.1-Flash 處理，較難的 repo issue 由雲端模型規劃，再交給多個本機 subagent 批次讀取；影片稱一次示範送入約 160 萬 tokens，但因本機執行而沒有 API token 費用。Microsoft 官方也確認 HydraFusion 將把本機模型納入路由，並預告在 GitHub Copilot app、CLI 與 VS Code 的 experimental preview。
- **可以怎麼開始：** 把任務分成「雲端規劃／本機大量讀取／雲端審查」三段；先讓本機 agent 只讀 issue、測試與 code，再把摘要交給較強模型決定是否修改。每段記錄模型、context 長度、失敗後是否回退雲端，以及最終測試結果。
- **編輯心得與限制：** 影片不是獨立 benchmark；作者特別質疑 2-bit／1.6-bit 量化在長 context、structured tool call 與複雜 coding 是否保真。這個工作流的價值在降低大量閱讀成本，不代表本機模型能取代規劃模型。
- 來源：[Sam Witteveen 影片](https://www.youtube.com/watch?v=CH1ciacnazE)、[Microsoft Windows hybrid intelligence](https://blogs.windows.com/windowsexperience/2026/10/07/building-windows-for-hybrid-intelligence/)。

## 2. 社群新工具與新玩法

### LightOnOCR-3：把 OCR、版面、圖表資料與 grounding 放進同一個小模型

- **新在哪裡：** LightOnAI 於 10/08 在 Hugging Face 發布 Apache 2.0 的 `0.8B`、`1B`、`4B` 版本；除了轉錄，也能輸出區塊 bounding box、圖片描述與圖表 HTML table。這對文件 RAG 的新意是先保留版面與座標，再交給 chunking／檢索，而不是先把 PDF 壓成沒有來源位置的純文字。
- **可以怎麼開始：** 先用 0.8B 或 1B 跑自己的 PDF／掃描件，要求輸出 `grounding`；保存原始圖片、模型輸出與轉換後 Markdown，對表格、手寫、雙欄與小字各做一組人工抽查，再接入 RAG。官方 repo 也提供格式轉換、視覺化與 benchmark 重現腳本。
- **編輯心得與限制：** 文章中的分數、速度與「領先」都是作者團隊在指定資料、解析度與 H100 條件下的結果；文章也承認不同文件類型的最佳模型不同，且 benchmark 的格式正規化會影響分數。不要只看總分，先看自己的文件分布與錯誤可接受度。
- 來源：[LightOnOCR-3 發布文章](https://huggingface.co/blog/lightonai/lightonocr-3)、[LightOnOCR GitHub](https://github.com/lightonai/lightonocr)。

### GitHub Copilot CLI：直接發現 Ollama 本機模型，但不是自動離線

- **新在哪裡：** GitHub Copilot CLI 1.0.94-0 起，`/model` 可以列出正在運作的 Ollama 模型，和既有雲端模型一起選；模型必須已安裝、支援 tool calling 與 streaming，CLI 不會替你下載 runtime 或權重。
- **可以怎麼開始：** 先在隔離 repo 用本機模型做讀取、測試與摘要；在 picker 裡核對 provider／endpoint，再決定只本次使用或加入設定。若需要真正不出網路，另行設定 `COPILOT_OFFLINE=true`，不要把「選了 local」誤當成 offline。
- **編輯心得與限制：** 官方明說 local provider 仍可能把 prompt／code context 傳到遠端，Telemetry 也不會因選本機模型自動關閉；企業環境應把 endpoint、資料範圍與離線設定寫進可稽核的政策。
- 來源：[GitHub Copilot CLI local model discovery](https://github.blog/changelog/2026-10-07-discover-local-models-in-github-copilot-cli)。

## 3. 官方新功能與推薦用法

### Google Gemini agent：從「回答問題」轉成跨系統交付結果

- **官方更新：** Google Cloud 於 10/08 發布 Gemini agent，主打單一 prompt 入口，能規劃工作、使用 skills／tools、連接 Workspace、Microsoft 365、Slack、Git、Jira、資料庫與 MCP，並在文件、信箱與開發環境內交付結果。官方描述也包含 persistent execution、多 agent 協作、獨立 agent identity、Agent Sandbox、Agent Gateway 與 real-time spend caps。
- **推薦用法：** 不要從「做一個萬能 agent」開始；先把一個可驗收的 outcome 寫成 skill，例如「產生每週資料品質報告」，限定資料來源、SQL 只讀、輸出格式、成本上限與人工簽核，再逐步加入寫入工具。
- **編輯心得與限制：** 多模型路由、企業治理與 customer case 的數字是 Google／客戶公布的結果，尚非獨立評測；實際可用性、區域、方案與 MCP connector 權限仍要逐項確認。agent 有持久記憶與跨系統權限後，撤銷、審計與資料生命週期不能只靠 prompt。
- 來源：[Google Cloud Gemini at Work 2026](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026)、[Google Cloud Gemini agent 概覽](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/gemini-at-work/)。

### Codex 更快接受中途修正：把 Steer 用在改方向，不用來排下一件事

- **官方更新：** OpenAI 於 10/08 的 release notes 表示，ChatGPT desktop app 正逐步提供更快的 Codex steering；執行中可用 follow-up 修正方法、補資訊或改方向，並在 Settings → General → Follow-up behavior 選擇 Steer 或 Queue。
- **推薦用法：** 用 Steer 送「停止目前假設、改查 X」或「把範圍縮到某檔案」；用 Queue 放下一個測試、文件或後續任務。高風險操作仍要讓 agent 在工具執行前停下來確認，因為中途 steering 不會撤銷已開始的工具呼叫。
- **編輯心得與限制：** 這是控制工作流的改善，不是讓模型自動理解所有新需求；長任務仍應用可驗證 checkpoint、diff 與測試結果判斷是否真的轉向成功。
- 來源：[ChatGPT Learn 的 steering／queue 說明](https://learn.chatgpt.com/docs/prompting)、[OpenAI Codex remote engineering guide](https://developers.openai.com/blog/mastering-codex-remote-for-engineering)。

## 4. 使用心得與避坑

### Anthropic 使用政策 11/12 生效：高風險 agent 要把人與安全狀態寫進系統

- **變化：** Anthropic 10/08 更新 Usage Policy，將假帳號、假網站與隱藏操作者來源整合為「不得從事欺騙性活動或人工擴散」；也更明確禁止用 Claude 建立武器控制軟體、未經同意追蹤個人，並要求健康、法律、財務與可造成傷害的實體設備維持合格 human-in-the-loop。新版本 11/12 才生效。
- **可以怎麼避坑：** 立即盤點 agent 的 tool descriptions、外部內容與寫入權限；高風險流程保留有權改變結果的人，實體設備必須能在模型斷線時進入 safe state。把「用途允許」和「技術上做得到」分開評估。
- **限制：** 這是供應商政策與執行邊界，不是完整的安全標準；你仍需以組織所在地法規、資安政策與實際 threat model 為準。
- 來源：[Anthropic 2026 Usage Policy update](https://www.anthropic.com/news/2026-usage-policy-update)。

### Copilot usage metrics 曾漏算 agent activity：儀表板不是不可變的事實

- **已確認問題：** GitHub 10/06 說明部分 IDE 將 agent session 移到 Copilot SDK 後，沒有標示原 IDE，導致 agent activity／agent LOC 漏算或被算到 CLI；VS Code 1.139.0 起已有修正，其他 IDE 預計陸續推出。Billing 不受影響，但遺失資料不能回填。
- **可以怎麼避坑：** 先固定 IDE／extension 版本與 telemetry 允許清單，再把 server-side 活躍度、IDE 細節遙測、PR／測試結果分開保存；不要拿修正後的月報直接和舊版的 agent LOC 做同比。
- **編輯心得：** 這不是 Copilot 生成品質問題，而是 attribution pipeline 問題；所有 AI coding 成效指標都要留版本、資料來源與是否可回填三個欄位。
- 來源：[GitHub usage metrics correction](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics)。

### 假前台影響操作：語言流暢與文章數量不能當成真實性證據

- **官方案例：** OpenAI 10/08 公布兩個被封鎖的影響操作：一個來自伊朗、用七個假記者身份產生與投遞長文，另一個來自俄羅斯、營造假智庫並散播假文件與音訊；OpenAI 表示前者近百篇文章曾在約十多個小型／中型媒體發布，但社群留言沒有明顯互動。
- **可以怎麼避坑：** 對 AI 產生的新聞、研究摘要與外部「證據」保留作者／機構 provenance、原始文件、反向查證與衝突來源；不要因為文章格式完整、跨語言流暢或內部報告自稱觸及很多人，就把 reach 當成影響力或事實。
- **編輯心得與限制：** 這是 OpenAI 依自身偵測與公開來源整理的案例，不等於所有相關活動都能被觀察；但它足以提醒團隊，內容生成的速度提升後，來源驗證與身份透明度反而更重要。
- 來源：[OpenAI：Disrupting AI-enabled false-front operations](https://openai.com/index/disrupting-ai-enabled-false-front-operations/)。

## YouTube 深度整理

### Sam Witteveen｜《Microsoft Joins the Local AI Push》

- **頻道／發布：** Sam Witteveen；2026-10-08（查核時 YouTube 顯示約 9 小時前）；[影片連結](https://www.youtube.com/watch?v=CH1ciacnazE)。頁面顯示約 1.3 萬觀看、13:28，已讀取完整 `en-US` 字幕；非 Shorts，未見贊助段落。
- **摘要：** 影片不是新聞朗讀，而是把 Microsoft Windows／Surface 活動中的 hybrid intelligence 拆成路由器、本機模型、Windows ML／llama.cpp、MXC sandbox 與硬體成本，並用 GitHub issue 批次處理示範說明「雲端規劃、本機大量讀取」的 agent 形狀。
- **5 個重點：**
  1. [0:08] 示範中的約 160 萬 tokens 主要在 laptop 本機執行，作者將它視為多 agent 長 context 的成本訊號，而非免費的品質保證。
  2. [1:34] Auto router 可把簡單清理交給本機 MAI-Code-1.1-Flash；較難的 issue 則由雲端模型規劃，再讓三個本機 subagent 處理大量閱讀。
  3. [4:20] 影片檢視 3-bit MAI-Code、2-bit Nemotron 與平均 1.6-bit DeepSeek V4 的取捨，特別擔心長 context、tool call 與量化後的 coding pass rate。
  4. [8:25] Windows ML 加入 llama.cpp，讓開發者更容易使用新出的 GGUF／開源模型，不必等待平台商重新封裝。
  5. [10:03] MXC 把 agent 的 tool／code execution 放進政策控制的 sandbox，並將 agent identity 與使用者身份分開，方便封鎖、追蹤與撤銷。
- **工作流程／工具與模型：** GitHub Copilot Auto → cloud planner → 本機 MAI-Code-1.1-Flash subagents；Windows ML、llama.cpp、MXC、RTX Spark／Surface Laptop Ultra；另討論 Nemotron 與 DeepSeek V4 的低位元量化。
- **作者心得：** 作者認為 Microsoft 把 local AI 從 enthusiast 玩法推向一般 Copilot workflow 是重要轉折，但反覆提醒「router 選錯後能否自我退回雲端」尚未在示範中證明，量化品質也要等獨立測試。
- **優點：** 有完整 demo 脈絡、具體模型／記憶體／context 討論，能幫工程師理解 local／cloud routing 的真正瓶頸。
- **缺點與限制：** 仍以活動示範與作者推論為主，沒有同一任務的高位元對照、失敗率或可重現 benchmark；硬體價格與可得性也會改變結論。
- **適合對象／是否值得看：** 適合想做本機 coding agent、模型路由或 sandbox 的工程師；值得看，尤其是 [1:34]、[4:20]、[10:03] 三段。可立即嘗試：在測試 repo 將「大量讀取」與「寫入／審查」分開，分別記錄本機與雲端成本、工具錯誤和回退行為。

## 今天最值得帶回團隊的三個檢查

- **路由：** 哪些步驟需要強模型，哪些只是大量讀取？路由失敗時是否有可觀測、可測試的 fallback？
- **邊界：** agent 的 identity、檔案／網路／憑證權限與安全停止狀態，是否獨立於模型能力？
- **證據：** benchmark、usage metrics、生成內容與客戶案例，是否保存來源、版本、可回填性與人工驗證結果？

## 今日一句話

Agent 的競爭正從「誰回答得最好」移到「誰能在正確的模型、隔離邊界與證據鏈上，把工作安全地完成」。

來源：[Microsoft Windows hybrid intelligence](https://blogs.windows.com/windowsexperience/2026/10/07/building-windows-for-hybrid-intelligence/)、[Microsoft Copilot local models and sandbox](https://commandline.microsoft.com/local-models-sandboxed-tools-github-windows/)、[LightOnOCR-3](https://huggingface.co/blog/lightonai/lightonocr-3)、[GitHub Copilot local models](https://github.blog/changelog/2026-10-07-discover-local-models-in-github-copilot-cli)、[GitHub local sandbox](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available)、[Google Gemini agent](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026)、[ChatGPT Learn steering](https://learn.chatgpt.com/docs/prompting)、[Anthropic Usage Policy](https://www.anthropic.com/news/2026-usage-policy-update)、[GitHub usage metrics](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics)、[OpenAI false-front operations](https://openai.com/index/disrupting-ai-enabled-false-front-operations/)、[Sam Witteveen](https://www.youtube.com/watch?v=CH1ciacnazE)。
