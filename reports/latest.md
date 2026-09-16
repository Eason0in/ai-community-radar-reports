# AI 實用日報｜2026-09-16

約 3 分鐘閱讀。今天的共同主線是：Agent 讓寫碼變快後，真正的瓶頸移到 CI、跨 repo 變更與執行期治理。以下把官方案例、社群流程、產品自述與編輯建議分開；數字若非獨立測量，均標為原作者或供應商資料。

## 1. 社群實戰用法

### 老系統先做「上下文與關卡」，再讓 Agent 逐階段動手

9 月 15 日 r/ClaudeWorkflows 整理一則開發者實戰：在同時有 Smalltalk、Java、Nuxt/Vue 與 PostgREST 的 30 年企業系統中，先用 `CLAUDE.md`、`DOMAIN.md`、`DATABASE-GUIDE.md` 和專案目錄把系統規則、領域詞彙、資料庫陷阱寫成可重讀的上下文；再讓 Agent 讀 ticket、跨 repo 搜尋、先出計畫，通過人工檢查後才分階段實作與 PR review。這是單一社群案例，互動數很低，不能當成普遍成功率。

可借用的部分不是「把全部原始碼丟給模型」，而是把不可省略的知識與驗收條件版本化：先建一個只讀盤點和小修補任務，為每個階段留下測試、diff 與人工批准點；Java／Smalltalk 仍逐行審查，UI 才做端到端驗收。敏感架構、秘密與商業資料不要因為有 enterprise 方案就自動全開。

