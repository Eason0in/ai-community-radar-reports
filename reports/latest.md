# AI 情報日報｜2026-09-28

約 5 分鐘閱讀。今天的主線是：AI 工具開始把「可觀察、可回溯、可限制」直接放進工作介面；同時，研究型 Agent 也在嘗試用摘要狀態取代無限增長的工具歷史。最值得帶走的是：把 Agent 的上下文、模型、權限與驗證結果都當成可檢查的工程狀態。

> 截稿時間：2026-09-28 08:04（Asia/Taipei）
> 查核範圍：優先 2026-09-26～09-28 的官方公告、原始研究、GitHub release／Changelog、開源專案與第一手實作文章；未重複 9/27 的 Copilot Canvas、Claude plugin directory、Copilot managed-settings validator、PR review stages、Microsoft run-assert-eval 與 OpenAI third-party impact，除非今天出現新的直接證據。較早資料只在補足開始方式與限制時引用。
> 證據標示：官方公告／文件是官方事實；研究作者或廠商自己的 benchmark 會標明為作者／廠商結果；個人文章與社群專案只代表作者經驗，不外推成普遍結論。

## 1. 社群實戰用法

### 先看 Agent 做了什麼，再談它做得好不好

- **新在哪裡：** 開發者 Jay_Stride 在 9/26 發布 Agent Pigeon，把本機 Claude Code 與 Codex 的完成後 session history 轉成短版 flight report：編輯次數、被辨識的驗證、FAIL→PASS 循環與 session 比較。它的出發點很實際：Agent 最後一句話常看不出中間改了什麼、重試幾次、是否真的跑過檢查。
- **可以怎麼開始：** 在不含機密的本機環境先跑 `npx agent-pigeon@latest flight`；需要比較兩次工作再用 `agent-pigeon compare <session-a> <session-b>`。先把它當工作紀錄索引，不要當品質分數。
- **編輯心得：** 「READ: N/A」比假裝是 0 更值得信任：Codex 常把讀檔藏在較大的 `exec` 命令裡，工具無法可靠歸因就應保持未知。這種可見的缺口，正適合拿來決定下一輪要補哪個 hook 或測試。
- **限制：** 驗證辨識是 heuristic；自訂腳本可能漏掉。FAIL→PASS 只證明事件順序，不證明是哪個修改造成通過；READ 計數也可能因 Provider log 形狀不同而不可用。專案目前是小型、獨立、唯讀 CLI，不是正式評測平台。

