# AI 情報日報｜2026-10-29

約 4 分鐘閱讀。今天的主線是：AI coding agent 正從「選一個模型來回答」轉向「由系統路由模型、持續記憶、跨 repo 找上下文，再把工作放進可控的 workflow」；成本、權限與驗證因此更需要被明確管理。

> 截稿時間：2026-10-29 08:00（Asia/Taipei）。
> 查核範圍：優先 2026-10-27～10-29；補充最近一週仍有直接實用價值的進展。避開 10/28 已報的 GPT-6.1 Terra、Oracle AI Workspace、Agent Skills 治理與 sandbox 研究，除非今天有新的可驗證進展。
> 證據標示：官方公告／文件是官方事實；GitHub release 與 Reddit 是社群專案或個案；廠商 benchmark 與產品自述標示為發布方結果，不視為獨立排名。

## 1. 社群實戰用法

### 平行 agent 的瓶頸在決策，不在同時開幾個視窗

- **新在哪裡：** Reddit 的 ClaudeWorkflows 整理了一套 Parallel Code 做法：每個 Claude Code、Codex CLI 或其他 terminal agent 都在自己的 git worktree／branch 執行，再用 Plan tours、Change tours 與 Task briefs 把人的工作集中到核准計畫、看風險 diff 和決定是否退回。這是社群工作流，不是受控研究；原文頁面的社群驗證仍低。
- **可以怎麼開始：** 先只平行跑 2 個互不重疊的小任務；每個 worktree 先寫任務範圍與驗收條件，agent commit 後只看變更摘要、測試結果與高風險檔案，再由人決定合併。不要讓多個 agent 同時寫同一批檔案，也不要把「背景檢查通過」當成需求完整的證明。
- **編輯心得與限制：** worktree 解決檔案互撞，不解決錯誤方向；平行數增加後，context、token、review 與整合成本也會增加。適合熟悉 Git、能維護明確任務邊界的團隊，不適合把它當成無人監督的加速按鈕。
- 來源：[Parallel Code：Multiple AI Agents + Git Worktrees](https://www.reddit.com/r/ClaudeWorkflows/comments/1xgafx2/workflow_parallel_code_managing_multiple_ai/)（2026-10-27～28，社群整理；低票數個案）。

## 2. 社群新工具與新玩法

### Replica：用既有 design system 讓自然語言原型不再從零開始

- **新在哪裡：** GitHub Design 開源 Replica，讓團隊把自己的元件、pattern 與文件提供給 Copilot，直接用自然語言產生可互動原型；也可自架 Replica Hub，讓同事留言回饋。它的重點不是「生成一張漂亮畫面」，而是把產品規範變成原型上下文。
- **可以怎麼開始：** 先挑一個不涉及真實個資的流程，整理 3–5 個元件、狀態與使用規則，從本機原型開始；只有在設計規範、資料來源與部署邊界確認後，才開 Hub 給團隊使用。
- **編輯心得與限制：** MIT 開源不代表生成結果自動符合 accessibility、互動狀態、效能或品牌治理；原型仍要由設計與工程共同檢查。這是工具發布方的產品描述，不是獨立效率評測。
- 來源：[GitHub｜Introducing Replica](https://github.blog/changelog/2026-10-28-introducing-replica-an-open-source-ai-prototyping-tool/)（2026-10-28，官方開源公告）、[Replica GitHub repository](https://github.com/github/replica)。

### OpenCode v1.19.5：修掉 TUI worker 失敗後「一直掛著」的可觀察性問題

- **新在哪裡：** 10/28 的 v1.19.5 修復了 TUI worker request 失敗時沒有回傳錯誤、讓呼叫端持續等待的問題；這種小修復比新模型更直接影響 coding agent 的可用性。
- **可以怎麼開始：** 升級前先在一個非關鍵 repo 記錄目前版本，故意觸發一個可預期失敗的 worker 請求，確認 CLI 會回報錯誤並能繼續或安全退出；再把錯誤、重試與超時納入自己的 smoke test。
- **編輯心得與限制：** release 只描述這個修復，不代表所有長任務、外掛或模型供應商問題都已解決；GitHub release 顯示距離該 tag 已有大量後續 dev commits，團隊應依穩定版策略升級，不要只追最新 tag。
- 來源：[OpenCode v1.19.5 release](https://github.com/anomalyco/opencode/releases/tag/v1.19.5)（2026-10-28，專案 release note）。

## 3. 官方新功能與推薦用法

### Copilot Fusion GA：從「挑模型」變成「挑工作強度」

- **新在哪裡：** GitHub Copilot Fusion 10/28 一般可用，系統會依任務路由與編排不同模型，提供 Standard、High、Max 三種 effort；工作流可採 Single、Cascade 或 Critique。Fusion Max 的 Artificial Analysis Coding Agent Index 與成本數字是 GitHub 引用／發布方結果，不是獨立全面排名。
- **推薦用法：** 日常小修改先用 Standard；跨檔案、難除錯任務才升 High／Max；連續一週記錄完成率、測試、延遲、token 與人工修正量，依真實 repo 決定是否把 Fusion 設成預設。Copilot Fusion 每個實際使用的模型都會計費，短期折扣也可能變動。
- **限制：** 模型路由是系統決策，不代表每次都選到最適合的模型；Max 可能更慢、更耗 AI credits。企業管理員仍應限制可用模型，並為敏感 repo 保留人工 review。
- 來源：[GitHub｜Route and orchestrate models with Copilot Fusion](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion)（2026-10-28，官方 GA 公告）。

### Agentic Workflows GA：把 issue triage、CI 分析與文件更新放進 Actions

- **新在哪裡：** GitHub Agentic Workflows 轉為 GA：用自然語言 Markdown 定義 reasoning-based task，再編譯成標準 Actions YAML；可用 Copilot 或其他 coding agent。官方列出的 safeguards 包含預設 read-only、sandbox container、Agent Workflow Firewall、safe outputs 與 threat detection。
- **推薦用法：** 先從「讀 issue、整理資訊、產生草稿」開始，設定明確的 allowed tools、runner 與輸出格式；再逐步加入 PR 或文件寫入，所有副作用都要求 safe output、測試與人審。用 `gh aw forecast` 估算 AI credits，不要一開始把 production deploy 放進 agent workflow。
- **限制：** GitHub 引用 Accenture 的 29 小時、91% commits 等是客戶案例自述；sandbox 與 read-only 也不是對所有 prompt injection、依賴污染或錯誤修改的保證。GA 代表產品可用，不代表你的 workflow 已安全。
- 來源：[GitHub｜GitHub Agentic Workflows generally available](https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available)（2026-10-28，官方 GA 公告）。

### Gemini 4 Carbon：先給 cyber defenders，還不是普遍可用的開發模型

- **新在哪裡：** Google 10/28 宣布 Gemini 4 Carbon，定位為長 horizon、coding 與 cybersecurity 模型；本週先透過 Fairwind Program 給一部分 cyber defenders 和 trusted partners，之後才逐步擴至開發者、企業與消費者。公告列出 $2／百萬 input、$10／百萬 output 的 introductory price，但實際開放前仍可能變動。
- **推薦用法：** 現階段把它當作安全研究觀察對象，不要為尚未取得存取權的團隊改架構；若獲邀試用，固定同一組漏洞 triage、修補與長任務測試，並把 guardrails 開啟與關閉的結果分開記錄。
- **限制：** SEC-bench Pro、ExploitGym、CWE-bench、WebDev Arena 與「比另一家模型高 10 倍」都是 Google 公告中的發布方／引用結果，部分評測未包含 guardrails；不能直接當成生產安全或跨模型總排名。
- 來源：[Google DeepMind｜Introducing Gemini 4 Carbon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)（2026-10-28，官方公告）、[Google Q3 2026 CEO remarks](https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/)（2026-10-28，官方說明）。

## 4. 使用心得與避坑

### 有 memory、跨 repo search，不等於可以放心讓 agent 自己改

- **今天的判斷：** GitHub intelligence 把 Copilot Memory、Dreaming 與跨 repo code search 放在同一個 context layer：Memory 可記住偏好與 repository convention；Dreaming 會整理記憶、提出 instruction／skill 的 PR；`/research` 可跨 repo 找 caller、schema 與相關實作。這能減少重複交代，但也會讓過時或錯誤的記憶被帶進更多工作。
- **立即可做：** 先讓 agent 做 read-only research，要求每個結論附 repo、檔案與行號；記憶只保留可驗證的命令與約定，涉及權限、付款、刪除、部署的內容不要自動寫入永久 guidance。任何 dreaming 產生的 instruction／skill 變更，都先當普通 PR review。
- **限制：** GitHub 公布的 93% preference adherence 與 42% workflow efficiency 是 public-preview 觀察數據；它沒有證明 memory 一定降低錯誤。跨 repo search 也可能擴大資料可見範圍，企業需先確認 repository access policy。
- 來源：[GitHub｜GitHub intelligence puts your code, context, and history to work](https://github.blog/changelog/2026-10-28-github-intelligence-puts-your-code-context-and-history-to-work)（2026-10-28，官方公告）。

### 本機模型路由不是離線模式，AI Scan 也不是一次性安全證明

- GitHub 的 Copilot Fusion 本機模型路由目前是 experimental preview：Windows 可透過 Windows ML 管理下載，macOS／Linux 可用 OpenAI-compatible server 自帶模型；但 routing decision 仍在雲端，本機 inference 不等於整個 session offline，且本機模型的 safety protection 可能不同。
- GitHub AI Scan 可掃整個 repository，補足 CodeQL 覆蓋不到的語言與 framework，但掃描以固定時間預算分析 default branch 最新 commit，修復後不會自動關閉 alert，必須重新 scan；它應與 CodeQL、人工 triage、dependency review 並用。
- 來源：[Copilot Fusion local models](https://github.blog/changelog/2026-10-28-github-copilot-fusion-now-supports-selection-of-local-models)、[AI Scan for repositories](https://github.blog/changelog/2026-10-28-ai-scan-for-repositories-in-public-preview)（2026-10-28，官方 preview 公告）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 10/27～10/29、必要時放寬至一週。可讀搜尋結果沒有同時提供可靠字幕／逐字稿、超過 10,000 觀看、且具實測／教學／技術拆解的合格候選；因此不從標題或介紹猜測內容，也不硬湊影片。

## 今天最值得帶回團隊的三個檢查

- **模型選擇：** 把「模型名稱」改成可量測的 effort、成本、延遲與人工修正量；路由系統也要留紀錄。
- **上下文治理：** memory、跨 repo search、design system 與 workflow instruction 都要有 owner、期限與 review，不要讓錯誤知識永久化。
- **副作用控制：** agent workflow 從 read-only、草稿與可回復變更開始；本機模型、AI Scan、sandbox 與 benchmark 都不是單獨的安全邊界。

## 今日一句話

Agent 的下一步不是替人選一個「最強模型」，而是把上下文、模型路由、工具權限與驗收證據組成一條能被檢查、限額與回復的工作流。

來源：[Copilot Fusion](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion)、[Agentic Workflows](https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available)、[Gemini 4 Carbon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon)、[Replica](https://github.blog/changelog/2026-10-28-introducing-replica-an-open-source-ai-prototyping-tool)。
