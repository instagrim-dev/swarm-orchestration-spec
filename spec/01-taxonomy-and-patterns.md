# Taxonomy and Patterns

**Document version:** 1.0  
**Date:** 2025-03-15

## Existing (pre-swarm) patterns

| Layer | Pattern | Topology | Lifecycle | Communication |
|-------|---------|----------|-----------|----------------|
| Spawn | Parent → child | Tree | Ephemeral | Output polling |
| Teams | Lead + teammates | Star | Persistent | Task queue + mailbox |
| Recipes/Pipelines | Sequential stages | Linear | Run-scoped | Artifact handoff |
| A2A | Remote agents | Federated | URL-based | Request/response |
| Mesh + self-org | Capability registry → team | Resolved star | Registry-scoped | Resolve + task queue |

Cross-cutting: choreography (state machine, tool gates), worktree isolation, permission/policy chains.

## Swarm archetypes

### 1. Hive (structured colony)

- Queen decomposes work and assigns roles; workers specialize; "dance" signals report back.
- Distinction: active rebalancing and cost tracking vs. static team lead.

### 2. Colony (stigmergic)

- No central coordinator; pheromone trails (weighted annotations) guide behavior.
- Agents sense environment (diffs, tests, lint) and self-select work; evaporation for decay.
- Distinction: resolution by environmental state, not by declared capability.

### 3. Flock (emergent alignment)

- Local rules: separation, alignment, cohesion. No explicit task decomposition.
- Heartbeat / broadcast of focus; codebase as coordination medium.
- Distinction: parallel with implicit coordination vs. sequential pipelines.

### 4. Pack (tight tactical unit)

- Small fixed roster (Lead, Scout, Implementer, Reviewer); shared context; role rotation.
- Distinction: peer-aware shared context vs. parent-child spawn.

### 5. Swarm proper (massive parallel)

- Many cheap agents; fan-out/fan-in; no inter-agent comms; merge reconciliation at end.
- Distinction: code-unit parallelism with merge intelligence vs. row-based fan-out.

### 6. Ecosystem (multi-species)

- Heterogeneous types; symbiotic triggers (code → test → review); competition/arena selection; homeostasis.
- Distinction: trigger chains and outcome-based selection vs. single agent type.

## Comparative matrix (summary)

| Dimension | Central (Spawn/Teams) | Colony/Flock | Swarm proper | Ecosystem |
|-----------|----------------------|--------------|--------------|-----------|
| Coordinator | Parent/lead | None (stigmergy/local rules) | Decomposer + merger | Reactive triggers |
| Task allocation | Explicit / queue claim | Self-selected by sensing | Pre-assigned 1:1 | Trigger-activated |
| Communication | Poll / queue / DM | Environment mutation / heartbeat | None (merge at end) | Event triggers |
| Conflict handling | Lead/queue | Pheromone / separation rule | Merge reconciler | Competition + selection |

See in-repo or external spreadsheets for full matrix if maintained.
