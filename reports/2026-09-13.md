# AI 實用日報｜2026-09-13

約 3 分鐘閱讀。今天的共同主線是：Agent 越來越會自己跑，但成熟用法反而更重視「什麼時候不要開 Agent」、可觀測性與明確的停損點。以下分開標示官方公告、社群經驗、作者主張與編輯推論；沒有把單一貼文或廠商數字當成普遍 benchmark。

## 1. 社群實戰用法

### 小改動用單次編輯，長任務才值得開 Agent loop

9 月 12 日 r/AI_Agents 有一篇獲 58 分的實戰貼文主張：日常 90% 工作不需要完整 autonomous agent，針對明確的小改動做一輪 edit 通常更快、更便宜，也比較不會在大專案裡自動擴大範圍。留言則補上一個重要條件：遇到模糊問題，先用多 Agent 討論方案；方案清楚後，再交給本機 Codex 或 Claude Code 實作，不要讓三個 Agent 付費開會到任務結束。這是社群訊號，不是獨立評測。

怎麼開始：把任務先分成「單檔、可回滾」與「需要探索／跨檔」兩類。前者只給一次編輯加測試；後者才開 plan、子任務、驗證與人工批准。記錄 token、重試次數、diff 大小和人工修正時間，兩週後再決定哪些類型值得自動化。

編輯心得：Agent 的成本不只在模型費，也在上下文膨脹和 review。可預測的小任務若被包成十幾步 loop，往往只是把責任邊界藏起來；真正值得自動化的是重複、可驗證、失敗可停的工作。

來源：[r/AI_Agents 社群實測（2026-09-12）](https://www.reddit.com/r/AI_Agents/comments/1we52pj/hot_take_you_dont_need_ai_agents_90_of_the_time_a/)（社群經驗，低於正式研究的證據強度）。

## 2. 社群新工具與新玩法

### Hermes Agent 0.21.2：先修 state.db，再談長時間 Agent

Nous Research 的 Hermes Agent 9 月 11 日發布 v0.21.2（v2026.9.11），定位是修補版。重點不是多一個炫目的模型，而是處理 v0.21.0 後可能出現的 SQLite state.db 鎖競爭、WAL／FTS 損壞、壞資料列拖垮整個 session list，以及多 profile 互讀資料庫或憑證的邊界問題。作者也把 hosted room 狀態移到 shared-state.db，並讓 dashboard 優先唯讀開啟。

怎麼試：若你已在本機跑 Hermes，先備份 state.db，再升級到 v0.21.2；用兩個同時寫入的 session、session list、匯出和多 profile credential routing 做 smoke test。新使用者先讀 release note 與 profile／vault 文件，再決定是否開啟付款、登入或私有 Git plugin 等高副作用能力。

限制：這是專案作者的 release note，不代表所有環境都會重現或完全消除資料庫風險；「password-blind vault」也不等於整個 Agent workflow 沒有社交工程、權限配置或 UI 批准問題。

來源：[Hermes Agent v0.21.2 release（2026-09-11）](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.11)（開源專案原始 release note）。

## 3. 官方新功能與推薦用法

### Copilot code review 開始自己重查、自己收斂留言

GitHub 9 月 11 日更新 Copilot code review：當後續 commit 已處理留言，重新 review 時會自動 resolve；套用 autofix 時會產生更貼近變更內容的 commit message；Lite review 也改用多 Agent ensemble，並能在 firewall 後使用 shell 工具跑 build、test 與 targeted script。這些是 GitHub 官方功能說明；文中的 addressed-comments 增幅與成本下降仍是 GitHub 自家實驗結果。

推薦用法：把「Copilot 留言 → 人工改動 → CI → rereview → 仍開著的留言」當成一條可稽核流程，不要因為留言自動消失就跳過測試。保留原始 review、變更 commit 和 CI 結果，尤其要抽查它沒有把「相似但未真正修好」的問題誤判為已處理。

### Usage metrics 終於能單獨看 VS Code Agents window

同日 GitHub 將 VS Code Agents window 的使用指標加入 Copilot usage metrics：組織／企業報告可看每日活躍人數、session 數與訊息數，使用者報告可看是否使用該視窗及個人 session／訊息統計。要注意它和 editor-window Agent Mode、一般 usage rollup 分開，且需要相應的 metrics policy 與檢視權限。

可立即做：先建立一個 28 天 baseline，把活躍人數、session、訊息數和 merged PR、revert、failed CI 並列；不要只看訊息量就宣稱生產力上升。

來源：[Copilot code review 更新（2026-09-11）](https://github.blog/changelog/2026-09-11-auto-resolution-and-analysis-updates-in-copilot-code-review/)｜[VS Code Agents metrics（2026-09-11）](https://github.blog/changelog/2026-09-11-add-vs-code-agents-to-copilot-usage-metrics/)

## 4. 使用心得與避坑

### 把「風險警告」和「已驗證能力」分開寫

Anthropic CEO Dario Amodei 9 月 12 日在個人文章呼籲放慢 frontier AI 能力成長，提出若能力持續加速，未來 6–12 個月可能出現能接管網路的持久 botnet swarm；他也主張讓外部 evaluator 以接近內部團隊的權限進行審查。這是公司 CEO 的風險判斷與政策主張，不是已完成的預測或獨立能力評測；AP 的報導可作為事件交叉查證，但不會替這個時間估計增加科學確定性。

實務上先做三欄：已觀察到的行為、在什麼環境才出現、作者對未來的推論。對能執行網路與程序的 Agent，將 egress、localhost 控制面、credential、子程序與人工批准分開測；每一項都留下可重現的 log。沒有這些邊界，就不要把「有 sandbox」「有 evaluator」或「模型說它知道規則」當成安全證明。

編輯心得：今天最值得帶走的不是接受或拒絕某個 CEO 的預言，而是把強烈宣稱拆成可驗證的中間問題：模型能否辨識未授權目標？能否在證據衝突時停下？能否被撤銷？能否讓第三方重播並檢查？

來源：[Dario Amodei〈We Must Pace the Frontier〉（2026-09-12）](https://darioamodei.com/post/we-must-pace-the-frontier)｜[AP 交叉報導（2026-09-12）](https://apnews.com/article/d59552edcb27892d8ee4d98a48397706)

## YouTube：今日無推薦

今日主動查找 PAPAYA 電腦教室、Tech With Tim、IBM Technology、Matthew Berman、Matt Wolfe 與其他中英文 AI／工具／Agent／AI Coding 頻道；沒有同時符合「近 24–48 小時優先、查核觀看數超過 10,000、非 Shorts、可取得可靠字幕／逐字稿、具實測或深度工作流程」的影片，因此不硬湊推薦。

今天先做：拿一個不含機密的小任務，先用單次 edit 和測試跑一次；只有在需要探索或跨檔協調時才開 Agent loop，並把批准點、工具呼叫、CI 與最終 diff 一起保存。
