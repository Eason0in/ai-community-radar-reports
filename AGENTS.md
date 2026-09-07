# AI 日報交付規則

## 免 GPG 的日報發佈

使用者已明確指定：AI 日報以無人值守方式發佈，不依賴本機 GPG key 或 pinentry。

- 這項政策只適用本倉庫日報與必要發佈設定。提交使用 `git -c commit.gpgsign=false commit --no-gpg-sign -m "docs: publish YYYY-MM-DD AI report"`，推送使用 `git -c push.gpgSign=false push origin HEAD:main`。
- 不先嘗試 `git commit -S`、`git-gpg-sign` 或要求使用者解鎖 GPG。不修改全域 Git 簽章設定；其他專案、軟體 release tag 與遠端保護規則不在本政策範圍內。
- 此倉庫日報以 `origin/main` 發佈至 GitHub Pages；已授權的日報交付直接完成，不另外建立 develop/master 發版流程或詢問是否發版。

## 完成條件

1. 先 fetch；主 checkout 有既有修改或落後時，從最新 `origin/main` 建立隔離 worktree，保留原本工作。
2. 以台灣日期產生 `reports/YYYY-MM-DD.md`、`reports/latest.md`、`LATEST_REPORT.md`，三份內容必須位元組相同。
3. 使用繁體中文與四類短版：社群實戰用法、社群新工具與新玩法、官方新功能與推薦用法、使用心得與避坑。以近 24–48 小時新進展為主，附原始來源、日期與可信度；去除已報過且無更新的題目。YouTube 另附，須超過 10,000 觀看並讀過可靠字幕，揭露贊助。
4. 執行 `npm run check`、`npm test`、`npm run build` 與 `git diff --check`，核對本機 `docs/data/latest.json` 日期與正文。
5. 只以完整檔名暫存本次日報與必要修改。不要整批暫存 `reports` 或 `data`；`community-radar/` 是另一個產出流程，`docs/` 是忽略的建置產物。
6. 免 GPG 提交後正常推送；若遠端前進，保留遠端修改、更新基準並重新驗證，禁止 force push。
7. 等待對應 commit 的 `Deploy Daily Report SPA` 成功，再 GET 公開 SPA 與加 cache-buster 的 `data/latest.json`，確認 HTTP 200、今天日期、正文與本次 Markdown 完全一致。
8. 以 https://eason0in.github.io/ai-community-radar-reports/ 交付。內容完成、commit、push、Pages 成功與公開回讀是不同階段；只在最後一步成功後稱為已發佈。