來源：[r/ClaudeWorkflows：30 年 legacy system workflow（2026-09-15）](https://www.reddit.com/r/ClaudeWorkflows/comments/1wgyxsf/workflow_integrating_claude_code_into_a_30year/)（社群轉述，低互動；可信度中低）。

## 2. 社群新工具與新玩法

### Agentic Batch Changes：把一次 migration 變成可分批審查的 changesets

Sourcegraph 9 月 14 日開放 Agentic Batch Changes：用自然語言描述要改什麼，Agent 先用 Deep Search 理解多個不完全相同的 repo，提出計畫，先在一個 repo 預覽，再由人控制分批 rollout；之後可追 CI、處理 merge conflict，必要時把單一 repo 工作交給 Claude Code 或 Codex。官方說 beta 客戶曾合併超過 1,000 個 changesets，最大案例超過 2,200 個，但這些是供應商自述。

適合拿來試的題目是依賴升級、CVE 修補或 deprecated API migration：先選 2–3 個代表性 repo 做 canary，要求產生 draft PR、跑既有測試，再逐批放大。不要一開始就對所有 repo 發布；多 repo 的「看似相同」變更很容易遇到版本、團隊規範與生成檔差異。

來源：[Sourcegraph Agentic Batch Changes（2026-09-14）](https://sourcegraph.com/changelog/agentic-batch-changes-ga)｜[官方文件](https://sourcegraph.com/docs/agentic-batch-changes)（官方功能說明；Cloud 已開放，self-hosted 預計 9/16 隨 Sourcegraph 8.0 提供）。

## 3. 官方新功能與推薦用法

### Google 的 zero-trust agent：把 intent gate 與異常行為放到平台層

Google Developers Blog 9 月 15 日的第二篇 zero-trust Agents 系列，示範同一個客服退貨 Agent 如何在 runtime 使用 Model Armor、Semantic Governance Policies 與 Agent Anomaly Detection：不只檢查 SQL 或 regex 是否合法，也判斷退款意圖、跨多回合的異常行為，並由平台／安全管理員維護治理，和 Agent 開發者分離。範例以 Gemini Enterprise Agent Platform、ADK 與一個 open-source companion demo 示範，仍是參考架構，不代表你的 Agent 已經安全。

推薦用法：對任何會退款、改權限、寄信或寫入資料庫的工具，先列出「允許的意圖、金額／頻率上限、需要人工批准的狀態」，再把輸入輸出 gateway、sandbox、簽章寫入與 anomaly detection 分層；每層都保留拒絕理由和 trace，方便回溯。單回合測試過關，不等於長工作階段沒有被逐步掏空的風險。

來源：[Build zero-trust AI agents that judge intent, not just syntax（Google Developers Blog，2026-09-15）](https://developers.googleblog.com/build-zero-trust-ai-agents-that-judge-intent-not-just-syntax/)｜[companion demo](https://github.com/GoogleCloudPlatform/zero-trust-agents-2)（官方文章與公開範例）。

### Anthropic 的實例：Agent 讓 CI job 六個月增 25 倍，解法是拆狀態而不是一直加機器

Anthropic 9 月 14 日分享，內部 CI jobs 六個月增加 25 倍、測試數增加 10 倍；原本的 test impact analysis 服務先後用加大機器、sharding、每日重啟撐過三次短期修補，最後改成無狀態 listener workers，把結果寫入 journal，再由獨立 consumer 彙整每個 test 的歷史，讓 selector 讀取相關結果。文章也提醒，若 Agent 讓 PR 更細、更密，CI 的尖峰和夜間活動會一起上升。

可移植的建議：先量測每秒進出的 CI jobs、listener lag、未處理事件和 test-selection 的資料新鮮度；重要服務不要依賴單一 process 內存狀態。把測試選擇的理由和使用的歷史資料提供給 Agent，讓它能自我驗證，但仍保留全量測試、抽樣 canary 和人類批准作為安全網。25 倍是 Anthropic 的內部觀察，不是所有團隊的預測值。

來源：[Agentic coding is straining CI（Anthropic，2026-09-14）](https://claude.com/blog/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic)（官方工程案例；含具體架構與限制）。

## 4. 使用心得與避坑

### 「免費、全自動、跨 repo」最容易省掉的，正是驗收成本

今天三個方向都指向同一個坑：跨 repo migration 可能一次開出大量 PR；CI test selection 若吃到 stale data，會不是漏跑就是被 flaky test 擋住；intent gate 若只寫在 prompt 裡，則跨回合或跨工具行為沒有人真正負責。更快的 Agent 不會自動帶來更低風險，只會讓錯誤擴散得更快。

今天可以做的小實驗：選一個低風險依賴升級或文件 migration，先只跑 3 個 repo；要求 Agent 產出 scope、每個 repo 的差異、測試結果與暫停條件，人工核准後才擴大。記錄成功、返工、CI 等待、人工 review 分鐘數與未命中案例；若只記「最後有 merge」，你量到的是完成率，不是可靠性。對第三方 Agent 服務，先確認資料保留、憑證範圍、可否停用自動修復與費用上限。

來源：[Sourcegraph 官方文件](https://sourcegraph.com/docs/agentic-batch-changes)｜[Anthropic CI 工程案例](https://claude.com/blog/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic)｜[Google zero-trust Agents Part 2](https://developers.googleblog.com/build-zero-trust-ai-agents-that-judge-intent-not-just-syntax/)（三家官方資料的編輯歸納，不是單一產品承諾）。

## YouTube：1 部符合門檻

### Matthew Berman｜The Risk Dario’s AI Warning Leaves Out

- 頻道／片名：[Matthew Berman《The Risk Dario’s AI Warning Leaves Out》](https://www.youtube.com/watch?v=_6PR25pkHKI)
- 發布日期：2026-09-15；Daily Curry 查核約 27.2K 次觀看，超過 10,000 門檻。[觀看數查核](https://dailycurry.com/)
- 逐字稿：已讀取 YouTube 自動產生的英文字幕；約 46 分 53 秒，非 Shorts。[字幕讀取頁](https://www.youtube-transcript.ai/transcript?v=_6PR25pkHKI)
- 重點：影片逐段討論 Dario Amodei 呼籲放慢 frontier AI 的文章，也整理 Sam Altman、Elon Musk 等人的公開回應；作者支持第三方 evaluator 的方向，但把「監管集中權力、可能壓縮 open source」視為另一個風險焦點。
- 作者觀點／限制：這是評論與政策觀點，不是安全測試、產品評測或獨立事實查核；片中有頻道導流／贊助內容，不能把作者對監管或開源的推論當成 Anthropic、OpenAI 或 Google 的共同立場。適合想快速掌握公共辯論的人，不適合拿來決定 production control。
- 可立即嘗試：看完只取一個可驗證問題——你的 Agent 是否有獨立於 prompt 的 intent、權限、費用與停止條件；把它寫成測試案例，別只把影片觀點寫進 policy。

今天先做：選一個小型跨 repo 變更，讓 Agent 先產生計畫與 canary diff；同時把 CI lag、測試選擇依據、人工批准點與 rollback 條件記錄下來，再決定是否擴大。這比追逐下一個「全自動」按鈕更能看出實際收益。
