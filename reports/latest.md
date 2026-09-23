# AI 情報日報｜2026-09-23

約 4 分鐘閱讀。今天的主線是：模型價格與快取開始直接決定 Agent 能不能長時間工作；多 Agent 工作台變得更容易上手，但真正的瓶頸轉移到 CI、權限與供應鏈驗證。

> 截稿時間：2026-09-23 08:02（Asia/Taipei）
> 查核範圍：優先 2026-09-21～09-23 的官方公告、官方 repo、工程團隊第一手文章與社群資料；補充最近一週仍具立即使用價值的安全進展。未重複 9/22 已報導的 Agent 成本／控制／安全主線、GitHub Agentic Workflows、低資源語言合作、OpenAI Academy、Gemini 3.8 Live 與 OpenAI misalignment framework。
> 證據標示：官方資料是官方事實；公司工程文章、GitHub repo 與社群討論是第一手實作或作者觀點；廠商／作者 benchmark、觀看數、效率與準確率都不等於獨立驗證。

## 1. 社群實戰用法

### Linear 的答案：AI coding 加速後，先重做 CI 的等待路徑

- **新在哪裡：** Linear 9/21 分享，AI 讓 PR 產出變快後，CI 成了新的瓶頸；他們把 PR 等待時間從超過 6 分鐘降到略高於 5 分鐘，測試 runner time 約減半。做法包括更快 runner、縮短 change-detection checkout、把非必要工作移出 critical path、只安裝工作需要的依賴，以及把短檢查合併後平行執行。
- **可以怎麼開始：** 先量每個 CI job 的「等待、checkout、安裝、真正測試」四段時間；不需要完整 working tree 的 gate 改成 shallow／sparse checkout，依賴少的 job 不要安裝整個 monorepo，能平行的短檢查合併到較少 runner。
- **編輯心得：** 這比再換一個 coding model 更可立即複製。Agent 產生的 PR 越多，CI 的固定 setup 成本越會放大；先把瓶頸拆成可量的階段，再決定要加 runner、shard 還是改工具鏈。
- **限制：** 數字是 Linear 自己的 TypeScript monorepo 與流量，不能直接推論到所有專案；他們也提醒共享 module state、增加 shards 都有正確性與成本風險。

