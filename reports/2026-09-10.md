# AI 實用日報｜2026-09-10

約 3–4 分鐘閱讀。今天的共同主線是：Agent 開始被當成一個有規格、權限與驗收的工程團隊來管理；官方工具也把「允許什麼、何時要人批准」做得更細。以下分開標示社群經驗、官方功能與廠商自述，不把單一案例當成普遍 benchmark。

## 1. 社群實戰用法

### 多模型分工真正有用的地方，是隔離職責與驗收證據

9 月 9 日，r/ClaudeAI 有一位具 20 多年開發經驗的作者分享大型遊戲世界 AI Agent 的工作流：一個模型維護高層架構，另一個模型反駁架構並對照程式庫補文件，接著由不同模型寫實作，再用獨立 validator 對照架構找「漏接」，最後以對話腳本與資料轉換紀錄驗收。這是作者的實作分享，不是成功率研究；作者也承認自己幾乎不逐行讀 code。

怎麼試：先挑一個小模組，寫出架構不變量、三個正常案例與三個失敗案例；讓 worker 只負責實作，讓沒有實作上下文的 reviewer 只看需求、diff、測試與執行紀錄。reviewer 的結論必須能連到一個可重跑的測試，不要只看多個 Agent「討論得很完整」。

編輯心得：這套流程的價值不是模型數量，而是把規劃、實作、審查和行為驗證拆開。若人類只看摘要、不保留原始測試與資料轉換，仍可能只是把不理解的程式碼交給另一個 Agent 背書。原文沒有提供完整 prompt、validator 規則或可重現 benchmark，小專案使用會過度設計。

