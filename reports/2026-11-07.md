# AI 情報日報｜2026-11-07

> 搜尋範圍：以 Asia/Taipei 2026-11-05～11-07 為主，優先採用 11/6～11/7 的官方公告、原始 repo、release notes 與技術文章。官方事實、社群專案自述、研究結果與廠商 benchmark 分開標示；昨天已報且沒有新進展的題目不重複。

## 1. 社群實戰用法

### 先錄製 agent，再測它是否真的遵守流程

- **新在哪裡：** 社群工具 `agentverify` 在 11/06 的 0.9.0 增加「只錄不存在的 cassette」、逐一檢查送給模型的文字、阻擋含 token／key／signature 的 URL，以及可選的工具結果／角色／參數 drift 檢查。它支援 OpenAI Agents SDK、Anthropic、Gemini、LangGraph、MCP 等多個 adapter；這是開源專案功能，不是模型供應商保證。
- **可以怎麼開始：** 在測試 repo 先用 cassette 錄一次真實流程，再在 CI replay；對高風險 agent 加 `assert_no_credential_urls`、允許工具清單與 `drift="fail"`。只有流程需要重錄時才更新 cassette，避免每次測試都呼叫付費 API。
- **編輯心得與限制：** cassette 能驗證 prompt、tool call 與結果是否漂移，不能證明 agent 在未覆蓋的情境永遠安全；production trace 也要搭配權限與副作用檢查。先把「路徑正確」加入測試，別只測最後一句回答。
- 來源：[agentverify 0.9.0 CHANGELOG](https://github.com/simukappu/agentverify/blob/main/CHANGELOG.md)（2026-11-06；社群開源工具）。

## 2. 社群新工具與新玩法

### Qwen Code 把 Skill 安裝變成可回查的工作流

- **新在哪裡：** Qwen Code v0.26.9（11/06）新增 Skill ZIP 上傳、daemon 安裝 API、TypeScript SDK、一次啟用或停用 1–100 個 Skill，以及安裝回執與失敗復原；Web Shell 可直接在 Skills 頁面上傳。另有 sandbox `/verify` 讀取 PR review threads、圖片輸入與 managed-agent automation 預設啟用。
- **可以怎麼開始：** 先固定 `v0.26.9`，在 disposable workspace 上傳一個只讀 Skill ZIP；把安裝 attempt ID、receipt、啟用清單與實際呼叫的工具一起保存，再測 `/verify` 是否真的看得到 unresolved／resolved review threads。
- **編輯心得與限制：** 「安裝成功」不等於「Skill 可信」。QQ 主動推送、背景回覆與 automation 預設開啟會擴大訊息與權限表面；團隊應先關閉非必要 channel、限制 Skill 來源，並在正式 repo 外驗證。
- 來源：[Qwen Code v0.26.9 release notes](https://github.com/QwenLM/qwen-code/releases/tag/v0.26.9)（2026-11-06；專案官方 release）。

### OpenDirector：在本機瀏覽器把生成、素材與剪輯放在同一個工作區

- **新在哪裡：** 開源專案 OpenDirector 11/06 發布 v0.1.0：本機儲存的 AI 影片工作區，能用聊天產生文字／素材、在 canvas 整理參考資產、做圖片與影片編輯，再從 timeline 輸出 MP4、JSON、FCPXML 與 asset bundle。模型可接供應商 API 或自架服務。
- **可以怎麼開始：** 先以非敏感素材建立一個短片專案，配置一個 API provider；測「參考資產 → 生成 → canvas 迭代 → timeline 剪輯 → MP4」完整路徑，確認專案資料只留在本機，並把 provider 金鑰放在環境設定而非素材目錄。
- **編輯心得與限制：** 這是早期版本，repo 頁面當時約 116 stars，不能當成成熟剪輯器或隱私保證。生成、去背、延展等能力取決於外接模型；正式使用前應檢查輸出授權、快取與模型端資料政策。
- 來源：[OpenDirector README](https://github.com/ThinkFlowLab/OpenDirector)（2026-11-06 release；Apache-2.0，社群專案）。

## 3. 官方新功能與推薦用法

### Kanana-2-v-decide：讓 agent 直接拿到選擇與分數

- **新在哪裡：** Kakao 11/06 開源 3B 規模的多模態決策模型；輸入文字或圖片，輸出機率、選擇或分數，不必先生成一段自然語言再抽取結論。Kakao 表示 H200 單卡平均 0.04 秒，約為 GPT-6 Luna 的 43 倍；這是廠商自己的測試，不能直接當成跨硬體的普遍結果。採用 Kanana Open License，可商用但仍要自行看授權與模型卡。
- **推薦用法：** 把它放在客服分類、工具選擇、商品圖片判斷等「有限選項」節點：先定義 JSON schema 與拒答／人工轉接門檻，再把決策結果交給規則或另一個 agent 執行；不要讓分數直接觸發退款、刪除或高權限操作。
- **編輯心得與限制：** 這種小模型適合做 router／judge 前置層，不代表它能取代通用模型的推理。Kakao 的 Decision Bench 與比較結果是官方報告，導入前要用自己的中文、圖片與錯誤成本資料重測。
- 來源：[Kakao 官方公告](https://www.kakaocorp.com/page/detail/12193?lang=KOR)、[Kanana-2-v-decide Hugging Face collection](https://huggingface.co/collections/kakaocorp/kanana-2-v-decide)（2026-11-06；速度與評測數字為廠商結果）。

### Images 2.6：把快速草稿與精準修改分成兩條路

- **新在哪裡：** OpenAI 11/04 發布 Images 2.6：ChatGPT、Codex 與 API 支援 GIF、SVG、markup 指定修改區域，並新增 `complexity` 控制規劃量；API 提供偏快的 `gpt-image-2.6-flare` 與偏精細的 `gpt-image-2.6-sunburst`。官方表示生成速度提升 50%，屬官方產品宣稱。
- **推薦用法：** 先用 Flare、低 complexity 做構圖與多輪草稿；確定版面後再以同一提示、參考圖與尺寸比較 Sunburst。對海報、產品圖與精確局部修改，使用 markup 並逐次只改一件事；要 GIF 則明確寫起始姿勢與回到起始姿勢的 loop 條件。
- **編輯心得與限制：** `complexity` 是規劃量，不等於輸出品質；高 complexity 可能增加延遲與不必要變更。文字、商標、透明背景與翻譯結果仍應人工逐字檢查，不能只看視覺上「很像」。
- 來源：[OpenAI Images 2.6 公告](https://openai.com/index/introducing-images-2-6/)、[Image prompting guide](https://developers.openai.com/api/docs/guides/image-prompting)（2026-11-04；速度與品質描述為官方資料）。

### Cosmos 3 新 checkpoint：把模擬資料生成接到 agent skill

- **新在哪裡：** NVIDIA 在 11/05 透過 Hugging Face 公開四個 Cosmos 3 Nano open-weight checkpoint，分別做多視角 RGB／LiDAR、串流駕駛觀測、模擬器控制轉 RGB，以及雙臂機器人動作到影片；每個模型有 16B trainable parameters，使用 OpenMDW1.1。
- **推薦用法：** 不要直接把生成影片當真實世界答案。先用官方 inference skill 或 notebook 跑一個樣本，再用 held-out episodes 比較感測器同步、控制延遲、物體幾何與 policy 成功率；只有短跑執行成功，不代表訓練已收斂。
- **限制：** 官方文件列出的 Sim-Bimanual 環境需要 Linux、NVIDIA GPU、Docker、NVIDIA Container Toolkit，發布設定曾以單張 GB200 測試，這不是最低硬體規格。物理一致性與 sim-to-real 仍需獨立驗證。
- 來源：[NVIDIA Cosmos 3 open models on Hugging Face](https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation)（2026-11-05；硬體需求與限制依官方文章）。

## 4. 使用心得與避坑

### Claude Code 2.1.319：背景 task 很方便，但安全檢查不能被 gateway 吃掉

- **發生什麼事：** Anthropic 11/06 的 v2.1.319 讓 MCP server 以 task 形式執行的工具呼叫立即進背景，完成後再回報；可用 `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND=1` 改回等待模式。同版也調整 auto mode：在 telemetry 或 feature flag 關閉、或 LLM gateway 無法做 server-side check 時，動作會被詢問或拒絕，不再悄悄 fallback 到內建 classifier；`claude -p` 被拒絕時也會以 exit 1 結束。
- **可以怎麼開始：** 先更新到固定版本，在測試 MCP server 上比較背景與前景兩種模式；CI 以 exit code 判定成功，並記錄 task id、完成事件與實際權限。若經過 Bedrock／Vertex／Foundry 或自建 gateway，明確驗證 auto-mode server check 是否真的抵達，不要只看 CLI 顯示。
- **避坑重點：** 背景化會讓「指令已送出」與「結果已驗證」分離；deploy、migration、付款或刪除類工具要保留人工 approval 與完成後 verifier。gateway 讓安全檢查失聯時，拒絕是保護，不是要用環境變數繞過的錯誤。
- 來源：[Claude Code v2.1.319 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.319)（2026-11-06；官方 release notes）。

### Agent catalog 不能只靠「找到」：要驗證簽章與 trust model

- **發生什麼事：** `ai-catalog-cli` v0.4.0（11/06）新增保存 Sigstore bundle、trust manifest 驗證指令，並改成離線優先選擇 Sigstore 服務；同時採用新的 trust model，屬 breaking change。這代表「agent 找到一個 Skill／MCP」與「允許它進入環境」應該是兩個步驟。
- **可以怎麼開始：** 在 CI 對 catalog、Skill 或 MCP manifest 做 digest／簽章驗證，把來源網域、簽章 bundle、授權範圍與版本 hash 一起保存；驗證失敗時停止安裝，不要用 `--force` 或把整個 marketplace 當成可信邊界。
- **編輯心得與限制：** Sigstore 只解決可驗證的發布鏈，不會替你判斷 Skill 是否過度索權、是否含惡意 instruction 或是否符合業務需求；仍需最小權限、隔離執行與人工 review。
- 來源：[ai-catalog-cli CHANGELOG](https://github.com/Agent-Card/ai-catalog-cli/blob/main/CHANGELOG.md)（2026-11-06；社群工具，breaking change 需先看 migration 文件）。

## YouTube 深度整理

### 今日無推薦

我主動查找 PAPAYA 電腦教室與其他中英文 AI／工具／Agent／AI Coding 頻道，優先查 2026-11-05～11-07，並放寬至一週。搜尋結果沒有同時滿足「觀看數超過 10,000、非純新聞朗讀、具實測／教學／技術拆解，且能取得並讀完可靠字幕或逐字稿」的候選；因此不從標題、縮圖或介紹猜內容，今日無推薦。

## 今天最值得帶回團隊的三個檢查

- **決策與生成分開：** router／judge 可用小模型輸出結構化選擇；最後仍由規則、來源與 verifier 決定能否執行。
- **背景不等於完成：** MCP task、managed agent 與影片／模擬生成都要有完成事件、結果檢查與可回復路徑。
- **發現不等於信任：** Skill、catalog、MCP 與第三方模型先驗證來源、簽章、權限與版本，再放進正式工作流。

## 今日一句話

AI agent 的下一個實用分工不是讓單一模型什麼都做，而是把選擇、生成、執行與驗證拆開，讓每一步都有可回查的證據。
