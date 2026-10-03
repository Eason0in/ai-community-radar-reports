# AI 情報日報｜2026-10-03

約 4 分鐘閱讀。這兩天的主線不是又一個「更大的模型」，而是 agent 開始被做成可重複的流程：有可恢復的 harness、可編排的 workflow、可透過 API 觸發的 review；同時，模型退役與桌面控制權限也提醒團隊，AI 工具的生命週期與邊界必須一起管理。

> 截稿時間：2026-10-03 08:04（Asia/Taipei）
> 查核範圍：優先查 2026-10-01～10-03 的官方公告、官方文件、GitHub Changelog、Hacker News 與 Reddit；已避開 10/01 日報已報導的 DevDay 發表、MCP Triggers、Sol 安全附錄與 safety case，除非有新的實測或後續變化。
> 證據標示：官方公告／文件是官方事實；官方 benchmark 或採用數字屬廠商結果；Reddit／Hacker News 是個人或社群經驗，不外推成普遍結論。

## 1. 社群實戰用法

### GPT-6.1 Sol 的新共識：省額度，但要接受慢與不穩定

- **新在哪裡：** 10/01～10/02 的 Codex 社群回報開始形成較一致的 trade-off：Sol 6.1 在長時間 coding、migration、複雜 repo 探索時，很多人覺得用量消耗遠低於 Astra／舊 Sol；但回應速度明顯慢，品質仍有人遇到「反覆迭代才完成」或 terminal／tool 使用異常。這是體感彙整，不是控制變因的 benchmark。
- **可以怎麼開始：** 把 Sol 6.1 放在長任務 worker：先讓它掃 repo、列出 plan、跑測試與整理 migration；需要快速互動、GUI／computer use 或一次性困難判斷時再切 Astra／其他模型。每次記錄模型、reasoning、耗時、用量、測試結果與返工時間。
- **編輯心得：** 「便宜」不等於「每分鐘產出較高」；對互動式修 bug，等待時間可能吃掉節省的額度。最實用的比較單位是「成功交付一個可驗證變更的總時間」，不是 token 或剩餘百分比。
- **限制：** 方案、帳號、服務負載與 `/fast`／reasoning 設定不同；貼文沒有完整 prompt、token log 或同任務對照，不能拿來宣稱 Sol 一定優於其他模型。

