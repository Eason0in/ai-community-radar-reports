# AI 情報日報｜2026-11-01

約 4 分鐘閱讀。今天的主線是：AI agent 不只是在寫程式，還在管理記憶、工具、評測與背景服務；而 10/29 的擴充套件供應鏈事件提醒我們，這些邊界必須一起審核。

> 查核範圍：優先 2026-10-30～11-01；補充最近一週仍有直接實用價值的進展。昨天已報的 Mistral Large 4、Genie 4、Cursor Agent SDK、ESP32 模擬器、Octomind 與 October Harness，今天不重複報導。
> 證據標示：官方公告／文件是官方事實；GitHub 專案與 Reddit 是社群工具或個案；廠商自行公布的 benchmark、效率數字與成本估算均標示為發布方結果。

## 1. 社群實戰用法

### 不要讓多個 agent 共用一條超長對話

- **新在哪裡：** r/ClaudeCode 一篇 10/27 的實戰討論，描述的做法是由一個主 agent 判斷任務難度、寫成 ticket／工作說明，再讓不同模型各自取得隔離 worktree 執行；另一個 agent 負責 review。留言也有人回報，將主 agent 的指示寫入檔案、重新開乾淨 session，比讓 sub-agent 在原對話裡不斷聊天更省 token。這是社群經驗，不是控制實驗。
- **可以怎麼開始：** 先固定五個欄位：目標、允許修改的檔案、驗收命令、預算／timeout、交接輸出；每個任務獨立 worktree，完成後只提交 diff、測試結果與未解風險。複雜任務才升級到更強模型或額外 reviewer。
- **編輯心得與限制：** worktree 能隔離檔案，不會自動隔離錯誤假設、API key 或網路權限；多 agent 也可能增加協調成本。適合用在可拆分、可測試的 repo 任務，不適合拿來掩蓋沒有清楚規格的工作。
- 來源：[r/ClaudeCode：Claude Max 20x weekly depleted in less than 2.5 days](https://www.reddit.com/r/ClaudeCode/comments/1xgxv58/claude_max_20x_weekly_depleted_in_less_than_25/)（2026-10-27，社群個案，中低可信度）。

## 2. 社群新工具與新玩法

### EvoScientist v0.4.0：每個專案一個背景 agent 服務

- **新在哪裡：** GitHub 專案 10/31 發布 v0.4.0，將每個專案的背景服務、記憶 worker 與對話 surface 收斂到一個可停止的服務；同時加入 GPT-6.1 Terra、較嚴格的 shell sandbox 與更安全的更新流程。這是專案自述，不代表獨立品質驗證。
- **可以怎麼開始：** 只在一個非關鍵專案試用；先確認服務的工作目錄、模型金鑰、瀏覽器來源限制與更新檔來源，再用 EvoSci server stop 驗證停止路徑。把 rubric／goal 當成驗收條件，不要讓背景服務直接擁有 production token。
- **編輯心得與限制：** 背景服務讓長任務與多 surface 更順，但也把常駐程序、記憶與權限疊在一起；macOS 目前標示 Apple silicon 限制，仍應先讀 release notes 和實際權限。
- 來源：[EvoScientist v0.4.0](https://github.com/EvoScientist/EvoScientist)（2026-10-31，GitHub 專案，待實測）。

### llama.cpp 夜間版：本地推論更像可驗證的發布物

- **新在哪裡：** llama.cpp 在 10/30～31 連續發布 b12017～b12024；變更包括 OpenCL fwht、Gemma 4 影像尺寸處理、Qwen3-Coder think block 與 Responses API 的修正，並提供多平台二進位檔與 GitHub attestation。b12024 是 pre-release，不能當穩定版。
- **可以怎麼開始：** 若要把本地模型接到 agent，先固定一個 nightly、記下 commit／attestation 與後端，再跑自己的 tool-call、長上下文與多模態 smoke tests；不要因為有 nightly binary 就跳過版本鎖定。
- **編輯心得與限制：** 夜間版對硬體支援與模型相容性很有價值，但更新頻率高，使用者要自己承擔回歸與效能差異。
- 來源：[llama.cpp releases](https://github.com/ggml-org/llama.cpp/releases)（2026-10-30～31，GitHub 官方專案）、[b12020 build attestation](https://github.com/ggml-org/llama.cpp/attestations/62071228)（2026-10-31）。

## 3. 官方新功能與推薦用法

### Codex CLI 0.166.0：把長 session 的恢復與診斷補齊

- **新在哪裡：** OpenAI Codex 10/29 發布 0.166.0：TUI 加入可用鍵盤選取、搜尋與定位的 transcript 操作；Markdown 在 async question 與 transcript 回覆中一致呈現；codex queue --resume 可恢復排隊後卸載的 thread；codex doctor --network-only 可只檢查設定、連線與 WebSocket；同版也把 GPT-6.1 Terra 加入 bundled、Vertex AI 與 Bedrock catalog。
- **推薦用法：** 先在長任務中用 transcript search 找到「最後一次有效決策」，再用 queue resume 接續；遇到只在公司網路失敗的情況，先跑 network-only doctor。任何 MCP 或外部工具恢復後仍要重新確認權限與工作目錄。
- **限制：** release notes 說明的是功能已加入，不代表所有平台、登入方案或模型供應商都同時可用。
- 來源：[OpenAI Codex 0.166.0 release](https://github.com/openai/codex/releases/tag/rust-v0.166.0)（2026-10-29，官方 release）。

### GitHub Copilot Memory／Dreaming：把團隊習慣變成可審核上下文

- **新在哪裡：** GitHub 10/28 宣布 Copilot Memory 在付費方案一般可用，可跨 Copilot app、CLI、VS Code、cloud agent、code review、Slack、Teams 與 Mobile 保存個人偏好和 repository conventions；Dreaming 則進入 public preview，會整理個人記憶、repository instruction／skill 與 code-review guidance，對 checked-in 變更提出 PR。
- **推薦用法：** 先只寫低風險、可驗證的規則，例如測試命令、PR 摘要格式與不可碰的目錄；開啟 repository dreaming 前，先設定誰能 review 它提出的 instruction／skill PR，並定期刪除過期記憶。
- **限制：** Dreaming 是 opt-in 且會消耗 AI credits；GitHub 提到的「93% 更遵循偏好、42% 工作流更有效率」是其 public-preview review 的發布方結果，不是獨立研究。記憶若過時，反而會讓 agent 一致地做錯事。
- 來源：[GitHub intelligence：Memory 與 Dreaming](https://github.blog/changelog/2026-10-28-github-intelligence-puts-your-code-context-and-history-to-work/)（2026-10-28，官方 changelog）。

### Microsoft Copilot 評測：用合成企業環境測時間脈絡與跨部門流程

- **新在哪裡：** Microsoft Research 10/30 公開 Industry Evaluation Data Generation Platform：用公開的 O*NET、職缺與 SEC 資料建立不含客戶資料的合成 tenant，模擬使用者、會議、郵件、文件與隨時間變化的組織，再自動產生並驗證產業特定查詢。
- **推薦用法：** 做企業 RAG／agent 評測時，不要只用問答題；加入跨日期的「上週決定了什麼」、跨角色的責任追蹤、引用正確性、敏感資料隔離與 action approval。每次版本從同一份設定重建資料，才能比較回歸。
- **限制：** 39% 品質改善、每份資料集約 10 萬美元節省與 30 萬美元專案節省都是 Microsoft 的內部估計／結果；合成環境再像，也不能完全代表真實租戶的語言、權限與例外流程。
- 來源：[Microsoft Research：From synthetic enterprise data evaluations to real Microsoft Copilot AI confidence](https://www.microsoft.com/en-us/research/blog/from-synthetic-enterprise-data-evaluations-to-real-microsoft-copilot-ai-confidence/)（2026-10-30，官方研究）。

## 4. 使用心得與避坑

### Cursor marketplace 的 Claude Code 擴充套件事件：安裝來源就是安全邊界

- **發生什麼事：** Cursor 10/29 公告，VS Code Marketplace 中的 Anthropic.claude-code 2.1.312／2.1.313 在美西時間 02:27～13:35 可被下載；惡意修改版嘗試安裝持久 SSH backdoor。Cursor 表示已下架、暫停 marketplace、輪替金鑰並重建服務；Microsoft Security 確認目前證據指向 Cursor marketplace，Microsoft Visual Studio Marketplace 與 npm 的官方套件未受此事件影響。
- **立即怎麼做：** 檢查是否曾從 Cursor marketplace 安裝上述版本；若有，先隔離主機，再檢查 LaunchAgent、cron／Startup 與使用者 SSH key 等持久化位置，撤銷／輪替可能暴露的 token，最後只從官方來源重裝。惡意程式可能執行失敗，所以「沒看到反向連線」不能當成已排除。
- **編輯心得與限制：** 這不是「Claude Code 本身被入侵」的證據，而是 marketplace／更新鏈的供應鏈事件；也提醒我們，AI extension、MCP、skill 與 agent settings 都應像依賴套件一樣鎖版本、審來源、留安裝紀錄。
- 來源：[Cursor security notice](https://cursor.com/blog/claude-code-extension-security-notice)（2026-10-29，官方事件公告）、[Microsoft Security 分析](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/)（2026-10-30，第一手技術分析）、[Claude Code v2.1.316 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.316)（2026-10-31，官方 release；含相關限制修正與版本說明）。

### 最小權限要落到每個工具，不只寫在 agent system prompt

- **今天的判斷：** Microsoft Foundry 10/30 的建議是讓 agent 只拿到當前任務所需的最小工具權限，並綁定正確身份與決策紀錄；這與 Cursor 事件的教訓相同：人類批准畫面、sandbox 或「官方名稱」都不能替代實際的權限與供應鏈檢查。
- **可以怎麼開始：** 將讀取、寫入、網路、secret、部署分開授權；每次外部副作用留下 actor、工具、目標、結果與人工核准者；對 extension／MCP／skill 做 lockfile、hash 或 attestation 驗證。
- 來源：[Microsoft Foundry：Designing Least-Privilege Tool Access for AI Agents](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/designing-least-privilege-tool-access-for-ai-agents-with-microsoft-foundry/4567029)（2026-10-30，官方技術文章）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-10-30～11-01、必要時放寬至一週。找到的候選沒有同時提供可靠字幕／逐字稿、超過 10,000 觀看、且具實測／教學／技術拆解的證據；因此不從標題或介紹猜測內容，也不硬湊影片。

## 今天最值得帶回團隊的三個檢查

- **來源：** extension、MCP、skill、模型 binary 都要記錄來源、版本與可驗證的 hash／attestation。
- **隔離：** 多 agent 用獨立 worktree，但 token、網路、檔案與部署權限也要分層。
- **評測：** 用可重建的合成或 fixture 資料測時間脈絡、引用、工具副作用與回歸，不只測一輪 demo。

## 今日一句話

Agent 的真正信任邊界，已經從「模型回答得對不對」擴大到「它記得什麼、裝了什麼、能碰什麼，以及我們能不能重現驗收」。
