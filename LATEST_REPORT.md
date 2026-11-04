# AI 情報日報｜2026-11-04

> 搜尋範圍：以 Asia/Taipei 2026-11-02～11-04 為主，補充一週內仍有直接用法的新進展。官方公告／文件是官方事實；GitHub、OpenAI、Google 的數字與效能屬發布者自述，不能當成獨立驗證。昨天已報題目若沒有新進展不重複。

## 1. 社群實戰用法

### Agent 設定檔開始影響整個 repo 的交付節奏

- **新在哪裡：** GitHub 10/28 發布的 2026 Octoverse 顯示，2026 年新建且含 agent 設定檔的 repo，平均 commit 數是沒有設定檔 repo 的 8 倍；到 9 月，GitHub 上超過 40% 的 PR 由 agent 先產生草稿，3 月是 17%。這是 GitHub telemetry 與可偵測的 agent 訊號，不是獨立研究，也不代表設定檔本身造成增長。
- **可以怎麼開始：** 不要先寫一份很長的 prompt；在 repo 放最小可執行的 `AGENTS.md`／同類規則，寫清楚測試、不可碰的目錄、完成證據與 PR 邊界。讓 agent 先做小 PR，再把「變更範圍、測試輸出、人工 review」當成固定交付欄位。
- **編輯心得與限制：** 這個實戰訊號真正值得帶走的是「agent 使用已進入 repo 流程」，不是 8 倍就等於 8 倍生產力。GitHub 自己也說 agent involvement 是可偵測下限；設定檔過時、權限過大或沒有 reviewer capacity，反而會加速錯誤。
- 來源：[GitHub Octoverse 2026](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/)（2026-10-28，GitHub 官方 telemetry；高可信於觀測範圍，效果仍需自行驗證）。

## 2. 社群新工具與新玩法

### Qwen Code 0.26.6：把 Web Shell 的 agent 活動變成可追蹤的工作佇列

