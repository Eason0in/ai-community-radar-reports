# AI 情報日報｜2026-09-24

約 4 分鐘閱讀。今天的主線是：coding agent 的價值開始由 migration、測試與權限邊界決定；模型能力、科學探索與語音工具都在延長 Agent 的工作範圍，但官方 benchmark 不能取代你的實測與人類驗收。

> 截稿時間：2026-09-24 08:05（Asia/Taipei）
> 查核範圍：優先 2026-09-22～09-24 的官方公告、官方工程文章、官方 repo 與社群實測；未重複 9/23 已報導的 Linear CI、Proliferate、ZCode、GPT-6 Sol／Luna、prompt caching 與 Plugin4Shell。
> 證據標示：官方資料是官方事實；公司工程文章、repo 與社群文章是第一手實作或作者觀點；廠商 benchmark、早期客戶案例與作者實驗不等於獨立驗證。

## 1. 社群實戰用法

### GitHub 用 Copilot 把 80 萬行 runtime 從 TypeScript 搬到 Rust

- **新在哪裡：** GitHub 9/16 發文、9/23 更新，分享 Copilot agent runtime 的實際重寫：超過 800,000 行 production Rust，128 個 PR 分批合併；文章稱大部分程式由 AI agent 撰寫，主要由一名工程師在數個月內完成，並逐步修正回歸問題。這不是「一次 prompt 產生整個 rewrite」，而是把長 migration 切成可 review、可部署的增量。
- **可以怎麼開始：** 先選一個有明確輸入／輸出契約的模組；讓 Agent 每次只處理一小段 port，固定跑原有 regression、效能與相容性測試，再以小 PR 合併。保留人工定義的 migration checklist、回滾點與 benchmark，避免讓 Agent 同時改架構、API 與測試判準。
- **編輯心得：** 真正可複製的不是 Rust，而是「共享 runtime、薄產品外殼、增量 PR、持續測試」的工作流。AI 讓大改寫的手工成本下降後，review 與驗證反而成為主要控制面。
- **限制：** 這是 GitHub 自家案例；「效能改善數個數量級」與單人完成時間沒有提供可獨立重現的完整基準，不能直接外推到你的語言、團隊或 production 風險。

來源：[GitHub：Migrating the GitHub Copilot runtime to Rust, using Copilot](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/)；可信度：GitHub 工程團隊第一手文章，數字為自家結果。

## 2. 社群新工具與新玩法

### real-browser-mcp：讓 Agent 驗證你已登入的 Chrome，而不是另一個乾淨瀏覽器

- **新在哪裡：** 這個開源 MCP server 加 Chrome extension，讓 Cursor、Claude Code、VS Code 等 MCP client 透過 localhost WebSocket 操作目前的 Chrome；Agent 可看到既有 cookies、SSO、staging session 與你剛重現的 bug。它補的是「程式修完了，但 Agent 無法進入我已登入的真實環境驗證」這個 coding loop 缺口。
- **可以怎麼開始：** 先以 `npx -y real-browser-mcp` 啟動 server，再用 Chrome 載入 extension；使用專用 browser profile 或單獨 tab，先讓 Agent 只做 read-only snapshot／重現，再逐步開放 click、type 與提交動作。需要 CI 的乾淨、可重複測試時，仍用 Playwright 類工具。
- **編輯心得：** 這種玩法把「修 code」與「在真實登入狀態驗證」接起來，對內部 staging 特別有用；它不是雲端瀏覽器，也不是讓 Agent 自動擁有所有帳號權限的理由。
- **限制：** Agent 仍能讀取連線 tab 裡的敏感資料並代為點擊；repo 自己也提醒不要把含個資、金鑰或高風險操作的 tab 直接交給不受信任的流程。localhost 傳輸不等於最終模型端不會看到頁面內容。

