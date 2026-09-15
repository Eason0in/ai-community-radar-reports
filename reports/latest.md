# AI 實用日報｜2026-09-15

約 3 分鐘閱讀。今天的共同主線是：Agent 的差異開始落在「誰負責規劃、誰負責執行、怎麼限制上下文與費用」，而不是只比較模型名稱。以下區分官方功能、單一社群實測、作者觀點與編輯推論，不把自述數字當成普遍 benchmark。

## 1. 社群實戰用法

### 讓昂貴模型規劃與審查，本機模型負責大量執行

9 月 12 日 r/Qwen_AI 有開發者分享：用 Claude Code 當 head，讓本機 Qwen3.8-27B 當 worker；Claude 先寫短 brief、最後 review，Qwen 讀碼與打字。作者自述在 RTX 5090、vLLM、最高 262K context 上累積約 2B tokens／27K requests，某個規格相同的工作由 US$0.91 降到 US$0.26，少用 85% 昂貴模型 tokens。這是單一使用者的自報，不是獨立比較。

怎麼開始：挑一個有隱藏測試或明確驗收的小任務，先把流程拆成「規格與計畫 → 本機模型修改 → 獨立測試 → 昂貴模型 review」；模型只負責自己擅長的段落，不要先把全部權限交給 local worker。作者還提到高 reasoning 會在量化模型上過度思考，反而用 medium 才能穩定落地。

編輯心得：這種分工同時節省成本與上下文，但「72%」只代表作者自己的 harness、硬體、任務與計價方式；先記錄每次失敗、重試、測試結果與人力時間，才知道省的是錢還是把成本移到維運。

