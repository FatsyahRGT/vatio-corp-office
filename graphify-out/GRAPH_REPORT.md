# Graph Report - kantor-ai-agent-local  (2026-11-08)

## Corpus Check
- 22 files · ~32,465 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 245 nodes · 513 edges · 8 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bbb5427d`
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
10. `renderMeetingParticipants()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `selectAgent()` --calls--> `agentById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `selectAgent()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `closeChat()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `buildMeetingPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `buildSystemPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.10
Nodes (15): app, daily, DAILY_MAX_REQUESTS, dailyCap(), dist, hits, MAX_TOKENS, PORT (+7 more)

### Community 1 - "box"
Cohesion: 0.08
Nodes (41): box(), buildHair(), buildHijab(), clamp(), createCharacter(), c, damp(), geo() (+33 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (31): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+23 more)

### Community 3 - "createPanel"
Cohesion: 0.13
Nodes (43): agentById(), divisionById(), clearAllHistory(), clearHistory(), fetchConfig(), getCode(), getCrossDivisionContext(), getHistory() (+35 more)

### Community 4 - "office.js"
Cohesion: 0.15
Nodes (18): addSeat(), buildDivisionRoom(), buildOffice(), buildShell(), makeSign(), PITCH_X, PITCH_Z, place() (+10 more)

### Community 5 - "main.js"
Cohesion: 0.12
Nodes (18): chipDefs, chipsEl, closeChat(), config, doneTimers, goTo(), initialTheme, markChip() (+10 more)

### Community 6 - "roster.js"
Cohesion: 0.09
Nodes (27): CONTEXT_PATH, __dirname, GRAPH_JSON_PATH, REPORT_PATH, ROOT_DIR, syncGraphifyToContext(), CONTEXT_PATH, __dirname (+19 more)

### Community 7 - "renderMarkdown"
Cohesion: 0.57
Nodes (6): esc(), inline(), isTableSep(), parseTableAlignments(), renderMarkdown(), splitTableRow()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPanel()` connect `createPanel` to `main.js`, `roster.js`, `renderMarkdown`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `three` connect `package.json` to `box`, `office.js`, `main.js`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.0782312925170068 - nodes in this community are weakly interconnected._
- **Why does `box()` connect `box` to `office.js`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07386363636363637 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.12525252525252525 - nodes in this community are weakly interconnected._