# AI 情報日報｜2026-11-02

> 搜尋範圍：以 Asia/Taipei 2026-10-31～11-02 為主，補充一週內仍有直接用法的新進展。官方公告／文件是官方事實；GitHub 專案是發布者自述；作者時間、數量與效能均不視為獨立驗證。

## 1. 社群實戰用法

### Karpathy 的 HackerTube：先定義資料來源，再讓 agent 完成產品閉環

- **新在哪裡：** Andrej Karpathy 10/31 公開 HackerTube，將 Hacker News 2007–2026 的留言交給 Opus 5.5 篩選，再由 Claude Code Workflow 用 Sonnet 去除垃圾，整理成 40,000 則影片推薦、6,454 部影片與 150 個主題，最後包成網站。約 2 小時、影片數與 token 數都是作者自述，不是獨立 benchmark。
- **可以怎麼開始：** 把「來源 → 清理 → 分類 → UI → 部署」拆成可檢查的階段；先選一個有明確社群訊號的資料集，再讓 agent 建立最小可用介面。人工只保留 API key、主機、網域與上線驗收，不要把憑證交給模型。
- **編輯心得與限制：** 真正可複製的是資料管線與產品邊界，不是「兩小時做完」的速度宣稱。作者說自己沒有讀寫程式或操作終端機；若換成團隊或正式服務，仍需審查資料授權、YouTube API 配額、部署安全與長期維運。
- 來源：[Karpathy 原文](https://karpathy.bearblog.dev/hacker-tube/)（2026-10-31，作者一手說明，高可信但數字未獨立驗證）、[HackerTube](https://hackertube.org/)。

## 2. 社群新工具與新玩法

### DeepSeek dsh-superagent：讓 GitHub 工作項目成為 agent 的入口

- **新在哪裡：** DeepSeek Harness Team 10/31 發布 `dsh-superagent` 研究原型：監聽 GitHub，選擇性接 Feishu；獲授權的請求會建立 work item、在自己的 agent session 與目錄工作，最後回到原對話回報或開 PR，並用 web panel 留下需要人處理的事項。
- **可以怎麼開始：** 只在非關鍵 repo 試用；先限定哪些人／來源能建立工作、哪些路徑可改、PR 必須通過哪些測試，再讓 agent 處理一個小 issue。把「可自動做」與「必須人批准」寫成 repo 規則。
- **編輯心得與限制：** 官方 README 明確說這是 reference-only、不是正式 DeepSeek 產品，也不是 production-ready；它展示的是授權、執行、回報三段式模型，不等於可直接交付 production 權限。
- 來源：[dsh-superagent GitHub](https://github.com/DeepSeek-ai/dsh-superagent-prototype)（2026-10-31，專案原作者，高可信但研究原型）。

### OpenCode 2.2.5：把 worktree、shell 與 context 預算變成一級操作

- **新在哪裡：** 10/30 發布的 v2.2.5 新增快捷鍵切換 worktree／base branch／shell mode，可在 `opencode.json` 用 `"compaction": { "buffer": "20%" }` 以比例保留 context；同版也修正超過 10 MiB 的 MCP stdio 訊息斷線與 compaction 上限問題。
- **可以怎麼開始：** 多任務 repo 先為每個 agent 建 worktree，為不同模型設相同的 compaction buffer，再用實際長任務比較恢復率與 token 消耗。MCP server 若會傳大輸出，先以 10 MiB 以上 fixture 做 smoke test。
- **編輯心得與限制：** 快捷鍵改善操作摩擦，但不會自動解決 merge、權限或錯誤上下文；比例 buffer 也只是配置，不是品質保證。這是社群工具的 release note，不代表每種模型／provider 都同樣穩定。
- 來源：[OpenCode v2.2.5 release](https://github.com/anomalyco/opencode/releases/tag/v2.2.5)（2026-10-30，官方 GitHub release）。

## 3. 官方新功能與推薦用法

### Claude Code 2.1.316：更細的 subagent effort 與 gateway policy

- **新在哪裡：** Anthropic 10/31 發布 v2.1.316，加入 `CLAUDE_CODE_SUBAGENT_EFFORT`，可在 subagent 沒有明確指定時設定 effort；Claude apps gateway 增加 pooled group budget 與 `managed.policy_mode: layered`；Bedrock guardrail 增加 input tagging。另公告 Opus 4.8 fast mode 已於 10/30 deprecated，11/30 移除，且不會自動退回標準 fast mode。
- **推薦用法：** 團隊先把 subagent effort、群組預算與政策合併規則寫入可審核設定；若仍依賴 Opus 4.8 fast mode，立即安排 Opus 5.5 遷移與成本／延遲回歸測試。Bedrock 使用者要確認輸入標籤是否與既有 guardrail 規則一致。
- **限制：** 這些功能的實際可用性仍受登入方案、gateway、Bedrock 設定與模型供應區域影響；版本號更新不等於你的帳號已開通全部能力。
- 來源：[Claude Code v2.1.316 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.316)（2026-10-31，官方 release）。

### OpenAI 支援共享 robots.txt 訓練偏好訊號，但目前不是立即生效的封鎖

- **新在哪裡：** OpenAI 10/30 表示將尊重 IETF AI Preferences 工作中的共享 robots.txt signal，讓網站用一套偏好向多家 AI provider 表達「是否允許 foundation-model training」；OpenAI 說預計未來幾個月實作，現有 crawler controls 仍繼續適用。
- **推薦用法：** 先把 GPTBot、OAI-SearchBot、搜尋曝光與訓練用途分開盤點，等規格與 provider 實作明確後再更新 robots.txt；同時保留 WAF、存取紀錄與內容授權政策，不能只靠一行設定判定已完成防護。
- **限制：** 這是自願性、仍在實作中的共享訊號，不是今天就能驗證的全球封鎖；不要把「不讓訓練」誤當成「不讓搜尋或使用者觸發的即時讀取」。
- 來源：[OpenAI 公告](https://openai.com/index/helping-websites-express-ai-training-preferences/)（2026-10-30，官方公司公告）、[IETF AI Preferences 工作](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/)。

## 4. 使用心得與避坑

### VOLTA：模型可能被拿來整理被竊資料，防守重點是 token 與瀏覽器邊界

- **發生什麼事：** Cisco Talos 10/31 分析一個名為 VOLTA-AUTODOXER 的 Windows infostealer：它先竊取瀏覽器憑證、cookies、支付卡、錢包、OAuth／聊天 session、SSH 與雲端金鑰，再把結構化資料送到 OpenRouter，要求 LLM 排出受害者資產的變現價值；若模型拒答，會依序切換 Claude、Kimi、Gemini。Talos 沒有確認受害者數量，也沒有證明這個 AI 階段已在野外成功運作。
- **立即怎麼做：** 對不明程序啟動 Chrome `--headless` 設警示或阻擋；若主機可能受影響，保留 `%APPDATA%\\volta_debug.txt` 等跡證，從可信設備撤銷 token、輪替密碼與 SSH／雲端金鑰。不要因為惡意程式自刪或沒有看到 LLM 請求，就當成沒有外洩。
- **編輯心得與限制：** 這不是「模型自己入侵」的證據，而是把竊取後的人工分級工作外包給模型；防守要看瀏覽器 session、API key、MCP／agent 執行環境的實際權限，不只看 prompt 是否安全。
- 來源：[Cisco Talos 原始分析](https://blog.talosintelligence.com/appraisal-by-ai-model-driven-victim-prioritization-in-the-volta-infostealer/)（2026-10-31，第一手威脅研究，高可信但樣本與在野影響有限）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-10-31～11-02，必要時放寬至一週；目前沒有同時能證明觀看數超過 10,000、已讀可靠字幕／逐字稿、且具實測／教學／技術拆解深度的候選，因此不從標題或介紹猜測內容，也不硬湊影片。

## 今天最值得帶回團隊的三個檢查

- **流程：** agent 最有價值的交付單位不是一段聊天，而是可授權、可測試、可回報的 work item。
- **邊界：** worktree 與 compaction 只處理隔離和上下文；token、瀏覽器 session、MCP 與部署權限仍要另外分層。
- **驗收：** 對作者自述的速度、數量與 benchmark，保留原始資料、版本、成本與失敗案例，別把 demo 數字當成團隊基準。

## 今日一句話

今天的共同訊號不是「agent 會不會寫更多程式」，而是「能否把資料、權限、context 與人類批准切成可驗證的工作流」。
