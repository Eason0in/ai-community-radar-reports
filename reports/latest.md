# AI 情報日報｜2026-10-25

約 4 分鐘閱讀。今天的主線是：AI coding agent 開始被放進團隊的通知、用量治理與安全驗證流程；模型端則往更長 context、更快的小決策與可開放權重發展。

> 截稿時間：2026-10-25 08:00（Asia/Taipei）。
> 查核範圍：優先 2026-10-23～10-25；補充最近一週仍有直接實用價值的更新。避開 10/24 已報的 IQuest-Q1、Google Agent Compute Engine、Claude Code 2.1.309、OpenCode Console 事件與 pdd-kit。
> 證據標示：官方公告／文件是官方事實；Reddit、Hacker News 是社群訊號；廠商 benchmark 只代表廠商測試，未視為獨立排名。

## 1. 社群實戰用法

### 把 agent 遵循規則的問題，拆成可觀測的工作流

- **新在哪裡：** 10/24 的 Claude 工作流分享提出一套改善 agent adherence 的做法：把確定性工作移到 script，用 hook 讓子 agent 讀同一套核心規則，主動清理過長 context，必要時在 compaction 後重讀規則，最後分析 session log 找出偏離點。這是個人經驗，不是受控實驗，原帖互動也很少。
- **可以怎麼開始：** 先挑一個重複任務，把「格式檢查、測試、檔案清單」寫成 script；再加一個 hook 驗證 agent 是否讀到專案規則。每次失敗記錄實際 prompt、tool output、compaction 前後與最後差異，不要只記 agent 的自我解釋。
- **編輯心得與限制：** 真正可複製的是把 deterministic work 外移、把 session 變成可稽核事件；「我很少再遇到問題」仍是作者自述，不能當成功率證據。
- 來源：[Reddit｜Workflow to Improve Claude Code Agent Adherence](https://www.reddit.com/r/ClaudeWorkflows/comments/1xeiosb/workflow_workflow_to_improve_claude_code_agent/)（2026-10-24，社群實戰，低互動個案）。

### 用「可重播」而不是多開 terminal 管理背景 agent

- **新在哪裡：** 10/23 HN 的 Show HN「Corgi」把 agent、dev server、worktree 和資源用量放進類 tmux 的 terminal multiplexer；它能看哪個 agent 正在工作、需要你處理或已完成，也能回看檔案變更。
- **可以怎麼開始：** 先用一個小 repo 開兩個 worktree：一個跑 agent、一個跑測試或 dev server；只有在 status、diff 與測試都看得懂時才增加並行數。Corgi 官方提供 macOS、Linux、WSL 安裝方式，也支援 Claude Code、Codex、Pi、OpenCode。
- **編輯心得與限制：** 這解決的是工作區可見性，不是 agent 品質；官方頁面仍是早期工具介紹，不能推論長期穩定性或 token 節省。
- 來源：[Corgi 官方網站](https://corgi.computer/)（工具說明）、[Hacker News｜Show HN](https://news.ycombinator.com/front?day=2026-10-23)（2026-10-23，125 points／42 comments，社群訊號）。

## 2. 社群新工具與新玩法

### Kimi K3.1 Pro：先用 hosted API，別急著等 open weights

- **新在哪裡：** Moonshot 10/23 發布 Kimi K3.1 Pro 與 Highspeed，提供 1M token context，可在 Kimi、Kimi Work、Kimi Code 與 API 使用；完整權重預計 11/4 才釋出。這讓長程 coding、文件與 agent 任務可以先用服務端試跑。
- **可以怎麼開始：** 用 Kimi Code 或 API 固定同一組 5–10 個真實任務，記錄完成率、重試、延遲、token 與人工修正，再和現有模型比較。長 context 不等於應該把整個 repo 一次塞進去，先用檔案索引與分段摘要。
- **限制：** 官方 Terminal-Bench 4.0 的 65.7% 是廠商結果，Kimi Code Bench 3.0 也是內部 benchmark；目前 hosted access 與預計的 open weights 不是同一種可控性，硬體需求、授權與實際成本仍待確認。
- 來源：[Kimi K3.1 Pro 官方技術文章](https://www.kimi.ai/blog/kimi-k3-1-pro)（2026-10-23，官方公告與廠商 benchmark）、[HN 討論](https://news.ycombinator.com/item?id=50212065)（社群反應）。

## 3. 官方新功能與推薦用法

### OpenAI Decisions API GA：把小判斷從大型 agent loop 拆出來

- **新在哪裡：** OpenAI 10/22 宣布 Decisions API 正式可用，以 GPT-6 Luna 處理分類、路由、下一步動作等 bounded decisions；官方稱相較 Responses API 最快可達 10 倍，並新增 GPT-Live、prompt caching、US／EU inference residency、原生 JSON 與圖片輸入，以及單次最多 400 個問題。
- **推薦用法：** 把「是否轉人工」「選哪個工具」「是否需要再查一次」這種輸出範圍有限的判斷獨立成 schema，對每個決策保留輸入、候選選項、confidence、延遲與 fallback。只有需要開放式產出的步驟才交給完整 agent。
- **限制：** 10 倍是官方效能宣稱；文章沒有替你的 prompt、區域、流量與 cache 命中率提供保證。先用自己的 trace 做 p50／p95、錯誤率與總成本比較。
- 來源：[OpenAI｜Build more responsive apps with the Decisions API](https://openai.com/index/decisions-api/)（2026-10-22，官方產品公告）。

### GitHub Copilot 進 Teams：從通知到 PR，但 review 仍不可省

- **新在哪裡：** GitHub 10/23 更新 Teams 整合：收到 issue 通知後，可在頻道、群組或私人聊天 `@GitHub`，讓 Copilot 調查問題、修 bug 並建立 pull request；團隊仍需測試、review、merge。舊版 GitHub notifications app 會改名 deprecated，並預計 11/16 退場。
- **推薦用法：** 先在低風險 repo 開啟，要求 agent 回傳重現步驟、修改檔案、測試結果與未處理風險；將 Teams 觸發視為「建立候選 PR」，不要直接授予自動合併權。
- **限制：** 這是流程入口的改善，不代表 issue 描述、外部連結或測試環境都可信；仍需檢查 repository scope、branch protection 與 secret exposure。
- 來源：[GitHub Changelog｜Turn notifications into code with GitHub Copilot in Teams](https://github.blog/changelog/2026-10-23-turn-notifications-into-code-with-github-copilot-in-teams)（2026-10-23，官方更新）。

### Copilot 用量 API 開始看見 OpenCode、Claude Code 與 Codex

- **新在哪裡：** GitHub 10/23 在 enterprise／organization 的 1-day 與 28-day 報表加入 `totals_by_client`，可按 `opencode`、`claude_code`、`codex`、`zed`、Copilot CLI 等 client 看 request、session、token 與 model selection mode。
- **推薦用法：** 每週把 client、model、token 與 request count 對照費用、成功率和人工修正；特別注意 request count 是 model calls，不是 prompts，而且 client 是整合傳來的 best-effort 標記，不是可信身份證明。
- **限制：** 需要相應 Copilot Metrics 權限；Copilot code review／cloud agent 的模型多半標成 product-selected 或 unknown，不要把報表誤讀成完整的 agent 行為追蹤。
- 來源：[GitHub Changelog｜Usage metrics API adds usage from tools like OpenCode](https://github.blog/changelog/2026-10-23-usage-metrics-api-adds-usage-from-tools-like-opencode)（2026-10-23，官方更新）。

## 4. 使用心得與避坑

### Claude 形式驗證的新進展：證明範圍比「AI 找到 bug」更重要

- **新在哪裡：** Anthropic 10/22 表示，與 Theorem 合作讓 Claude 對 123 個 open-source library 的 239 個 fuzz entry point 產生並通過 Rocq proof，合計約 1.8 億行 proof；流程也找到一些傳統 fuzzing 不容易碰到的 bug，並公開部分 proof 與可信元件。
- **立即可做：** 如果團隊已有 C／C++ fuzz entry point，先選一個小 library，把「要證明的 theorem、編譯目標、OS／CPU model、輸入大小與 proof checker」寫進驗收紀錄，再和現有 fuzz、ASan、static analysis 並行。
- **限制：** 這不是「程式已無 bug」：官方明確限定單執行緒、static RISC-V binary、固定 memory budget、Linux model，並承認 spec 不完整、caller misuse、x86／ARM／glibc 差異等缺口；proof 也可能耗費數億 token。廠商展示的成功率與成本不能直接外推到 production。
- 來源：[Anthropic｜LLMs are making formal software verification feasible at a much larger scale](https://www.anthropic.com/research/formal-verification)（2026-10-22，官方研究／工程報告）。

### GitHub CLI 的短期 OAuth token：安全性提高，舊 script 可能壞掉

- **新在哪裡：** GitHub CLI v2.103.0 在 public preview 支援 `gh auth login --expiring`，access token 會過期並由 rotating refresh token 自動刷新；GitHub 建議搭配 `gh auth setup-git`，並使用 Git 2.46 以上。
- **立即可做：** 先在非 production automation 的帳號驗證 `gh auth status`、HTTPS credential helper 與 CI 行為；任何外部工具都要每次重新呼叫 `gh auth token`，不要把一次讀出的 token 長期存檔。
- **限制：** 依賴固定 token 的 script、extension 或第三方整合會因 token 過期失效；這個功能是 opt-in，若 workflow 需要長時間不變的 token，先不要切換。
- 來源：[GitHub Changelog｜Opt in to expiring, auto-refreshing OAuth tokens](https://github.blog/changelog/2026-10-21-github-cli-opt-in-to-expiring-auto-refreshing-oauth-tokens)（2026-10-21，官方更新）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室、Tech With Tim、Gary Chen、Matthew Berman 與其他 AI／Agent／AI Coding 頻道，優先查 10/23～10/25、必要時放寬一週。近期候選沒有同時滿足「觀看數超過 10,000、可靠字幕或逐字稿已讀、非 Shorts、不是純新聞、具實測／教學／技術拆解」的硬門檻；因此不從標題、縮圖或介紹猜測內容。

## 今天最值得帶回團隊的三個檢查

- **先拆 bounded decision：** 路由、分類與是否繼續查詢不必每次啟動完整 agent。
- **再量化 agent 使用：** 把 client、model、token、session、測試與人工修正放在同一張週報裡。
- **最後驗證安全邊界：** proof、短期 token、Teams 觸發和長 context 都要記錄「涵蓋什麼」與「沒有涵蓋什麼」。

## 今日一句話

AI agent 的下一個瓶頸不是「能不能再多做一件事」，而是能不能在通知、用量、憑證與證明範圍都清楚的情況下，把事情交給它做。

來源：[OpenAI Decisions API](https://openai.com/index/decisions-api/)、[GitHub Copilot in Teams](https://github.blog/changelog/2026-10-23-turn-notifications-into-code-with-github-copilot-in-teams)、[Anthropic formal verification](https://www.anthropic.com/research/formal-verification)、[Kimi K3.1 Pro](https://www.kimi.ai/blog/kimi-k3-1-pro)。