來源：[r/ClaudeAI 原始分享（2026-09-09）](https://www.reddit.com/r/ClaudeAI/comments/1wbh0v5/dev_with_20_years_xp_c_as_fast_as_i_can_type_am_i/)

## 2. 社群新工具與新玩法

### agent-roadmap：用一個可讀 JSON 保存人與 Agent 的 release 計畫

作者 9 月 9 日公開的 [agent-roadmap](https://github.com/mikelux1/agent-roadmap) 只有一個 HTML、一個 Python 腳本和一個 `roadmap-data.json`，不需要伺服器、帳號、建置工具或套件。人可以在瀏覽器拖曳 release、backlog、狀態與 effort points；Agent 則從 CLI 執行 `status`、`changes --by human`、`add`、`set` 等指令。每次 Agent 修改會留下 session stamp，畫面可標出最新變更；同一欄位衝突時保留人的版本並顯示 Agent 版本。

怎麼開始：從最新 release 取 `roadmap.html` 與 `roadmap.py`，執行 `python3 roadmap.py init --project "My app" --agent Claude`，再把 `agent-instructions.md` 的規則放進 `AGENTS.md` 或相應的 Agent 指令檔。先用一個不含機密的專案，觀察 `status`、`changes --by human` 與 Git diff 是否真的讓交接更清楚。

限制要先知道：即時檔案同步依賴 File System Access API，主要是 Chrome／Chromium；Firefox、Safari 只能用匯入匯出。它是單一人類加單一 Agent 的 local-first 看板，不是多人即時協作工具；詳細欄位是可執行的 raw HTML，不要貼入不可信內容。專案目前只有一個 commit、仍是很早期的 quick-and-dirty 工具，不能把「有 session 紀錄」誤認成完整審計。

來源：[GitHub README](https://github.com/mikelux1/agent-roadmap)｜[作者原始貼文（2026-09-09）](https://www.reddit.com/r/ClaudeAI/comments/1wbaqvq/created_a_quick_and_dirty_release_and_roadmap/)

## 3. 官方新功能與推薦用法

### GPT‑6 Astra 正式進入 Work、Codex 與 API，但企業權限仍是第一道門

OpenAI 9 月 9 日更新 GPT‑6 Astra 的工作場景說明：Astra 可在 ChatGPT Work、Codex 與 API 使用，標示價格從每百萬 input tokens US$10、output tokens US$50 起；官方把 computer use、瀏覽、軟體工程與文件工作列為主要能力。企業管理員可限制核准的網站與桌面 App、上傳下載、瀏覽歷史，並以 confirmation policy 和 automated review 卡住高後果工具呼叫；企業 access launch 時預設關閉。

推薦用法：先只給一個低風險、可回滾的小任務，限制網站與資料來源，要求每個外部寫入都停在人工確認；把「模型完成」定義成通過測試、產物可讀回，而不是畫面看起來做完。官方頁列出的 Terminal-Bench 4.0 57.9% 與安全 benchmark 改善都屬 OpenAI 自述結果，不能直接推論成你的專案成功率。

來源：[OpenAI｜GPT‑6 Astra（2026-09-09）](https://openai.com/index/gpt-6-astra-next-generation-work/)｜[GitHub｜Astra 已進入 Copilot（2026-09-04）](https://github.blog/changelog/2026-09-04-gpt-6-astra-is-generally-available-in-github-copilot/)

### GitHub 把 Copilot Agent 的 shell、檔案與網路權限做成企業集中政策

GitHub 9 月 9 日宣布 enterprise managed permissions GA：管理者可分別設定 shell command、file read/edit 與 network domain 哪些要封鎖、要人工批准或可直接通過；政策不能被使用者、workspace、auto-approval 或舊批准降低，並已涵蓋 Copilot app、CLI 與 VS Code 的 Agent Host session。同日也加入最多選 25 個 Code Quality findings、交給 Copilot 在分支上修復並開 PR 的 agentic autofix；另可用 ruleset 阻擋含未解決 secret scanning alert 的 PR 合併。

怎麼用：先把 production secrets、部署指令與外部網域設成 block 或 approval，再為低風險測試 repo 開 autofix；合併前同時要求 CodeQL／secret scan 完成且人工讀 diff。這讓 Agent 更可控，但 AI 自動開 PR 仍不等於自動合併。

來源：[Copilot managed permissions](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations)｜[agentic autofix](https://github.blog/changelog/2026-09-09-remediate-code-quality-findings-with-agentic-autofix)｜[PR secret 阻擋規則](https://github.blog/changelog/2026-09-09-block-pull-requests-with-exposed-secrets-from-merging)

### 研究訊號：OpenAI 公開 Navier–Stokes 解法，但仍不是已獲數學界接受的千禧年獎解答

OpenAI 9 月 8 日表示，內部系統產生了 Navier–Stokes existence and smoothness 問題的一份分析證明與 Lean formalization，並描述約 10,000 個並行 Agent、2.7 million messages 和約 130 billion output tokens 的工作量。這是值得關注的 AI 輔助數學研究案例；但頁面也明說不打算宣稱取得 Millennium Prize，外部數學審查與獨立重現仍是必要條件。不要把「Lean 可形式化」或 Agent 規模直接當成學界已確認。

來源：[OpenAI｜On the Navier–Stokes Millennium Prize Problem（2026-09-08）](https://openai.com/index/navier-stokes-solution/)

## 4. 使用心得與避坑

### 先把廠商 benchmark、內部案例與你的 production 指標分成三張表

今天的 Astra 頁面同時放了價格、Terminal-Bench、客戶引言、內部安全 benchmark 和企業控制項；這些證據的性質不同。最容易踩的坑，是把廠商選定的 benchmark、單一客戶案例或「少幾次 retry」直接換算成團隊產能與安全保證。

實際導入時建議分三層記錄：模型／工作流的公開 benchmark；自己固定任務上的完成率、返工次數、token 成本與人工 review 分鐘；最後是高風險操作的誤觸、撤銷與回滾紀錄。GitHub 的 managed permissions、secret scanning 和 CodeQL 2.27.0 都能縮小風險面，但不會替你判定需求是否正確；CodeQL 2.27.0 雖新增 Linux ARM64 原生支援與 Rust command-line-injection query，舊的跨平台 zip 也進入淘汰路徑，升級前要在實際 runner 重跑掃描並檢查新增告警。

來源：[CodeQL 2.27.0（2026-09-09）](https://github.blog/changelog/2026-09-09-codeql-2-27-0-adds-support-for-linux-arm64)｜[OpenAI Astra 工作場景與限制](https://openai.com/index/gpt-6-astra-next-generation-work/)

## YouTube：今日無推薦

已主動查核 PAPAYA、Tech With Tim、IBM Technology、Matthew Berman、Matt Wolfe 等中英文 AI／工具／Agent 頻道。PAPAYA 有一部 9 月 9 日發布、查核約 7.1 萬觀看的 ComfyUI＋Claude 教學，頁面列出 7 個章節；但匯出逐字稿時回報沒有 transcript，無法完成「先讀字幕／逐字稿」的硬門檻。其餘查到的候選不是超過 24–48 小時，就是偏舊、偏短評或無可靠逐字稿，因此不以標題和簡介猜測內容。

今天先試：拿一個不含機密的小功能，寫三條不變量；讓一個 Agent 實作，讓全新上下文的 reviewer 只看需求、diff、測試與執行紀錄，最後用 10 分鐘記錄返工與人工審查時間。若分工沒有降低返工，就不要因為 Agent 數量增加而繼續加層。
