# AI 實用日報｜2026-09-07

約 3 分鐘閱讀。今天的主線是：Agent 能力進入研究與長期記憶，但驗證、權限與隱私仍要留在人手中。社群案例與產品展示未代表獨立實測。

## 1. 社群實戰用法

### 讓記憶成為可審查的工程產物

9 月 5–6 日社群討論的 OKF Agent Memory，把長期知識放進 Git 追蹤的 Markdown/YAML。這個方向值得借用：每個決策都要有來源、日期與可信度，Agent 只在需要時搜尋，不把整個「記憶庫」塞進 context。

怎麼試：先建立 5–10 個小型 `knowledge/` 條目，記錄一個架構決策、一個踩坑與一個操作步驟；讓 Agent 用搜尋取用，完成任務後只提出記憶草稿，人工查看 `git diff` 再合併。把「是否仍為真」與失效日期也寫進條目。

編輯心得：Git diff、版本與退回能力比「永遠記得」更重要；這是工作流建議，不是 OKF 或該工具的成效保證。

來源：[Google OKF v0.2 規格](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)｜[Hacker News 討論](https://news.ycombinator.com/item?id=45199989)｜[專案](https://github.com/okf-memory/okf-agent-memory)

## 2. 社群新工具與新玩法

### OKF Agent Memory：本地、Git-native、內建 MCP 的長期記憶

這個 Go 工具主打跨 session 的持久記憶、Markdown/YAML、漸進式揭露與 MCP 介面；適合想把 Agent 的工作知識放在自己 repo、能 review 和回滾的人。專案自稱 in-memory BM25 搜尋低於 300µs、可減少 80% token；9 月 6 日的獨立稽核則指出，5,000 個概念時測得約 354ms，且 ranking 會變動。兩者量測條件不同，不能把 README 數字當成通用保證。

推薦玩法：先只放公開文件或合成資料，設定 `source`、`freshness`、`owner` 三個欄位；連續跑同一個任務 3 次，比較搜尋結果、token 用量與錯誤引用，再決定是否接入私人專案。真正有價值的賣點是可追蹤性，不是單一 benchmark。

來源：[專案 README](https://github.com/okf-memory/okf-agent-memory)｜[獨立 benchmark 稽核](https://blog.compendialabs.org/posts/2026-09-06-dk-okf-agent-memory-benchmark-audit)

## 3. 官方新功能與推薦用法

- **OpenAI Research acceleration（官方，9/6）**：OpenAI 表示，截至 8 月中研究組每個人類工作日對應 3.1 個 Agent 工作日；依 Agent 用量排序的研究者中位數，每日用量以 API 價格計超過 600 美元，第 90 百分位超過 7,000 美元，並以 2028 年 3 月前達到自動化 AI researcher 為目標。這是供應商內部數據，不是獨立 benchmark。推薦用法：把 Agent 用在可平行的程式、實驗與資料整理，留下 log、成本上限與人工驗收點。[原文](https://openai.com/index/research-acceleration-view-inside-openai/)

## 4. 使用心得與避坑

### 「省 80% token」要看拿什麼相比

9 月 6 日的 OKF 稽核指出，專案的節省數字來自「載入整份資料」與「只取一份相關文件」的比較；這不代表換上工具後，每種任務都會省 80%。稽核也回報資料量增大後搜尋變慢、相同查詢的排序可能改變，本報未自行重現這些量測。

怎麼避坑：先用自己熟悉的小任務，比較答案有沒有正確引用、是否漏掉必要資料，再看用量。可以先整理既有文件、按需搜尋，不急著導入新服務。

來源：[原始稽核與量測方法](https://blog.compendialabs.org/posts/2026-09-06-dk-okf-agent-memory-benchmark-audit)

## YouTube：推薦 1 部

### Tech With Tim｜Everyone Needs an AI Brain (This Is the Easiest Way to Build One)

- **查核資料**：2026-09-05 發布；2026-09-07 查核約 1.6 萬次觀看；片長 11:01。[影片](https://www.youtube.com/watch?v=8yFb8QfAxRg)
- **字幕查核**：已閱讀今早匯出的 YouTube 逐字稿；匯出檔標記 en-CA，但正文為中文轉譯，因此僅摘要清楚可辨的示範，不作逐字引用。
- **摘要與重點**：影片把「AI brain」定義成位於使用者與模型之間的長期 context 層，依序完成 capture、store、recall；示範用 Genspark Workspace 6.0 的 SecondBrain 連接 Gmail、GitHub、Drive、Slack、Notion，再用 GenMail 做信箱整理與每日 briefing。可留意 2:03 的三步驟、5:29 的記憶摘要示範、8:48 的自然語言自動化流程。
- **作者觀點、工具與贊助**：作者認為自動建立與更新記憶比手動維護 Notion/Obsidian 輕鬆；工具是 Genspark SecondBrain、GenMail、Workspace 6.0。影片明確揭露由 Genspark 贊助，描述欄另有 referral/折扣導流。
- **優點、限制與適合對象**：適合想快速理解「記憶層如何串進工作流」的開發者、產品人與自動化初學者；但這是贊助產品展示，未驗證資料留存、權限、召回正確率或成本，也不應當作採購證據。值得看流程，不值得只因 demo 就連接私人信箱。

今天先試一件事：用 3 份公開或合成文件做一個可刪除的 context pack，為每條記憶加來源與日期，跑一次 Agent 任務後先看 diff 和引用，再決定是否保留。
