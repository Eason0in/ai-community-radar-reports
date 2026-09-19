# AI 情報日報｜2026-09-19

約 4 分鐘閱讀。今天的主線是：AI coding 已經不只是在「幫人寫程式」，而是在改變研究、review、瀏覽器操作與企業治理；可驗證的軌跡、權限和人類判斷，仍然是不能省略的部分。

> 截稿時間：2026-09-19 08:05（Asia/Taipei）
> 查核範圍：優先 2026-09-17～09-19 的官方公告、官方文件、第一手 repo 與社群實戰；沒有重大新模型發布時，補充仍具立即使用價值的本週進展。
> 證據標示：官方資料是官方事實；社群文章是個人經驗；廠商／作者 benchmark 與數字均不等於獨立驗證。

## 1. 社群實戰用法

### 先看 Agent 做了什麼，再判斷它是否真的省時間

- **新在哪裡：** r/ClaudeCode 的 9/18 Showcase 有開發者分享 Claudescope：把 Claude Code、Codex、Copilot CLI 等 session 的 JSONL 做成本、token、工具呼叫、變更檔案與全文搜尋；作者特別提到，實際成本常和直覺不同，cache read 可能佔很大一部分。
- **可以怎麼開始：** 先在 disposable repo 或本機唯讀地索引 session；每次任務結束記錄「改了哪些檔案、跑了哪些測試、用了多少 token、是否重試」，再決定要縮短上下文、拆任務或換 harness。可先試 [Claudescope](https://github.com/vladar107/claudescope) 的本機模式。
- **編輯心得：** 這比單看最後 diff 更有用，因為能把「模型能力」和「上下文重播、工具往返、session 過長」拆開看。
- **限制：** 這是單一作者的早期工具與自述；各 Agent 的 transcript 格式未必穩定，成本欄位也應用自己的帳單或 API log 交叉核對。

來源：[r/ClaudeCode Weekly Showcase，2026-09-18](https://www.reddit.com/r/ClaudeCode/comments/1wg0ux6/weekly_showcase_thread_what_are_you_building_with/)；[Claudescope repo](https://github.com/vladar107/claudescope)；可信度：社群第一手經驗／開源 repo。

## 2. 社群新工具與新玩法

### BrowserSkill：讓 Agent 使用你已登入的瀏覽器，但權限風險也一起帶進來

- **新在哪裡：** [Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill) 以 CLI、瀏覽器 extension 和 skill，讓 Claude Code、Codex、Cursor、Hermes 等 Agent 操作現有的登入瀏覽器，不必複製 session 或重新登入。9/17 的 AI GitHub 趨勢整理把它列為當日上升最快的瀏覽器 Agent 工具之一；這是活躍度訊號，不是品質保證。
- **可以怎麼開始：** 先只開一個測試 profile 和低風險網站，限制 Agent 只能讀取頁面與產生草稿；確認每個 click、download、submit 都有人工確認，再考慮寫入或外部送出。
- **編輯心得：** 它補上「headless browser」和「接管真人桌面」之間的空隙，適合需要既有登入狀態、又想保留人工瀏覽控制的流程。
- **限制：** 已登入瀏覽器等於把 cookie、個人資料與可操作帳號暴露給 Agent 的工具鏈；不要把銀行、信箱、學生資料或生產後台直接接上。extension、Agent、網站三者的權限邊界要分開驗證。

### OpenCodeReview：用 deterministic pipeline 限制 LLM review 的自由度

- **新在哪裡：** Alibaba 將內部使用的 [OpenCodeReview](https://github.com/alibaba/open-code-review) 開源：先由工程邏輯決定檔案選擇、分組、規則匹配與 comment 定位，再讓 LLM 做需要判斷的部分；支援 diff review、整檔 scan、JSON 輸出與 Codex／Claude Code 整合。
- **可以怎麼開始：** 先對一個小型 PR 執行 `ocr review --format json --output result.json`，把既有 linter、測試和人工 review 保留，觀察 false positive、漏報與 comment 定位，再決定是否接 CI。
- **可信度與限制：** repo 宣稱在 50 個 repo、200 個 PR、10 種語言的 AACR-Bench 上，以同一模型達到較高 Precision/F1 且約 1/9 token；這是專案方 benchmark，不能視為獨立結論。它也明說 Recall 較低，是偏向少噪音的取捨。

來源：[OpenCodeReview 官方 repo](https://github.com/alibaba/open-code-review)，2026-09-18 查核；[AI GitHub Trending，2026-09-17](https://github.com/Vic563/ai-github-trending)；可信度：專案官方資料／第三方趨勢整理，benchmark 為廠商／專案方結果。

## 3. 官方新功能與推薦用法

### Anthropic：AI 已參與建造下一代 AI，但還沒有「完全自我改進」

- **官方更新：** Anthropic Institute 9/18 更新〈[When AI builds itself](https://www.anthropic.com/institute/recursive-self-improvement)〉，表示 Claude 已能在明確目標下寫程式、跑實驗、平行委派 Agent；截至 2026 年 5 月，Anthropic 合併進 codebase 的程式碼超過 80% 由 Claude 撰寫，並稱工程師平均每日合併的程式量約為 2024 年的 8 倍。
- **推薦用法：** 把這篇當成「如何量測 AI 參與研發」的範本：分開記錄模型執行任務、提出實驗、選擇研究方向和人類審查，不要只用 lines of code 當生產力指標。Anthropic 自己也承認程式行數是有缺陷的數量指標。
- **重要限制：** Anthropic 明確寫出目前還沒有 recursive self-improvement；人類仍掌握問題選擇和方向判斷。內部成功率、8 倍程式量、benchmark 進展都是公司資料或引用資料，不是獨立驗證的整體產業預測。

### OpenAI Astra for Law：專業領域模型的重點在資料、工具與治理組合

- **官方新功能：** [Astra for Law](https://openai.com/index/astra-for-law/)（2026-09-17）把 GPT‑6 Astra、法律搜尋索引、法律分析指令和企業控制組合成給律所與 legal-tech 建置的 foundation；初期透過 Trusted Access 提供給選定律所與 Codex／ChatGPT 使用者，API 即將提供。
- **推薦用法：** 對任何垂直領域先畫出「模型、搜尋索引、專業工具、客戶資料隔離、人工覆核」五層，再做小型固定題集驗收；不要只比較裸模型聊天品質。OpenAI 自己的法律 benchmark 是 200 題私有 validation set，應標成供應商結果。
- **重要限制：** 目前是選定客戶的早期存取；法律搜尋結果仍需律師檢查權威性、時效與適用範圍，不能把 54.0% correctness 或相對提升直接當作一般法律工作的保證。

### GitHub Copilot：review 與 Agent 使用量開始變成可追蹤的治理資料

- **新功能：** 9/18 的 [Copilot code review 更新](https://github.blog/changelog/2026-09-18-copilot-code-review-an-improved-review-experience/) 讓 overview 顯示 open、已解決、後續才發現的問題，並在批次套用建議時產生 commit message；9/17 的 [CLI metrics API](https://github.blog/changelog/2026-09-17-agentic-cli-customizations-now-in-the-usage-metrics-api/) 則加入 skills、custom agents、MCP、slash commands 和 plugins 的使用統計。
- **推薦用法：** 把「哪個 skill／MCP 被用到」和 PR 通過率、測試結果、人工退回率一起看；MCP 的 interaction count 只代表連線／重連嘗試，不代表工具呼叫成功，更不代表產生價值。
- **限制：** 企業需開啟 usage metrics policy 並具備相應權限；客製名稱會被歸到 `other`，所以數據適合看採用趨勢，不適合精確評估每個團隊的實際產出。

## 4. 使用心得與避坑

### Instruction file 是上下文，不是安全邊界

- Claude Code 官方文件現在支援在沒有 `CLAUDE.md` 時讀取 repo 的 `AGENTS.md`；這能讓不同 coding agent 共用專案規則，但官方同時明說：這些檔案是 context，不是 enforced configuration。要「無論模型怎麼判斷都不能做」的事情，應使用 PreToolUse hook 或更外層的權限控制。
- **立即可試：** 把 `AGENTS.md`／`CLAUDE.md` 限制在架構、測試與工作流程；把秘密、外部傳送、刪除、部署和資料庫寫入改成工具層 deny-by-default，並要求每次高風險動作留下 diff、參數、核准者與結果。規則文字寫得再清楚，也不能取代 hook、sandbox 或人工批准。
- **來源與限制：** [Claude Code memory／AGENTS.md 官方文件](https://code.claude.com/docs/en/memory)，2026-09-18 查核；這是產品文件的行為說明，不是對所有 Agent 的安全保證。

## YouTube

**今日無推薦。** 查核 Tech With Tim 9/18《Top 7 AI Agent Tools That Actually Work》（約 3 萬觀看）與 9/15《How to Build Your Own AI Agent Team From Scratch》（約 3.3 萬觀看）；兩部都符合觀看門檻，但目前頁面沒有可可靠匯出的字幕／逐字稿，因此不猜測內容、不納入。9/17 已報導的《Cursor Costs $20. This AI Agent Costs $1,000,000.》也不重複收錄。

## 今日一句話

Agent 的下一個競爭點不是「能不能自己做事」，而是能不能把它做過什麼、花了多少、哪些判斷仍由人負責，清楚留下來。

## 來源總覽

- Anthropic Institute：When AI builds itself，2026-09-18。
- Anthropic：Accenture embedded evaluation，2026-09-18。
- OpenAI：Astra for Law，2026-09-17。
- GitHub Changelog：Copilot code review、CLI customizations，2026-09-17～09-18。
- Claude Code Docs：AGENTS.md／memory，2026-09-18 查核。
- Alibaba OpenCodeReview、Tencent BrowserSkill：官方 repo。
- Reddit r/ClaudeCode：Claudescope 社群實戰，2026-09-18。
- YouTube：Tech With Tim 候選影片頁與字幕查核結果。
