# AI 情報日報｜2026-10-30

約 4 分鐘閱讀。今天的主線是：AI coding agent 正逐漸成為 IDE 與作業系統的可插拔工作層，但權限、上下文與 instruction file 也一起變成新的安全邊界。

> 查核範圍：優先 2026-10-28～10-30；補充最近一週仍有直接實用價值的進展。避開昨天已報的 Copilot Fusion、Agentic Workflows、Replica、OpenCode v1.19.5、Gemini 4 Carbon 與 GitHub intelligence，除非今天有新的可驗證進展。
> 證據標示：官方公告／文件是官方事實；GitHub 專案與 Reddit 是社群工具或個案；媒體報導與研究筆記不等於漏洞已被所有環境重現。廠商自己的數字標示為發布方結果。

## 1. 社群實戰用法

### 把 Claude 與 Codex 分成角色，讓 repo 成為共同真相

- **新在哪裡：** r/codex 一個持續更新的實戰討論，描述的不是「兩個 agent 互相聊天」，而是由一個 agent 實作、另一個獨立 review，再用明確的 handoff 傳遞目標、範圍、已知資訊與驗收條件；共同規則與架構放在 repo，個別 agent 的暫時筆記則視為待驗證提示。
- **可以怎麼開始：** 先選一個 15–40k LOC 的小型 bug 或重構，讓實作者只負責變更，reviewer 只讀指定 revision；handoff 固定寫 `Goal / Scope / What’s needed / What’s already known / Done when`，測試與業務規則仍由人確認。
- **編輯心得與限制：** 這是社群經驗，不是獨立效率實驗；雙 agent 會增加 token 與管理成本，且兩邊都可能繼承錯誤假設。真正有用的部分是把對話外的狀態寫成可審核文件，避免靠複製貼上維持上下文。
- 來源：[Claude Code + Codex users：what does your actual workflow/setup look like?](https://www.reddit.com/r/codex/comments/1wyzbib/claude_code_codex_users_what_does_your_actual/)（2026-10-06 發文，2026-10-29 仍有新留言；社群個案，低至中可信度）。

## 2. 社群新工具與新玩法

### Forge：把 coding agent 變成可暫停、可驗收的流程

- **新在哪裡：** GitHub 開源專案 Forge 把任務固定成 `Task → Plan → Approval → Skills → Code → Tests → Review → Handoff`，並要求 agent 顯示計畫、維持核准範圍、跑專案檢查，再留下可續接的摘要；它不是另一個模型，而是包在目前 agent session 外的流程層。
- **可以怎麼開始：** 先在非關鍵 repo 試一個小任務，只開啟 plan、approval、tests 與一次 final review；讀完最終 diff 和測試輸出後再決定是否使用它的 commit／push 流程。不要因為有流程名稱就跳過人工審查。
- **編輯心得與限制：** README 是專案自述，頁面顯示最近一週仍在更新；沒有獨立 benchmark 證明一定省 token 或提高正確率。它的價值更像把「先說清楚、再修改、最後留證據」產品化，適合需要可追溯交接的團隊。
- 來源：[Forge｜Deterministic automation for AI coding agents](https://github.com/daanavcoding/forge)（GitHub 專案，近一週可見更新；社群工具，待實測）。

### instruction file 也要進入 supply-chain review

- **新在哪裡：** Cloud Security Alliance 的 10/27 研究筆記把 `AGENTS.md`、`CLAUDE.md`、Cursor rules、Copilot instructions 與 `SKILL.md` 視為「會說服 agent 的自然語言設定」；`.mcp.json`、`.claude/settings.json`、`.vscode/tasks.json` 等則可能提供真正的 hook、MCP 或環境變數執行能力。兩者串在一起，就會形成新的設定檔供應鏈風險。
- **可以怎麼開始：** 把 instruction／settings 檔列入 code owner review；agent 啟動前檢查檔案來源與最近變更；禁止 agent 自己修改自己的設定；令 Downloads、home directory 與未審核 clone 目錄不作為 agent 工作根目錄。
- **編輯心得與限制：** CSA 是安全研究整理，不代表每個案例都在所有 agent 或瀏覽器成功；但 BleepingComputer 交叉報導了以 Downloads 內惡意 `AGENTS.md` 誘導 Codex 安裝 `function-color` 的案例，足以把它當成實際防守檢查，而不是抽象 prompt injection。
- 來源：[Cloud Security Alliance｜Markdown Is the New Executable](https://labs.cloudsecurityalliance.org/research/csa-research-note-agent-instruction-file-poisoning-20261027/)（2026-10-27，研究筆記）、[BleepingComputer｜AI coding agents hijacked using AGENTS.md](https://www.bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder/)（2026-10-25，媒體交叉報導）。

## 3. 官方新功能與推薦用法

### Android Studio Rabbit 2：Bring Your Own Agent 進入穩定版

- **新在哪裡：** Google Android Developers 10/28 宣布 Android Studio Rabbit 2 stable，能在 IDE 直接選 Claude Agent、Codex、Antigravity 或其他 ACP-compatible agent；Android CLI 也加入遠端真機串流、Compose preview、profiling、quality analyze 與 30+ Android skills，並推出 Claude Code 與 Codex 官方 plugin。
- **推薦用法：** 先讓 agent 在一個小 Compose 畫面完成「讀 code → preview → build → 真機驗證」閉環；把 Android CLI 的 preview、trace 與 quality analyze 當成 agent 的工具，不要只接受它生成的畫面截圖。涉及權限、網路與付款流程時，保留人工 review。
- **同一波值得注意：** AppFunctions beta 讓 app 將功能暴露給裝置或系統 agent；A2UI alpha 可把 agent 回覆轉成 app 自己的 Compose UI；Gemini Nano 4 的 ML Kit Agentic API 則處理函式執行、歷史、編排與 guardrails。這些仍有 beta／alpha 標籤，不宜直接當成穩定生產契約。
- **限制：** 官方公告描述的是產品能力與可用範圍，不是跨 agent 的獨立品質比較；ACP、AppFunctions、A2UI 與 on-device API 的版本與 preview 限制，必須以實際 SDK 文件和 target device 測試為準。
- 來源：[Android Developers｜Agentic and Flexible](https://developer.android.com/blog/posts/build-it-your-way-a-next-era-of-android-development)（2026-10-28，官方公告）。

### OpenAI 更新 Model Spec：把 side effects 與 human agency 寫得更明白

- **新在哪裡：** OpenAI 10/29 更新公開 Model Spec，整理成 faithfulness to human intent、harm minimization、honesty and transparency、human agency、care 五項價值，新增對 context、oversight、agency 與 side effects 的說明，也撤掉多數固定 style guidance，讓語氣更多由使用者偏好與情境決定。
- **推薦用法：** 把五項價值轉成 agent 任務模板：先說明假設與可能副作用，再要求 read-only research；對刪除、部署、付款、外部訊息與權限變更，固定設人工確認點。不要把 Model Spec 當成「模型已經完全做到」的保證，官方也明說這是努力達成的行為目標。
- 來源：[OpenAI｜An updated Model Spec for more capable and beneficial AI](https://openai.com/index/updated-model-spec/)（2026-10-29，官方安全公告）。

## 4. 使用心得與避坑

### 監控、sandbox 與 instruction review 必須疊加，不是三選一

- **今天的判斷：** OpenAI 10/29 公開其 frontier model misalignment monitoring：從 activation probes、model-based reviewer、investigative agent 到結合 telemetry 的 automated investigation，再交給人處理；公告也說 external API 的 monitoring 與 intervention 受產品面、conversation tracking 與隱私限制影響，Chat Completions 不在同一套 coverage 內。
- **可以怎麼開始：** 對自己的 coding agent 做最小化 defense-in-depth：工作目錄只給必要 repo、token 採最小權限、工具與網路預設關閉或需核准、保留 command／file／network audit log，並對 instruction file 做 code owner review。遇到 agent 自稱需要關閉 sandbox、改 endpoint 或安裝陌生套件時，先停下來查來源。
- **限制：** OpenAI 公開的是自家監控設計與內部／模擬案例，不能推論成所有 agent 都有相同偵測能力；CSA 與 BleepingComputer 的案例也顯示，若攻擊者控制 agent 能讀到的自然語言檔案，單一 guardrail 很容易失效。
- 來源：[OpenAI｜How we detect frontier model misalignment](https://openai.com/index/how-we-detect-frontier-model-misalignment/)（2026-10-29，官方安全研究）、[CSA 研究筆記](https://labs.cloudsecurityalliance.org/research/csa-research-note-agent-instruction-file-poisoning-20261027/)（2026-10-27，安全研究）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-10-28～10-30、必要時放寬至一週。搜尋結果沒有同時提供可靠字幕／逐字稿、超過 10,000 觀看、且具實測／教學／技術拆解的合格候選；因此不從標題或介紹猜測內容，也不硬湊影片。

## 今天最值得帶回團隊的三個檢查

- **上下文：** repo 共同文件要可驗證、可 review；agent 個人筆記只能當線索。
- **權限：** agent 工作根目錄要窄，instruction／settings 檔要像程式碼與依賴一樣審核。
- **驗收：** 把 build、preview、trace、tests 與人工核准點接進 workflow，不能只看 agent 的完成摘要。

## 今日一句話

Agent 的可用性正在從「模型會不會寫 code」轉向「它能否在正確上下文、有限權限與可回溯驗收中完成工作」。

