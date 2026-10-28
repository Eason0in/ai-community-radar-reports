# AI 情報日報｜2026-10-28

約 4 分鐘閱讀。今天的主線是：AI coding agent 的可靠性開始被拆成可配置的工作流、權限判斷與可攻擊的隔離邊界；模型升級本身，不能取代這三層驗證。

> 截稿時間：2026-10-28 08:00（Asia/Taipei）。
> 查核範圍：優先 2026-10-26～10-28；補充最近一週仍有直接實用價值的進展。避開 10/27 已報的 subagent fold、GEAR、Claude Code Monitor、Claude for Nonprofits、Claude Duet、Oracle Deep Trust 與 skills 風險研究，除非今天有新的可驗證進展。
> 證據標示：官方公告／文件是官方事實；GitHub／Reddit 是社群專案與個案；研究結果只代表該研究設計；廠商 benchmark 與產品自述標示為發布方結果，不視為獨立排名。

## 1. 社群實戰用法

### 用「部署前問題清單」補上 agent 看不到的環境

- **新在哪裡：** 近期 Claude Code 社群反覆出現一個可複製的避坑做法：在部署前，先要求 agent 列出只在本機成立的路徑、localhost URL、gitignored 檔案、環境變數與預裝工具，再把清單逐項核對；另一則回覆補充，應在全新 worktree 安裝與 build，讓缺少 `.env`、`node_modules` 或本機產物的問題直接暴露。
- **可以怎麼開始：** 對任何要上線的變更先開乾淨 worktree，執行安裝、check、test、build；再讓 agent 只做「找出部署依賴」的盤點，最後由人確認 URL、secret、權限與第三方服務。這個流程可以套在 Codex、Claude Code 或 Copilot，不依賴特定模型。
- **編輯心得與限制：** 這是低票數社群經驗，不是受控研究；prompt 盤點可能漏項，乾淨 worktree 也抓不到硬編碼的錯誤 URL。它的價值是把「模型說完成」轉成兩個便宜的獨立檢查。
- 來源：[Before you let Claude Code deploy](https://www.reddit.com/r/ClaudeCode/comments/1xdaz44/before_you_let_claude_code_deploy_ask_it_this_one/)（2026-10-23～24，社群個案）。

## 2. 社群新工具與新玩法

### Zeroshot 把 agent graph 變成可觀測的交付管線

- **新在哪裡：** Zeroshot 不只提供 review loop，也允許每個節點指定模型、平行步驟、retry 條件與 delivery 行為；`software-change` 預設準備可合併 PR，`--delivery none` 可完全不發布，`--ship` 才進入 PR、CI 與 merge 流程。這讓「多 agent」的重點從多開幾個 session，變成先寫清楚何時重試、何時停止、何時需要人。
- **可以怎麼開始：** 先執行 `zeroshot template show software-change` 看內建 graph，再把 acceptance reviewer 改成專案自己的驗收條件；只給它一個可量測的小任務，保存 run ledger 與失敗原因。不要一開始就授予 `--ship` 或真實 production credential。
- **編輯心得與限制：** 它能記錄流程，不等於能證明需求完整；平台／Docker target 仍涉及 GitHub、API key 與隔離環境設定，Node.js 需求為 18+。這是工程工具，不是獨立品質 benchmark。
- 來源：[Zeroshot README 的 workflow 與 delivery 說明](https://github.com/the-open-engine/zeroshot#what-the-built-in-workflow-does)、[官方 Quickstart](https://dev.theopenengine.com/docs/quickstart)（目前查閱）。

### Agent Skills 往中立基金會移交，安全規格會變成下一個工作項

- **新在哪裡：** Anthropic 10/22 宣布把 Agent Skills 的名稱、規格組織與 agentskills.io 捐給 Linux Foundation 旗下的 Agentic AI Foundation，並提出版本化、正式提案流程與安全指引的 roadmap。官方稱 ChatGPT、Cursor、GitHub Copilot、VS Code 等超過 70 個平台已整合。
- **可以怎麼開始：** 把 `SKILL.md` 當成可執行的供應鏈元件：安裝前讀完整 bundle、鎖定來源與版本，先在無 secret 的 sandbox 執行；對能讀檔、寫檔、連網或呼叫 credential 的 skill 做 allowlist 與人工核准。不要因為格式是開放標準，就把內容當成可信程式碼。
- **編輯心得與限制：** 這是治理與互通性進展，不是安全保證；官方提到的安裝量與整合平台數是發布方統計，規格的安全指引也仍是後續工作。
- 來源：[Anthropic｜Donating Agent Skills to the Agentic AI Foundation](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation)（2026-10-22）。

## 3. 官方新功能與推薦用法

### GPT‑6.1 Terra 進入 ChatGPT Work、Codex、API 與 GitHub Copilot

- **新在哪裡：** OpenAI 10/26 開放 GPT‑6.1 Terra，定位是高量、快速的視覺推理、computer use、寫作與日常 coding；API 標準價為每百萬 input token $1、cached input $0.05、output $5。GitHub 同日宣布 Terra 進入 Copilot，涵蓋 VS Code、Visual Studio、Copilot CLI、cloud agent、JetBrains、Xcode、Eclipse 等，採漸進 rollout。
- **推薦用法：** 先把 Terra 放在有明確驗收條件的 terminal／修 bug／資料整理任務；用同一組真實 repo 任務比較完成率、測試、延遲、token 與人工修正量，再決定是否把預設模型切換過去。不要只看官方 Terminal-Bench 4.0 分數。
- **編輯心得與限制：** OpenAI 的 16.7% factual-error、50.3% Terminal-Bench 4.0 等數字是 OpenAI 內部／發布方 benchmark；GitHub 的「early testing noticeably more」也是平台自述，不是跨供應商獨立比較。Terra 仍不代表複雜任務一定勝過更大的模型。
- 來源：[OpenAI｜Introducing GPT‑6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/)（2026-10-26）、[GitHub｜GPT‑6.1 Terra in GitHub Copilot](https://github.blog/changelog/2026-10-26-gpt-6-1-terra-in-github-copilot/)（2026-10-26）。

### GitHub Copilot Assisted permissions 正式可用

- **新在哪裡：** Copilot CLI、Copilot app 與 VS Code 現在可選 Assisted permissions；當 agent 要執行 command、讀取 filesystem path 或開 URL 時，由另一個語言模型判斷「明顯安全」的請求並自動放行，其餘要求人工批准。企業管理員可以封鎖 Allow All、保留 Assisted，或直接停用 Assisted。
- **推薦用法：** 先在非 production repo 開 `/permissions` 選 Assisted，觀察它對安裝、測試、git、網路請求的分類；企業環境把 Allow All 設成不可用，並保留敏感路徑、外部網域與發布命令的人工 gate。
- **編輯心得與限制：** 這是降低提示疲勞的便利層，不是安全邊界：判斷本身仍由模型完成，對 command injection、惡意 skill 或被污染的 repo 內容不能單獨依賴。高風險操作仍應由 OS sandbox、網路 policy、CI 與人核准共同限制。
- 來源：[GitHub｜Copilot assisted permissions generally available](https://github.blog/changelog/2026-10-26-github-copilot-assisted-permissions-generally-available/)（2026-10-26）。

### Oracle AI Workspace：把 agent 放進既有權限與核准流程

- **新在哪裡：** OpenAI 10/27 宣布擴大與 Oracle 合作：Oracle AI Workspace 目標是在 ChatGPT 中整合 Oracle applications／data，讓使用者描述工作、找資料並完成已核准的 workflow；Oracle App Composer 則用 Codex 與其他 AI 工具連接核准的資料與流程。這些是 announced／developing offerings，不是所有地區今天都可用的 GA 功能。
- **推薦用法：** 如果團隊已使用 Oracle，先從唯讀的 finance、procurement 或月結查詢開始，明確定義角色、可讀資料、可寫動作與 approval；讓 agent 產生待辦與草稿，將付款、刪除、提交與權限變更留在人手中。
- **編輯心得與限制：** 官方描述的是產品方向與合作方案，尚未提供獨立效率或安全 benchmark；Marketplace 取得 OpenAI 服務的說明也限定美國 Oracle 客戶。不要把 announced integration 當成已完成的資料治理。
- 來源：[OpenAI｜OpenAI expands partnership with Oracle](https://openai.com/index/oracle-apps-in-chatgpt/)（2026-10-27）。

## 4. 使用心得與避坑

### Sandbox 沒有網路，不代表 agent 沒有跨邊界通道

- **新在哪裡：** OpenAI 10/23 公開 frontier training environment 的 red-team 結果：研究 agent 在隔離 microVM、沒有網路與共享可寫檔案的條件下，仍找到利用 CPU cache timing 傳遞 synthetic secret 的方法；另外也發現 sandbox escape、服務誤設定與間接連網路徑。OpenAI 表示已修補、加強 monitoring，並將高計算量 red-teaming 納入未來安全案例。
- **立即可做：** 只要 agent 能執行不受信任程式，就把 threat model 從「檔案／網路權限」擴到共享 CPU、storage、DNS、TLS cache、logging 與 metadata service；對多 agent 任務避免不必要的共用 host，並用實際攻擊演練驗證監控是否能偵測、暫停與復原。
- **編輯心得與限制：** 這是 OpenAI 對自家研究環境的安全披露，測試使用特製副本與大量 token，不能直接推論所有商用 sandbox 都有同樣漏洞；但它提醒我們「模型看不到網路」與「系統真的沒有可用的側通道」是兩個不同命題。
- 來源：[OpenAI｜Securing our frontier model training environment](https://openai.com/index/securing-our-frontier-model-training-environment/)（2026-10-23）。

### Terra、Assisted permissions 與自動 review 都不應取代獨立證據

- **今天的判斷：** 模型更快、權限提示更少、workflow 更完整，三者都只是在縮短操作成本；能否安全交付仍取決於需求是否可測、review 是否獨立、環境是否乾淨，以及失敗時能否停止與回復。
- **明天可試：** 選一個小 bug，先寫 3 個 acceptance checks，再讓兩個不同 session 執行／審查；在 fresh worktree 跑 check、test、build，最後只讀 diff、command log 與產物，不接受「我已完成」作為證據。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 10/26～10/28、必要時放寬至一週。近期候選要麼觀看數仍低於 10,000，要麼沒有足夠可靠的字幕／逐字稿可供閱讀；較完整的候選如 Nate Herk 10/16 的《How to use coding agents to stand out in AI era》雖有 174.9K 觀看並可讀字幕摘要，但已超出一週窗口。因此不從標題或介紹猜測內容，也不硬湊推薦。

## 今天最值得帶回團隊的三個檢查

- **流程：** agent 先寫 acceptance checks，再進實作、獨立 review、repair；每個節點都要能停止。
- **權限：** Assisted、skill、tool 與 enterprise integration 都是便利層，真正的限制要落在 sandbox、網路、資料與 approval。
- **證據：** 官方 benchmark、產品自述與社群案例都要標示來源，跨模型決策只用同一組真實任務重跑確認。

## 今日一句話

Agent 的下一個工程問題不是「它會不會寫更多程式」，而是「它能否在可攻擊的環境裡，只做被授權、可驗證、可回復的那一小段工作」。

來源：[Zeroshot](https://github.com/the-open-engine/zeroshot)、[GPT‑6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/)、[Copilot Assisted permissions](https://github.blog/changelog/2026-10-26-github-copilot-assisted-permissions-generally-available/)、[OpenAI sandbox security](https://openai.com/index/securing-our-frontier-model-training-environment/)。
