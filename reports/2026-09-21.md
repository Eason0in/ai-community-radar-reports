# AI 情報日報｜2026-09-21

約 4 分鐘閱讀。今天的主線是：開源影像模型開始把生成、編輯、透明背景與多參考圖放進同一條工作流；Agent 工具則把持久 shell、跨 session 交接和獨立審查做成可操作的產品，但實測品質、成本與隱私邊界仍要自己驗收。

> 截稿時間：2026-09-21 08:05（Asia/Taipei）
> 查核範圍：優先 2026-09-19～09-21 的官方公告、官方 repo、第一手社群實作；補充 9/17～9/18 仍具立即使用價值的新功能。未重複 9/20 已報導的 Jev、typesafe-mcp、Ouroboros、embedded evaluation、Sentry／Dev Containers 與 Copilot 模型汰換。
> 證據標示：官方資料是官方事實；社群文章、Reddit 與影片是個人實作；廠商／作者 benchmark、速度、費用與準確率都不等於獨立驗證。

## 1. 社群實戰用法

### Qwen-Image-2.1：先把它當「2K 生成／編輯器」，不要急著當萬用放大器

- **新在哪裡：** Qwen 9/20 開源 Qwen-Image-2.1，7B 視覺生成元件支援文字生圖、透明 RGBA、最多 10 張參考圖、局部遮罩／塗畫編輯與原生 2K；ComfyUI 社群幾乎同步整理了文字生圖與圖片編輯 workflow。
- **可以怎麼開始：** 更新 ComfyUI 後從 Templates 載入 `image_qwen_image_2_1_t2i` 或 `image_qwen_image_2_1_image_edit`；先用一張產品圖做背景替換，再試 2–3 張參考圖的角色／物件合成。官方 Diffusers 入口是 `QwenImage21Pipeline`，預設 40 steps。
- **社群實測：** r/StableDiffusion 有人用原生 2K 與約 4.2MP 像素預算做細節增強，不加額外 upscaler；另一串初測回報 4070 生成 2MP 約 1 分 14 秒，也有人認為複雜場景會有 artifact。這些是早期個人結果，不是模型排名。
- **編輯心得與限制：** 優先測透明背景、文字排版和可控編輯；若只是把自然照片放大，先保留原圖作 A/B 比較，因為過度細節 prompt 可能把照片推成明顯的「AI 樣式」，40 steps 也不等於品質保證。

