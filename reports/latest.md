# AI 情報日報｜2026-10-05

約 4 分鐘閱讀。今天沒有需要硬湊的全新大模型發布，主線反而很清楚：AI agent 的競爭正在從「會不會呼叫工具」移到「是否留下正確狀態、能否重複成功、出了錯能否被關住」。

> 截稿時間：2026-10-05 08:06（Asia/Taipei）。
> 查核範圍：優先查 2026-10-03～10-05；必要時補充 9/28～10/02 的仍具實作價值進展。已避開 10/04 已報導的 real-browser-mcp、Supabase／Turso、Claude Code 2.1.288、AstaBrief、Claude Frontier Academy 與 Kolibri，除非今天有新的獨立進展。
> 證據標示：官方公告／文件是官方事實；論文、模型卡與 benchmark 數字是作者或廠商結果；社群與影片是實作經驗，不外推成普遍結論。

## 1. 社群實戰用法

### 把 agent 的「我做完了」改成可驗證的後端狀態

- **新在哪裡：** Microsoft 與 Hugging Face 10/03 公開 [ThinkingBox](https://huggingface.co/blog/microsoft/thinkingbox)：507 個有狀態的企業工作流，每個任務重跑 20 次，檢查資料庫終態與額外副作用，不只看回答或 tool call 是否格式正確。作者報告的 121,680 次有效試驗中，79,853 次未通過 executable check；失敗裡 67.24% 仍正常結束、成功呼叫了會改狀態的工具，卻留下錯誤結果。
- **可以怎麼開始：** 你的 agent 每個重要 workflow 都寫一個「完成後必須為真」的 assertion，例如資料列狀態、建立的 ticket、不可發生的額外寫入；先用 5 次重跑，再依風險提高到 20 次。把 pass@1、best-of-k 與 every-of-k 分開記，別把偶爾成功當穩定性。
- **編輯心得：** 這是很適合放進 CI／staging 的評估觀念：先讀真實狀態，再讀模型摘要。限制是 ThinkingBox 的企業案例是 synthetic reconstruction，數字是作者 benchmark，不代表你的模型在真實資料上也會有同樣比例。

來源：[ThinkingBox 介紹與可執行流程](https://huggingface.co/blog/microsoft/thinkingbox)、[ThinkingBox paper](https://arxiv.org/abs/2608.19741)（2026-10-03）；可信度：Microsoft／Hugging Face 聯合技術文章與公開環境，benchmark 結果屬作者結果。

### 先做最小 harness，再用資料證明多 Agent 值得存在

- **新在哪裡：** 9/30 的 [How Much of a Harness Does a Strong Agent Need](https://arxiv.org/abs/2609.40303) 在相同 frontier backbone、相同時間預算下比較複雜開源 harness 與單一 session 的 minimal coding agent；作者在其 MLE benchmark 中沒有看到複雜 harness 的優勢。
- **可以怎麼開始：** 先用一個 agent、read／write／bash、固定 timeout、明確驗收與可重播資料集跑 baseline；只有當 trace 顯示「分工、檢索、記憶或重試」真的改善成功率／成本，才加 subagent 或 orchestration。
- **限制：** 這是特定 MLE benchmark 的研究，不是「多 Agent 永遠沒用」；真實團隊仍可能因權限隔離、不同技能或並行等待而受益。不要把論文結論變成架構教條。

## 2. 社群新工具與新玩法

### AREX-2：把「反思」做成可增加預算的開放模型迴圈

- **新在哪裡：** BAAI 9/29 釋出 [AREX-2 model card](https://huggingface.co/BAAI/AREX-2) 與 [論文](https://arxiv.org/abs/2609.38288)：27B、Apache 2.0、262,144 context 的多模態 agent model，讓模型反覆走「提出 → 測量 → 讀取分數／log／錯誤 → 修正」，並宣稱這種在 coding／MLE 學到的長循環能力能轉移到 deep research。
- **可以怎麼開始：** 有 24GB 以上 GPU 或可用推理服務時，先照 model card 用 Transformers、vLLM 或 SGLang 跑一個有明確 verifier 的小任務；每一輪只接受可觀察的測試結果，不要把模型自述的「我已改善」當成改善。
- **編輯心得：** 它把「多花 inference budget 是否真的變好」變成可測的產品旋鈕。MLE-Lite 81.8、Frontier-CS 70.7、GAIA 92.2 等數字是論文／模型卡的作者結果；model card 也顯示目前沒有現成 Inference Provider，部署成本與速度仍要自己量。

來源：[BAAI/AREX-2](https://huggingface.co/BAAI/AREX-2)、[AREX-2 paper](https://arxiv.org/abs/2609.38288)（2026-09-29）；可信度：公開權重／模型卡／論文，benchmark 屬作者結果。

### OpenShell：把 agent 邊界放在 harness 之外

- **新在哪裡：** NVIDIA 9/28 公開 [Open Agent Safety Platform](https://www.nvidia.com/en-us/solutions/ai/agent-safety/)，以 [OpenShell](https://github.com/NVIDIA/OpenShell) 做 sandboxed runtime 與政策執行，再以 Sentry／BlueField-4 做 out-of-band 監控與隔離；重點不是提醒模型「請小心」，而是讓檔案、網路、credentials 與工具路徑有可執行的邊界。
- **可以怎麼開始：** 先把 agent 放進沒有 production credentials 的測試環境，列出允許的 workspace、egress host、package install 與工具清單，測試正常任務、惡意 repo／setup script、越權網路三條路徑，再看 policy log 是否能阻擋與回溯。
- **限制：** OpenShell／Sentry 的架構、效能與「毫秒級 quarantine」是 NVIDIA 的產品主張；硬體層方案也不等於應用層授權、秘密輪替與人類審核已完成。社群已有小型測試報告安全改善，但也觀察到 auto-approval 仍可能放行新 host，不能只看成功案例。

來源：[NVIDIA 官方公告](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Launches-Open-Agent-Safety-Platform-to-Secure-Agents-From-Testing-to-Deployment/default.aspx)、[OpenShell Research](https://nvidia.github.io/OpenShell-Research/dev-notes/posts/2026-09-28-introducing-openshell-research/)、[社群測試](https://www.reddit.com/r/OpenAI/comments/1wt5lns/we_tested_nvidia_openshell_with_a_local_qwen38b_agent/)；可信度：官方架構＋小型社群實測，非獨立安全審計。

## 3. 官方新功能與推薦用法

### GPT-6.1 Sol：把 agent 成本路由拉回可計算的區間

- **官方更新：** OpenAI 9/29 發布 [GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/)；官方 API 價格為每百萬 tokens input $2、cached input $0.10、output $10，並稱其在 agentic coding、computer use 與 professional work 接近 Astra。GPT-6.1 Sol 已在 ChatGPT Work／Codex 的 Plus、Pro、Business、Enterprise、Edu 提供，ChatGPT 一般對話與 Ultrafast 可用性另有 rollout 差異。
- **推薦用法：** 先把任務分成「有 deterministic verifier」與「需要高判斷／高風險」兩類；前者用 Sol 記錄成功成本、返工與失敗原因，後者再升 Astra。DeepSWE、AutomationBench、OSWorld 等數字都是 OpenAI 自己的評測，不能直接當你的 production SLA。

### Agents API + computer use：少寫基礎 harness，多寫工具與驗收

- **官方更新：** [Agents API](https://openai.com/index/introducing-the-agents-api/) 進入 public beta，OpenAI 管理 sandbox、檔案、套件、skills、plugins 與 multi-agent；[DevDay recap](https://openai.com/index/devday-2026-recap/) 也列出 computer use、tool search 與 Codex harness 能力。這讓團隊可以把時間放在 domain tools、資料界線、驗收與觀測，而不是從零重造 loop。
- **可以怎麼開始：** 先用一個唯讀或可回滾的流程，設定最小 capability directory、MCP allowlist、輸出目錄與人工 approval；用 ThinkingBox 式終態檢查驗證後，再開啟可寫入外部系統的權限。Hosted sandbox 的隔離不會替你決定哪些資料與網站可以被 agent 看見。
- **限制：** public beta、partner sandbox、模型與方案可用性會變動；API 文件的範例與 OpenAI 自己的 customer／benchmark 數字都不能取代你自己的 cost、latency、failure recovery 與 data residency 測試。

### Dots：持續代理的價值在「回來後能接著做」，風險也在這裡

- **官方更新：** OpenAI 9/29 [Introducing dots](https://openai.com/index/introducing-dots/) 描述可持續工作的 agent：各自有 cloud computer，能透過 ChatGPT、Slack、Teams 與 connected apps 工作，並從回饋學習偏好。
- **推薦用法：** 先從低風險的每日整理、草稿與提醒開始；為每個 dot 設定資料範圍、可執行動作、停止條件與每日 review，付款、寄信、提交表單與刪除資料一律保留人工確認。這類 persistent agent 若沒有 audit log 與 kill switch，就不適合直接接個人主信箱或 production。
- **限制：** Dots 的方案、地區、beta 與 plugin rollout 仍可能不同；「always-on」是產品定位，不是保證每個背景任務都會可靠完成。

## 4. 使用心得與避坑

### 今日共同避坑：工具成功 ≠ 任務成功

- **先驗收狀態：** agent 回傳「已完成」、tool call 格式正確、HTTP 200，最多只證明它走過一段路；資料庫、檔案、ticket、寄件匣與權限記錄才是結果。ThinkingBox 的建議很實用：從一次「正常結束但狀態錯誤」的 trace 開始修，而不是只追模型排名。
- **先做最小範圍：** MCP 官方文件明確提醒 tools 代表任意程式碼執行能力，需要使用者同意與清楚授權；每個 server 先 pin 版本、限制 roots／egress、不要把整個 home directory 或 production token 暴露給 agent。
- **本地 agent 也要有 harness：** 今天的影片示範用純 Python 從 chat loop、tool schema、MCP、Markdown memory 到 model routing 組出小型 agent；這很適合學習，但影片示範的 workspace 工具、簡化錯誤處理與本地模型並不是 production security design。先加 timeout、schema validation、audit log、可回復寫入與人工 approval，再談 24/7。

來源：[MCP 官方入門](https://modelcontextprotocol.io/introduction)、[MCP specification 的安全原則](https://modelcontextprotocol.io/specification/2025-06-18)、[ThinkingBox failure signatures](https://huggingface.co/blog/microsoft/thinkingbox)；可信度：官方規格與公開 benchmark，部署建議是編輯推論。

## YouTube 深度整理

### Tech With Tim｜《Build Your Own Agentic Harness in Python - Full Tutorial》

- **頻道／發布／觀看：** Tech With Tim｜2026-10-04｜查核觀看數 20,617（數字會變動）｜[YouTube 原片](https://www.youtube.com/watch?v=H5o1P8RMiMw)｜37:43。
- **逐字稿查核：** 已用 yt-dlp 取得並讀完 YouTube `en-orig` 英文自動字幕；不是從標題或介紹猜測。影片有 HubSpot 贊助段，作者也推廣自己的 AI stack 資源與頻道工具鏈。
- **摘要：** 作者用純 Python 從一個 chat completion 開始，逐步加上 tool calling、agentic loop、MCP servers、Markdown persistent memory、命令列操作與 model routing，目標是讓讀者理解 Claude Code／Codex 類 harness 在底層做什麼，而不是只會在 UI 裡輸入 prompt。
- **重點：**
  1. LLM 只產生文字／tool-call 意圖，真正執行函式、回傳結果與持續迭代的是外層 harness。
  2. 最小 loop 是「送 messages → 判斷 tool call → 執行工具 → 把結果放回 messages → 直到沒有 tool call」。
  3. MCP 讓工具可動態發現，不必把每個 server 的函式硬編進 harness；作者示範 stdio server、時間工具與 fetch 工具。
  4. persistent memory 可以先是 Markdown 檔，但它等於每次把檔案內容注入 system prompt，不是自動可靠的記憶系統。
  5. model routing 可以用命令列切換本地小模型、較大本地模型與雲端模型；應依任務與硬體實測，不要只按模型名稱選。
- **步驟／工作流程：** `uv init` 建 Python 專案 → 安裝 OpenAI SDK、MCP 與 Pydantic → 先跑單輪 chat → 定義工具 schema → 加 while loop → 連 MCP → 加 `memory.md` → 加 `/models`、`/tools`、`/memory` 指令 → 用 workspace 檔案做多步任務。
- **工具／模型：** Python、VS Code、uv、OpenAI-compatible client、Ollama、本地 Qwen 3.5 2B／4B、MCP、Pydantic；也示範切到雲端 API。影片中的程式碼是作者教學實作，不是通用 production framework。
- **作者心得：** 作者認為理解 harness 比堆疊框架更重要，並示範「直接貼模組、逐步理解」比手打每一行更有效率；這是作者教學觀點，不是實驗結論。
- **優點／限制：** 優點是把 agent loop 拆成可理解的小版本，對想自己做 MCP／coding agent 的工程師很有用；限制是示範沒有完整 auth、rate limit、權限隔離、錯誤分類、任務終態 assertion 或 production secrets 管理，且 transcript 是自動字幕，專有名詞可能有辨識錯誤。
- **適合對象／是否值得看：** 適合會 Python、想理解 agent harness 與 MCP 底層的人；值得看，但應搭配 [MCP 官方規格](https://modelcontextprotocol.io/specification/2025-06-18) 與 [OpenAI Agents API](https://openai.com/index/introducing-the-agents-api/) 校正安全與正式 API 行為。
- **可立即嘗試：** 用一個沒有 secrets 的暫存 workspace，先只做 `list_files`／`read_file`；再加一個可回滾的 `write_file`，為每次 tool call 記錄輸入、輸出、耗時與失敗原因，最後用 5 次相同任務確認每次終態一致。不要直接把影片範例接到 production repo。

## 今天最值得帶回團隊的三個檢查

- **結果：** agent 完成後，外部系統的哪個欄位／檔案／ticket 狀態必須為真？
- **重複：** 同一任務重跑 5～20 次，成功率是 pass@1、best-of-k，還是 every-of-k？
- **邊界：** MCP、sandbox、credentials、browser 與 persistent agent 的最小權限在哪裡？出錯時誰能停止與回復？

## 今日一句話

AI agent 的下一個分水嶺不是更會說「完成」，而是能在可觀察的邊界內，反覆留下正確且可回復的結果。

## 來源總覽

- 實戰／評測：[ThinkingBox](https://huggingface.co/blog/microsoft/thinkingbox)、[Minimal harness paper](https://arxiv.org/abs/2609.40303)。
- 開放模型／工具：[AREX-2](https://huggingface.co/BAAI/AREX-2)、[AREX-2 paper](https://arxiv.org/abs/2609.38288)、[NVIDIA Open Agent Safety Platform](https://www.nvidia.com/en-us/solutions/ai/agent-safety/)、[OpenShell](https://github.com/NVIDIA/OpenShell)。
- 官方產品：[GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/)、[Agents API](https://openai.com/index/introducing-the-agents-api/)、[Dots](https://openai.com/index/introducing-dots/)。
- 規格／影片：[MCP specification](https://modelcontextprotocol.io/specification/2025-06-18)、[Tech With Tim 原片](https://www.youtube.com/watch?v=H5o1P8RMiMw)。
