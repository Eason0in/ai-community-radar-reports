# AI Community Radar - 2026-10-23

> Generated: 2026-10-23T01:21:37.185Z
> Timezone: Asia/Taipei
> Active cutoff: updated since 2026-10-21; archived GitHub repos excluded; max stale age 2 days.

## 今日摘要

| 項目 | 結果 |
| --- | --- |
| 熱門 AI repo | 3 個 |
| MCP Registry 取樣 | 800 servers |
| 可能未上架候選 | 8 個 |
| 可實作工具建議 | 5 個 |

## GitHub 熱門 AI Repo Top 3

| # | Repo | Stars | Forks | Language | Updated |
| --- | --- | ---: | ---: | --- | --- |
| 1 | [morluto/rea](https://github.com/morluto/rea) | 366,414 | 91,806 | TypeScript | 2026-10-23T01:10:40Z |
| 2 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | 256,256 | 55,970 | Python | 2026-10-23T01:16:18Z |
| 3 | [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | 201,185 | 79,380 | C++ | 2026-10-23T01:19:02Z |

### 1. [morluto/rea](https://github.com/morluto/rea)

**可以做什麼**

Reverse engineer anything with agents, from app behavior down to native binaries.

**解決什麼問題**

降低建置 AI agent、工具調用、任務規劃或多步驟自動化的成本。

**可貢獻切角**

可先做 read-only MCP companion 或文件搜尋工具，若 repo 沒有官方 MCP integration，這會是低風險且有社群價值的切入點。

**Topics**: `agent-skills`, `ai-agents`, `binary-analysis`, `claude-code`, `cli`, `codex`, `cordis`, `decompiler`
**Glama 交叉查詢**: https://glama.ai/mcp/servers?q=rea

### 2. [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

**可以做什麼**

The agent that grows with you.

**解決什麼問題**

降低建置 AI agent、工具調用、任務規劃或多步驟自動化的成本。

**可貢獻切角**

可先做 read-only MCP companion 或文件搜尋工具，若 repo 沒有官方 MCP integration，這會是低風險且有社群價值的切入點。

**Topics**: `ai`, `ai-agent`, `ai-agents`, `anthropic`, `chatgpt`, `claude`, `claude-code`, `codex`
**Glama 交叉查詢**: https://glama.ai/mcp/servers?q=hermes-agent

### 3. [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow)

**可以做什麼**

An Open Source Machine Learning Framework for Everyone.

**解決什麼問題**

解決 AI 應用開發中重複整合、理解成本高或從 prototype 到可用工具落差大的問題。

**可貢獻切角**

可先做 read-only MCP companion 或文件搜尋工具，若 repo 沒有官方 MCP integration，這會是低風險且有社群價值的切入點。

**Topics**: `deep-learning`, `deep-neural-networks`, `distributed`, `machine-learning`, `ml`, `neural-network`, `python`, `tensorflow`
**Glama 交叉查詢**: https://glama.ai/mcp/servers?q=tensorflow

## MCP / Tool 社群機會

| 指標 | 值 |
| --- | --- |
| Registry sample | 800 servers |
| Active baseline since | 2026-10-21 |
| GitHub stale cutoff | 2 days |

### 可能還沒上官方 MCP Registry 的候選

#### 1. [@tanstack/ai-mcp](https://www.npmjs.com/package/@tanstack/ai-mcp)

| 欄位 | 內容 |
| --- | --- |
| 類型 | npm-package |
| 說明 | Host-side Model Context Protocol client for TanStack AI: discover and run MCP server tools, resources, and prompts in any adapter's chat() loop, with generated end-to-end types. |
| 為什麼值得看 | npm 上已有人釋出 MCP server / tool 相關 package，但在本次官方 MCP Registry 取樣中沒有命中，可確認是否適合整理、補文件或提交 registry。 |
| 下一步 | 確認 package 是否真的可用；若品質足夠，協助補 server.json、README install block、Glama/官方 registry 上架流程。 |
| Repo | [https://github.com/TanStack/ai](https://github.com/TanStack/ai) |

#### 2. [@kubb/mcp](https://www.npmjs.com/package/@kubb/mcp)

| 欄位 | 內容 |
| --- | --- |
| 類型 | npm-package |
| 說明 | MCP server for Kubb. Exposes code generation as a tool over the Model Context Protocol so AI assistants like Claude, Cursor, and other MCP-compatible clients can generate TypeScript types, clients, and more. |
| 為什麼值得看 | npm 上已有人釋出 MCP server / tool 相關 package，但在本次官方 MCP Registry 取樣中沒有命中，可確認是否適合整理、補文件或提交 registry。 |
| 下一步 | 確認 package 是否真的可用；若品質足夠，協助補 server.json、README install block、Glama/官方 registry 上架流程。 |
| Repo | [https://github.com/kubb-labs/kubb](https://github.com/kubb-labs/kubb) |

#### 3. [@supabase/mcp-utils](https://www.npmjs.com/package/@supabase/mcp-utils)

| 欄位 | 內容 |
| --- | --- |
| 類型 | npm-package |
| 說明 | MCP utilities |
| 為什麼值得看 | npm 上已有人釋出 MCP server / tool 相關 package，但在本次官方 MCP Registry 取樣中沒有命中，可確認是否適合整理、補文件或提交 registry。 |
| 下一步 | 確認 package 是否真的可用；若品質足夠，協助補 server.json、README install block、Glama/官方 registry 上架流程。 |
| Repo | [https://github.com/supabase/mcp](https://github.com/supabase/mcp) |

#### 4. [@payloadcms/plugin-mcp](https://www.npmjs.com/package/@payloadcms/plugin-mcp)

| 欄位 | 內容 |
| --- | --- |
| 類型 | npm-package |
| 說明 | MCP (Model Context Protocol) capabilities with Payload |
| 為什麼值得看 | npm 上已有人釋出 MCP server / tool 相關 package，但在本次官方 MCP Registry 取樣中沒有命中，可確認是否適合整理、補文件或提交 registry。 |
| 下一步 | 確認 package 是否真的可用；若品質足夠，協助補 server.json、README install block、Glama/官方 registry 上架流程。 |
| Repo | [https://github.com/payloadcms/payload](https://github.com/payloadcms/payload) |

#### 5. [@traceloop/instrumentation-mcp](https://www.npmjs.com/package/@traceloop/instrumentation-mcp)

| 欄位 | 內容 |
| --- | --- |
| 類型 | npm-package |
| 說明 | MCP (Model Context Protocol) Instrumentation |
| 為什麼值得看 | npm 上已有人釋出 MCP server / tool 相關 package，但在本次官方 MCP Registry 取樣中沒有命中，可確認是否適合整理、補文件或提交 registry。 |
| 下一步 | 確認 package 是否真的可用；若品質足夠，協助補 server.json、README install block、Glama/官方 registry 上架流程。 |
| Repo | [https://github.com/traceloop/openllmetry-js](https://github.com/traceloop/openllmetry-js) |

#### 6. [ratnoub/mcp-librenms](https://github.com/ratnoub/mcp-librenms)

| 欄位 | 內容 |
| --- | --- |
| 類型 | github-repo |
| 說明 | MCP (Model Context Protocol) server that exposes the LibreNMS REST API as MCP tools. Built with FastMCP. |
| 為什麼值得看 | GitHub 上近 2 天仍有更新、且不是 archived 的 MCP 相關 repo，但在本次官方 MCP Registry 取樣中沒有命中。 |
| 下一步 | 先跑通 server、檢查工具 schema 描述，再幫作者補 registry submission 或整理成可安裝 npm package。 |

#### 7. [nlqueries/nlqueries](https://github.com/nlqueries/nlqueries)

| 欄位 | 內容 |
| --- | --- |
| 類型 | github-repo |
| 說明 | Open source natural language to SQL (NL2SQL) engine with schema validation and an MCP server for Claude and Cursor |
| 為什麼值得看 | GitHub 上近 2 天仍有更新、且不是 archived 的 MCP 相關 repo，但在本次官方 MCP Registry 取樣中沒有命中。 |
| 下一步 | 先跑通 server、檢查工具 schema 描述，再幫作者補 registry submission 或整理成可安裝 npm package。 |

#### 8. [OWASP/www-project-agent-memory-guard](https://github.com/OWASP/www-project-agent-memory-guard)

| 欄位 | 內容 |
| --- | --- |
| 類型 | github-repo |
| 說明 | Runtime defense against memory poisoning in AI agents (OWASP ASI06). Drop-in for LangChain, OpenAI Agents, AutoGen, CrewAI and mem0. |
| 為什麼值得看 | GitHub 上近 2 天仍有更新、且不是 archived 的 MCP 相關 repo，但在本次官方 MCP Registry 取樣中沒有命中。 |
| 下一步 | 先跑通 server、檢查工具 schema 描述，再幫作者補 registry submission 或整理成可安裝 npm package。 |

### 建議可以實作的工具

#### 1. [morluto/rea MCP companion](https://github.com/morluto/rea)

**可以做什麼**

為 morluto/rea 做一個 MCP companion，讓 agent 可以查詢專案能力、範例、設定檔、常見錯誤與 release note。

**為什麼有人會用**

熱門 AI repo 通常文件量大、設定組合多；MCP 化後可直接服務 Cursor、Claude Code、Codex、ChatGPT 等 agent 工作流。

**MVP**

先做 read-only tools：search_docs、list_examples、explain_config、troubleshoot_error；穩定後再補 scaffold 或 patch 類工具。

#### 2. [NousResearch/hermes-agent MCP companion](https://github.com/NousResearch/hermes-agent)

**可以做什麼**

為 NousResearch/hermes-agent 做一個 MCP companion，讓 agent 可以查詢專案能力、範例、設定檔、常見錯誤與 release note。

**為什麼有人會用**

熱門 AI repo 通常文件量大、設定組合多；MCP 化後可直接服務 Cursor、Claude Code、Codex、ChatGPT 等 agent 工作流。

**MVP**

先做 read-only tools：search_docs、list_examples、explain_config、troubleshoot_error；穩定後再補 scaffold 或 patch 類工具。

#### 3. [tensorflow/tensorflow MCP companion](https://github.com/tensorflow/tensorflow)

**可以做什麼**

為 tensorflow/tensorflow 做一個 MCP companion，讓 agent 可以查詢專案能力、範例、設定檔、常見錯誤與 release note。

**為什麼有人會用**

熱門 AI repo 通常文件量大、設定組合多；MCP 化後可直接服務 Cursor、Claude Code、Codex、ChatGPT 等 agent 工作流。

**MVP**

先做 read-only tools：search_docs、list_examples、explain_config、troubleshoot_error；穩定後再補 scaffold 或 patch 類工具。

#### 4. [MCP Registry Gap Finder](https://registry.modelcontextprotocol.io)

**可以做什麼**

每天比對 GitHub/npm 的 MCP 新專案與官方 registry / Glama 收錄狀態，產出可上架、可修文件、可合併同類工具清單。

**為什麼有人會用**

MCP 生態成長快，開發者需要有人把可用但沒被發現的工具整理出來。

**MVP**

把本報告的取樣邏輯抽成 MCP server，提供 find_unlisted_servers、score_listing_readiness、generate_submission_checklist。

#### 5. [Tool Definition Quality Linter](https://glama.ai/mcp/methodology)

**可以做什麼**

針對 MCP tools 的 description、input schema、side effects、readOnly/destructive/idempotent hints 做本機 lint。

**為什麼有人會用**

工具描述品質會直接影響 agent 是否敢用、會不會誤用；這是很多 MCP 專案都需要的貢獻。

**MVP**

先支援 JSON schema / FastMCP introspection output，輸出 GitHub PR comment 與修正文案建議。

## 今日行動清單

- [ ] 從候選清單挑 1 個項目人工確認是否真的未上官方 MCP Registry。
- [ ] 如果候選品質足夠，補 README install block、工具 schema 說明與 registry submission checklist。
- [ ] 從工具建議挑 1 個 read-only MVP，先做小範圍 prototype。

## 資料限制

- GitHub 熱門度以近期活躍且 stars 高的 AI topic repo 估算，不等同 GitHub Trending 官方頁面。
- 每日檢查排除 GitHub archived repos，以及超過 2 天沒有 pushed update 的 GitHub 項目。
- 官方 MCP Registry 以分頁取樣比對，未命中代表值得人工確認，不代表百分之百未上架。
- Glama 作為人工交叉檢查入口；若後續需要更精準，可再接 Glama public API 的完整查詢結果。

## Sources

- GitHub Search API: https://docs.github.com/en/rest/search/search#search-repositories
- npm Registry search API: https://registry.npmjs.org/-/v1/search
- Official MCP Registry API: https://registry.modelcontextprotocol.io/v0.1/servers
- Glama MCP directory: https://glama.ai/mcp/servers

