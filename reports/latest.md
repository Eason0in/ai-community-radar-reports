# AI 情報日報｜2026-10-04

約 4 分鐘閱讀。今天的主線是「把 AI 做窄、做快、做可控」：AstaBrief 把科學報告生成縮成可下載的 8B 專用模型，Kolibri 以德英雙語與 abstention 走主權部署；另一邊，Anthropic、Supabase 與 Claude Code 的更新都在補企業落地所需的人才、資料庫與權限邊界。

> 截稿時間：2026-10-04 08:05（Asia/Taipei）。
> 查核範圍：優先查 2026-10-02～10-04 的官方公告、官方文件、GitHub release、社群 repo 與 YouTube；已避開 10/03 已報導的 GitHub dynamic workflows、OpenAI GPT-6 guide、Pi Durable 與 Copilot computer use，除非今天有新的獨立進展。
> 證據標示：官方公告／文件是官方事實；官方 benchmark、採用數字與速度是廠商結果；社群 repo 與影片是作者或使用者經驗，不外推成普遍結論。

## 1. 社群實戰用法

### 用 real-browser-mcp 驗證「剛修好的 staging」，但把登入狀態當成高風險權限

- **新在哪裡：** 社群的 [real-browser-mcp](https://github.com/ofershap/real-browser-mcp) 把 MCP server 與 Chrome extension 接到使用者已登入的瀏覽器，讓 coding agent 看到既有 SSO、cookies、staging 頁面與已重現的 bug；它不是另開乾淨 Playwright browser，也不是雲端代操。repo 目前提供 18 個工具與可安裝的 agent plugin／規則。
- **可以怎麼開始：** 建一個專用 Chrome profile，只登入測試帳號；在本機以 `npx -y real-browser-mcp` 啟動 server、載入 extension，先讓 agent 做 snapshot，再只允許讀取頁面、截圖與 console 檢查。完成後把結果回寫成 issue／測試證據，付款、寄信、改資料與登入操作保持人工。
- **編輯心得：** 這補上「agent 寫完 code 卻沒看過真實瀏覽器」的缺口，但真正的價值是把驗證拉回開發者已重現的環境，不是把 agent 變成全權瀏覽器使用者。
- **限制：** repo 自己也提醒，agent 仍可讀取或操作連接分頁中的登入資料；它適合 live QA，不適合 CI 的乾淨、可重播測試。extension、localhost WebSocket、MCP client 也都增加供應鏈與權限面。

來源：[real-browser-mcp README](https://github.com/ofershap/real-browser-mcp)（查核 2026-10-04）；可信度：公開 repo／README，功能與安全邊界以作者自述為準，尚非獨立安全審計。

### 把 agent 的「資料庫」從共享 Postgres 拆成一次任務一個可拋棄資料庫

- **新在哪裡：** Supabase 10/02 宣布收購 Turso，公開理由不是一般資料庫整合，而是 agent 會大量建立 prototype、dashboard 與短生命週期 app；Turso 的架構主打單一 server 管理大量 SQLite database，閒置時 suspend，再讓工作負載成長後走向 Postgres。
- **可以怎麼開始：** 對一次性的 coding agent 任務，先建立每個分支／agent 一個 SQLite database，測試與 migration 通過後才升級到共享 Postgres；同時為 database 建立 TTL、owner、資料分類與清除記錄，不要把「建立很便宜」誤當成可以無限保留資料。
- **編輯心得：** agent-native infrastructure 的重點是隔離與生命週期，不只是把模型接上資料庫。每個 agent 有自己的資料狀態，能降低互相污染，也更容易在任務結束時回收。
- **限制：** Supabase 表示既有使用者目前不變，收購後的產品路線、價格、跨 Postgres／SQLite 的正式升級體驗仍待後續；「每個 agent 一個 DB」是方向，不是所有產品都該照做。

來源：[Supabase｜Supabase is acquiring Turso](https://supabase.com/blog/supabase-is-acquiring-turso)、[Turso｜給每個 agent 一個 database](https://turso.tech/blog/turso-is-joining-supabase)（2026-10-02）；可信度：雙方官方公告，商業與產品效益仍屬公司願景。

## 2. 社群新工具與新玩法

### Claude Code 2.1.288：MCP 權限升級與危險 shell 路徑一起補上

- **新在哪裡：** [v2.1.288 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)（10/02）修正在特定 `bash -c`／`sh -c`、bypassPermissions 或 shell allow rule 下可能失去提示的危險 `rm` 路徑；當 MCP server 在 tool call 期間要求更多 OAuth scope 時，新增重新驗證提示，也修復 resume／compaction 後上下文遺失等問題。
- **可以怎麼開始：** 先在非正式專案更新，跑一個包含 shell、MCP OAuth、Ctrl+C resume、compaction 的 smoke test；把 MCP server 的 scope 申請當成新的權限事件記錄，不要因為同一個 server 以前授權過就自動接受擴權。
- **編輯心得：** 這是值得注意的「修功能也修邊界」版本：MCP 的可用性與權限升級提示必須同時存在，shell allowlist 也不能被複合命令語法繞過。
- **限制：** release note 不等於完整安全稽核；實際行為會受 client、OS、permission mode、MCP server 與企業 policy 影響。升級前仍要在自己的 deny-path 測試 `rm`、重導向與 scope escalation。

來源：[Anthropic Claude Code v2.1.288 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)（2026-10-02）；可信度：官方 release note。

### AstaBrief：用窄模型處理「有檢索證據的報告」，不要拿它取代搜尋

- **新在哪裡：** Ai2 10/02 開源 [AstaBrief 8B](https://allenai.org/blog/astabrief)，輸入研究問題與已檢索的文獻摘錄，輸出附引用的科學報告；模型權重、訓練資料與 PDF 範例 workflow 都公開，也已成為 Asta 的 Fast mode。
- **可以怎麼開始：** 先把自己的 PDF／論文檢索結果整理成帶來源 ID 的 excerpts，再讓 AstaBrief 只負責一次報告生成；逐段檢查 citation precision、citation recall 與是否把 sample-specific 結果擴大成普遍結論，最後才把報告交給人審。
- **編輯心得：** 它示範了一個比「通用模型加長 prompt」更實用的分工：retrieval 負責找證據，窄模型負責固定格式的 synthesis，評估也直接量引用是否支持文字。
- **限制：** Ai2 報告的 51.1 秒 vs 178.5 秒、約 3.5 倍速度與品質比較是作者結果，而且完整評估多在 2025 年完成，沒有重跑今日 frontier models；模型本身不是 literature search service，也不會自動保證引用真的支持每個句子。

來源：[Ai2｜Open-sourcing AstaBrief](https://allenai.org/blog/astabrief)、[AstaBrief model](https://huggingface.co/allenai/AstaBrief-8B)（2026-10-02）；可信度：Ai2 官方文章／權重，速度與 benchmark 屬廠商結果。

## 3. 官方新功能與推薦用法

### Anthropic 用「部署工程師」補企業 AI 的最後一哩

- **官方更新：** Anthropic 10/02 宣布投入 1 億美元推出 [Claude Frontier Academy](https://www.anthropic.com/news/claude-frontier-academy)，目標在 2027 年底前培訓 10,000 名 Frontier Deployed Engineers。首期 Residency 以企業真實案例、security review、handover 與 graded practical 為核心，不是只看課程完成或模型證照。
- **推薦用法：** 企業若沒有參加資格，也可以照它的結構做內部版本：選一個真實流程，要求候選人從 use-case、資料邊界、威脅模型、原型、測試到 handover 完成一次；評分「能否安全交付」而不是只評 prompt 漂亮不漂亮。
- **編輯心得：** 這個公告透露的產業訊號比「又一個模型」更重要：agent 落地的瓶頸正在轉成懂業務、懂安全、能把 prototype 帶進 production 的人。
- **限制：** 目前採 nomination、首批場次在特定城市，名額、價格、資格與訓練成效未公開；10,000 人是 Anthropic 的目標，不是已完成的部署人數。

來源：[Anthropic｜Claude Frontier Academy](https://www.anthropic.com/news/claude-frontier-academy)（2026-10-02）；可信度：官方公告，目標與企業引述屬公司自述。

### Kolibri：德英雙語、1M context、可拒答的主權 open-weight 路線

- **官方更新：** Aleph Alpha 10/03 發布 [Kolibri](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model)：78B total／約 3B active 的 MoE、德英雙語、最高 1M context、Apache 2.0 權重，並以 regulated／on-premise 部署與「找不到證據就 abstain」為重點。
- **推薦用法：** 若有德文或歐洲受管制場景，先用可公開文件建立小型 RAG eval：答案正確、引用可追溯、無資料時拒答、工具呼叫可控，四項都過才評估本機部署。不要先被 1M context 誘惑，把不必要的整庫內容塞進去。
- **編輯心得：** 這是「專用語言／部署邊界」的產品策略，不只是追逐通用 benchmark；對企業而言，可審查的權重與資料路徑有時比排行榜多幾分更有價值。
- **限制：** 4× active parameter、Pareto frontier、各項 benchmark 與 customer-proxy score 都是 Aleph Alpha 自行公布的結果；尚未代表台灣繁中、實際企業資料或你的硬體一定適合。

來源：[Aleph Alpha｜Kolibri Has Landed](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model)、[Hugging Face model card](https://huggingface.co/Aleph-Alpha/Kolibri-1)（2026-10-03）；可信度：官方公告／模型卡，benchmark 標示為廠商結果。

## 4. 使用心得與避坑

### 長 context、open weights、local browser 都不是自動的安全保證

- **今天的共同風險：** Kolibri 的 1M context 不代表每次都該塞滿；AstaBrief 的引用不代表每句都被證據支持；real-browser-mcp 的 localhost 不代表 agent 看不到登入中的敏感資料；Claude Code 的 re-auth prompt 也不代表人一定會仔細讀 scope。
- **最小驗收清單：** 先列資料可見範圍與工具 allowlist，再用一個正常案例、一個越權案例、一個「證據不足／應拒答」案例測試；把模型、權限、來源版本、輸出與測試結果一起保存。
- **編輯心得：** AI 工具越靠近真實資料與真實瀏覽器，越應把「證據、權限、可回復」當成產品功能，而不是事後補一段安全聲明。
- **限制：** 今天多數新功能仍是 preview、早期 rollout 或廠商自述；正式導入前仍需自己的資料、成本、延遲與 deny-path 測試。

來源：[real-browser-mcp 安全說明](https://github.com/ofershap/real-browser-mcp#is-it-safe-to-let-an-agent-control-my-real-browser)、[Claude Code v2.1.288](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)、[AstaBrief 限制與評估](https://allenai.org/blog/astabrief)；可信度：原始 repo／官方 release／官方技術文章。

## YouTube 深度整理

### Nate Herk｜《I Tested Sonnet 5.5 vs Opus 5.5. What You Need to Know.》

- **頻道／發布／觀看：** Nate Herk｜2026-09-29｜查核觀看數約 73.7K（Modern Creator 頁面快照，數字會變動）｜[YouTube](https://www.youtube.com/watch?v=7eo-11K2e3c)｜25:48。
- **逐字稿查核：** YouTube 原生匯出在本次查核未提供字幕；以下使用 [Modern Creator 的完整時間軸逐字稿](https://moderncreator.app/2026-09-29-nate-herk-ai-automation-i-tested-sonnet-5-5-vs-opus-5-5-what-you-need-to-know) 讀完後整理，並以 [Anthropic Sonnet 5.5 公告／價格](https://www.anthropic.com/news/claude-sonnet-5-5) 交叉校正。不是從標題或介紹猜測。
- **摘要：** 作者用相同 prompt、high effort 跑 7 個真實工作：landing page、motion showreel、90-day plan、Excel／投資簡報、HTML explainer、AI news dashboard、YouTube resource guide。作者的結論不是 Opus 永遠較好，而是「有清楚、可檢查的 definition of done，先用 Sonnet；目標模糊且需要判斷時，Opus 才比較值得加價」。
- **3–7 個重點：**
  1. Sonnet 5.5 在作者的 7 回合贏 4 回，Opus 5.5 贏 3 回；這是作者主觀評分，不是正式 benchmark。
  2. landing page 中，Opus 的整體設計較好，但用了假的產品圖；作者認為 Sonnet 只要再 prompt 一次就能補救，因此把勝場判給較便宜的 Sonnet。
  3. motion／sound design 與模糊的 90-day plan 需要較多品味與判斷，Opus 的優勢較明顯。
  4. spreadsheet、deck 與有固定 skill 的 resource guide 輸出接近時，速度與成本成為決勝點。
  5. 7 個任務合計 Opus 約多花 46 分鐘、約多 16 美元；不是把單價直接乘二就能預測實際成本。
- **步驟／工作流程：** 先把任務分成「有客觀驗收」或「仍需模型幫忙定義目標」；有驗收的任務用 Sonnet 跑一輪並記錄成本；模糊任務才升 Opus；同一個 skill 用兩個模型各測一次，建立自己的 per-skill routing 表；最後以輸出、返工、耗時與美元成本一起決定。
- **工具／模型：** Claude Sonnet 5.5、Claude Opus 5.5、Claude Code／API、high effort、skills、網站與簡報／試算表工作流。
- **作者心得：** 「模型選擇」不如「任務是否定義清楚」重要；作者也提醒要在自己的 prompt、skill 與流程上重測。
- **優點／限制：** 優點是同 prompt、跨多種工作、同時記錄時間與美元成本；限制是樣本只有 7 個、評分主觀、工具與 prompt 未完全公開，且頁面逐字稿是第三方整理；影片中的「Sonnet 30% faster／30% cheaper」是 Anthropic／作者敘述，不能當成此實驗的普遍結果。
- **適合對象／是否值得看：** 適合已在 Claude Code 或 API 上付費、想建立 model routing 規則的人；值得看，尤其是 `00:41–02:07` 選型規則、`17:43–25:48` 的 skill／成本總結。若只想找正式 benchmark，這部不適合。
- **贊助：** 影片提到 ImageKit、Glaido、Scrollcraft／社群導流；本片不是純模型評測，工具推薦與作者社群推廣應分開看。
- **可立即嘗試：** 選你最常做的 3 種任務，各寫一條可驗收的 definition of done；同一 prompt 分別跑便宜模型與高階模型一次，記錄成功率、返工分鐘、輸入／輸出 token 與實際費用，七天後再決定預設路由。

## 今天最值得帶回團隊的三個檢查

- **資料邊界：** agent 看得到的 browser profile、MCP scope、PDF excerpts 與 database 是否都比任務需要的更大？
- **證據品質：** 每個引用是否真的支持句子，而不是只有看起來相關？模型沒有證據時是否會拒答？
- **成本路由：** 把「清楚驗收」與「需要判斷」分開，用實際成功任務成本而不是模型名氣選擇模型。

## 今日一句話

AI agent 的下一步不是把所有任務交給最大模型，而是讓窄模型、專用資料、短生命週期工具與明確權限各自負責可驗證的一小段。

## 來源總覽

- 社群與實戰：[real-browser-mcp](https://github.com/ofershap/real-browser-mcp)、[Supabase 收購 Turso](https://supabase.com/blog/supabase-is-acquiring-turso)。
- 工具更新：[Claude Code v2.1.288](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)、[AstaBrief](https://allenai.org/blog/astabrief)。
- 官方模型／產業：[Claude Frontier Academy](https://www.anthropic.com/news/claude-frontier-academy)、[Kolibri](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model)、[Gemini 4 Argon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)。
- YouTube：[Nate Herk 原片](https://www.youtube.com/watch?v=7eo-11K2e3c)、[完整時間軸逐字稿](https://moderncreator.app/2026-09-29-nate-herk-ai-automation-i-tested-sonnet-5-5-vs-opus-5-5-what-you-need-to-know)。
