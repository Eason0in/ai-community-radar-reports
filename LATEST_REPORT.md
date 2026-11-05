# AI 情報日報｜2026-11-05

> 搜尋範圍：以 Asia/Taipei 2026-11-03～11-05 為主，優先採用 11/4～11/5 的官方公告、原始 repo／文件與第一手事件紀錄。官方公告是官方事實；廠商 benchmark、產品自述與作者數字均標明，不直接等同獨立驗證。昨天已報題目若沒有新進展不重複。

## 1. 社群實戰用法

### Context Graph 先給 agent「候選依賴」，再讓它回到程式碼驗證

- **新在哪裡：** Postman 11/04 分享一個 17 題、每題各跑一次的 GPT-6.1 Terra 對照測試：先給 Context Graph 的 API／服務關係，再讓 agent 查 repo；相較只靠程式碼搜尋，廠商回報 input tokens 少 43%、模型工作時間少 42%、tool calls 少 29%。這是 Postman 自行設計與執行的 benchmark，不是獨立評測。
- **可以怎麼開始：** 先挑一個你知道答案的問題，例如「哪些服務直接呼叫 billing-api？」；讓 graph 產生候選清單，agent 逐一打開 call site、確認 endpoint／SDK 操作，再標成「已證實」或「待確認」。CLI 可用 `postman context-graph ask "Which services directly call billing-api over HTTP?" --wait`，也可透過 MCP 查詢。
- **編輯心得與限制：** 它減少的是跨 repo 找路，不是替你證明依賴真的存在。Postman 自己也提醒 inventory 題會帶來較多 false positives；涉及 production impact 時，還要核對部署與 runtime data。適合 API 變更前的 impact analysis，不適合把 graph 結果直接當 merge 依據。
- 來源：[Postman 實測與操作步驟](https://blog.postman.com/context-graph-makes-gpt-6-1-terra-42-faster-and-uses-43-less-tokens/)（2026-11-04，廠商 benchmark；中可信於流程、低於獨立效能證據）。

## 2. 社群新工具與新玩法

### Vercel Workflow SDK：用 domain token 擋住重複啟動

- **新在哪裡：** Workflow SDK 5.4.0 的 `start()` 可在同一個 atomic step 接受 run 並 claim hook；相同 token 的第二次啟動會安全失敗，不再需要先 `getHookByToken()` 再 `start()`，因此消除兩次呼叫之間的 duplicate-start race。
- **可以怎麼開始：** 把訂單、發票、匯入任務或 request ID 當 idempotency token；捕捉 `HookConflictError`，把重複請求導向原 run 的 `resumeHook`。先對 webhook、重試與使用者連點寫一個「同 token 只能有一個 run」測試，再升級 `workflow` 5.4.0。
- **編輯心得與限制：** 這解決的是 admission race，不是整條 workflow 的 exactly-once 副作用；寫入外部服務仍要有自己的冪等鍵、重試策略與 retention 設定。文件仍把部分參數標成 experimental，升級前要鎖版本並跑回歸。
- 來源：[Vercel Workflow SDK changelog](https://vercel.com/changelog/atomic-start-hooks-in-the-workflow-sdk)（2026-11-04，官方 changelog，高可信於 API 變更；實際穩定性需自行測試）。

## 3. 官方新功能與推薦用法

### OpenAI 收購 Pierre：Codex 往「寫、看、審、存」程式碼的工作面延伸

- **新在哪裡：** OpenAI 11/04 宣布將收購 Pierre Computer；Pierre 的 Trees、Diffs 已在 Codex app 用於瀏覽檔案與 review，Code Storage 則提供以 Git 追蹤程式碼歷史的服務。交易尚待監管核准，完成前兩家公司仍獨立；Pierre 的 open-source projects 會維持開源。
- **推薦用法：** 現在就把 agent 產出的 branch、diff、決策與測試證據視為可 review 的交付物；不要等待「Codex 變成新 GitHub」才整理流程。若評估 Code Storage，先確認資料出口、Git 相容性、權限、審查與既有 remote 的備份策略。
- **限制：** 這是公司公告與產品方向，不是今天即可使用的新服務，也沒有公布交易金額、上線時程或客戶遷移方案；不要把收購宣言當成已完成的產品能力。
- 來源：[OpenAI 收購 Pierre 公告](https://openai.com/index/openai-to-acquire-pierre/)（2026-11-04，官方公告，高可信於交易狀態與已存在的元件；未來產品仍待確認）。

### Images 2.6：用低 complexity 做快改，用 medium／high 換細節與一致性

- **新在哪裡：** Images 2.6 已在 ChatGPT、Codex 與 API 推出；OpenAI 宣稱生成速度提升 50%，可產生 GIF，API 提供 Flare／Sunburst、局部 image markup、SVG export 與新的 complexity 參數。ChatGPT／Codex 為全訂閱層級可用，API 模型另看定價。
- **推薦用法：** 先用低 complexity 做局部修圖、尺寸與文字版面迭代；角色、產品或品牌細節反覆漂移時，再把 complexity 調到 medium／high，並固定 reference image、畫布與驗收清單。要做社群動圖，可先要求六格 sprite sheet，再檢查每格尺寸與首尾接合。
- **限制：** 「50% faster」、早期客戶案例與每天生成量都是 OpenAI 自述；GIF、SVG 與跨輪一致性仍應在你的素材與文字語言上實測，且輸出仍需檢查版權、品牌與安全政策。
- 來源：[OpenAI Images 2.6](https://openai.com/index/introducing-images-2-6/)（2026-11-04，官方產品公告；速度與品質數字為廠商結果）。

### GitHub Copilot 進入 Xcode 內建 Coding Assistant 公開預覽

- **新在哪裡：** GitHub 11/04 宣布 Copilot 可直接作為 Xcode 內建 coding assistant 的 provider，從 Xcode 27.3 beta 開始公開預覽；原本獨立的 GitHub Copilot for Xcode extension 仍然存在，所有 Copilot plans 都支援。
- **可以怎麼開始：** 在 Apple Developer Downloads 安裝 Xcode 27.3 beta（需要 macOS Tahoe 26.6+），到 `Xcode > Settings > Intelligence` 設定 Copilot。先用一個可丟棄的 Swift 專案比較內建 assistant 與原 extension 的模型選擇、權限提示、上下文範圍與 premium request 消耗，再決定團隊是否導入。
- **限制：** 這是 beta；GitHub 沒有在公告中列出內建路徑可用的完整功能、模型差異或穩定版時間，不能把 extension 的行為推論成 Xcode 內建 assistant 的行為。
- 來源：[GitHub Changelog](https://github.blog/changelog/2026-11-04-github-copilot-is-now-available-in-xcodes-coding-assistant/)（2026-11-04，官方 changelog，高可信於支援範圍與安裝條件）。

## 4. 使用心得與避坑

### 第三方桌面 app 不應默默改寫 agent 的全域設定

- **發生什麼事：** Postman GitHub issue #14370 的 macOS 使用者提供 log、`~/.codex/config.toml` 與 `~/.claude/settings.json` 證據：Postman desktop 12.33.4 以 `auto-existing-upgrade` 安裝 Codex／Claude Code plugin、remote MCP 與 SessionStart hook；hook 會要求任何非 trivial API 工作載入 Postman skill。issue 也指出 installer 嘗試寫入 Codex hook 的 trust state，但作者沒有把 trust record 過度解讀成已證明的使用者互動。
- **可以怎麼開始：** 只要近期更新過 Postman，就檢查 `~/.codex/config.toml`、`~/.claude/settings.json`、`~/.copilot/settings.json` 是否突然出現 Postman；核對 marketplaces、plugins、MCP URL、SessionStart hooks 與 trusted hash，再決定停用／移除。先備份設定，移除後再 grep 一次，因為 remover 是否清掉 Codex trust record 仍未有完整官方說明。
- **編輯心得與限制：** 這是公開 issue 的個案與後續回報，不等同已證明資料外洩；Postman 回覆表示會讓既有使用者的 opt-in 更清楚並檢視 hook 行為，但 issue 仍是開放狀態。真正的避坑是把 agent 設定、hooks、MCP 與全域 instructions 當成供應鏈與權限邊界，任何更新都要可 diff、可回復。
- 來源：[GitHub issue #14370](https://github.com/postmanlabs/postman-app-support/issues/14370)（2026-10-25 起持續更新，第一手使用者證據；事件仍待官方完整修正說明）、[事件整理與檢查方式](https://theproofdesk.com/postman-desktop-auto-installs-claude-code-codex-plugins-hook)（2026-11-04，媒體整理；中可信）。

### Cyber agent 的「成功 exploit」也要驗證它走的是指定漏洞

- **發生什麼事：** OpenAI 11/04 分享一條 Linux kernel vulnerability discovery → dynamic validation → exploitability assessment → patch generation → human review pipeline；官方回報一次 mid-October run 驗證 1,724 個候選、產生 948 個 LPE exploits，成本約 121 萬美元 API credits。更值得注意的是，早期有 200 個 exploit 看似成功，但人工審查發現其中 20 個其實利用了另一個 0-day，之後才加上獨立檢查。
- **可以怎麼開始：** 把 agent 的「結果成立」拆成兩個 gate：一是拿到預期結果，二是拿到結果的路徑與證據確實符合指定假設；對 security、migration、資料修復這類任務，保留隔離環境、原始 log、最小 PoC、輸出 diff 與第二個 verifier，不要只看 exit code 或成功文字。
- **編輯心得與限制：** 948、成本與「10 種新 exploitation techniques」都是 OpenAI 自行研究結果；研究使用受控環境與人審，不能推論成一般 agent 可安全地自主攻擊。它最可移植的教訓不是數字，而是「驗證結果，也驗證產生結果的路徑」。
- 來源：[OpenAI A thousand fewer paths to root](https://openai.com/index/a-thousand-fewer-paths-to-root/)（2026-11-04，官方安全研究；數字為廠商研究，流程與已揭露限制高可信）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-11-03～11-05，並放寬至一週。找到 IBM Technology 的 **Context-Aware Coding: Give AI Agents the Right Context**（2026-11-02，約 46,728 觀看），主題符合 agent coding；但本次無法獨立讀回可驗證的完整字幕／逐字稿，只能看到第三方 transcript index 的摘要與時間點，因此不把它列為推薦，也不從標題或介紹猜測內容。

## 今天最值得帶回團隊的三個檢查

- **依賴：** graph、索引與 agent search 只能產生候選，最後仍要回到 call site、runtime 與原始證據。
- **權限：** agent 的 plugins、MCP、hooks、全域設定與 trusted hash 都是供應鏈邊界，更新後要能 diff 和回復。
- **驗證：** 任何「成功」都要同時驗證結果與路徑；生成速度變快時，更需要獨立 verifier、隔離環境與人審。

## 今日一句話

AI agent 的新瓶頸不是再多一個工具，而是讓跨 repo 的上下文、全域設定與自動化結果都能被追溯、限權與獨立驗證。
