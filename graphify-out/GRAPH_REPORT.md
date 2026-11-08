# Graph Report - kantor-ai-agent-local  (2026-11-08)

## Corpus Check
- 22 files · ~32,173 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 242 nodes · 510 edges · 9 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `519ab0cc`
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
- character.js

## God Nodes (most connected - your core abstractions)
1. `createPanel()` - 40 edges
2. `box()` - 34 edges
3. `submit()` - 19 edges
4. `divisionById()` - 17 edges
5. `agentById()` - 15 edges
6. `render()` - 15 edges
7. `agentsOf()` - 11 edges
8. `createCharacter()` - 11 edges
9. `renderMarkdown()` - 11 edges
10. `buildSystemPrompt()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `buildMeetingPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `buildSystemPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `buildDivisionRoom()` --calls--> `agentsOf()`  [EXTRACTED]
  src/office.js → shared/roster.js
- `createPanel()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `render()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.10
Nodes (15): app, daily, DAILY_MAX_REQUESTS, dailyCap(), dist, hits, MAX_TOKENS, PORT (+7 more)

### Community 1 - "box"
Cohesion: 0.14
Nodes (28): box(), BOOK_COLORS, bookshelf(), calculator(), chair(), chartWall(), clock(), coffeeMachine() (+20 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (31): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+23 more)

### Community 3 - "createPanel"
Cohesion: 0.14
Nodes (41): agentById(), divisionById(), clearAllHistory(), clearHistory(), getCode(), getCrossDivisionContext(), getHistory(), histories (+33 more)

### Community 4 - "office.js"
Cohesion: 0.15
Nodes (18): addSeat(), buildDivisionRoom(), buildOffice(), buildShell(), makeSign(), PITCH_X, PITCH_Z, place() (+10 more)

### Community 5 - "main.js"
Cohesion: 0.13
Nodes (18): fetchConfig(), setCode(), chipDefs, chipsEl, closeChat(), config, doneTimers, goTo() (+10 more)

### Community 6 - "roster.js"
Cohesion: 0.09
Nodes (27): CONTEXT_PATH, __dirname, GRAPH_JSON_PATH, REPORT_PATH, ROOT_DIR, syncGraphifyToContext(), CONTEXT_PATH, __dirname (+19 more)

### Community 7 - "renderMarkdown"
Cohesion: 0.57
Nodes (6): esc(), inline(), isTableSep(), parseTableAlignments(), renderMarkdown(), splitTableRow()

### Community 8 - "character.js"
Cohesion: 0.14
Nodes (13): buildHair(), buildHijab(), clamp(), createCharacter(), c, damp(), geo(), geoCache (+5 more)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPanel()` connect `createPanel` to `main.js`, `roster.js`, `renderMarkdown`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `three` connect `package.json` to `character.js`, `box`, `office.js`, `main.js`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Why does `box()` connect `box` to `character.js`, `office.js`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07386363636363637 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.13510520487264674 - nodes in this community are weakly interconnected._