來源：[Qwen 官方公告](https://qwen.ai/blog?id=qwen-image-2.1)；[官方 GitHub／快速開始](https://github.com/QwenLM/Qwen-Image-2.1)；[ComfyUI workflow 討論](https://www.reddit.com/r/comfyui/comments/1wlgy69/comfyorgs_qwenimage21_models_are_out_for_comfyui/)；[2K 放大實作](https://www.reddit.com/r/StableDiffusion/comments/1wlu4jk/qwenimage21_image_upscaling/)；可信度：官方 repo 加社群第一手實作。

## 2. 社群新工具與新玩法

### DSCODE 0.7.22：把持久 shell、session bridge 和獨立 review 組成一個 DeepSeek coding harness

- **新在哪裡：** 9/20 版把 DSH Plugin Hub 的 runtime 準備與驗證移到安裝器，失敗時會保留完整原因鏈；產品主打同一個持久 shell、TUI／CLI／script 共用 session、跨 session handoff，以及由另一個 read-only model 做 approval／diff review。
- **可以怎麼開始：** macOS 14+、Node 22.19+ 可先在 disposable repo 固定版本試跑：`npm install -g @toddzheng024/dscode`，或用 GitHub installer 指定 `0.7.22`；先讓一個 session 讀碼與跑測試，再用另一個 session review diff，確認成本與權限紀錄。
- **編輯心得：** 這個玩法值得看的不是「又一個聊天介面」，而是把交接、背景工作、獨立審查與可恢復 session 變成 runtime 狀態；對長任務比每次重新貼 prompt 更接近真正的工程流程。
- **限制：** 這是獨立社群專案，不是 DeepSeek 官方產品；需要 Chrome、Git 與 API key，auto review 仍會消耗額外模型用量，且 Computer Use／MCP 權限不要一開始就開滿。

來源：[DSCODE 0.7.22 官方 repo](https://github.com/qiz029/dscode)；[0.7.22 release](https://github.com/qiz029/dscode/releases/tag/v0.7.22)；[DeepSeek Harness 官方 developer preview](https://deepseek.com/harness/en/)；可信度：開源 repo／release 一手資料，社群專案仍需自行驗收。

## 3. 官方新功能與推薦用法

### Step 5 Preview：長上下文與 agentic work 的新選項，但官方 benchmark 要打折看

- **官方更新：** StepFun 9/19 推出 Step 5 Preview，宣稱 600B sparse MoE、每 token 27B active、1M-token context 和 vision input；目前可在產品與 API 使用，並預告 10/15 開放權重。
- **推薦用法：** 先拿它做需要長上下文、工具呼叫和多輪修正的 coding／研究小任務，記錄實際 token、延遲、工具失敗率與人工返工；不要因為 1M context 就把整個 repo 或所有歷史資料一次塞進去。
- **結果怎麼讀：** 官方頁列出 DeepSWE、StepCodeBench、Terminal-Bench、MCP-Atlas 等多組分數，但這些是廠商頁面的比較結果；其中 Terminal-Bench v4 仍明顯低於 GPT-6 Astra／Claude Opus 5，且不同 harness、temperature 與資料集不可直接當同一場公平比賽。
- **限制：** 模型仍是 Preview；價格、速率、可用區域、服務穩定性與 10/15 的權重授權都應以正式文件為準。高風險工具呼叫仍要靠 sandbox、測試和人工核准，不要把長 context 當成可靠性。

來源：[StepFun 官方 Step 5 Preview](https://www.stepfun.com/step-5-preview)；可信度：官方發布與官方 benchmark，分數明確標為廠商結果。

### GitHub Copilot code review GA：讓 review 變成「找出還沒解決的事」

- **官方更新：** 9/18 一般可用的新 review 介面會把 findings 分成 Open、Resolved since last review、Previously missed，保留多次 review 的進度；comment 也有標題，批次採納建議時會產生 smart commit message。
- **推薦用法：** PR 先要求 Copilot review，再把每次 push 後仍在 Open 的項目當作工作清單；對 `Previously missed` 另外跑測試與人工確認，批次採納前先檢查完整 diff，不要只看自動產生的 commit title。
- **限制：** 自動 resolve 只是根據後續 commit 和回覆整理狀態，不是證明問題真的修好；仍要把測試、型別檢查和安全 review 放在 merge gate。

來源：[GitHub Changelog：Copilot code review improved review experience](https://github.blog/changelog/2026-09-18-copilot-code-review-an-improved-review-experience/)；可信度：官方 changelog。

## 4. 使用心得與避坑

### ChatGPT 廣告追蹤：社群觀察值得看，但不要把「cookie 被送出」直接寫成「帳號已被跨站解析」

9/20 的獨立分析者 Buchodi 表示，在 Android Chrome 實測到 ChatGPT 廣告收集器使用一年期 `__obi` cookie，並在部分廣告主網站的請求中送回 OpenAI；他也明確寫出尚未直接觀察到 OpenAI 伺服器如何把事件與帳號 join。OpenAI 9/10 更新的 cookie policy 確實把 `__obi` 列為 chatgpt.com／openai.com 的一年期 Analytics cookie；官方廣告說明則表示廣告主拿不到聊天、記憶、姓名、email 或精確位置。

**可以怎麼做：** 把這兩件事分開理解：官方「廣告主看不到聊天」不等於「瀏覽器沒有廣告／分析識別流程」；若在意跨站追蹤，檢查 ChatGPT 的廣告個人化與分析 cookie 設定、使用瀏覽器第三方 cookie 防護，並把敏感研究與一般廣告測試分開的瀏覽環境。不要只因一篇文章就宣稱所有裝置、所有 session 都有相同行為。

**限制與證據層級：** 目前是獨立 Android Chrome 觀察，加上官方 cookie 名稱／用途文件；作者自己列出桌面 Chrome 未測、iOS WebKit 可能阻擋、約五分之一 session 取得 sync token 等限制。這是值得追蹤的隱私訊號，不是 OpenAI 已承認的安全事件。

來源：[Buchodi 9/20 技術分析](https://www.buchodi.com/chatgpt-now-knows-what-you-do-on-other-websites-via-ad-collector/)；[OpenAI Cookie policy](https://openai.com/en-GB/policies/cookie-policy/)；[OpenAI Ads FAQ](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)；可信度：獨立實測加官方政策，關鍵 join 結論仍未直接觀察。

## YouTube

今日無推薦。已主動檢查 PAPAYA 電腦教室、Tech With Tim、IBM Technology、Matthew Berman、Matt Wolfe 與近期 Qwen／Agent 候選；沒有同時符合近 24–48 小時（必要時一週內）、超過 10,000 觀看、可靠字幕／逐字稿、非 Shorts、且有實測或技術拆解的影片。未以標題或介紹猜測內容，也沒有用重複舊片湊數。

## 今日一句話

今天最值得試的不是「再開一個 Agent」，而是把新模型放進小型、可回溯的工作流：固定版本、限制權限、留下 trace，最後用獨立測試和人工 review 決定它能不能往前走。

## 來源總覽

- Qwen：Qwen-Image-2.1 官方公告、GitHub 與 ComfyUI／StableDiffusion 社群 workflow。
- StepFun：Step 5 Preview 官方模型頁與官方 benchmark 表。
- GitHub：Copilot code review 2026-09-18 changelog。
- DeepSeek Harness 生態：DSCODE 0.7.22 GitHub repo／release。
- OpenAI／Buchodi：`__obi` cookie、廣告 FAQ 與獨立 Android Chrome 實測。