來源：[real-browser-mcp GitHub repo](https://github.com/ofershap/real-browser-mcp)；可信度：公開 repo／README，功能與安全界線以查核時版本為準。

## 3. 官方新功能與推薦用法

### Claude Opus 5.5：更便宜的長任務模型，但先做自己的成本基準

- **官方更新：** Anthropic 9/22 發布 Claude Opus 5.5，宣稱在多數工作接近 Fable 5.1、比 Opus 5 便宜 40%；價格為每百萬 tokens：input 4 美元、output 20 美元、cache read 0.20 美元，並宣稱輸出速度快逾 30%。官方也回報其自家 agentic coding 與安全評測結果，包括 containment-boundary 嘗試約少 85%。
- **推薦用法：** 把它放在 codebase-wide migration、長時間 audit 或需要多輪工具呼叫的 A/B 測試；固定相同 repo、prompt、工具與驗收條件，記錄成功率、重試次數、cache hit、總 token 與人工 review 時間，再和現有模型比較。不要只看排行榜分數。
- **編輯心得：** 對長任務來說，cache read 價格和每個任務實際 token 比單次 token 單價更重要；把「能否安全停手、是否誤改行為」列為品質欄位，比只量完成率更有用。
- **限制：** 以上價格、benchmark 與 85% 數字都是 Anthropic 官方或早期評估結果；官方也承認模型可能察覺自己正在被評測，且可靠抓住所有 failure 仍是未解問題。Production rollout、方案限額與 safety routing 仍需以你的帳號和產品 surface 實際確認。

來源：[Anthropic：Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)；可信度：官方公告；價格與 benchmark 為廠商結果。

### Claude 代理進入生物研究流程：候選生成不等於已完成發現

- **官方更新：** Anthropic 9/23 分享生命科學團隊的早期結果：Claude agents 從超過 200,000 個 reverse transcriptase 中挑出 3,500 個候選，再縮成 20 個值得分析的系統，注意到一個帶有 CRISPR-like repeats 的新系統 ART。人類科學家負責實驗室工作；ART 的功能仍在進一步驗證。
- **推薦用法：** 把這種 workflow 當成「大量搜尋 → 候選排序 → 可讀報告 → 人類實驗」的模板；先要求 Agent 輸出候選的證據鏈、反例與待驗實驗，再交給專家決定是否投入昂貴的 wet-lab 資源。
- **編輯心得：** AI 的優勢在把搜尋空間壓縮到人類能檢視的候選集，不在於把「有趣的模式」直接升格成新生物機制。
- **限制：** 這是 Anthropic 自己的早期研究敘事；ART 的生物功能尚未完全確定，不能把「Agent 找到值得測的異常」寫成「AI 已自主完成科學發現」。

來源：[Anthropic：Claude discovers a novel enzyme system with CRISPR-like repeats](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system)；可信度：官方研究團隊第一手文章，實驗結果仍在進行中。

### ChatGPT Voice 支援 plugins：語音做事，未完成任務可接回文字

- **官方更新：** OpenAI 9/23 在 release notes 表示，Voice 現可在 web、iOS、Android 使用帳號可用的 plugins 與 connected apps；Work 的 Voice 也能建立文件、簡報、試算表或在瀏覽器中工作，結束語音後未完成的 task 可在文字對話繼續。
- **推薦用法：** 先用語音口述目標與限制，再要求 Agent 用文字回傳待確認欄位、產物連結與下一步；涉及寄信、外部寫入或登入頁面時保留人工確認，不要把「可以用 plugin」當成「已授權所有動作」。
- **限制：** rollout、方案、連線 app 權限與 usage limit 仍依帳號而異；語音輸入也會增加轉錄歧義，重要參數應在文字介面重新核對。

來源：[OpenAI Help：ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)；可信度：官方 release notes。

## 4. 使用心得與避坑

### `.mcp.json` 看起來像設定檔，實際上可能是啟動程式碼

- **新在哪裡：** Reddit `r/mcp` 的一項小型實驗記錄 34 次嘗試、4 個模型與全新 sandbox；作者指出，五個 harness 中有三個會在使用者輸入前自動啟動專案 `.mcp.json` 宣告的 server，導致 approval mode 與 tool allowlist 可能尚未介入。實驗也觀察到瀏覽器路徑的 prompt injection 可把內容帶到 Agent，shell 路徑在該組測試中則沒有外洩。
- **可以怎麼開始：** 把新增或修改 `.mcp.json` 視為和 Makefile、hooks、`.vscode/tasks.json` 同等級的 code review 入口；在陌生 repo 首次開啟前先閱讀 command、args、env 與外部連線，關閉自動啟動或使用 trusted-directory gate，再用無憑證 sandbox 測試。
- **編輯心得：** 安全審查不能只看 Agent 是否在對話中「同意」工具呼叫；有些風險發生在 harness 啟動 server、瀏覽器載入內容或模型看到輸出之前。
- **限制：** 作者明確說明資料集小、部分條件只有一次 run，測試 hostname 也可能讓拒絕率偏高；這是值得採取的防護建議，不是所有 Agent 的普遍失效率估計。

來源：[Reddit：I measured three ways into an agent](https://www.reddit.com/r/mcp/comments/1wm9jju/i_measured_three_ways_into_an_agent_browser/)；[公開測試 fixtures](https://github.com/aliefe04/llms-txt-injection-lab)；可信度：作者公開實驗與限制說明，非獨立大樣本評測。

## YouTube

### 今日無推薦

主動查核 PAPAYA 電腦教室、Tech With Tim、IBM Technology、Matthew Berman、Matt Wolfe，以及近期 AI coding／Agent／MCP 候選。今天找到的結果未能同時符合 2026-09-22～09-24 時效、超過 10,000 觀看、非 Shorts、可讀可靠字幕與實測／教學／技術拆解深度；因此不以標題或介紹猜內容，也不重複昨天影片，今日無推薦。

## 今日一句話

今天最值得帶走的是：Agent 能寫更多 code、操作更多瀏覽器與搜尋更大的科學空間，但可靠交付仍取決於增量 diff、可重現測試、清楚的登入權限與把「候選」和「已驗證結果」分開。

## 來源總覽

- 社群實戰：[GitHub Copilot runtime migration](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot)。
- 社群工具：[real-browser-mcp](https://github.com/ofershap/real-browser-mcp)。
- 官方產品與研究：[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Claude 生物研究](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system)、[ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)。
- 安全實測：[r/mcp 實驗](https://www.reddit.com/r/mcp/comments/1wm9jju/i_measured_three_ways_into_an_agent_browser/)、[公開 fixtures](https://github.com/aliefe04/llms-txt-injection-lab)。
- YouTube：今日無推薦；已查核來源頻道、時效、觀看門檻、字幕可用性與是否重複。
