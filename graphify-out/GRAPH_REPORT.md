# Graph Report - kantor-ai-agent-local  (2026-11-07)

## Corpus Check
- 17 files · ~24,527 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 213 nodes · 420 edges · 8 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b7e78eec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.js
- box
- package.json
- createPanel
- office.js
- main.js
- character.js
- renderMarkdown

## God Nodes (most connected - your core abstractions)
1. `box()` - 34 edges
2. `createPanel()` - 29 edges
3. `render()` - 14 edges
4. `submit()` - 13 edges
5. `divisionById()` - 13 edges
6. `createCharacter()` - 11 edges
7. `renderMarkdown()` - 11 edges
8. `agentsOf()` - 10 edges
9. `agentById()` - 9 edges
10. `createStage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `createPanel()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `render()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `buildMeetingPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `buildSystemPrompt()` --calls--> `divisionById()`  [EXTRACTED]
  server/prompts.js → shared/roster.js
- `buildDivisionRoom()` --calls--> `agentsOf()`  [EXTRACTED]
  src/office.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.07
Nodes (29): delegate(), parsePlan(), planPrompt(), wantsDelegation(), app, daily, DAILY_MAX_REQUESTS, dailyCap() (+21 more)

### Community 1 - "box"
Cohesion: 0.14
Nodes (29): box(), mat(), BOOK_COLORS, bookshelf(), calculator(), chair(), chartWall(), clock() (+21 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (29): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+21 more)

### Community 3 - "createPanel"
Cohesion: 0.13
Nodes (33): agentById(), allLeaders(), divisionById(), clearAllHistory(), clearHistory(), fetchConfig(), getCode(), getHistory() (+25 more)

### Community 4 - "office.js"
Cohesion: 0.14
Nodes (19): DIVISIONS, addSeat(), buildDivisionRoom(), buildOffice(), buildShell(), makeSign(), PITCH_X, PITCH_Z (+11 more)

### Community 5 - "main.js"
Cohesion: 0.14
Nodes (16): chipDefs, chipsEl, closeChat(), config, doneTimers, goTo(), markChip(), mobile (+8 more)

### Community 6 - "character.js"
Cohesion: 0.13
Nodes (13): SKIN, buildHair(), buildHijab(), clamp(), createCharacter(), c, damp(), geo() (+5 more)

### Community 7 - "renderMarkdown"
Cohesion: 0.57
Nodes (6): esc(), inline(), isTableSep(), parseTableAlignments(), renderMarkdown(), splitTableRow()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `three` connect `package.json` to `box`, `office.js`, `main.js`, `character.js`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._
- **Why does `createPanel()` connect `createPanel` to `index.js`, `main.js`, `renderMarkdown`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.135632183908046 - nodes in this community are weakly interconnected._
- **Why does `box()` connect `box` to `office.js`, `character.js`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07956989247311828 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._