來源：[Linear：AI coding has made CI a bottleneck](https://linear.app/now/ci-bottleneck-reworked)；可信度：公司工程團隊第一手文章，數字為自家結果。

## 2. 社群新工具與新玩法

### Proliferate：用 worktree 把 Claude、Codex、OpenCode、Grok 並排跑

- **新在哪裡：** Proliferate 是開源 AI IDE，把不同 coding agent 放進同一個工作區；每個任務有自己的 branch、terminal、conversation 與 review state，也支援 subagent、MCP、Skills、Browser／Computer Use 與排程 workflow。GitHub 頁面目前約 500 stars、84 forks。
- **可以怎麼開始：** 先挑兩個互不依賴的小任務，各自放進獨立 worktree；讓一個 Agent 寫修正、另一個做 reviewer，再以測試與 diff 逐一驗收。不要一開始就把同一檔案交給多個 Agent 同時改。
- **編輯心得：** 這個玩法的價值不是「更多 Agent」，而是把隔離、比較與 review 變成產品原語；對需要在 Codex／Claude／其他 harness 間比較的人，成本低於自己拼一套 supervisor。
- **限制：** 仍是早期開源產品；本機／雲端 Agent 的憑證、MCP 權限、worktree 清理與資料留存要自行審核，AGPL-3.0 也要先看是否符合團隊部署方式。

來源：[Proliferate GitHub repo](https://github.com/proliferate-ai/proliferate)；可信度：公開 repo 與 README，star／fork 是查核當下訊號，不是品質保證。

### ZCode 開源：桌面、瀏覽器與終端 Agent 集成，但先做隱私隔離

- **新在哪裡：** Z.ai 的 ZCode 近期公開源碼，提供 Desktop、Web 與 terminal Agent，並把 client、server、shared UI、CLI 與 runtime 放在同一個 repo；官方頁面目前約 2,000 stars、488 forks。
- **可以怎麼開始：** 若要評估，先在沒有公司 repo、SSH key 或雲端憑證的測試環境跑 Web／CLI；把 outbound network、檔案讀取、workspace 上傳與登入流程逐項記錄，再決定是否接入正式專案。
- **編輯心得：** 它把「從哪裡控制 Agent」做成同一套工作台，適合想比較本機與瀏覽器操作的人；但開源不等於已完成安全審查。
- **限制：** 9/21 的報導整理了開發者對 ZCode 曾未經清楚同意上傳本機 workspace 資料的疑慮；Z.ai 表示已修補、刪除相關資料並計畫邀請第三方檢視。在第三方稽核與可重現測試完成前，不要把它放進含 secrets 的工作區。

來源：[ZCode GitHub repo](https://github.com/zai-org/ZCode)；[事件與廠商回應整理](https://www.tomshardware.com/tech-industry/artificial-intelligence/devs-say-chinese-ai-company-silently-uploaded-hundreds-of-megabytes-of-local-workspace-data-z-ai-the-firm-behind-the-glm-models-didnt-ask-for-user-consent-and-made-564-attempts-to-exfiltrate-313mb-archive)；可信度：repo 是官方第一手資料，隱私事件為媒體與開發者回報，仍應等待可重現稽核。

## 3. 官方新功能與推薦用法

### GPT-6 Sol／Luna 上線：把模型選擇改成「工作量 × 成本」

- **官方更新：** OpenAI 9/22 發布 GPT-6 Sol 與 GPT-6 Luna；API 文字價格相較 GPT-5.6 promotional pricing 各降 50%：Sol 為每百萬 input／output token 2／10 美元，Luna 為 0.10／0.50 美元。兩者已在 Codex 與 ChatGPT Work 逐步提供，也進入 GitHub Copilot 的 model picker。
- **推薦用法：** Luna 用於小型修正、摘要與快速探索；Sol 用於需要多步驟驗證的 coding／Agent 任務；Astra 留給高風險或需要最強 computer-use 的工作。先用固定小任務記錄成功率、token、重試與 review 時間，再決定預設模型。
- **編輯心得：** 價格下降讓「多跑一輪 reviewer」變得更可行，但不代表模型能取代驗收；OpenAI 的 AutomationBench、FrontierCode、DeepSWE 等數字是官方／合作方或公開報告整理，應標示為廠商結果。
- **限制：** ChatGPT rollout、Copilot 方案與模型政策仍分批開放；不同 surface 的 system prompt、tools 與計費方式可能不同，API 分數不能直接當成你的 IDE 體驗。

來源：[OpenAI：GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)；[GitHub：GPT-6 Sol／Luna in Copilot](https://github.blog/changelog/2026-09-22-openais-gpt-6-sol-and-gpt-6-luna-now-available/)；可信度：官方公告；benchmark 為官方／合作方結果。

### Prompt caching 新工具：先固定工具定義，再調 reasoning effort

- **官方更新：** OpenAI 9/22 為 GPT-6 提供更高的 prompt cache hit rate、30 分鐘共享 prefix 快取折扣、Prompt Caching Dashboard、cache-miss diagnostics、explicit breakpoints 與 prewarming；在 GPT-6 上調整 reasoning effort 或工具可用性也能保留既有快取脈絡。
- **推薦用法：** 把穩定的 system instructions、tool schema 與參考資料放在前段；保持工具名稱、schema 與順序穩定，把會變動的任務資料放後段；先用 dashboard 找 miss reason，再改 prompt，不要盲目把整段 context 重送。
- **編輯心得：** 這是長時間 Agent 真正能省錢的工程功能。尤其要把「快取命中率」加入成本監控，而不是只看平均 token；工具 schema 的小改動可能讓整段 prefix 失去重用。
- **限制：** OpenAI 引用的「最多 90% cached input discount」與合作方成本改善都是產品／客戶案例，實際命中率取決於請求形狀、模型、工具與時間窗。

來源：[OpenAI：Better prompt caching for GPT-6](https://openai.com/index/better-prompt-caching-for-gpt-6/)；可信度：官方產品公告，合作方改善數字為案例結果。

## 4. 使用心得與避坑

### Plugin4Shell：鎖 commit hash 不代表 Agent 真的拿到那個版本

- **新在哪裡：** Air Security 9/18 揭露的 Plugin4Shell 顯示，部分 Agent 在 marketplace 鎖定 commit SHA 後，仍可能因 Git 把看似 SHA 的值解讀成 branch 名稱而取到另一份程式；插件又通常以使用者權限執行，風險包含讀取檔案、憑證與可登入系統。
- **可以怎麼開始：** 更新 Claude Code 至 2.1.179+、Codex 至 0.146.0+；對非 GitHub host 的 plugin，安裝前自行 `git cat-file -p <sha>`、核對 tree／檔案 hash，再把 plugin repo、commit、安裝時間與權限記錄到 audit log。不要只看 UI 顯示的版本字串。
- **編輯心得：** GitHub-based default marketplace 目前不容易觸發文中 branch-name 變體，但這不是「所有 plugin 都安全」；自訂 marketplace、公司 Git server、auto-update 與高權限 token 仍要視為供應鏈邊界。
- **限制：** 這是研究團隊與媒體揭露，未見所有廠商同步發布完整 advisory；文章也沒有證明已發生真實攻擊，且更新後是否清理已被替換的 plugin 仍需自行檢查。

來源：[The Hacker News：Plugin4Shell](https://thehackernews.com/2026/09/plugin4shell-lets-repository-owners.html)；[Codex public fix #34644](https://github.com/openai/codex/pull/34644)；可信度：研究團隊／媒體技術重現，影響範圍與修補狀態仍要以各 Agent 最新版本驗證。

### Copilot 的新模型很多：先看方案、usage billing 與 rollout

GitHub 9/21–9/22 連續加入 Grok 4.7、GPT-6 Sol／Luna 與 Claude Opus 5.5；這些模型都在不同 Copilot 方案、IDE／CLI／cloud agent surface 逐步 rollout，且使用 provider list pricing 的 usage-based billing。建議先在 model policy 限定可用模型，再用小型、可回滾的 PR 比較品質與成本；不要因 model picker 出現名稱，就假設所有 seat、所有 surface 或預算都已可用。

來源：[Grok 4.7 in Copilot](https://github.blog/changelog/2026-09-21-grok-4-7-is-now-available-in-github-copilot)；[Claude Opus 5.5 in Copilot](https://github.blog/changelog/2026-09-22-claude-opus-5-5-is-now-available-in-github-copilot)；可信度：GitHub 官方 changelog。

## YouTube

### 今日無推薦

主動查核 PAPAYA 電腦教室、Tech With Tim、IBM Technology、Matthew Berman、Matt Wolfe 與近期 AI coding／Agent 候選。Tech With Tim 的《Is Software Engineering Dying in 2026?》雖約 10 萬觀看，但查核時播放器標示未提供字幕／隱藏式輔助字幕，無法按規則閱讀可靠逐字稿；Ray Amjad 的 Jev 影片雖超過 10 萬觀看且有字幕，但已在 9/20 日報收錄。其餘候選未同時符合近 24–48 小時、超過 10,000 觀看、非 Shorts、可靠字幕與實測深度，因此不湊數推薦。

## 今日一句話

今天最值得帶走的是：模型價格下降與 prompt cache 讓長時間 Agent 更可負擔，但真正能把它送進 production 的差距，仍在 CI 等待路徑、worktree 隔離、插件供應鏈與可回溯的成本／權限紀錄。

## 來源總覽

- 社群與實戰：[Linear CI 工程文章](https://linear.app/now/ci-bottleneck-reworked)、[Proliferate](https://github.com/proliferate-ai/proliferate)、[ZCode](https://github.com/zai-org/ZCode)。
- 官方產品：[GPT-6 Sol／Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)、[GPT-6 prompt caching](https://openai.com/index/better-prompt-caching-for-gpt-6)、[GitHub Copilot model changelog](https://github.blog/changelog/2026-09-22-openais-gpt-6-sol-and-gpt-6-luna-now-available/)。
- 安全與避坑：[Plugin4Shell](https://thehackernews.com/2026/09/plugin4shell-lets-repository-owners.html)、[ZCode 隱私事件整理](https://www.tomshardware.com/tech-industry/artificial-intelligence/devs-say-chinese-ai-company-silently-uploaded-hundreds-of-megabytes-of-local-workspace-data-z-ai-the-firm-behind-the-glm-models-didnt-ask-for-user-consent-and-made-564-attempts-to-exfiltrate-313mb-archive)。
- YouTube：今日無推薦；已實際查核觀看數、字幕可用性、發布時效與是否重複昨日。
