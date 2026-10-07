# AI 情報日報｜2026-10-08

約 4 分鐘閱讀。今天的主線是：agent 開始把「決策、介面與跨裝置執行」拆成更小的元件，但成本、不可逆操作與安全評估仍要由產品流程兜底。

> 截稿時間：2026-10-08 07:56（Asia/Taipei）。
> 查核範圍：優先 2026-10-06～10-08；已避開 10/07 已報導且沒有新增證據的 Receipts、Paveo、Agent Session Inspector、jcode、GPT-6 Astra 與 Anthropic Cyber Verification Program。
> 證據標示：官方公告／文件是官方事實；廠商 benchmark、價格與客戶案例標為廠商／作者結果；社群文章與 Hacker News／Reddit 是實作訊號，不外推成普遍結論。

## 1. 社群實戰用法

### Codemode：讓 agent 先寫小段程式，再批次處理工具結果

- **新在哪裡：** Armin Ronacher 在 10/06 的 [Codemode 實作筆記](https://lucumr.pocoo.org/2026/10/6/codemode/)示範：agent 不必把每個 MCP 工具暴露成大量 JSON schema，而是先用 JavaScript 組合查詢、`Promise.all` 批次執行，再把整理後的結果送回模型。這適合大量 issue、帳戶或 log 的分類與彙整。
- **可以怎麼開始：** 先挑唯讀工作，要求 agent 產生「查詢 → 聚合 → 排序」的短程式；限制並行數、保留執行結果與原始來源，確認輸出後才允許寫入型工具。
- **編輯心得與限制：** 這是作者的工作流，不是獨立 benchmark。作者也指出把 Codemode 疊在 MCP server 內會造成雙重 JSON escaping，較小模型容易混亂；執行程式碼的權限邊界仍比 prompt 更重要。

### Agent token 的新瓶頸：不是只看 API 帳單

- **新在哪裡：** [Tom’s Hardware 10/03 的整理](https://www.tomshardware.com/tech-industry/artificial-intelligence/futurum-ceo-says-agents-use-ai-5x-more-than-humans-number-will-eventually-hit-10x-but-agents-are-mostly-rereading-what-theyve-already-seen)引用 OpenRouter／a16z 的平台資料：2026 年 8 月 agents 約 7.3 兆 tokens、人類約 1.4 兆，超過 85% 是 cached prompts。這是單一平台、token 量而非支出，且分類方法是平台自己的 7 個訊號。
- **可以怎麼開始：** 在 agent telemetry 同時記錄新輸入、cache read、重送的歷史 context、每步延遲與成功率；先找出「每輪都重讀整份 session」的工具結果，再做摘要、分層記憶或 context compaction。
- **編輯心得與限制：** cache 能降低單次 token 價格，卻不會消除 KV cache 的記憶體與延遲成本。不要只用「每次請求多少錢」判斷 agent ROI。

## 2. 社群新工具與新玩法

### Strands Decider 2B：用小型決策模型攔截錯誤 tool call

- **新在哪裡：** AWS Strands 在 10/01 發布 [Strands Decider 2B](https://strandsagents.com/blog/introducing-strands-decider/)，它不是聊天模型，而是從固定選項中做選擇並給 confidence；官方表示可在 RTX 3090 約 115ms、M3 MacBook 小任務約 153ms 本機決策，模型、資料與訓練腳本也開放。效能與 JevBench 排名是官方引用的外部／作者結果，仍應自行重測。
- **可以怎麼開始：** 用 `pip install strands-decider`，先做兩個 before-tool-call 問題：參數是否來自使用者明確提供的資料？現在是否需要先澄清？只在信心與規則都通過時 `Proceed`，否則 `Confirm` 或 `Guide`。
- **編輯心得與限制：** 它適合路由、tool selection、guardrail、memory policy，不適合取代複雜推理或產生文字；固定選項設計錯了，低延遲只會更快地做錯決策。

### nanoMuse 0.1.41：跨手機、桌面與瀏覽器的可中斷個人 agent

- **新在哪裡：** [nanoMuse GitHub](https://github.com/nano-muse/nanoMuse) 在 10/07 更新 0.1.41，主打同一個 agent 跨 Android、iOS／iPadOS、Windows、macOS、Linux 與瀏覽器工作；支援 shell、瀏覽器、MCP、skills，遇到刪除、寄送或付款等不可逆操作先詢問，記憶以可讀 Markdown 保存。
- **可以怎麼開始：** 先用瀏覽器 demo 或測試帳號，把「手機下指令、桌面執行、手機核准」限定在非敏感工作；確認 relay、模型 key、Markdown 記憶與裝置權限後，再考慮自架 `bash scripts/self-host.sh --local`。
- **編輯心得與限制：** 專案採 GPL-3.0-or-later，社群 relay 有免費額度，之後要自備 key；跨裝置同步意味著更多 token、瀏覽器 session 與個人記憶暴露面，不能把「先詢問」當成完整安全模型。

## 3. 官方新功能與推薦用法

### OpenAI GPT‑6 Intelligent UI：答案變成可互動的介面

- **官方更新：** OpenAI 於 10/07 發布 [GPT‑6 and Intelligent UI](https://openai.com/index/gpt-6-for-everyone/)。GPT‑6 可依問題組合文字、圖表、按鈕、表單與互動體驗，並以 streamable component library 與 compiler 漸進呈現；Plus／Pro／Business／Enterprise 先行，Free／Go 隔日擴大。官方明確說這次是 ChatGPT Chat 體驗，Work 與 Codex 使用的模型不變。
- **推薦用法：** 先用在旅行規劃、教學拆解、比較表、計算器等「互動能減少理解成本」的任務；若要把結果拿進正式流程，仍要求匯出資料、驗證公式與保留人工確認，不要把臨時 UI 當成 production app。
- **能力與限制：** 官方提到 web search 平均更早開始回答 44%，但這是 OpenAI 內部評測；介面設計判斷仍在改善，互動元件也可能讓錯誤看起來更像可靠的產品。

### Claude Haiku 5.5：把便宜模型放到高頻 subagent 與瀏覽器工作

- **官方更新：** Anthropic 於 10/07 發布 [Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5)：支援 1M context、可調 effort，API 每百萬 tokens 在 100K 以內為 input $0.10／output $0.50，並同步把 Sonnet 5.5 cache read 降半；Python／TypeScript SDK 新增 computer use 與 browser use beta。官方 benchmark 與客戶案例均為廠商／客戶早期結果。
- **推薦用法：** 讓 Haiku 做分類、摘要、compaction、資料抽取、快取查詢或高量 subagent，複雜 coding 仍讓 Sonnet／Opus 主導；用 `effort` 和固定任務集量測延遲、成本、錯誤率，不要只看單次 demo。
- **額外變化：** Max 5x、Max 20x 與 Team 本週陸續取得每月 API credits；適合拿來做小型試驗，但應先確認所連結的 Console organization、額度是否到期，以及是否會自動加值。

## 4. 使用心得與避坑

### Haiku 5.5 的「單價便宜」不等於長 context 便宜

- **實測訊號：** Simon Willison 在 [10/07 的測試](https://simonwillison.net/2026/Oct/7/claude-haiku-5-5/)用 token counter 發現，同一份長 prompt 在 Haiku 5.5 約使用 Haiku 4.5 的 1.25 倍 tokens；100K 以上價格也跳到 input $0.50／output $2.50。他還示範 `llm -m claude-haiku-5.5 ... -o thinking_effort low`，並提醒月度 API credits 不 rollover。
- **可以怎麼避坑：** 先用 10K、50K、100K、150K context 做成本曲線；對會長期跑的 agent 設 hard budget cap、關閉不需要的 auto-reload，並把超長歷史改成摘要或外部可查記憶。
- **編輯心得與限制：** 這是個人實測，不是完整價格 benchmark；對短任務 Haiku 5.5 很有吸引力，但跨過 context 價格階梯後，便宜小模型可能不如另一家模型划算。

### GPT‑6 的安全卡提醒：高 prompt-injection 分數不能代表所有風險都改善

- **官方避坑：** [GPT‑6 Sol／Luna 10 月 system card](https://deploymentsafety.openai.com/gpt-6-october)記載，兩模型在 instruction-hierarchy prompt injection 評測達 99.99%／99.79%（官方評測），但同一份文件也列出相對 GPT‑5.6 在未成年人 age-restricted、sexual content、emotional reliance 等項目的統計回歸；文件並提醒困難案例不代表一般流量頻率。
- **可以怎麼用：** 對 agent 上線前把 prompt injection、未成年人安全、敏感領域與人工接管分開測；不要用一個漂亮的 robustness 數字抵銷另一組回歸。高風險 tool 仍要在權限、網路、資料與終態層做獨立 deny／confirm。

## YouTube 深度整理

### 今日無推薦

已主動查核 PAPAYA 電腦教室、Tech With Tim、Gary Chen、Matt Pocock、freeCodeCamp 與近期 AI／Agent／AI Coding 候選。PAPAYA 10/03 的「找不到適合自己的 App？」有可讀內容摘要，但第三方查核約 7,700 次觀看，未達 10,000；其餘候選未同時符合近 24–48 小時優先、破萬觀看、非 Shorts、實測深度與可靠字幕／逐字稿門檻，因此不從標題或介紹推測內容。

## 今天最值得帶回團隊的三個檢查

- **決策：** 能否用小模型先檢查 tool 參數是否有根據、是否該先澄清？
- **成本：** 是否分開記錄 cache read、重送 context、context 長度與真正完成任務的成本？
- **終態：** 互動 UI、跨裝置 agent 或 browser use 被中斷後，是否仍有權限撤銷、人工確認與可驗證結果？

## 今日一句話

Agent 的下一步不是把所有事情交給更大的模型，而是用小決策器、互動介面與可中斷的權限流程，把每一次自動化行動拆成能驗證的步驟。

來源：[OpenAI GPT‑6 Intelligent UI](https://openai.com/index/gpt-6-for-everyone/)、[OpenAI GPT‑6 October system card](https://deploymentsafety.openai.com/gpt-6-october)、[Anthropic Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5)、[Strands Decider 2B](https://strandsagents.com/blog/introducing-strands-decider/)、[nanoMuse](https://github.com/nano-muse/nanoMuse)、[Codemode](https://lucumr.pocoo.org/2026/10/6/codemode/)、[Tom’s Hardware／OpenRouter token data](https://www.tomshardware.com/tech-industry/artificial-intelligence/futurum-ceo-says-agents-use-ai-5x-more-than-humans-number-will-eventually-hit-10x-but-agents-are-mostly-rereading-what-theyve-already-seen)、[Simon Willison 的 Haiku 5.5 實測](https://simonwillison.net/2026/Oct/7/claude-haiku-5-5/)。