來源：[作者第一手介紹](https://dev.to/jay_stride/i-built-a-tiny-cli-to-see-how-my-coding-agent-actually-worked-5co8)（2026-09-26）、[Agent Pigeon 原始碼與限制](https://github.com/hyukvoid/agent-pigeon)；可信度：作者實作與原始碼，效果仍需自行驗證。

### 把深度搜尋拆成「規劃」與「整理」，不要讓歷史無限長大

- **新在哪裡：** Tencent 的 IterSynth 論文（9/24）把同一個模型在每輪交替扮演 Planner 與 Synthesizer：Planner 只根據問題與目前摘要決定下一個搜尋，Synthesizer 只把新證據整合成下一版摘要；原始搜尋歷史不再是唯一長期狀態。
- **可以怎麼開始：** 不必先重訓模型，就能把這個模式套進研究 prompt：`(問題, 目前摘要) → Planner 搜尋 → Synthesizer 更新摘要`，每輪保留來源、支持／反駁關係與未解問題，下一輪只讀摘要與新證據。等流程穩定後，再考慮使用作者釋出的 verl patch。
- **編輯心得：** 這不是「多開兩個 Agent」而已，而是限制每個角色能看什麼、能做什麼；對長時間 RAG、競品研究與政策查核，比把整串 tool trace 硬塞回 context 更容易控制成本與漂移。
- **限制：** 50.7 平均分、比同規模先前 Agent 高 4.2% 是**論文作者結果**，不是獨立 benchmark；完整訓練需要自己的 verl 環境、資料與 API，公開 repo 也明確說冷啟動 SFT 不包含在釋出內容內。摘要若漏掉反證，後續 Planner 會在錯誤狀態上繼續搜尋。

來源：[原始論文](https://arxiv.org/abs/2609.29444)（2026-09-24）、[Tencent/IterSynth 程式碼與訓練說明](https://github.com/Tencent/IterSynth)；可信度：原始研究與作者 repo，數字標示為作者結果。

## 2. 社群新工具與新玩法

### Perplexity Fast Search：把「先拿快結果」變成明確的檢索層

- **新在哪裡：** Perplexity 在 9/24 公告 Search API 的 Fast Search，底層是 Rust retrieval／ranking service Photon；官方宣稱 95% 搜尋結果在 230 ms 內返回。這是廠商自己的延遲結果，不是外部壓測。
- **怎麼開始：** 如果產品需要「先快速拿候選，再由自己的模型或規則做整理」，可從 [Fast Search API](https://pplx.ai/fast-search-api-fm) 建一個小型 A/B：固定 query、抓取數量、時間窗與失敗重試，分開量測 time-to-first-result、完整結果時間、引用正確率與成本。
- **編輯心得：** 快速檢索層和最終答案層應分開；不要因為第一批結果更快，就把它直接等同於更好的研究答案。對互動式搜尋、autocomplete、Agent 的第一輪 evidence gather 很有吸引力。
- **限制：** Photon、230 ms 與 95% 都是 Perplexity 公告中的廠商說法；查核時未見完整公開 workload、區域、query 分布或 p95／p99 定義。正式上線前仍要保留慢速 fallback 與來源品質檢查。

來源：[Perplexity API 官方公告](https://community.perplexity.ai/t/introducing-fast-search-in-the-perplexity-search-api/6195)（2026-09-24）、[Photon 技術文章](https://perplexity.ai/hub/blog/photon)；可信度：官方公告，效能數字為廠商結果。

### OpenCode 2 的熱重載：工具可以變，但必須知道哪一層已生效

- **新在哪裡：** OpenCode V2 文件現在把 plugin、skill、MCP 與 config 放在可監看的目錄；官方文件說 watched config 變更會自動 reload，CLI 也提供 `opencode reload`。社群在 9/22 實測展示新 plugin／skill 可在 session 中被看見，不必整個重開。
- **怎麼開始：** 先在測試 repo 放一個最小 `.opencode/plugins/hello.ts`，改動後用 `opencode reload` 或觀察 watched directory 是否生效，再從 `opencode plugin list`、`opencode mcp list` 與實際一次 tool call 驗證。新能力先只給唯讀工具。
- **編輯心得：** 熱重載適合快速迭代 Agent workflow，尤其是調整 skill 描述、MCP routing 或模型 policy；但它也讓「這一輪到底用了哪份設定」更難回溯，最好把 config commit hash 寫進 session metadata。
- **限制：** V2 plugin API 仍是 beta，官方提醒 entrypoint、hook 與 draft shape 可能變；V1 plugin 不能只靠改檔名直接跑在 V2，需按 migration guide 移植。未監看的依賴變更仍可能需要 restart，不能把「看到檔案變了」當成所有層都已更新。

來源：[OpenCode V2 plugins 官方文件](https://opencode.ai/v2/docs/plugins)、[V2 migration guide](https://opencode.ai/v2/docs/migrate-v1)、[9/22 社群實作整理](https://vibecoding.tech/news/2026/09/22/opencode-2-hot-reload-plugins)；可信度：官方文件確認能力與限制，社群文章提供第一手示範脈絡。

## 3. 官方新功能與推薦用法

### Copilot 進入 Slack／Teams 後，對話脈絡可以一路回到 GitHub 工作

- **官方更新：** GitHub 9/25 的 public preview 讓 Slack 的檔案、附件與 message link，以及 Teams 的 inline image、forwarded message、channel／thread history 成為 cloud agent context；建立 issue 前會查相似項目，結果會連回原始對話。兩邊都可切換下一則訊息使用的模型，Slack 另可設定預設 owner 與 repository。
- **推薦用法：** 在團隊頻道先讓 Copilot 摘要背景，再要求「列出候選 issue、指出相似既有 issue、等待我選定 repo 與 owner」；確認後才建立工作。對長任務把 implementation-plan 狀態、連線中斷與 idle recovery 當作可觀察訊號，不要只看最後一句完成通知。
- **編輯心得：** 真正的新價值不是把 Agent 塞進聊天，而是把「決策來源 → GitHub 工作 → 回溯連結」串起來。這會讓需求 triage 更容易稽核，也讓 duplicate issue 與錯 repo 的風險更早暴露。
- **限制：** 目前是 Copilot Business／Enterprise public preview，需管理員啟用 cloud agent policy，功能分批 rollout，使用量沿用既有 Copilot entitlement／budget；不能把它當成所有 Slack／Teams workspace 已可用。

來源：[GitHub 官方 Changelog](https://github.blog/changelog/2026-09-25-updates-to-github-copilot-for-slack-and-microsoft-teams)（2026-09-25）、[Slack／Teams 設定文件入口](https://docs.github.com/en/copilot/using-github-copilot/coding-agent/integrating-copilot-coding-agent-with-slack)；可信度：官方產品公告，preview 狀態以公告為準。

### Copilot app 的本機 sandbox 與 OpenTelemetry，先把 Agent 行為放進可觀察邊界

- **官方更新：** GitHub 9/25 weekly release 將 Copilot app 的 local sandboxing 與 OpenTelemetry 列為 public preview；VS Code 1.139 也開始逐步支援 Agent 在 SSH、Tunnel、WSL 的 Dev Container 中使用遠端專案工具與依賴。
- **推薦用法：** 對本機或遠端 workspace 先設定檔案、網路、credential 的最小權限，再把 OpenTelemetry 接到既有監控；試跑一個可回滾的測試任務，確認拒絕事件、tool call、session id 與耗時都能查到，再擴大權限。
- **編輯心得：** sandbox 解決「能碰到什麼」，OpenTelemetry 解決「到底碰了什麼」；只有其中一個，事故排查都會缺一半。遠端 Dev Container 也要把 secrets、mount、網路出口視為新的 trust boundary。
- **限制：** 兩項仍是 public preview／逐步 rollout；遙測是否真的接到你的 backend、欄位是否足夠回答事故問題，不能只看設定已填入。模型可用性也依 Copilot 方案不同，勿把週報中的 model list 當成所有帳號保證。

來源：[GitHub Copilot weekly releases — September 21](https://github.blog/changelog/2026-09-25-github-copilot-weekly-releases-september-21)（2026-09-25）、[VS Code 1.139 release notes](https://code.visualstudio.com/updates/v1_139)；可信度：官方 Changelog／release notes。

## 4. 使用心得與避坑

### Copilot Memory 可以減少重複說明，但不要把它當永遠正確的 repo 規則

- **新在哪裡：** GitHub 9/25 說明 agentic autofix 可讀取既有 Copilot Memory，修好安全告警後也能保存 fix pattern，供後續 autofix、code review 與 cloud agent 使用。官方文件指出 repository facts 會附引用，使用前會對照目前 branch 驗證；未使用的項目 28 天後自動刪除。
- **可以怎麼開始：** 先只讓它記錄低風險、可由程式碼證明的事，例如「這個 repo 的資料庫連線要走哪個 wrapper」；每次 memory 影響修補時，要求 Agent 同時列出引用檔案與 branch，並在 PR 中檢查是否仍符合現在的架構。
- **編輯心得：** Memory 的正確用途是減少重複 context，不是取代 code review、測試或 versioned instructions。把「能被目前程式碼驗證」當成入場券，比把所有聊天偏好都存成長期記憶安全。
- **限制：** agentic autofix 與 Copilot Memory 都是 public preview，行為可能變；Business／Enterprise 的 user-level preferences 也涉及組織管理者可匯出／刪除的治理邊界，導入前要確認 workspace policy 與資料保留規則。

來源：[GitHub Changelog：Agentic autofix now uses Copilot Memory](https://github.blog/changelog/2026-09-25-agentic-autofix-now-uses-copilot-memory)、[Copilot Memory 官方文件](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/copilot-memory)；可信度：官方產品公告與文件。

### ChatGPT 檔案連接器變方便，權限與自動切換反而更要先測

- **官方更新：** OpenAI 9/25 release notes 表示 Box、Dropbox、SharePoint 檔案與資料夾正在 ChatGPT 的 Chat／Work 網頁面向多個方案 rollout，可與對話並排使用；同一份更新也說 Plus／Pro 全球停止 Instant→Thinking 的自動切換，使用者需在 model picker 選可用選項。
- **推薦用法：** 先用一個低敏感度資料夾測試「讀取、跨檔案比較、建立新輸出」三種操作，逐項確認原始權限與引用回鏈；需要穩定延遲或推理成本時，把模型與 reasoning effort 明確寫進工作流程，不要依賴舊的自動切換行為。
- **避坑：** 「能看到資料夾」不代表 Agent 能對所有檔案做相同動作；既有 file permissions、workspace controls、方案與地區仍會影響可用性。手機支援另待後續，不能以網頁 rollout 推論 mobile 已同步。

來源：[OpenAI ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)（2026-09-25）；可信度：官方說明，rollout 與方案限制以該頁最新內容為準。

## YouTube

### 今日無推薦

我主動查核 PAPAYA 電腦教室與其他中英文 AI／Agent／AI Coding 頻道：PAPAYA 最新公開候選為 11 天前；Web Dev Cody 的 **This Is the Future of Agentic Coding** 雖於查核時約 1.2 萬觀看、發布約 6 小時，但影片實際長度只有 1:47，播放器明確顯示「未提供字幕／隱藏式輔助字幕」，無法完成可靠逐字稿查核，因此排除。其他近期高觀看候選偏新聞朗讀、傳聞或不符合技術深度門檻。依規則今天不湊片，寫「今日無推薦」。

## 今日一句話

把 Agent 當成一個會改變上下文、權限、模型與外部狀態的系統；每次交付都留下可回溯的摘要、事件與驗證證據，才有可能在能力變快時維持工程可靠性。

## 來源總覽

- 社群實戰：[Agent Pigeon 第一手文章](https://dev.to/jay_stride/i-built-a-tiny-cli-to-see-how-my-coding-agent-actually-worked-5co8)、[Agent Pigeon](https://github.com/hyukvoid/agent-pigeon)、[IterSynth 論文](https://arxiv.org/abs/2609.29444)、[Tencent/IterSynth](https://github.com/Tencent/IterSynth)。
- 新工具／新玩法：[Perplexity Fast Search](https://community.perplexity.ai/t/introducing-fast-search-in-the-perplexity-search-api/6195)、[OpenCode V2 plugins](https://opencode.ai/v2/docs/plugins)、[OpenCode V2 migration](https://opencode.ai/v2/docs/migrate-v1)。
- 官方更新：[GitHub Slack／Teams](https://github.blog/changelog/2026-09-25-updates-to-github-copilot-for-slack-and-microsoft-teams)、[GitHub weekly releases](https://github.blog/changelog/2026-09-25-github-copilot-weekly-releases-september-21)、[OpenAI Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)。
- 使用心得／避坑：[Copilot Memory Changelog](https://github.blog/changelog/2026-09-25-agentic-autofix-now-uses-copilot-memory)、[Copilot Memory 文件](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/copilot-memory)。
- YouTube：今日無推薦；已實際查核觀看數、發布時間與字幕狀態，未以標題或影片介紹代替逐字稿。
