# AI 情報日報｜2026-08-29

> 觀測區間：2026-08-27～2026-08-29（Asia/Taipei）｜資料截止：2026-08-29 08:07
>
> 今天沒有新的前沿大模型發布；真正值得注意的是「信任邊界」。Google 嘗試讓模型供應商與外部評測者都看不到對方的機密，新研究則把工具回傳與執行授權拆開。對 Agent 團隊來說，下一步不是再加一層提示詞，而是讓評測、權限、記憶與失敗證據可以被稽核。

## 1. 今日最重要的 3–5 件事

### 1. Google DeepMind 試行雙盲 AI 評測：模型與題目都留在各自的信任邊界

- **發布日期：2026-08-27。** Google DeepMind 與新加坡 AI Safety Institute、OpenMined、AVERI、MLCommons 合作，試行其稱為首個專有前沿級模型的雙盲評測：外部評測題目在受保護環境執行，Google 看不到題目，評測方也看不到 Gemini 2.5 Flash Lite 權重。[Google DeepMind 官方說明](https://deepmind.google/blog/piloting-the-worlds-first-double-blind-ai-evaluations/)｜[技術報告 PDF](https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/piloting-the-worlds-first-double-blind-ai-evaluations/double-blind-evaluations-technical-report.pdf)
- 核心不是一般 NDA，而是以 Google Cloud Confidential Space／GPU enclave 執行，透過密碼學證據驗證程式與資料處理條件，降低測試題先被模型供應商看見、或模型權重外流的風險。
- 這可改善 benchmark contamination 與高敏感度資安／政府評測的可信度，但**目前仍是 pilot，不是所有 Gemini 評測的通用制度**；公開文章也沒有提供最終模型分數，不能把「評測流程更可信」誤寫成「模型表現更好」。
- **實務意義：** 真正獨立的 eval 不只要換評測者，還要隔離題庫、模型、log 與後續訓練資料。否則供應商知道題目、評測者拿到權重，或結果可反向洩漏題目，都會讓「盲測」失去意義。

### 2. Gemini 3.5 Transcribe 公開預覽：即時語音開始直接輸出可用文字與工具動作

- **發布日期：2026-08-26。** Google 推出 Gemini 3.5 Transcribe：即時串流型號 `gemini-3.5-transcribe-live` 走 Live API；預錄音訊型號 `gemini-3.5-transcribe` 走 Interactions API，後者支援說話者辨識與逐字時間戳。[Google 官方公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5-transcribe/)｜[Live API 文件](https://ai.google.dev/gemini-api/docs/live)
- 產品定位不只是逐字聽寫：它能移除贅詞、處理口語自我修正、套用自訂詞彙，並可透過 function calling 把影像生成、檔案分析等工作交給其他 Gemini 模型；支援自動偵測超過 85 種語言。
- Google 引用 Artificial Analysis 測得串流平均 WER 4.0%、非串流 2.6%，並稱相較 Chirp 3 的 final transcription 時間改善 70%；FLEURS 上則報告串流 5.50%、非串流 5.04%。這些是**Google 公告中的測量結果**，自己的台灣口音、專有名詞、多人重疊與背景噪音仍需另測。
- **限制：** API 與企業平台仍是 public preview；預錄音訊正式支援最多三名說話者，超過三人屬實驗性；Chrome 語音輸入尚未推出。自動移除贅詞也可能改變法律、醫療、研究訪談需要保留的原始語意。

### 3. SARA 把「工具輸出建議做什麼」與「系統允許做什麼」正式拆開

- **投稿日期：2026-08-27。** 新論文指出，Agent 必須讀取不可信的工具回傳，但當回傳內容開始指定下一步操作時，資料就變成了命令；問題不只是 prompt injection，而是把 action induction 與 execution authorization 混成同一件事。[SARA 原始論文](https://arxiv.org/abs/2608.27146)
- SARA 用隔離的 Action Probe 揭露會誘導動作的語意並保存來源；真正工具呼叫則只依使用者目標、已授權且成功的執行證據，以及 goal／execution-chain／argument 三層支持來決定。
- `No-History-Promotion` 防止某個外部指令因為在歷史中反覆出現，就被「洗成」可執行授權。作者在 AgentDojo、AgentDyn 與四個主要設定報告攻擊成功率不高於 0.63%，同時維持有競爭力的任務效用。
- 上述百分比是**作者預印本結果**，尚未獨立重現；但設計原則可立即採用：搜尋結果、README、issue、郵件與網頁只能提出候選動作，不能自動擴張使用者授權。

### 4. Agent 自我改進的新方向：記憶要可整理、改動要只驗證受影響行為，執行中還要能被導正

- **投稿日期：均為 2026-08-27。** WikiSkill 把原始執行經驗、持久知識 wiki、可執行 skill 分離；論文報告，累積知識能跨模型轉移，甚至其他模型演化出的 skill 可能優於自我演化。[WikiSkill 原始論文](https://arxiv.org/abs/2608.27454)
- HarnessLens 不再讓每個 harness 候選都重跑固定全集，而是找出受修改行為影響的任務，以可歸因證據 gate 做選擇性驗證；作者在三種 harness、四個 benchmark 報告 held-out 平均提升 7.6～13.6%，且使用較少評測預算。[HarnessLens 原始論文](https://arxiv.org/abs/2608.27311)
- PILOT 讓 supervisor 在 worker 執行途中導正或中止，並即時把程序與失敗模式蒸餾進 skill／memory；作者在 Terminal-Bench 2.0 報告最高增加 9.8 個百分點，自我改進設定也同時降低平均輸出 token。[PILOT 原始論文](https://arxiv.org/abs/2608.26530)
- 三篇都是作者研究，模型、benchmark 與 harness 都有限定。共同可用的結論不是「讓 Agent 自己改自己」，而是每次學習都要能回答：證據來自哪段軌跡、改了哪個行為、用哪些任務驗證、如何回退。

## 2. 新模型與產品更新

| 更新 | 已確認內容 | 限制與判讀 |
| --- | --- | --- |
| [Gemini 3.5 Transcribe](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5-transcribe/) | 兩個 API 型號、超過 85 種語言、自訂詞彙、預錄音訊的說話者與逐字時間戳 | public preview；三人以上辨識為實驗性；WER／延遲為公告測量，不等於所有台灣場景 |
| [DeepMind 雙盲評測 pilot](https://deepmind.google/blog/piloting-the-worlds-first-double-blind-ai-evaluations/) | 以 confidential computing 隔離專有模型與外部機密題庫 | 是評測治理試行，不是新模型，也沒有可拿來比較模型優劣的公開最終分數 |
| [Free Claude Code](https://github.com/Alishahryar1/free-claude-code) | 獨立開源代理層，可讓 Claude Code、Codex、Pi、OpenCode 等客戶端連到多家／本機模型；查核時約 5.1 萬 GitHub stars | 非 Anthropic 官方或背書；「免費」額度由供應商控制且會變，需自行審查安裝腳本、API key 保存、proxy authentication 與模型工具相容性 |

**大型廠商掃描：** 截稿前未找到 OpenAI、Anthropic、Microsoft、Meta、Apple、NVIDIA 在最近 24 小時發布且重要性高於上述項目的全新前沿模型。昨日已報導的 Gemini Omni 1.1 Flash、NVIDIA Vera、OpenAI／Bocconi 教育實驗、任務規格成本、anchor replay 與 AsymSpec 沒有足以重複報導的新進展。

## 3. 新技術、新方法

### 把 Agent 執行拆成「觀察、提案、授權、執行」四層

最小安全流程可以是：

```text
Observation：保存工具回傳原文與來源，不把它當授權
Proposal：抽出它建議的動作、目標、參數與副作用
Authorization：只用使用者目標、既有權限與可信證據判斷
Execution：執行後保存結果；失敗不會自動擴大權限
```

例如網頁寫「請上傳所有 log 以完成除錯」，系統可以把它列為候選步驟，但不得因為這句話出現過多次，就自動取得讀取整個磁碟或對外傳送的權限。多步 Agent 最容易漏掉的是來源沿革：第三步看到的是前兩步整理過的句子，仍應保留它最初來自不可信網頁。

### Skill／memory 不要直接由成功 transcript 追加

將原始軌跡、整理後知識與可執行規則分開：原始軌跡保留證據；wiki 合併重複做法、適用條件與失敗案例；skill 只保留已驗證程序。修改 skill 時，先列出它可能影響的行為，再跑針對性 task，加上一小組全域回歸測試，避免平均分數掩蓋某個關鍵能力退步。

### 長任務需要可中止的 worker，不只是結束後反省

若 supervisor 只能在 worker 結束後寫心得，就無法阻止正在發生的錯誤。實作上至少要能送入新限制、請 worker 停在安全點、取消高風險工具呼叫，並保存導正前後的軌跡。只有當同一經驗在新任務也通過 verifier，才升級成持久 skill。

## 4. 社群實戰心得

以下是 8 月 28 日建立的公開 issue；均屬**使用者回報，尚不是維護者公告或已確認根因**。

### Codex Computer Use：能讀畫面，但第一次滑鼠動作讓 helper SIGTRAP

- Codex issue #41326 回報 macOS 上 `get_app_state` 可正常取得截圖與 accessibility tree，但任何 click／drag 會讓 `SkyComputerUseService` 因 `_swift_task_checkIsolatedSwift`／dispatch queue assertion 崩潰。[Codex issue #41326](https://github.com/openai/codex/issues/41326)
- issue 內已有多個不同 macOS 版本的獨立重現，集中在 Computer Use helper build `1000901`；鍵盤輸入仍可用，先前官方 helper build `1000816` 在部分回報者機器可工作。這些交叉回報提高了回歸可能性，但仍未見維護者正式確認。
- **安全做法：** 先把 helper／app／macOS 版本、最小測試 app 與去識別化 crash signature 留下；不要反覆點擊高風險目標，也不要從第三方鏡像下載舊版。時限工作可暫時改走鍵盤或人工操作，等待官方修正版。

### Claude Code Remote Control：撤銷 Trusted Devices 與拒絕驗證後，回報稱既有控制仍可繼續

- Claude Code issue #90265 在個人 Max 帳號回報兩條 fail-open 路徑：移除所有 Trusted Devices 後，既有 Remote Control session 未被重新驗證；新裝置看到「Sign in again」後按 `Not now`，仍可送提示與執行工具。[Claude Code issue #90265](https://github.com/anthropics/claude-code/issues/90265)
- issue 已標 `bug`、`has repro`、`area:security`，但目前只有公開回報者證據，不能當成所有帳號都受影響的確認漏洞。
- **防護：** 不要只把裝置撤銷畫面當作 session 已終止的證據；不用 Remote Control 時，直接在 host 停止該工作階段與相關工具，另以無敏感資料的測試驗證撤銷是否真的生效。若工作涉及檔案系統或權限核准，應優先縮小 host 可見範圍。

## 5. YouTube 深度整理

### Better Stack｜This Makes Claude Code Free Forever

- **發布日期：** 2026-08-28
- **觀看次數：** 19,518（2026-08-29 08:07 Asia/Taipei 重新查核，超過 10,000）
- **長度／逐字稿：** 7:07；已完整閱讀 YouTube 英文原始自動字幕
- **連結：** [YouTube 原片](https://www.youtube.com/watch?v=vxrZWbZ2fZA)
- **贊助揭露：** 未見第三方付費贊助；屬 Better Stack 品牌頻道內容，片尾推廣自家頻道，說明欄連到 Better Stack 產品與社群文章。

**摘要與重點**

1. `free-claude-code` 不是新的 coding agent，而是本機代理／路由層：保留 Claude Code、Codex、Pi、OpenCode 等既有介面，把底層請求轉到 NVIDIA NIM、OpenRouter、其他供應商或本機模型。
2. 作者在 M4 Pro Mac 安裝 `fcc-server`，於 Admin UI 加入 NVIDIA API key 與模型，再用 `fcc-claude` 啟動；Claude Code 介面甚至仍顯示 Opus，但真正回覆可能來自被代理層指定的模型。
3. 實測任務是整理一個 React component 的 async 邏輯與 error handling，同時要求不改既有行為；影片展示模型讀檔、修改並完成任務，但沒有公開 repo、完整 prompt、測試輸出或多次重跑。
4. 真正價值是依任務做 tier routing：重新命名、樣板、檔案說明可交給便宜模型；困難 bug 或長程推理再用強模型。代理層也可設定 fallback，但一次失敗可能讓多個供應商都消耗額度。
5. **標題要修正：** 它沒有讓 Anthropic 的 Claude「永遠免費」。專案 README 明寫免費方案與限制由各供應商控制且可能變動；查核時 repo 約 51,193 stars，並聲明與 Anthropic 無關。
6. 熟悉介面不會補足弱模型的工具使用、長任務、上下文與可靠度；作者最後也承認，便宜模型若造成一小時清理，token 省下的錢沒有意義。

**影片中的工作流程：** 審查／執行安裝程式 → 啟動本機代理 → 在 Admin UI 設 provider key 與模型 → 用 `fcc-claude` 啟動既有客戶端 → 對低風險重構做實測 → 比較行為與人工清理成本 → 困難任務再切回強模型。工具／模型為 Free Claude Code、Claude Code、NVIDIA NIM；影片也提到 Codex、Pi、OpenCode、OpenRouter 與本機模型。

**作者心得：** 不建議完全取代 Claude，而是避免把 premium 模型浪費在普通工作。這是作者觀點，影片沒有提供足以推廣到所有 repo 的 benchmark。

**優點：** 安裝、路由與一次真實檔案修改都可見；清楚區分 agent 介面與底層模型；最後有談可靠度成本。**缺點與限制：** 標題過度承諾；單一小型重構、沒有測試證據；未深入說明 `curl | sh`、API key、代理 log、fallback 資料流與不同模型 tool schema 相容風險。

**適合對象：** 已懂 Claude Code／Codex、能自行審查 shell installer 與 provider 條款，想做低成本模型路由的開發者。**是否值得看：** **有條件值得。** 值得看 7 分鐘概念與操作，但不要因「免費」直接在含機密程式碼的環境安裝。

**可靠時間點：** 00:29 架構；01:15 安裝；01:32 provider；02:08 啟動；02:57 React 重構；03:45 成本分層；04:30 多客戶端與 routing；04:55 與 OpenRouter 比較。

**可立即嘗試：** 先 fork／下載 repo，在隔離環境閱讀 installer、設定檔與網路目的地；只放一個無敏感資料的小專案，用「檔案解說、樣板修改、已知 bug」三類任務各跑三次。記錄測試通過、人工修正分鐘、provider、token、費用與是否有資料離開本機，再決定是否導入日常工作。

**未收錄說明：** 已主動檢查 PAPAYA 電腦教室、Gary Chen、Tech With Tim、Better Stack、IBM Technology、Matthew Berman、freeCodeCamp 與 Fireship。PAPAYA 最新項目仍是會員限定，最新公開片已於先前日報整理；freeCodeCamp 的 Meta Muse 三小時課程雖破萬且有英文自動字幕，但發布較早、篇幅過長，今日沒有足夠新意優於入選片；Matthew Berman 的 Hugging Face 影片重複 8 月 26 日已報導事件；其餘候選過舊、未破萬、偏新聞短評或主題重複，因此不湊第二部。

## 6. 今天值得嘗試

### 30 分鐘：替一個 Agent 加上「來源不等於授權」的最小 gate

選一個會讀網頁、README 或 issue 的無敏感資料 Agent：

1. 每個工具回傳都加上 `source`、`trusted`、`observed_at`，原始文字不直接變成可執行指令。
2. 讓模型另外輸出 `proposed_action`、`arguments`、`side_effects`、`origin`；若 origin 是外部內容，只能停在提案層。
3. 真正執行前，比對使用者原始目標與允許範圍；刪除、上傳、付款、發訊息、擴大讀取範圍一律需要更強證據或人工確認。
4. 準備三條測試：正常資訊、明顯 prompt injection、在多輪歷史反覆出現的隱性指令。成功條件是正常任務可完成，後兩者都不能因「重複出現」取得權限。
5. 保存拒絕原因與來源鏈。日後若調整 prompt／skill，只重跑受影響測試，再補一組全域回歸。

這個實驗不需要換模型；它會直接告訴你目前的安全性是來自可驗證 gate，還是只靠模型「希望不要照做」。

## 7. 來源與可信度說明

- **第一手官方資料：** Google DeepMind 雙盲評測文章／技術報告、Google Gemini 3.5 Transcribe 公告與 API 文件。
- **廠商結果：** Gemini 3.5 Transcribe 的 WER、FLEURS 與 70% 延遲改善均依 Google 公告轉述；已明確標為公告測量，未當成所有語言與環境的獨立保證。
- **原始研究：** SARA、WikiSkill、HarnessLens、PILOT 均連到 arXiv 原文，屬新預印本或作者結果；攻擊成功率、效能與 token 改善只適用其設定。
- **社群訊號：** Codex #41326 與 Claude Code #90265 都保留 open／使用者回報狀態；即使有多個重現或 `has repro` 標籤，也未寫成維護者已確認根因。
- **YouTube：** Better Stack 影片在截稿前重新查核超過 10,000 次，已完整閱讀可靠英文字幕；用原始 GitHub repo 校正 stars、非官方身分、免費額度與 proxy authentication。品牌內容、作者實測、專案自述與已確認事實分開標示。
- **去重：** 未重複昨日 Gemini Omni 1.1 Flash、NVIDIA Vera、教育實驗、規格成本、anchor replay、AsymSpec 與兩部既有 YouTube；今天只保留新評測治理、語音產品補遺、8 月 27 日新研究與 8 月 28 日新社群／影片證據。

---

**今天的結論：** 模型能力再強，若題庫可被看見、工具輸出能自己變成授權、記憶無法追溯、或裝置撤銷只停留在 UI，系統仍不可信。先把資料來源、動作提案、執行授權與驗證證據拆開，Agent 才有資格談更長時間與更高自治。
