# AI 實用日報｜2026-09-06

資料截止：2026-09-06（Asia/Taipei）。本期約 3 分鐘，固定分成四類；只保留今天能動手試、且能說清楚限制的內容。

## 1. 社群實戰用法

### 把重複的專案流程做成 project-specific skill

- 一位 Codex 使用者分享：把 WordPress 備份取回流程做成「archive curator」skill，也把專案設計系統整理成 skill，實際使用時比泛用技能更可靠。[Reddit 實例與討論](https://www.reddit.com/r/codex/comments/1w8d3rt/looking_for_advice_on_improving_my_codex_chatgpt/)
- **怎麼試：** 先只寫一個重複流程，明確列出輸入、輸出、檢查點與一個成功／失敗範例；先在單一專案使用，遇到錯誤再補規則。
- **適合：** 專案有固定資料格式、命名規則或驗收步驟。**限制：** 這是單一使用者經驗，不是獨立 benchmark；請用任務完成率、人工介入次數與 token／回合數自行比較。

## 2. 社群新工具與新玩法

### Plumbline：把「意圖 → 實作 → 驗證 → 文件」串成輕量流程

- Plumbline 是開源的 Codex／Claude Code workflow plugin，作者主張用長期目標、可留下的 workflow receipt 與 UAT，減少每次重新說明背景的成本。[作者 Reddit 說明](https://www.reddit.com/r/codex/comments/1vcs9xi/opensourcing_my_lightweight_plugin_on_the_off/)｜[GitHub repository](https://github.com/nickyfactz/plumbline)
- **怎麼試：** 只取 README 中與自己流程相符的部分，在 disposable project 先跑 3–5 個相同任務，記錄回合數、token、測試通過率與人工修正時間。
- **適合：** 需要跨多回合追蹤目標、驗收與文件的個人專案。**限制：** 作者明確標示是 n=1 的個人使用資料；repository 目前採用度仍低，不能把作者的用量改善當成普遍成本保證。

## 3. 官方新功能與推薦用法

### GitHub HydraFusion：在 Copilot CLI 內測試多模型路由

- GitHub 於 9/4 發布 research preview，提供 single、cascade、critique 三種執行模式；Copilot CLI 可用 `/update`、`/experimental on`，再從 `/model` 選 HydraFusion。[GitHub 官方說明](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/)
- **怎麼試：** 用固定的 6 個 synthetic coding 任務，分別跑單模型、cascade、critique；記錄實際模型、token、重試、延遲與 verifier 結果，再決定是否值得導入。
- **適合：** 任務難度差異大、需要草擬後審查或失敗升級的流程。**限制：** 仍是研究預覽，依實際使用模型的標準 token 價格計費；GitHub 的 TerminalBench 數字是廠商離線評測，不是獨立保證。

### OpenAI Skills：先做小而專的技能，再考慮包成 plugin

- 官方文件把 skill 定義為可重用的任務流程，包含 `SKILL.md`、必要資源與可選腳本；建議保持聚焦，並讓模型只在需要時讀取完整指令。[官方 Build skills 文件](https://learn.chatgpt.com/docs/build-skills)
- **推薦用法：** 把一個高頻、可驗收的工作流程寫成小 skill，先驗證觸發條件與輸出品質；只有要跨專案或分享給別人時，才整理成 plugin。
- **適合：** 團隊有一致的報告、測試、資料清理或 release 檢查流程。**限制：** skill 不是能力保證；仍要保留測試、人工審查與權限邊界。

## 4. 使用心得與避坑

### 不受信任的 repo 可能在 agent 啟動前就影響 Git 行為

- Manifold Security 的 GitSpawn 研究指出，某些 coding agent 的背景 `git status`／`git diff` 若讀到惡意 `.git/config`，可能觸發 Git 設定指定的外部程式；修補狀態會隨版本變動。[原始安全披露](https://www.manifold.security/blog/ai-coding-agents-git-hijack)
- **今天可做：** 收到 ZIP、同步資料夾或 USB 專案時，先在隔離環境檢查 `.git/config`、hooks 與其他可執行設定；更穩妥的做法是使用乾淨 clone，再把必要檔案以檔案層級方式帶入。不要把 workspace trust 視為完整的主機級安全邊界。
- **限制：** 這是特定 agent／版本與 Git 設定組合的風險，不代表所有工具目前都可重現；實際防護請再對照使用中 agent 的最新 advisory。

### YouTube：今日無推薦

本次沒有找到同時符合「查核時超過 10,000 次觀看、非 Shorts、可讀字幕／逐字稿、具實測或技術拆解、且不是純贊助宣傳」的 9/4–9/6 新片，因此不為了湊篇幅推薦影片。

### 一個可直接執行的 30 分鐘驗收

選 3 個 synthetic coding 任務，為每次執行留下 `task_id`、模型／路由、token、測試結果與人工介入紀錄；最後只把有測試或 validator receipt 的結果標成完成。這能同時檢查 skill、路由與安全流程是否真的省時間，而不是只比較模型最後一句回答。
