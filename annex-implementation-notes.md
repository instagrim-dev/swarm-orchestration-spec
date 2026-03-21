# Implementation Notes (non-normative)

This annex is **non-normative**. It is for implementers who want to see how the spec maps to existing systems; it does not define requirements.

## BMO

- **Choreography** — BMO's choreography engine (state machine, directives, transitions) could serve as the **outer state machine** for an adaptive meta-orchestrator (classify → shape → execute → reshape → converge). The genome would drive the Shaper; the Monitor would mutate the genome and trigger transitions.

- **Worktrees** — BMO's worktree isolation maps to the spec's **isolation** genome field (worktree vs. shared). Each agent or team member can get an isolated worktree; the spec's "Claims" and "location" could align with worktree/branch or path.

- **Adaptive context** — BMO's adaptive context (pheromone-like traits, evaporation, selection by strength) is conceptually **pheromone-like**: chunks/locations have strength and decay. Mapping to the spec's PheromoneMap and normative kinds (e.g. needs_review, high_priority) would require exposing or extending that layer as a general environment for swarm-style coordination.

## Anthills / Stigmera

**Anthills** — Already has a shared pheromone board and stigmergic coordination (sense, act, deposit). It aligns with the spec's environment and agent loop. What the spec adds: **vocabulary** (05) for pheromone kinds and genome fields, **termination** (03) definitions (GoalSatisfied, Quiet, livelock), **human interface** (04) intent layer and control points, **failure/recovery** (06) and **conformance** (07) for claims and partial success.

**Stigmera** — Event-driven, trace → trigger → next agent; aligns with environment-mediated coordination. The spec adds: explicit **Environment** model (PheromoneMap, Claims, RepoSnapshot), **termination** and **human interface** (goal/scope/constraints, observability, control), and **conformance** so Stigmera could document alignment or gaps.
