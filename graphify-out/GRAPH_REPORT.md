# Graph Report - kantor-ai-agent-local  (2026-11-08)

## Corpus Check
- 25 files · ~33,650 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 269 nodes · 549 edges · 11 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6e43a0b`
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
- renderMarkdown
- tiered-memory.test.js
- character.js
- rotate-logs.cjs

## God Nodes (most connected - your core abstractions)
1. `createPanel()` - 40 edges
2. `box()` - 34 edges
3. `submit()` - 19 edges
4. `divisionById()` - 17 edges
5. `agentById()` - 15 edges
6. `render()` - 15 edges
7. `createCharacter()` - 11 edges
8. `agentsOf()` - 11 edges
9. `renderMarkdown()` - 11 edges
10. `scripts` - 9 edges

## Surprising Connections (you probably didn't know these)
- `selectAgent()` --calls--> `agentById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `buildMeetingPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `buildSystemPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `closeChat()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `selectAgent()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.10
Nodes (15): app, daily, DAILY_MAX_REQUESTS, dailyCap(), dist, hits, MAX_TOKENS, PORT (+7 more)

### Community 1 - "box"
Cohesion: 0.14
Nodes (28): box(), BOOK_COLORS, bookshelf(), calculator(), chair(), chartWall(), clock(), coffeeMachine() (+20 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (32): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+24 more)

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
Cohesion: 0.19
Nodes (14): getSystemContext(), delegate(), parsePlan(), planPrompt(), wantsDelegation(), buildMeetingPrompt(), buildSystemPrompt(), DIVISION_BRIEF (+6 more)

### Community 7 - "renderMarkdown"
Cohesion: 0.57
Nodes (6): esc(), inline(), isTableSep(), parseTableAlignments(), renderMarkdown(), splitTableRow()

### Community 8 - "tiered-memory.test.js"
Cohesion: 0.08
Nodes (25): CONTEXT_PATH, __dirname, GRAPH_JSON_PATH, REPORT_PATH, ROOT_DIR, syncGraphifyToContext(), TIER1_PATH, ARCHIVE_DIR_PATH (+17 more)

### Community 9 - "character.js"
Cohesion: 0.13
Nodes (14): SKIN, buildHair(), buildHijab(), clamp(), createCharacter(), c, damp(), geo() (+6 more)

### Community 10 - "rotate-logs.cjs"
Cohesion: 0.25
Nodes (5): archiveDir, dest, fs, path, sprintLog

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPanel()` connect `createPanel` to `main.js`, `roster.js`, `renderMarkdown`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `three` connect `package.json` to `character.js`, `office.js`, `main.js`, `box`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Why does `divisionById()` connect `createPanel` to `index.js`, `main.js`, `roster.js`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07130124777183601 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.13510520487264674 - nodes in this community are weakly interconnected._