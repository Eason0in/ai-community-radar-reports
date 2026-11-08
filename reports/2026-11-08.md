# AI 情報日報｜2026-11-08

> 搜尋範圍：以 Asia/Taipei 2026-11-06～11-08 為主，優先採用 11/6～11/7 的官方 release、原始文章與 GitHub 專案。官方事實、專案自述、社群實作與編輯推論分開標示；11/07 已報且沒有新進展的題目不重複。

## 1. 社群實戰用法

### 先清理「會把 agent 帶偏」的舊 TODO

- **新在哪裡：** Google Developers Blog 11/06 分享以數千名工程師、數億 agent steps 的內部 trace 做的分析：13% 的讀檔 session 會看到 `TODO(bug/...)` 或 `FIXME(bug/...)`；其中 6% 會針對該 bug 採取後續行動，而 83% 是開發者沒有要求的行動。Google 的資料也顯示，這些未提示的 detour 平均多 70% steps、77% tokens、105% 等待時間。這是 Google 內部資料與分析，不是跨公司的獨立 benchmark。
- **可以怎麼開始：** 在 agent 讀得到的 repo 先掃描帶 bug ID 的 TODO，對照 tracker 狀態；已修好、won't-fix 或重複的先刪除，仍有效的改成短而明確的上下文。給 coding agent 的任務也加上「遇到未被要求的 TODO 先列出，不要擴大 scope」規則。
- **編輯心得與限制：** 舊註解現在不只是維護負債，也是上下文污染。自動清理只能送 PR 供人審，不能讓 agent 因為看見一個 ticket 就直接改 code；Google 的統計來自其自身工作流，應在自己的 trace 中重測。
- 來源：[Google Developers Blog：Agent Distraction](https://developers.googleblog.com/en/agent-distraction/)（2026-11-06；官方文章，數字為 Google 內部分析）。

## 2. 社群新工具與新玩法

### OpenCode 2.2.6：把 scripted agent 放進隔離 worktree，完成後自動不進收件匣

- **新在哪裡：** 11/06 的 v2.2.6 新增 `opencode run --worktree`（`-w`），可替 scripted/CI session 建立新的 Git worktree；`--archived` 則在建立時就把 run 排除於 inbox、首頁與 session 清單。另有 opt-in 的 MCP connection pooling，可讓相同設定的多個專案共享連線。
- **可以怎麼開始：** 在 repo 根目錄先試 `opencode run -w --worktree=agent-a "完成小型修正並跑測試"`；排程或 CI 用 `opencode run --archived`，避免大量一次性 session 汙染人類工作區。要用 pooling 先確認 MCP server 沒有把連線狀態、工作目錄或權限錯誤地視為全域共享。
- **編輯心得與限制：** worktree 只隔離檔案與 Git 狀態，不會自動替你審查 agent 的副作用；`run` 會等待它啟動的 background shell、subagent 和 image job，若 prompt 啟動 dev server 或 watcher，CI 可能永遠不結束，必須自行設 timeout。
- 來源：[OpenCode v2.2.6 release](https://github.com/anomalyco/opencode/releases/tag/v2.2.6)（2026-11-06；社群開源專案）。

### Qwen Code 0.27.0：把本機檔案變更與 Skill／managed-agent 狀態露出來

- **新在哪裡：** 11/07 發布的 v0.27.0 加入 local session 的 `FileChanged` hook、較完整的 Skill completion details、managed-agent 基礎工具對齊 daemon，以及 GitHub repository event 的 allowlist／blocklist。這些是 release notes 的專案功能，不等於任何模型本身變強。
- **可以怎麼開始：** 固定版本後，在 disposable workspace 寫一個只讀或只記錄的 `FileChanged` hook，觀察 agent 哪些檔案真的被動過；GitHub channel 先設定 allowlist，再測一個測試 repo 的 issue／PR event，避免把整個組織的活動餵給 session。
- **編輯心得與限制：** completion receipt、hook 與事件篩選能改善可回查性，但不會自動建立可信邊界；Skill ZIP、daemon 與 GitHub event 仍要限制來源、權限與可接觸的 repo。這一版同時含大量 managed-agent 修正，正式升級前應先做一次可回復的 smoke test。
- 來源：[Qwen Code v0.27.0 release](https://github.com/QwenLM/qwen-code/releases/tag/v0.27.0)（2026-11-07；專案官方 release）。

## 3. 官方新功能與推薦用法

### Codex 0.167.0：先用 agent command center 看未讀結果，再切 backend

- **新在哪裡：** OpenAI Codex 11/06 的 0.167.0 穩定版新增 `codex agents --no-daemon` agent command center，session picker 會標示 unread results；也能在 terminal session picker 切換 connected backend 並保留草稿，支援本機圖片預覽，approval prompt 開啟時可直接展開 patch details。
- **推薦用法：** 多個長任務並行時，先以 command center 看哪些 session 有新結果，再進入單一 session 審 diff；切換 provider 前先保存目前 draft，避免把「換模型」誤當成「重新開始」。對含圖片的 UI 任務，先確認 terminal 是否支援 preview，再把 transcript path 存進可回查的工作紀錄。
- **編輯心得與限制：** 這些是工作台與可見性改善，不代表 agent 產出可以免審；同一版也強化 network approval 結束與 managed command checkpoint，CI 仍應以 exit code、diff 與測試結果作為完成條件。
- 來源：[OpenAI Codex 0.167.0 release](https://github.com/openai/codex/releases/tag/rust-v0.167.0)（2026-11-06；官方 GitHub release）。

### GitHub Agentic Workflows 1.2.1：跨 agent continuation 也要 fail closed

- **新在哪裡：** GitHub 的 `gh-aw` v1.2.1（11/06，pre-release）加入 artifact-backed durable workflow continuation across agents；repo-memory 可用 GitHub App authentication，workflow environment 有 deployment controls。安全審查遇到 unresolved 現在 fail closed，並警告 dynamic checkout ref 可能把 host setup steps 暴露給不受信任的 code。
- **推薦用法：** 先在測試 repo 用 artifact 保存 continuation state，明確指定下一個 agent 可讀的輸入與最小權限；把 unresolved security review 視為阻斷，不用 `--force` 繞過。對 dynamic checkout ref 加固定 commit／受信任分支 allowlist，再測一次惡意 PR 的執行路徑。
- **編輯心得與限制：** durable continuation 解決的是「跨 agent 接續」，不是「自動可信」；這版是 pre-release，且 workflow lock、App token、environment permission 都要放進自己的 threat model。第三方模型 attribution 也不等同於結果品質保證。
- 來源：[GitHub Agentic Workflows v1.2.1 release](https://github.com/github/gh-aw/releases/tag/v1.2.1)（2026-11-06；GitHub 官方專案，pre-release）。

## 4. 使用心得與避坑

### Agent session 的「恢復成功」要看 run_id、delivery state 與 process probe

- **發生什麼事：** 社群 terminal session manager agent-deck v1.16.38（11/07）修正 pi session continue 沒有沿用同一 `run_id`、恢復 log 後 delivery state 超過 resume point 沒清掉、pending flag 寫入失敗會讓 delivery pass 看不到紀錄，以及 `ps`／`pgrep` probe 沒有限制範圍等問題。
- **可以怎麼開始：** 升級後做一次「中斷 → continue → 子 agent／訊息送達」測試，逐一記錄 `run_id`、turn sequence、resume point 與 delivery result；不要只看 TUI 顯示完成。對長時間 session 把恢復紀錄與 process probe 納入 smoke test，並限制 probe 只看自己的 process tree。
- **避坑重點：** session manager 的 UI 已顯示完成，不代表訊息一定送達；尤其是跨 agent、跨 pane 或重啟後，應把 durable log、delivery ledger 與實際工具結果分開驗證。這是社群專案的修正方向，不是對所有 agent runtime 的普遍保證。
- 來源：[agent-deck v1.16.38 release](https://github.com/asheshgoplani/agent-deck/releases/tag/v1.16.38)（2026-11-07；社群開源專案）。

### 對醫療 AI，別把單一正確率當成安全證明

- **發生什麼事：** Google for Health 11/04 公開 AI health evaluation framework，把評估拆成 accuracy、safety、usefulness，並混合 closed-question benchmark、autograder 與專家人工審查；這是方法框架，不是某個模型通過醫療認證。
- **可以怎麼開始：** 先為自己的醫療 use case 寫三張表：可接受錯誤、不可接受傷害、使用者是否真的能完成任務；再分別設計 closed questions、危險情境與專家 review，最後才比較模型分數。
- **避坑重點：** benchmark 高分不代表臨床安全，也不代表使用者會正確採納建議。高風險流程要有人工升級、來源與不確定性呈現，並在真實語言、族群與工作流程上另做驗證。
- 來源：[Google：A framework for evaluating AI in health](https://blog.google/innovation-and-ai/technology/health/evaluating-health-ai-at-scale/)（2026-11-04；官方方法文章）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-11-06～11-08，並放寬至一週。沒有同時滿足「觀看數超過 10,000、非純新聞朗讀、具實測／教學／技術拆解，且能取得並讀完可靠字幕或逐字稿」的候選；因此不從標題、縮圖或介紹猜內容，今日無推薦。

## 今天最值得帶回團隊的三個檢查

- **先清上下文，再放大 agent：** 舊 TODO、過期規格與未整理的 bug reference 會直接變成 scope creep。
- **隔離執行與可回查狀態：** worktree、archived run、artifact continuation 和 run_id 各自解決不同問題，不能只靠一個「完成」提示。
- **安全失敗要保留：** unresolved review、dynamic checkout、外部事件與高風險醫療建議都應在無法驗證時停下來，而不是自動繞過。

## 今日一句話

當 agent 開始長時間、跨工作區、跨工具接續工作，真正重要的不是再加一個模型，而是讓上下文、權限、恢復狀態與驗證結果都能被人重新檢查。