來源：[Sol 省用量但速度慢的討論](https://www.reddit.com/r/codex/comments/1wvq11f/gpt61_sol/)、[長時間使用回報](https://www.reddit.com/r/codex/comments/1wvi37e/for_now_gpt_61_sol_is_an_absolute_gem/)、[Sol 速度／成本體感串](https://www.reddit.com/r/codex/comments/1wtrkiu/codex_got_dumber_after_devday_gpt_61_sol_cant_use/)（2026-10-01～10-02）；可信度：社群第一手經驗，非正式評測。

## 2. 社群新工具與新玩法

### Pi 1.0 與 Pi Durable：把 crash recovery 變成 agent harness 的基本能力

- **新在哪裡：** Earendil 10/01 發布 Pi 1.0，同日推出實驗性的 `@earendil-works/pi-durable`。它把對話、模型回合、tool call 與自有狀態先寫入 storage，讓程序中斷後能重新開啟並繼續；不同工具還能明確宣告「可安全重播」或「不可重播」。Pi Durable 不是 Pi coding agent 的替代品，而是拿來組裝長時、多入口、可多人 steering 的 agent application。
- **可以怎麼開始：** 先用 vacation planner 或簡單研究任務做 disposable PoC：把搜尋、讀檔、部署分成任務，為每個 tool 定義 replay policy；故意中斷程序，確認唯讀工作會重跑、不可重播的副作用只回報 interrupted，最後再把結果送回主 agent。
- **編輯心得：** 真正值得借鑑的不是「又一個 agent CLI」，而是把恢復語意放進工具契約；長任務的可靠性不能只靠模型記得上一句話。
- **限制：** 官方明確標示 Pi Durable 為 experimental、API 可能變動；15,000 行原始碼、耐久性與可擴展性數字是作者說法，尚未視為獨立 benchmark。

來源：[Pi Durable 官方發布文](https://earendil.com/posts/pi-durable/)（2026-10-01）、[Pi 1.0 官方發布文](https://earendil.com/posts/pi-1-0/)（2026-10-01）、[Hacker News：Pi Durable](https://news.ycombinator.com/item?id=49925969)（2026-10-02 查核）、[npm package](https://www.npmjs.com/package/%40earendil-works/pi-durable)；可信度：官方原始碼／套件＋社群討論，成熟度仍在實驗階段。

## 3. 官方新功能與推薦用法

### GitHub Copilot 把 agent workflow 從 prompt 推進到可編排程式

- **官方更新：** GitHub 10/01 將 dynamic workflows 推進 Copilot CLI、Copilot app 與 Copilot SDK public preview。開發者用程式定義串行／平行步驟、結構化輸出、subagent 互審、checkpoint 與人工暫停；10/02 又讓 Copilot code review 可由 REST／GraphQL API 觸發，並可為每次 review 設定 effort，Balanced 成為新預設。
- **可以怎麼開始：** 先做一個 `review-changed` workflow：列出變更檔、讓兩個 agent 分別找 correctness／security 問題，再用結構化 schema 合併；在建立 PR 或修改檔案前暫停，讓人確認 findings。Code Review API 則先接到 CI 的「提出 review」階段，不要直接授權自動 merge。
- **編輯心得：** workflow 的價值是把步驟、重試、審查點與輸出格式變成可讀的程式，而不是讓模型自由發明流程；這更容易做成本上限與失敗回復。
- **限制：** dynamic workflows 仍是 public preview；Copilot plan、SDK 版本、可用模型與組織 policy 會影響行為。API 觸發 review 不代表 findings 已足夠可靠，仍要保留測試與人工 merge gate。

來源：[Dynamic workflows in Copilot CLI and the Copilot app](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)（2026-10-01）、[Copilot code review API 與 Balanced effort](https://github.blog/changelog/2026-10-02-copilot-code-review-api-support-and-new-default-effort-level)（2026-10-02）、[官方 dynamic workflows 文件](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows)；可信度：官方公告／文件。

### GPT-6 使用指南把「選模型」改成成本、上下文與長任務的聯合設計

- **官方更新：** OpenAI 10/02 發布 GPT-6 family guide，建議以 workload、reasoning effort、速度、prompt caching、compaction、steering 與 async tools 一起規劃；指南列 Astra 做最難推理、Sol 做複雜 coding／research／computer use、Luna 做明確且大量的重複任務。文中也提到 cached input 依模型可比未快取輸入低最多 95%，這是官方成本說明，不是本報告的獨立測試。
- **可以怎麼開始：** 把穩定的 repo instructions、tool definitions 與 reference material 放在 prompt 前段，任務變動放後段；對重複日報、批次分類或固定 review 開 cache，長對話用 compaction，並用「每個成功任務的成本／延遲」而非單次 token 估算。
- **編輯心得：** 模型選擇不該是全域預設值；同一個產品可以讓 Luna 做 extraction、Sol 做 implementation、Astra 做高風險 review，再用測試與人工驗收決定是否升級。
- **限制：** 這是 OpenAI 的產品指南；95% 是官方依模型與情境提供的上限式說明，實際 cache hit、輸出品質、延遲與 API 價格仍要用自己的 workload 驗證。

來源：[A model guide for the GPT-6 family](https://openai.com/index/practical-guide-building-gpt-6/)（2026-10-02）；可信度：官方產品指南，成本與案例數字屬廠商說法。

## 4. 使用心得與避坑

### Computer use、模型退役與 preview 功能，不能只靠「開啟就好」

- **新在哪裡：** GitHub 10/01 將 Copilot CLI／app 的 computer use 開放 public preview，可讀取桌面內容、點擊、輸入、捲動並操作沒有 API／CLI／MCP 的 GUI；官方要求先取得核准，也允許組織停用。10/02 GitHub 同時退役 Gemini 3.5 Flash、Gemini 3.6 Flash、Kimi K2.7 Code、Claude Opus 4.7，並列出替代模型。
- **可以怎麼開始：** computer use 只在 disposable app／測試帳號開啟；prompt 寫清楚目標 app、允許操作與不可觸碰的資料，完成後關閉權限並檢查 audit／結果。企業則把 Copilot model policy 與 CI／extension 中的 model ID 列成 inventory，先替換退役模型，再跑一次 smoke test。
- **編輯心得：** 「有 approval」不等於安全邊界完整：螢幕上看到的 secrets、瀏覽器登入狀態與跨 app 剪貼簿仍可能暴露；模型退役也不是只改 UI 下拉選單，還要查 API、workflow、extension 與文件中的固定名稱。
- **限制：** computer use 目前是 public preview，macOS 還需要 Accessibility／Screen Recording 權限；替代模型是否可用仍受 Enterprise policy 影響，不能假設所有帳號自動啟用。

來源：[Copilot computer use public preview](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/)（2026-10-01）、[Copilot 模型退役通知](https://github.blog/changelog/2026-10-02-selected-models-in-github-copilot-deprecated/)（2026-10-02）；可信度：官方 GitHub Changelog。

## YouTube

### 今日無推薦

已主動查核 PAPAYA 電腦教室、Tech With Tim、Gary Chen、IBM Technology、Matthew Berman 與近期 AI coding／Agent 候選。近期能找到的影片不是純新聞／評論、沒有可靠可讀字幕，或已超過本報告的 24–48 小時優先範圍；因此沒有影片同時符合超過 10,000 觀看、可靠字幕／逐字稿、非 Shorts 與實測／教學深度門檻，不以標題或介紹猜測內容。

## 今天最值得帶回團隊的三個檢查

- **Agent 可靠性：** 每個 tool 先定義 crash 後可否重播，再談長時間 autonomous run。
- **Workflow 可驗證性：** 把 agent 步驟、schema、checkpoint、成本上限與人工 gate 寫進程式或設定。
- **生命週期管理：** 建立模型／權限 inventory，對 preview、退役與替代模型各跑一次 deny-path／smoke test。

## 今日一句話

AI agent 的下一個競爭點不是「能不能做事」，而是中斷、升級、退役或碰到真實桌面時，團隊能不能清楚知道它做了什麼、能不能安全接手。

## 來源總覽

- 社群實戰：[Sol Reddit 實測一](https://www.reddit.com/r/codex/comments/1wvq11f/gpt61_sol/)、[Sol Reddit 實測二](https://www.reddit.com/r/codex/comments/1wvi37e/for_now_gpt_61_sol_is_an_absolute_gem/)。
- 工具與社群：[Pi Durable](https://earendil.com/posts/pi-durable/)、[Pi 1.0](https://earendil.com/posts/pi-1-0/)、[Hacker News](https://news.ycombinator.com/item?id=49925969)。
- 官方更新：[GitHub dynamic workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)、[GitHub Code Review API](https://github.blog/changelog/2026-10-02-copilot-code-review-api-support-and-new-default-effort-level)、[OpenAI GPT-6 guide](https://openai.com/index/practical-guide-building-gpt-6/)。
- 避坑：[Copilot computer use](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/)、[模型退役](https://github.blog/changelog/2026-10-02-selected-models-in-github-copilot-deprecated/)。
