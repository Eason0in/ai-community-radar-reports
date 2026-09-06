# AI 實用日報｜2026-09-06

約 3 分鐘閱讀。今天看社群怎麼留下工作流程，以及官方可立即試用的模型分工功能。社群案例未經本報親自實測。

## 1. 社群實戰用法

### 把每次重講的工作流程，做成專用技能

9 月 5–6 日的 Codex 討論中，一位使用者分享，把 WordPress 備份整理方式與專案設計規範做成技能，方便後續工作重複使用。

怎麼試：挑一件常做的事，例如日報整理，寫清楚輸入、理想輸出與一個範例，再整理成技能。

編輯心得：值得先處理自己反覆交代的流程；這是個人經驗，不能保證每個人都省時間。

來源：[社群原文](https://www.reddit.com/r/codex/comments/1w8d3rt/looking_for_advice_on_improving_my_codex_chatgpt/)

## 2. 社群新工具與新玩法

### Plumbline：把計畫、執行與驗收連起來

較早發布的開源外掛，9 月 5 日仍有作者與使用者討論。它嘗試保存工作計畫、安排代理分工，讓較長的開發任務容易接續。

怎麼試：先看作者的完整流程，挑一個可重做的小專案試用，觀察是否減少重新解釋和返工。

編輯心得：適合常做多階段任務的人參考；作者的用量改善是個人資料，目前沒有獨立測試保證。

來源：[作者分享](https://www.reddit.com/r/codex/comments/1vcs9xi/opensourcing_my_lightweight_plugin_on_the_off/)｜[開源專案](https://github.com/nickyfactz/plumbline)

## 3. 官方新功能與推薦用法

### Copilot 可以自己安排不同模型處理與審查

GitHub 9 月 4 日推出 HydraFusion 研究預覽，依任務自動選擇直接處理、必要時升級模型，或加入另一個模型審查。

怎麼試：更新 Copilot CLI、開啟實驗功能，再從模型選單選 HydraFusion；官方原文提供操作步驟。

編輯心得：先拿一個熟悉的小任務，比較使用前後的完成時間、返工和花費。這仍是研究預覽，按實際模型用量計費，官方節費數字不是個人保證。

來源：[官方上手教學](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/)

## 4. 使用心得與避坑

### 收到別人的專案壓縮檔，先別急著讓 AI 開啟

9 月 1 日的 GitSpawn 披露指出，部分 AI 程式工具可能因專案附帶的 Git 設定，執行非預期程式。

今天可做：更新工具；對陌生的專案壓縮檔或同步資料夾，先在隔離環境檢查，避免直接交給 AI 工具開啟。

編輯心得：重點是接收專案的方式。研究者披露時已將 Codex、Cursor 相關問題列為修補；各工具今天的狀態仍需依版本確認。

來源：[原始披露與修補紀錄](https://www.manifold.security/blog/ai-coding-agents-git-hijack)

YouTube：今日無符合既有查核門檻的新片。

今天先試一件事：從你反覆交代的工作中，選出一個流程，留下規則與成果範例，作為專用技能的起點。