來源：[r/Qwen_AI 實測分享（2026-09-12）](https://www.reddit.com/r/Qwen_AI/comments/1weqhps/2b_tokens_of_local_qwen38_as_claude_codes_worker/)（社群自述，含工具導流）。

## 2. 社群新工具與新玩法

### Graft 把「讀整個 repo」改成有政策與收據的結構化讀取

Graft 是近期公開的 coding-agent context governor：小檔案可讀全文，大檔案先回 AST 結構摘要，需要時再讀範圍；對 secret、binary、lockfile 可拒絕，工具回應還附 bytes consumed、bytes avoided 與 policy decision。它提供 CLI、MCP 與 API，README 的快速試法是 `npx @flyingrobots/graft init --write-claude-hooks --write-codex-mcp`，再用 `graft read safe` 或啟動 stdio server。

怎麼試：先在拋棄式 repo 執行 `--dry-run` 或只用 CLI，確認它會寫哪些 `.graftignore`、Agent 指示檔與設定；再挑一個大型模組比較原始全文讀取與結構化讀取的 token／延遲／錯誤率。不要把「拒絕 secret」誤當成完整安全邊界，也不要在未審查來源前直接讓 `npx` 修改全域 Codex 設定。

限制：目前 README 的能力與收據是專案自述；結構摘要仍需配合測試、review 與新鮮度檢查，不能取代編譯器或權限系統。

來源：[Graft GitHub repository](https://github.com/flyingrobots/graft)（開源專案 README，查核 2026-09-15）。

## 3. 官方新功能與推薦用法

### OpenAI Agents API 把 Codex harness、sandbox、MCP 與多 Agent 放進 public beta

OpenAI 9 月 10 日推出 Agents API public beta：可選 OpenAI hosted sandbox 或合作夥伴環境，內建長工作階段的 context compaction、tool search、programmatic tool calling、MCP 與 subagents；官方範例設定最多 3 個並行 subagents。官方也說 Agents API 本身不另收費，仍按使用的 tokens 與 tools 計價。

推薦用法：先做一個只讀的資料整理或測試報告 agent，只開一個 MCP server與必要工具，設定並行上限、逾時、預算與人工批准點；把 compaction 前後的摘要、每次 tool call 與產物保存下來。public beta 的「secure sandbox」是供應商功能描述，不是你的應用已完成安全驗證。

來源：[Introducing the Agents API（OpenAI，2026-09-10）](https://openai.com/index/introducing-the-agents-api/)｜[Agents API MCP 文件](https://openai.github.io/openai-agents-python/mcp/)（官方產品與文件）。

### GitHub Copilot auto model selection 新增 efficiency／balance／intelligence 三層

GitHub 9 月 14 日開始推出三種自動選模偏好：Efficiency 偏成本與速度、Balance 取成本／品質／延遲折衷、Intelligence 偏複雜任務的品質；三層仍使用同一組可用模型，實際費用依系統選中的模型計算，目前在 VS Code、Copilot CLI 與 Copilot app rollout。這是路由偏好，不是三個新模型，也不是品質保證。

怎麼用：拿同一個低風險 issue 各跑一次固定模型、Auto/Balance 與 Auto/Intelligence，記錄延遲、費用、diff 大小、測試與返工次數；先用 Efficiency 處理 docstring、查詢與小修補，複雜重構才試 Intelligence。不要只看完成速度，因為自動路由可能讓成本與上下文來源更難追蹤。

來源：[Configure cost and quality in Copilot auto model selection（GitHub，2026-09-14）](https://github.blog/changelog/2026-09-14-configure-cost-and-quality-in-copilot-auto-model-selection/)（官方 release note）。

## 4. 使用心得與避坑

### Claude Code 額度不是「被砍半」：促銷結束後，週額度永久保留原始額度上方 25%

Anthropic 說明頁今天更新：5 月 13 日至 9 月 13 日的 Claude Code 週額度促銷原本提高 50%；9 月 14 日起促銷結束，但 Pro、Max、Team 與符合資格的 seat-based Enterprise 週額度永久比促銷前高 25%。5-hour limit 沒有被這次促銷改動；Free 與 consumption-based Enterprise 不在促銷內。社群在 9/14 看到額度變化時出現「被進一步降低」的說法，留言也有人指出那其實是回到已公告的 25% 永久加成，兩者不要混為一談。

現在可做：用 `/usage` 分開記錄 weekly 與 5-hour limit，並把自己的方案、模型、effort 與任務量一併寫下；不要拿促銷期的體感，直接和今天的另一個模型或訂閱方案做價格結論。額度讀值、產品政策與實際輸出品質是三件事，必須分開驗證。

來源：[Claude Code May–August 2026 weekly limits promotion（Anthropic Help Center，2026-09-15 更新）](https://support.claude.com/en/articles/15910845-claude-code-may-august-2026-weekly-limits-promotion)｜[r/Anthropic 額度討論（2026-09-14）](https://www.reddit.com/r/Anthropic/comments/1wfwko6/the_limits_have_been_reduced_even_further_now_its/)（官方政策＋社群反應）。

## YouTube：1 部符合門檻

### Nate Herk｜Anthropic Engineer Explains: What to Build Instead of AI Agents

- 頻道／片名：[Nate Herk | AI Automation《Anthropic Engineer Explains: What to Build Instead of AI Agents》](https://www.youtube.com/watch?v=HIRDzMtuWFk)
- 發布日期：2026-09-13；查核時由 Daily Curry 顯示約 59,500 次觀看，超過 10,000 門檻。[觀看數查核](https://www.dailycurry.com/)
- 逐字稿：已讀取 YouTube 自動產生的英文逐字稿；影片約 9 分 46 秒，非 Shorts。[時間戳逐字稿](https://youtube-transcript.ai/transcript?v=HIRDzMtuWFk)
- 重點：把 model 想成 processor、agent runtime 想成作業系統、skills 想成 app；不要為每個任務重做一個 Agent；把穩定流程、腳本、範例與驗收條件固化成可重用 Skill；用漸進揭露與清楚描述減少模型猜測；把自我檢查放進流程，而不是交出第一版就算完成。
- 工作流程：挑一個每週重複的任務，先整理成 `SKILL.md` 與可重跑腳本，再加「輸出格式、驗收條件、失敗時停下」；連續跑三次後，只把已確認的修正寫回 Skill。
- 作者觀點／限制：影片主張 Skill-first 可避免大量重複工作，但「70% problem」等說法不是獨立量測；頻道有課程、VPS 與語音工具導流，並不能代表 Anthropic 官方產品立場。適合已經會用 Claude Code／Agent Skills、想把 prompt 經驗整理成可維護流程的人；值得看，但要把它當工作流觀點與示範，不是 benchmark。
- 可立即嘗試：為一個小型 repo 建立「只讀盤點 → 修改 → 測試 → review」Skill，先以手動觸發和明確測試驗收，確認穩定後才開放自動載入。

今天先做：拿一個低風險 coding 任務，實測「規格／review 用雲端模型、執行用本機模型」或「Auto/Balance 與固定模型」的差異；同時保留測試、費用、延遲與返工紀錄，避免只憑一次成功 demo 下結論。
