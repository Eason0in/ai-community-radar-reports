# AI 情報日報｜2026-10-06

約 4 分鐘閱讀。今天的共同主線是：agent 工具開始把流程、審查與停止條件寫進可重播的結構，但「可重播」不等於「結果必然正確」。

> 截稿時間：2026-10-06 08:18（Asia/Taipei）。
> 查核範圍：優先查 2026-10-04～10-06；必要時補充近一週仍有實作價值的進展。已避開 10/05 的 ThinkingBox、AREX-2、OpenShell、GPT-6.1 Sol、Agents API、Dots 與 Tech With Tim harness 影片，除非本日有獨立新進展。
> 證據標示：官方公告／文件是官方事實；模型卡、benchmark 與產品方數字是作者或廠商結果；社群 release 與影片是實作經驗，不外推成普遍結論。

## 1. 社群實戰用法

### Pi 1.0.2：依 thinking level 調整 sampling，而不是一組參數打天下

- **新在哪裡：** Pi 10/04 的 [v1.0.2 release](https://github.com/earendil-works/pi/releases/tag/v1.0.2) 新增 `samplingParamsByThinkingLevel`，可在 `models.json` 依 thinking level 設 `temperature`、`top_p` 等 OpenAI-compatible 參數。
- **可以怎麼開始：** 先只為低／中／高三個 level 設不同參數，固定同一批任務比較成功率、延遲與成本；把設定當 routing 實驗，不要直接假設高 temperature 會帶來更好的探索。
- **編輯心得與限制：** 這是 harness 層的可控旋鈕，不是模型能力提升；release 只證明設定支援，最佳參數仍要用自己的任務驗證。

### Orca 1.4.220：Stop 應該真的停止背景程序

- **新在哪裡：** Orca 10/04 的 [v1.4.220 release](https://github.com/stablyai/orca/releases/tag/v1.4.220) 修正 native chat 的 Stop，會結束 Claude process、背景命令與 subagents；同時改善 interrupted turn、Codex retry、SSH 與 workspace 狀態。
- **可以怎麼開始：** 先在無 production secrets 的 repo 測試「執行中按 Stop → 檢查子程序、未送出的訊息、工作樹與檔案狀態」，把停止行為列入 agent 的驗收案例。
- **限制：** release notes 不是獨立可靠性審計；Windows ARM、OpenCode 既有 pane、Codex managed home 等已列出已知問題，升級前要看自己的平台。

## 2. 社群新工具與新玩法

### Cloudflare Clef：讓 agent 的路由決策回傳 typed probabilities

- **新在哪裡：** Cloudflare 10/01 開源 [Clef 與 Clef-flash](https://blog.cloudflare.com/clef-decision-models/)，不是生成長文，而是對輸入狀態與一組 typed questions 回傳各選項機率；可在 Workers AI 使用，也能從 [Hugging Face](https://huggingface.co/collections/cloudflare/clef) 下載 Apache 2.0 權重，另提供 Clef 的 RL fine-tuning 產品。
- **可以怎麼開始：** 把「客服分流、是否升級人工、是否阻擋」這類有限選項先包成 decision step；設 confidence threshold，低於門檻就交給人，不要讓機率直接等同授權。
- **編輯心得與限制：** 這種 bounded output 很適合放在 LLM 前後的路由層；Cloudflare 提到 64K context、vision encoder 與 latency benchmark，但那些是廠商結果，先用真實流量量 false positive、p95 latency 與人工接管率。

### Agent Orca：把 agent 變成 Kubernetes 資源來管理

- **新在哪裡：** 社群在 10/04 公開的 [agent-orca](https://github.com/heddles/agent-orca) 以 Kubernetes CRD 管理 `AgentRun`、長駐 `AgentDeployment` 與多步 `AgentWorkflow`，並把零信任網路、OAuth／OIDC、RAG、checkpoint、成本與 audit 放進平台層。
- **可以怎麼開始：** 只在 kind／測試叢集建立一個 one-shot `AgentRun`，先限制 namespace、egress、模型 key 與預算，再測試失敗重試、取消、checkpoint 恢復與外部 API auth。
- **限制：** 這是新社群專案，不代表已具備 production SLA；需要 Docker、Kubernetes、Redis／Postgres 等元件，部署複雜度遠高於單機 coding agent。

## 3. 官方新功能與推薦用法

### GitHub Copilot dynamic workflows：把多 Agent 流程寫成程式

- **官方更新：** GitHub 10/01 將 [dynamic workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) 帶到 Copilot CLI、Copilot app 與 SDK。你可以用程式固定順序、平行分工、結構化交接、checkpoint、pause／resume，而不是每次讓 agent 自己重新決定整張流程圖。
- **推薦用法：** 從 release check、PR 多檔審查或 incident triage 開始：deterministic steps 收集資料，agent 只負責需要判斷的節點，最後用 schema 驗證與人工 checkpoint 收口。CLI 需 `--experimental` 或 `/experimental on`。
- **限制：** 目前是 public preview；文件也明確說 agent 的內容仍可能不同，AI credit limit 是近似上限，已在途的工作可能讓實際用量超過設定。

### Anthropic Frontier Academy：企業導入開始把「會用模型」改成可考核職能

- **官方更新：** Anthropic 10/02 宣布投入 1 億美元，目標在 2027 年底培訓 10,000 名 [Frontier Deployed Engineers](https://www.anthropic.com/news/claude-frontier-academy)。第一批由 Accenture、Bain、Capgemini、Deloitte、McKinsey、Morgan Stanley、Novo Nordisk 等企業提名，課程包含 simulated deployment、security review、handover、graded practical 與 12 週 residency。
- **推薦用法：** 團隊內可仿照它的順序做小型能力矩陣：選題 → 威脅／資料界線 → 真實流程試作 → 驗收 → 交接；不要只用 prompt challenge 當 AI 能力證明。
- **限制：** 目前是企業提名制，這是 Anthropic 的培訓與人才策略，不是公開認證普遍有效的證據；badge 也不能取代你們自己的 production 安全與效益指標。

### ChatGPT 視覺廣告：先分清楚「測試」與「已全面上線」

- **官方更新：** OpenAI 10/05 發布 [新的 ChatGPT Ads 視覺格式](https://openai.com/index/new-chatgpt-ads-format-and-measurement/)，預計本月底先在美國、對一小批廣告主測試；初期會出現在圖片生成流程旁，廣告會標示並與生成圖片分開。OpenAI 表示廣告不影響答案，並新增歸因、品牌適配與轉換資料整合。
- **怎麼看：** 一般使用者目前不用把它當成已在所有帳號出現的 UI；產品團隊若要評估，應把 answer quality、廣告誤認、敏感情境排除與隱私邊界列成獨立測試。
- **限制：** WeightWatchers、Dose、Portland Leather 等成效數字是合作夥伴／廣告方早期結果，不是獨立長期因果評估；正式 rollout、地區與體驗仍可能變動。

## 4. 使用心得與避坑

### ReviewBench：評估 code-review agent 不要只看一個總分

- **新在哪裡：** GitHub 10/05 公開 [ReviewBench](https://github.blog/ai-and-ml/github-copilot/reviewbench-an-open-benchmark-for-ai-code-review/)，從 1.039 億個 PR 的分布抽出 219 個、涵蓋 19 種語言的公開 PR，以 human reviewers、frontier LLM 與 static analysis 建立 multi-source golden set，提供 grounded／augmented precision 與 recall。
- **可以怎麼開始：** 把自己的 reviewer 跑在 25-PR test set，先分 severity、security、correctness、testing，再決定團隊要高 precision 少噪音，還是高 recall 多抓問題；最後一定要用真實 PR 的 addressed rate 與人工修改率回看。
- **限制：** GitHub 報告的 96.6% expert agreement、離線分數與線上實驗同向，仍是 GitHub 建立與驗證的 benchmark 結果；219 個 PR 不代表你的語言、框架與風險分布，不能直接當 production SLA。

### 「流程寫死」仍不等於「結果寫死」

- dynamic workflow、`implement spec` 與多 Agent orchestrator 都在把步驟固定化，但模型判斷、工具副作用與外部服務仍會變。建議每個階段留下結構化輸出、可重播輸入、timeout、取消、人工 checkpoint 與終態 assertion。
- 高風險動作（刪除、付款、寄信、部署、修改權限）先用 dry-run／staging；把「停止後沒有背景程序」、「低 confidence 交人工」、「PR 仍通過 deterministic checks」寫成測試，而不是只看 agent 最後一句話。

來源：[Pi v1.0.2](https://github.com/earendil-works/pi/releases/tag/v1.0.2)、[Orca v1.4.220](https://github.com/stablyai/orca/releases/tag/v1.4.220)、[Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models/)、[Agent Orca](https://github.com/heddles/agent-orca)、[GitHub dynamic workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)、[Anthropic Frontier Academy](https://www.anthropic.com/news/claude-frontier-academy)、[OpenAI Ads](https://openai.com/index/new-chatgpt-ads-format-and-measurement/)、[ReviewBench](https://github.blog/ai-and-ml/github-copilot/reviewbench-an-open-benchmark-for-ai-code-review/)。

## YouTube 深度整理

### Matt Pocock｜《New Skills! v1.3 brings /pr, /implement-spec, and /retro》

- **頻道／發布／觀看：** Matt Pocock｜2026-10-05｜查核觀看數 116,314（數字會變動）｜[YouTube 原片](https://www.youtube.com/watch?v=BsJGo1wFTvQ)｜14:30。已取得並讀完 YouTube `en-orig` 英文自動字幕；影片介紹另連到 [skills repo](https://github.com/mattpocock/skills)。未見贊助段，但有 AI Hero 課程、newsletter 與 Discord 自我推廣。
- **摘要：** 作者示範 skills v1.3 的 `implement-spec`、`pr`、`retro`：前者把 spec 拆成有 blocking relationship 的 task graph，後者把 PR 的 evidence、merge danger、blast radius 寫進 review body，retro 則回看 agent session 找出 context loss、缺測試、工具浪費與 steering 問題。
- **3–7 個重點：**
  1. 大功能不要一次塞給單一 coding agent；先有 spec，再用 tickets／task graph 拆開。
  2. 能 deterministic loop 就優先用 script；`implement-spec` 是較容易上手的 AFK 中間方案，但不如固定腳本可預測。
  3. PR 應提供 before／after evidence，而不只寫「測試通過」；也要說清楚可逆性與 blast radius。
  4. `retro` 會檢查 code navigation、automated checks、agents.md、tool economy 與 context loss。
  5. 作者特別提醒不要把 `retro` 的建議全自動套用，否則 false positives 可能讓 agent 連續改壞 repo。
- **步驟／工作流程：** 先寫 spec → 拆 tickets 與 blocking edges → 讓 subagents 在 worktree 執行 → 合併到 integration branch → code review → 產生含證據的 PR；最後抽樣對近期 session 跑 retro，由人決定採納哪些修正。
- **工具／模型：** Matt Pocock skills、coding agent、subagents、Git worktrees、TDD、PR template；影片沒有提供獨立模型 benchmark，品質提升是作者的工作流心得。
- **作者心得、優缺點與限制：** 作者認為 `retro` 大幅提升 token efficiency 與工作品質，這是個人經驗；優點是把「可驗證、可回復、可審查」變成可重用模板，限制是 setup、ticket 拆分與 worktree 管理仍需要工程判斷，且影片的 skills 行為會隨 repo 更新。
- **適合對象／是否值得看：** 適合正在用 Claude Code、Codex 或其他 coding agent、但常遇到 context 爆掉與 PR 難審的人；值得看，尤其是想把個人 agent 習慣整理成團隊流程的工程師。
- **可立即嘗試：** 選一個中型 feature，先拆成 3–5 個有依賴關係的 tickets；每個 ticket 限定 worktree、測試與驗收，PR body 加上 before／after、merge danger、blast radius，最後只對一個失敗 session 做 retro，不要先全面自動修 repo。

## 今天最值得帶回團隊的三個檢查

- **流程：** 哪些步驟應寫死在 workflow／script，哪些節點才值得交給模型判斷？
- **結果：** agent 停止、重試或完成後，外部系統與子程序的終態如何被測出來？
- **評估：** 你要的是低噪音高 precision，還是高覆蓋高 recall？是否用自己的 PR 與線上行為驗證？

## 今日一句話

Agent 的下一步不是再加一個更長的 prompt，而是把可重播流程、可停止執行與可驗證結果一起設計進產品。