- **新在哪裡：** Qwen Code 11/02 的 v0.26.6 新增 Web Shell sidebar activity view，可集中看 approval、input、error、未讀完成與執行中工作，也能 bulk read/archive；另外加入 Split View、每模型成功率／輸出速度／首 token latency 與 Workflow mode 提示。這些是專案 release note 的功能描述。
- **可以怎麼開始：** 先在測試 repo 開兩個低風險 session：一個跑測試修復，一個做文件；用 activity view 只追 approval、error 與完成狀態，再在 token usage panel 比較模型的首 token latency、輸出速度與失敗原因。確認權限與 workspace 邊界後才讓它碰可發布分支。
- **編輯心得與限制：** 這類 UI 解決的是「多個 agent 到底卡在哪裡」的可見度，不會自動解決衝突、成本或錯誤 patch。Workflow mode、managed agent 與 Web Shell 仍要依版本與部署方式確認；不要把 sidebar 顯示完成當成程式已通過測試。
- 來源：[Qwen Code v0.26.6 release](https://github.com/QwenLM/qwen-code/releases/tag/v0.26.6)（2026-11-02，專案官方 release；高可信於功能清單，實際效果需自行試跑）。

## 3. 官方新功能與推薦用法

### OpenAI Pando：agent 越多，Git 後端也要為並行寫入重新設計

- **新在哪裡：** OpenAI 11/02 公開 Pando 的設計：保留 Git client／protocol 相容性，以 blob storage、metadata 與 packfile URI 來處理大量並行 push／fetch；官方稱 production median push latency 降近 5 倍、每日可提供接近 1 PB Git data。這些是 OpenAI 內部系統的官方數字，不是一般 repo 可直接複製的 benchmark。
- **可以怎麼開始：** 一般團隊不必照抄 Pando；先量三件事：並行 agent push 的排隊時間、落後 checkout 的 fetch 時間、以及 branch／worktree 合併失敗率。把 agent 工作拆到獨立分支或 worktree，保留 read-your-own-write 與非 force push 的驗收條件，再決定是否需要 repository backend 優化。
- **編輯心得與限制：** 這篇最實用的是容量規劃與一致性思路，不是立刻換 Git server。Pando 依賴 OpenAI 的 blob、metadata、cache 與客製 Git build；官方也只說正在探索分享技術，沒有宣稱已提供可直接部署的產品。
- 來源：[Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai/)（2026-11-02，OpenAI Engineering；高可信於架構與內部數字，外部可用性未確認）。

### Codex／ChatGPT 進入 CAD、PCB 與模擬流程，但人工製造審查仍是必要步驟

- **新在哪裡：** OpenAI 11/03 分享內部硬體團隊用模型處理 CAD、製造圖、模擬與跨 ECAD 設計；示範裝置由 Astra 產生外殼、PCB 與軟體整合，但官方也明確寫到模型沒有穩定掌握製造限制、公差與裝配細節。頁面中的 BenchCAD 2.0 分數與 token 增長都是 OpenAI 自行報告。
- **可以怎麼開始：** 把工程任務切成「需求與限制 → 候選設計 → CAD／PCB 產出 → 模擬 → 製造性審查」五段；讓模型先做可回退的草案與檢查清單，要求工程師核對尺寸、公差、材料、熱／電安全與實際工具輸出，不要直接把生成設計送製造。
- **編輯心得與限制：** 這是官方工作流展示與廠商 benchmark，不是通用能力保證；對一般前端／後端團隊，最可借用的是把多專業約束顯式化、讓 agent 做重複檢查，再保留專家簽核。
- 來源：[Accelerating engineering for the physical world](https://openai.com/index/accelerating-engineering-for-the-physical-world/)（2026-11-03，OpenAI Research；高可信於案例與限制，數字為廠商結果）。

## 4. 使用心得與避坑

### GitHub AI application code scanning：把 prompt injection 當成 PR 安全問題

- **新在哪裡：** GitHub 10/28 將 AI application／agent 風險偵測放進 public preview，會在 PR 旁邊找 indirect prompt injection（XPIA）、敏感資訊外洩與 excessive agency 等路徑，並給修復提示。需要 GitHub Advanced Security，且目前不支援 GitHub Enterprise Server。
- **可以怎麼開始：** 若團隊已有 Advanced Security，先對一個 agent repo 開啟 code scanning，檢查 alert 是否指出「不可信 issue／網頁／檔案內容 → model → tools／資料／業務系統」的路徑；再用最小權限、輸入隔離、輸出驗證與人工 approval 修正，最後用一個惡意 fixture 做回歸測試。
- **編輯心得與限制：** scanner 是早期防線，不是 prompt sanitizer，也不會證明 agent 沒有其他資料外洩路徑。public preview 的規則會變，且 license、平台限制與誤報要納入成本評估。
- 來源：[Code scanning for AI applications in public preview](https://github.blog/changelog/2026-10-28-code-scanning-for-ai-applications-in-public-preview/)（2026-10-28，GitHub Changelog；高可信於支援範圍，preview 結果需自行驗證）。

### Google Jules 將關停：先匯出 agent 記憶，再談換到 Antigravity

- **發生什麼事：** Google Jules 10/29 公告將於 2026-12-31 wind down；11/11 前仍可完成 session，之後到年底改為 read-only。官方提供匯出設定、環境變數、排程、連接 repo、記憶、setup scripts，以及每個 session 的 prompt、plan、activity log 與 code patches；GitHub 上的 code、branch、PR 不受影響。
- **可以怎麼開始：** 先列出未完成 session、只存在 Jules 的決策與排程，再安裝官方 Jules Tools 登入並執行 export；抽查匯出內容真的能讓另一位工程師接手。`env-variables.json` 含環境變數值，匯出資料要放私密位置，不要提交 repo；不要假設資料會自動搬到 Antigravity，官方沒有宣布自動 migration。
- **編輯心得與限制：** 這是服務生命週期的提醒：程式碼備份和 agent 上下文備份是兩件事。若團隊依賴背景任務，先把觸發條件、權限與人工 review 寫成 repo 內文件，再逐一重建；不要在沒有確認替代服務能力前一次切換全部排程。
- 來源：[Jules Turndown](https://jules.google/docs/changelog/2026-10-29/)（2026-10-29，Google Jules 官方文件；高可信於日期、匯出範圍與警告）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-11-02～11-04，必要時放寬至一週；目前沒有同時能證明觀看數超過 10,000、已讀可靠字幕／逐字稿、且具實測／教學／技術拆解深度的候選，因此不從標題或介紹猜測內容，也不硬湊影片。

## 今天最值得帶回團隊的三個檢查

- **協作：** 讓 agent 設定檔、分支／worktree、測試輸出與 review 成為同一條證據鏈。
- **安全：** 任何「不可信內容 → agent → tools／資料」的路徑，都要按 prompt injection 與最小權限檢查。
- **可持續：** 服務會關停、agent 會產生大量並行工作；先保存上下文與可回復邊界，再擴大自動化。

## 今日一句話

AI coding 的下一個瓶頸不是生成速度，而是能不能在大量並行工作、服務變動與不可信輸入中，仍保留可追溯、可審查、可接手的工程流程。
