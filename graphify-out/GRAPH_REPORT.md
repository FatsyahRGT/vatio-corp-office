# Graph Report - kantor-ai-agent-local  (2026-11-07)

## Corpus Check
- 17 files · ~25,430 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 223 nodes · 455 edges · 7 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `946aa7f1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.js
- box
- package.json
- createPanel
- office.js
- main.js
- renderMarkdown

## God Nodes (most connected - your core abstractions)
1. `createPanel()` - 39 edges
2. `box()` - 34 edges
3. `submit()` - 18 edges
4. `render()` - 15 edges
5. `divisionById()` - 14 edges
6. `agentById()` - 11 edges
7. `createCharacter()` - 11 edges
8. `renderMarkdown()` - 11 edges
9. `agentsOf()` - 10 edges
10. `renderMeetingParticipants()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `selectAgent()` --calls--> `agentById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `selectAgent()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `closeChat()` --calls--> `divisionById()`  [EXTRACTED]
  src/main.js → shared/roster.js
- `createPanel()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js
- `render()` --calls--> `agentsOf()`  [EXTRACTED]
  src/panel.js → shared/roster.js

## Import Cycles
- None detected.

## Communities (7 total, 0 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.07
Nodes (31): delegate(), parsePlan(), planPrompt(), wantsDelegation(), app, daily, DAILY_MAX_REQUESTS, dailyCap() (+23 more)

### Community 1 - "box"
Cohesion: 0.08
Nodes (41): box(), buildHair(), buildHijab(), clamp(), createCharacter(), c, damp(), geo() (+33 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (29): dependencies, dotenv@latest, express@latest, jszip@^3.10.2, pdf-parse@^2.4.5, three@latest, description, devDependencies (+21 more)

### Community 3 - "createPanel"
Cohesion: 0.12
Nodes (43): agentById(), allLeaders(), divisionById(), clearAllHistory(), clearHistory(), getCode(), getHistory(), histories (+35 more)

### Community 4 - "office.js"
Cohesion: 0.15
Nodes (18): addSeat(), buildDivisionRoom(), buildOffice(), buildShell(), makeSign(), PITCH_X, PITCH_Z, place() (+10 more)

### Community 5 - "main.js"
Cohesion: 0.13
Nodes (17): fetchConfig(), chipDefs, chipsEl, closeChat(), config, doneTimers, goTo(), markChip() (+9 more)

### Community 7 - "renderMarkdown"
Cohesion: 0.57
Nodes (6): esc(), inline(), isTableSep(), parseTableAlignments(), renderMarkdown(), splitTableRow()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPanel()` connect `createPanel` to `index.js`, `main.js`, `renderMarkdown`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06567992599444958 - nodes in this community are weakly interconnected._
- **Why does `three` connect `package.json` to `box`, `office.js`, `main.js`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.0782312925170068 - nodes in this community are weakly interconnected._
- **Why does `box()` connect `box` to `office.js`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07956989247311828 - nodes in this community are weakly interconnected._
- **Should `createPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.1202020202020202 - nodes in this community are weakly interconnected._