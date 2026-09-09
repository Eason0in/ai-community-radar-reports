# AI 實用日報｜2026-09-09

約 3–4 分鐘閱讀。今日主線是：Agent 工作流開始把「分工、隔離、審查」做成固定層次，而影像工具則把草圖、模板與局部編修做成可重複流程。廠商自述、社群工作流與開源專案訊號分開標示，不能互相當成獨立 benchmark。

## 1. 社群實戰用法

### 讓不同 Agent 分工，不要讓同一個 Agent 自己驗收

9 月 8 日 r/ClaudeWorkflows 收錄一套多 Agent coding workflow：強模型負責 orchestrator，worker sub-agents 實作，另一個沒有實作上下文的 reviewer 用不同模型做獨立檢查；開始 auto mode 前先人工拆模組，並先跑 lint／test。這是單一社群工作流整理，不是可泛化的成功率研究。

怎麼試：挑一個小功能，先手寫驗收條件；讓 worker 在隔離分支修改，再把 diff、測試與需求交給全新 reviewer；最後由 orchestrator 只處理 reviewer 指出的具體問題。不要一次把整個專案交給多個 Agent。

編輯心得：真正有價值的是「實作者不知道審查者的前提」與「審查有獨立證據」，不是 Agent 數量越多越好。成本與協調複雜度會一起上升。

來源：[社群工作流整理（9/8）](https://www.reddit.com/r/ClaudeWorkflows/comments/1wa1lf0/workflow_multiagent_claude_workflow_for_code/)｜[原始 r/ClaudeAI 討論](https://www.reddit.com/r/ClaudeAI/)

## 2. 社群新工具與新玩法

### 用 context-mode 先壓縮工具輸出，再把記憶留在工作層

GitHub Explore 9 月 8 日列出的 `mksglu/context-mode` 是 TypeScript 工具，主打把 coding Agent 的工具輸出隔離、保存 session memory，並以 MCP 加 hooks 做路由；專案頁宣稱可減少 98% context，但這仍是維護者說法，不是獨立量測。

推薦玩法：先在公開 repo 的只讀任務試用，記錄原始 tool output、壓縮後內容、實際 token／延遲與遺失的細節；確認可回放後，再對含敏感資料的專案設定明確 allowlist。不要只因「context 變短」就放寬工具權限。

來源：[context-mode GitHub](https://github.com/mksglu/context-mode)｜[GitHub Explore（9/8 更新訊號）](https://github.com/explore)

### mcp-context-forge 1.0.10 把 OAuth 與觀測性一起補上

IBM 的 `mcp-context-forge` 1.0.10（9/7）新增 OAuth redirect allowlist、啟用驗證時拒絕弱／預設密碼、W3C trace propagation、affinity tracing，以及 A2A agent 的 Vault token 支援；同時有 breaking change：既有部署必須補齊密碼環境變數。

怎麼開始：先在 staging 升級，明確設定允許的 HTTPS origin、旋轉舊 secret，再驗證 OAuth callback、session affinity 與 trace 是否能在一個完整 MCP 呼叫中串起來。升級後不要只看服務啟動成功，還要測失敗登入與錯誤回傳。

來源：[v1.0.10 release notes](https://github.com/IBM/mcp-context-forge/releases/tag/v1.0.10)

## 3. 官方新功能與推薦用法

### ChatGPT Images 2.5：把「生成一張圖」改成可控的編修循環

OpenAI 9 月 8 日發布 ChatGPT Images 2.5，主打更精細的細節、較可靠的局部編修、多輪一致性，以及相較 Images 2.0 最多降低 50% 延遲（廠商結果）。ChatGPT 新增 Sketch、模板、圖片內留言與分享 prompt；API 同步提供 GPT‑Image‑2.5 Flare 與較重視精準控制的 Sunburst。官方表示已向 ChatGPT、ChatGPT Work 與 Codex 的桌面、手機、網頁使用者推出。

推薦用法：先用 Templates 建立海報或產品圖，再用 Sketch 指出構圖，接著每輪只改一個區域；用圖片留言描述「保留什麼、只改什麼」，最後另存原始版本並人工檢查文字、人物特徵、品牌元素與來源標記。這比一次塞入十個修改要求更容易定位錯誤。

來源：[OpenAI 官方公告（9/8）](https://openai.com/index/introducing-chatgpt-images-2-5/)｜[ChatGPT Release Notes](https://help.openai.com/en/articles/6825453)

## 4. 使用心得與避坑

### 「3.1 agent-workdays」是內部案例，不是你的自動化保證

OpenAI 9 月 8 日文章表示，其研究組織目前每一個人類工作日對應 3.1 個 agent-workdays，並說明人仍負責研究優先順序與判斷結果。這是 OpenAI 以自家組織與 Stanford 8 小時工作日作為來源的公司自述，不是獨立 benchmark，也沒有直接告訴你任務失敗率、返工成本或人工審查時間。

避坑做法：把這個數字只當成「值得量測的假設」，不要直接拿來估算團隊產能。先為自己的任務記錄完成率、返工次數、人工 review 分鐘、工具失敗與總成本；涉及寫入、刪除、部署或對外傳送時保留人工 checkpoint。Agent-workdays 增加，若沒有可驗收成果，仍可能只是更快產生更多待修工作。

來源：[OpenAI〈The Work Now Within Reach〉（9/8）](https://openai.com/index/the-work-now-within-reach/)

## YouTube：今日無推薦

已主動檢查 PAPAYA、Tech With Tim、IBM Technology、Matthew Berman、Matt Wolfe 等中英文 AI／工具／Agent 頻道；目前查到的候選沒有同時通過近 24–48 小時、觀看數超過 10,000、可讀字幕／逐字稿與實測或深度拆解四項門檻，因此不以標題或簡介湊數。

今天先試一件事：拿一個不含機密的小型 coding 任務，分成 worker 與 fresh reviewer 兩個上下文；同時記錄測試、返工、token 與人工審查時間，再比較單 Agent 與分工流程的實際差異。
