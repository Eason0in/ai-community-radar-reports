# AI 情報日報｜2026-08-23

> 閱讀時間：約 9 分鐘。觀測範圍以 2026-08-20～2026-08-23（Asia/Taipei）為主；週末新增公告較少，因此只收錄具實務影響、且未在昨日重複報導的內容。

## 1. 今日最重要的 3–5 件事

### 1. GPT-5.6 Sol 限時降價，但官方頁面的數字尚未完全同步

- **發布／更新：2026-08-21。** OpenAI 表示 GPT-5.6 Sol 的 API 與點數價格在未來三個月降低超過 20%。企業版的 token 計價表已列出 Work／Codex 每百萬 token 為輸入 **US$4**、快取輸入 **US$0.40**、輸出 **US$20**，促銷至少到 2026-11-21；既有方案內含額度不變。
- 但目前模型頁仍顯示一般 API 標準價為輸入 US$5、快取輸入 US$0.50、輸出 US$30。這代表公告、企業計價表與公開模型頁尚未完全同步；**API 使用者應以帳戶用量頁與實際帳單為準，不宜把 US$4／US$20 直接當成所有 API 帳戶的確定費率。**
- 來源：[OpenAI GPT-5.6 Sol 公告](https://openai.com/index/gpt-5-6/)、[企業版 token 計價表](https://help.openai.com/en/articles/20001415-chatgpt-rate-card-enterprise-token-based-pricing)、[API 模型頁](https://developers.openai.com/api/docs/models/gpt-5.6-sol)

### 2. Claude Mythos 5 開始進入防禦端工作流程，並投入 US$35M 支援開源安全

- **發布：2026-08-21。** Claude Security 公開測試版已使用 Mythos 5 掃描程式碼儲存庫，回傳 CWE、信心、嚴重度與修補建議；目前提供 Enterprise 客戶，依既有方案的標準 token 用量計費，沒有額外附加費。
- Anthropic 強調每個修補仍需人工審查；Security 掃描權限也不等於可在其他介面直接使用 Mythos 5。官方另宣布 **Defender Advantage Fund（0xDAF）**，投入 US$35M Claude 點數支援開源安全專案，並擴大 Cyber Verification Program。
- 這是官方產品與資助公告，不是已證明能取代安全工程師的獨立評測；基金受助名單與更廣泛的 Mythos 5 存取仍待後續公布。
- 來源：[Anthropic：Bringing Claude Mythos 5 to more defenders](https://claude.com/blog/bringing-claude-mythos-5-to-more-defenders)

### 3. Anthropic 的 Computer Use、Skills API、Files API 正式 GA，並新增 Browser Use

- **發布：2026-08-20。** Computer Use、Skills API 與 Files API 已正式可用；Computer Use 現可在單一回合執行多個動作，Browser Use 則利用頁面結構與元素定位處理瀏覽器任務。
- Skills API 支援上傳與版本化自訂技能；Files API 新增自動到期、提高 5 倍速率限制，組織儲存上限為 1 TB。Computer Use 也可在簽署 BAA 後用於符合 HIPAA 的工作負載。
- Microsoft Foundry 已提供 Skills 與 Files；Vertex AI 的新版 Computer／Browser Use 尚在後續導入。官方列出的「32 分鐘降到 13 分鐘、成本約降 30%」是客戶案例，不是跨產業通用 benchmark。
- 來源：[Anthropic：Computer use, Skills API, and Files API are now generally available](https://claude.com/blog/computer-use-skills-api-files-api)

### 4. MidTool：先用 203 億 token 的工具語料中訓練，再做 SFT／RL

- **論文提交：2026-08-20。** MidTool 建立 20.3B-token、1,122 萬筆樣本的語料，組成包含網頁 42%、程式碼 26%、PDF 23%、原生軌跡 9%，資料來自真實 API、MCP skills、文件與程式碼，再加驗證流程。
- 在作者的 Qwen3-4B 實驗，BFCL 總分由僅 SFT 的 39.73，提高到 MidTool＋SFT 的 50.25；再加 RL 為 54.18。8B 模型則由 47.62 提高到 51.12／55.12。
- 這是作者在特定模型、資料管線與評測上的結果，訓練還使用 32 張 H200，RL 使用 8 張 B200；尚不能推論到所有模型或真實長流程 Agent。
- 來源：[MidTool 論文](https://arxiv.org/abs/2608.20314)、[HTML 全文](https://arxiv.org/html/2608.20314v1)

### 5. MaliciousSkillBench 顯示：惡意 Skill 偵測器跨來源時明顯失準

- **論文提交：2026-08-20。** 資料集從 13 個公開來源整理 7,505 個惡意與 2,235 個正常 skills。隨機切分時偵測器 macro-F1 可達 0.882～0.932，但來源完全分離後只剩 0.653～0.665。
- 最強的 TF-IDF SVM 在來源分離下雖找出 95.6% 惡意樣本，卻把 62.4% 正常樣本誤判為惡意。這表示模型可能只是記住來源風格，而非真正理解行為風險。
- 實務上不能把單一掃描器當成安裝閘門；至少要加上來源驗證、權限最小化、沙箱執行、人工審查與執行期監控。數字仍屬作者 benchmark。
- 來源：[MaliciousSkillBench 論文](https://arxiv.org/abs/2608.19901)

## 2. 新模型與產品更新

| 更新 | 可立即確認的能力 | 邊界與採用建議 |
| --- | --- | --- |
| GPT-5.6 Sol 限時價格調整 | 公告稱 API 與點數價格降低超過 20%；企業 Work／Codex 計價表已有促銷數字 | 公開 API 模型頁仍是標準價；先在用量儀表板做一筆小額實測，再更新成本模型 |
| Claude Security＋Mythos 5 | 儲存庫掃描、CWE／信心／嚴重度與修補建議，Enterprise 公開測試版 | 每個修補都要人工審查；不是一般 Mythos 5 存取，也不是獨立安全認證 |
| Claude Agent 平台 GA | 多動作 Computer Use、Browser Use、版本化 Skills、Files 自動到期與 1 TB 組織容量 | Browser／Computer Use 仍需處理提示注入、權限與不可逆操作；雲端平台支援範圍不完全相同 |

截至本次查核，Google、Microsoft、Meta、Apple、NVIDIA 的官方來源沒有比昨日更值得取代上述項目的新前沿模型或定價公告，因此不以舊消息補篇幅。

## 3. 新技術、新方法

### Skill 要「拆到可轉移的子任務」，不是把整個任務摘要存下來

- **論文提交：2026-08-20。** *Break It Down, Pass It On* 的受控實驗發現，從完整任務歸納的 skills 多數讓 Agent 表現低於無記憶基線；從子任務萃取的 skills 則平均帶來改善，而且文字式 skill 通常比程式碼式 skill 更容易跨任務轉移。
- 作者提出結合「具體性」與「抽象度」的 skill utility，可在真正執行前，僅由 skill 與目標任務描述估計是否值得重用。
- 可採用的設計：把「研究一家公司」拆成來源定位、日期核對、宣稱分類、交叉查證等原子步驟；為每個步驟記錄適用條件與失敗訊號，而不是儲存一份只適合原任務的長摘要。
- 來源：[Break It Down, Pass It On](https://arxiv.org/abs/2608.20274)

### Repo0：先把需求、元件與對齊關係建成雙 DAG，再生成整個儲存庫

- **論文提交：2026-08-20。** Repo0 將零起點程式碼生成分成需求 DAG、元件 DAG 與兩者的對齊，先反覆修正模組結構，再以測試驅動方式實作。
- 作者在 RepoCraft 的 6 個真實儲存庫、GPT-5 mini 與 DeepSeek V3.2 上，回報相對 RPG 最多提高 20.08 個百分點功能覆蓋率、29.74 個百分點測試通過率。
- 方法值得借鏡的是「先驗證需求到元件的可追蹤性，再寫程式」；但只有 6 個儲存庫，且數字是作者結果，不能直接當成大型既有系統的效果保證。
- 來源：[Repo0 論文](https://arxiv.org/abs/2608.19854)

## 4. 社群實戰心得

### Claude Code 的 Advisor 可能讓 `/compact` 失去提示快取效益

- **回報：2026-08-22，GitHub issue 尚未結案。** 回報者在 Claude Code 2.1.239 做相同情境的 A/B 測試：啟用 Advisor 時，單次壓縮成本紀錄為 86,493 microdollars；停用後為 24,688，約差 3.5 倍。啟用時另產生 54,008 個 cache-creation tokens，而停用時為 0。
- 回報者推測內部 fork 缺少 Advisor tool／system 區段，造成提示前綴不同而無法命中快取；目前沒有維護者確認。`CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1` 只是該環境的診斷性繞法，不應直接成為所有人的永久設定。
- 可操作做法：在自己的計費紀錄對 `/compact` 前後做 A/B，記錄 cache read／creation 與模型版本；確認重現後再暫時停用，並追蹤 issue 更新。
- 來源：[anthropics/claude-code #88755](https://github.com/anthropics/claude-code/issues/88755)

### 多個 Coding Agent 共用同一個 clone，Git 無法保留「哪個工作階段擁有哪一行」

- **回報：2026-08-22，GitHub issue 尚未結案。** 一名使用者在 3～6 個並行工作階段共用同一 working tree 時遇到 3 次歸屬混淆。其 14 天樣本中，286 個 commit 有 106 個觸及競爭檔案，其中 58 個又夾帶其他檔案。
- 改用每個工作階段各自寫 fragment inbox 後，7 天內 23 個 fragment 的夾帶率由 55% 降至 0%；但仍有 3 次繞過約定直接編輯，顯示規範本身不是強隔離。
- 可操作做法：每個 Agent 使用獨立 worktree／clone；提交時使用明確 pathspec，並在 commit 前檢查 staged diff。回報數字是單一團隊案例，不是普遍發生率。
- 來源：[anthropics/claude-code #88862](https://github.com/anthropics/claude-code/issues/88862)

## 5. YouTube 深度整理

今天先搜尋 PAPAYA 電腦教室與多個中英文 AI／工具頻道；PAPAYA 最新公開影片仍是昨日已整理內容，故不重複。以下兩部均在交付前重新查核超過 10,000 次觀看，並已閱讀可靠字幕；觀看數會持續變動。

### 1. Better Stack｜[4 Billion Free LLM Tokens… One API (FreeLLMAPI)](https://www.youtube.com/watch?v=sHOwbyMbun0)

- **發布／查核：**2026-08-20；16,222 次觀看；9:13；英文自動字幕，已完整審閱。頻道品牌內容，未標示外部贊助。
- **摘要：**影片示範把多家模型供應商的免費額度放到一個 OpenAI 相容端點後，讓路由器依模型能力、額度與健康狀態切換。重點不是「免費前沿模型」，而是用本機控制面統一個人實驗的多把金鑰。
- **重點：**
  1. 專案宣稱每月約可聚合 40 億 tokens；這是維護者估算，不是獨立量測。
  2. 安裝後在本機儀表板加入 Google、Groq、Cerebras、Mistral、OpenRouter 等供應商金鑰。
  3. Balanced routing 依智力排名、可用額度、健康狀態與速率限制選模型，失敗時再切換。
  4. 範例用統一 base URL 與 API key 驅動 Python CLI 任務管理器，產出程式與 README。
  5. 官方儲存庫目前列 29 家供應商、251 個模型家族與 358 個端點；影片口述與網站數字不同，顯示目錄變動很快。
- **步驟／工作流程：**檢查安裝腳本與 Docker 設定 → 產生加密金鑰 → 啟動本機儀表板 → 加入低權限供應商金鑰 → 先在 playground 測試 → 將客戶端改成統一端點 → 人為關閉一個供應商驗證 failover。
- **工具／模型：**FreeLLMAPI、Docker Compose、OpenAI 相容 API，以及多家免費層模型；不是單一模型評測。
- **作者心得與優缺點：**作者認為適合 side project、原型與大量 Agent loop；優點是一把金鑰、集中額度與自動 failover，缺點是模型品質與延遲不一致、免費額度與條款隨時可能改變。
- **限制／適合對象：**官方明確定位為單人、本機優先、個人實驗用途，無 SLA、沒有前沿模型保證，不適合正式環境或敏感資料。供應商條款仍各自適用；即使金鑰以 AES-256-GCM 儲存在本機，也應使用可撤銷、低權限金鑰。
- **是否值得看：** **值得有多家免費額度、想快速做原型的人看**；需要穩定延遲、集中稽核與正式支援者應改用成熟閘道或受管服務。
- **可立即嘗試：**只接兩家測試帳戶，固定一個非敏感 prompt，量測 20 次路由的成功率、P50／P95 延遲與模型漂移；通過後才接入個人專案。
- **可靠時間點：**[0:00](https://www.youtube.com/watch?v=sHOwbyMbun0&t=0s) 前提、[1:45](https://www.youtube.com/watch?v=sHOwbyMbun0&t=105s) 安裝與路由、[4:30](https://www.youtube.com/watch?v=sHOwbyMbun0&t=270s) 範例、[6:15](https://www.youtube.com/watch?v=sHOwbyMbun0&t=375s) 同類工具比較、[7:15](https://www.youtube.com/watch?v=sHOwbyMbun0&t=435s) 優缺點。
- **官方交叉查證：**[FreeLLMAPI GitHub](https://github.com/tashfeenahmed/freellmapi)、[FreeLLMAPI 官網](https://freellmapi.co/)

### 2. IBM Technology｜[AI Agents vs Business Rules: Which Should Make Decisions?](https://www.youtube.com/watch?v=i1ZmNUbRGD4)

- **發布／查核：**2026-08-20；10,097 次觀看；10:25；人工英文字幕，已完整審閱。IBM 品牌內容，未標示外部贊助；說明欄註明逐字稿與 metadata 曾使用 AI 協助。
- **摘要：**影片把決策系統分成可預期、可稽核的規則，以及能處理非結構化與例外情境的 Agent；最佳實務通常不是二選一，而是讓規則先處理明確案件，再把模糊案件送給 Agent，最後加守門規則與人工覆核。
- **重點：**
  1. Business rules 是明確的條件—動作，結果可重現、可測試、可稽核，沒有模型推論。
  2. Agent 接收目標、上下文與工具，能處理非結構化資料與未預期情境，但輸出具機率性。
  3. 退款、貸款、保險等結構化且受規範的決策，應先由規則處理。
  4. 長信件、文件、異常案例或需要跨工具蒐集資料的任務，才適合交給 Agent。
  5. 高風險混合流程是：規則初篩 → Agent 處理例外 → 決定性 guardrail → 高價值案件人工覆核 → 最終決策。
- **步驟／工作流程：**列出決策輸入 → 標記明確與模糊案例 → 規則自動核准／拒絕明確案例 → Agent 只處理未解案例 → 以金額、權限與合規規則檢查 Agent 輸出 → 超過門檻交給人。
- **工具／模型：**概念性架構示範，沒有指定模型或可重現程式碼；重點是規則引擎、Agent、工具呼叫、guardrail 與 human-in-the-loop。
- **作者心得與優缺點：**規則便宜、快速、穩定且易稽核，但難處理長尾；Agent 有彈性，但成本、延遲與結果一致性較差。混合式設計把各自放在合適風險區段。
- **限制／適合對象：**沒有實測數字，也不是法規或產業安全認證；適合正在設計審批、客服、理賠、退款流程的產品與平台團隊，不適合作為選模型的 benchmark。
- **是否值得看：** **值得需要決定「何處真的要用 Agent」的團隊看**；內容偏架構判斷，已有成熟決策引擎經驗者可直接看後半段。
- **可立即嘗試：**拿一條現有 AI 決策流程，先把 80% 可列舉條件改成規則，只保留模糊 20% 給 Agent，再加一條不可逆操作必須人工確認的閘門。
- **可靠時間點：**[0:29](https://www.youtube.com/watch?v=i1ZmNUbRGD4&t=29s) 規則、[1:23](https://www.youtube.com/watch?v=i1ZmNUbRGD4&t=83s) Agent、[4:09](https://www.youtube.com/watch?v=i1ZmNUbRGD4&t=249s) 使用時機、[6:20](https://www.youtube.com/watch?v=i1ZmNUbRGD4&t=380s) 混合流程、[7:54](https://www.youtube.com/watch?v=i1ZmNUbRGD4&t=474s) guardrail 與人工覆核。

## 6. 今天值得嘗試

### 用 45 分鐘把一條 Agent 決策流程改成「規則優先、例外才推論」

1. 選一條可逆、非敏感流程，例如 issue 分類或內部文件分流，蒐集 10 個真實範例。
2. 先寫 3～5 條可測試的決定性規則，讓明確案例不呼叫模型。
3. 只把規則無法判斷的案例送給 Agent，限定可讀資料與工具權限。
4. 在輸出端加兩道閘門：格式／範圍檢查，以及不可逆或高價值操作的人工確認。
5. 記錄規則命中率、Agent 成功率、P95 延遲、token 成本與人工介入率；一週後再決定是否擴大。

這個小實驗可同時驗證今日三個主題：Anthropic 的新 Agent 工具是否真的需要、IBM 提議的混合決策是否降成本，以及 MidTool 所強調的工具能力是否能在你的真實任務上成立。

## 7. 來源與可信度說明

- **官方事實：**OpenAI、Anthropic 的產品公告、文件與計價表是功能／供應狀態的主要依據；官方客戶案例與降價敘述仍屬廠商提供，已另外標示。
- **研究證據：**MidTool、MaliciousSkillBench、Skill transfer、Repo0 均為 2026-08-20 提交的預印本；本文只報作者實驗，不視為獨立複現或正式產品能力。
- **社群證據：**兩個 Claude Code issues 都有具體版本、樣本或 A/B 數字，但尚未由維護者結案；只能作為診斷線索，不能推論普遍發生率。
- **YouTube 證據：**兩部影片均於交付前重新確認觀看數門檻並完整閱讀字幕；產品數字另以官方儲存庫交叉查證。影片心得、示範與官方事實已分開表述。
- **去重原則：**昨日已整理的 AI4AI-Bench、Phantom Gains、MemTrapBench、PolicyGuide、Adaptive Reasoning、Codex 子代理上下文限制與 Claude Desktop GitHub 限流，今日沒有新的官方進展，因此不重複。
