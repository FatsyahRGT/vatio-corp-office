# Graph Report - kantor-ai-agent-local  (2026-11-08)

## Corpus Check
- 30 files · ~38,322 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 310 nodes · 614 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06a91e1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.js
- box
- package.json
- createPanel
- office.js
- main.js
- roster.js
- check-status.sh script
- context.js
- rotate-logs.cjs
- notulen-master.js
- tiered-memory.test.js
- notulen-master.test.js
- sync-context.js
- check-status.js
- renderMarkdown
- ref_node_fs

## God Nodes (most connected - your core abstractions)
1. `createPanel()` - 40 edges
2. `box()` - 34 edges
3. `submit()` - 19 edges
4. `divisionById()` - 17 edges
5. `agentById()` - 15 edges
6. `render()` - 15 edges
7. `scripts` - 11 edges
8. `createCharacter()` - 11 edges
9. `renderMarkdown()` - 11 edges
10. `agentsOf()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `selectAgent()` --calls--> `agentById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `createPanel()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `createPanel()` --calls--> `allLeaders()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `render()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `buildDivisionRoom()` --calls--> `agentsOf()`  [EXTRACTED]
  src/office.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.10
Nodes (15): app, daily, DAILY_MAX_REQUESTS, dailyCap(), dist, hits, MAX_TOKENS, PORT (+7 more)

### Community 1 - "box"
Cohesion: 0.08
Nodes (42): SKIN, box(), buildHair(), buildHijab(), clamp(), createCharacter(), c, damp() (+34 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (34): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+26 more)

### Community 3 - "createPanel"
Cohesion: 0.14
Nodes (41): agentById(), divisionById(), clearAllHistory(), clearHistory(), getCode(), getCrossDivisionContext(), getHistory(), histories (+33 more)

### Community 4 - "office.js"
Cohesion: 0.15
Nodes (18): addSeat(), buildDivisionRoom(), buildOffice(), buildShell(), makeSign(), PITCH_X, PITCH_Z, place() (+10 more)

### Community 5 - "main.js"
Cohesion: 0.11
Nodes (20): fetchConfig(), setCode(), chipDefs, chipsEl, closeChat(), config, doneTimers, goTo() (+12 more)

### Community 6 - "roster.js"
Cohesion: 0.14
Nodes (19): syncGraphifyToContext(), getSystemContext(), delegate(), parsePlan(), planPrompt(), wantsDelegation(), buildMeetingPrompt(), buildSystemPrompt() (+11 more)

### Community 8 - "context.js"
Cohesion: 0.23
Nodes (11): ARCHIVE_DIR_PATH, __dirname, formatBytes(), formatDate(), getArchiveList(), getClipping(), getMemoryStructureTable(), listContext() (+3 more)

### Community 10 - "rotate-logs.cjs"
Cohesion: 0.25
Nodes (5): archiveDir, dest, fs, path, sprintLog

### Community 11 - "notulen-master.js"
Cohesion: 0.18
Nodes (10): BIZ_LOGS, __dirname, __filename, FINAL_MASTER_DOC, HACKATHON_DOC, ROOT_DIR, SPRINT_LOG, SYSTEM_CONTEXT (+2 more)

### Community 12 - "tiered-memory.test.js"
Cohesion: 0.20
Nodes (8): ARCHIVE_DIR, CHECK_JS, CHECK_PS1, CHECK_SH, __dirname, ROOT_DIR, TIER1_PATH, TIER2_PATH

### Community 13 - "notulen-master.test.js"
Cohesion: 0.25
Nodes (7): synthesizeNotulen(), extractDecisions(), synthesizeAllDivisions(), __dirname, FINAL_DOC_PATH, HACKATHON_DOC_PATH, ROOT_DIR

### Community 14 - "sync-context.js"
Cohesion: 0.25
Nodes (6): CONTEXT_PATH, __dirname, GRAPH_JSON_PATH, REPORT_PATH, ROOT_DIR, TIER1_PATH

### Community 15 - "check-status.js"
Cohesion: 0.25
Nodes (5): ARCHIVE_DIR, __dirname, __filename, TIER1_PATH, TIER2_PATH

### Community 16 - "renderMarkdown"
Cohesion: 0.57
Nodes (6): esc(), inline(), isTableSep(), parseTableAlignments(), renderMarkdown(), splitTableRow()

### Community 17 - "ref_node_fs"
Cohesion: 0.40
Nodes (3): __dirname, __filename, rotateLogs()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPanel()` connect `createPanel` to `renderMarkdown`, `main.js`, `roster.js`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `divisionById()` connect `createPanel` to `index.js`, `main.js`, `roster.js`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.07591836734693877 - nodes in this community are weakly interconnected._
- **Why does `agentById()` connect `createPanel` to `index.js`, `main.js`, `roster.js`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.13510520487264674 - nodes in this community are weakly interconnected._