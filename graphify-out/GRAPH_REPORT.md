# Graph Report - kantor-ai-agent-local  (2026-11-08)

## Corpus Check
- 28 files · ~35,001 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 290 nodes · 579 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e4180a6`
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
- tiered-memory.test.js
- rotate-logs.cjs

## God Nodes (most connected - your core abstractions)
1. `createPanel()` - 40 edges
2. `box()` - 34 edges
3. `submit()` - 19 edges
4. `divisionById()` - 17 edges
5. `agentById()` - 15 edges
6. `render()` - 15 edges
7. `agentsOf()` - 11 edges
8. `renderMarkdown()` - 11 edges
9. `createCharacter()` - 11 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `selectAgent()` --calls--> `agentById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `getCrossDivisionContext()` --calls--> `divisionById()`  [EXTRACTED]
  src/chat.js → shared/roster.js
- `closeChat()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `selectAgent()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `createPanel()` --calls--> `divisionById()`  [EXTRACTED]
  src/panel.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.10
Nodes (15): app, daily, DAILY_MAX_REQUESTS, dailyCap(), dist, hits, MAX_TOKENS, PORT (+7 more)

### Community 1 - "box"
Cohesion: 0.08
Nodes (42): SKIN, box(), buildHair(), buildHijab(), clamp(), createCharacter(), c, damp() (+34 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (33): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+25 more)

### Community 3 - "createPanel"
Cohesion: 0.11
Nodes (46): agentById(), clearAllHistory(), clearHistory(), getCode(), getCrossDivisionContext(), getHistory(), histories, persist() (+38 more)

### Community 4 - "office.js"
Cohesion: 0.15
Nodes (18): addSeat(), buildDivisionRoom(), buildOffice(), buildShell(), makeSign(), PITCH_X, PITCH_Z, place() (+10 more)

### Community 5 - "main.js"
Cohesion: 0.11
Nodes (20): fetchConfig(), setCode(), chipDefs, chipsEl, closeChat(), config, doneTimers, goTo() (+12 more)

### Community 6 - "roster.js"
Cohesion: 0.20
Nodes (15): getSystemContext(), delegate(), parsePlan(), planPrompt(), wantsDelegation(), buildMeetingPrompt(), buildSystemPrompt(), DIVISION_BRIEF (+7 more)

### Community 8 - "tiered-memory.test.js"
Cohesion: 0.06
Nodes (38): CONTEXT_PATH, __dirname, GRAPH_JSON_PATH, REPORT_PATH, ROOT_DIR, syncGraphifyToContext(), TIER1_PATH, ARCHIVE_DIR_PATH (+30 more)

### Community 10 - "rotate-logs.cjs"
Cohesion: 0.25
Nodes (5): archiveDir, dest, fs, path, sprintLog

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPanel()` connect `createPanel` to `main.js`, `roster.js`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `divisionById()` connect `roster.js` to `index.js`, `createPanel`, `main.js`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.07591836734693877 - nodes in this community are weakly interconnected._
- **Why does `three` connect `package.json` to `box`, `office.js`, `main.js`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06890756302521009 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.11224489795918367 - nodes in this community are weakly interconnected._