# Implementation Notes (non-normative)

This annex is **non-normative**. It is for implementers who want to see how the spec maps to existing systems; it does not define requirements.

## Agent Coordination Substrate (reference implementation)

The [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate) provides a formal primitives layer with:

- **Go reference implementation** (`reference/go/`): In-memory `MemSignalStore` and `MemClaimStore` with zero external dependencies. Implements advisory deposit/readout/zone-pressure and enforcement acquire/release/override with mortality semantics.
- **Conformance runner** (`reference/conformance-runner/`): Validates any `SignalStore` and `ClaimStore` implementation against YAML-defined expectations. Covers advisory scenarios (deposit, mortality, zone pressure, signal kill) and enforcement scenarios (acquire, release, conflict, override, remote TTL).
- **JSON schemas** (`advisory/schemas/`, `enforcement/schemas/`, `induction/schemas/`): Formal schemas for signal envelopes, zone pressure readouts, claims, actor identity, and induction rules.
- **HTTP transport binding** (`transport/HTTP.md`): Defines REST endpoints and SSE streams for wire-level interoperability.

Implementations of this swarm orchestration spec that use the substrate get formal primitive validation "for free" by running the conformance runner against their environment layer.

## BMO

- **Choreography** — BMO's choreography engine (state machine, directives, transitions) serves as the **outer state machine** for the adaptive meta-orchestrator (classify → shape → execute → reshape → converge). The genome drives the Shaper; the Monitor mutates the genome and triggers transitions.

- **Signal Fabric** — BMO's `internal/signalfabric` implements the substrate advisory layer: mortal signals with zone-scoped deposit, strength, kind, TTL, and zone pressure readout. This directly realizes the SignalMap from §03.

- **Workspace Claims** — BMO's `internal/workspaceclaim` implements the substrate enforcement layer: exclusive hard claims with actor identity, TTL, and operator override. This directly realizes the Claims from §03.

- **Adaptive orchestration** — BMO's adaptive context and orchestration genome (`internal/orchestrate/adaptive/`) maps to the Classifier/Shaper/Monitor from §02. The genome parameterizes topology, conflict strategy, and isolation.

- **Worktrees** — BMO's worktree isolation maps to the `isolation` genome field (worktree vs. shared). Each agent or team member can get an isolated worktree; claims scope to worktree/branch or path zones.

## Anthills / Stigmera

**Anthills** — Has a shared signal board and environment-mediated coordination (sense, act, deposit). It aligns with the spec's environment and agent loop. What the spec adds: **vocabulary** (§05) for signal kinds and genome fields, **termination** (§03) definitions (GoalSatisfied, Quiet, livelock), **human interface** (§04) intent layer and control points, **failure/recovery** (§06) and **conformance** (§07) for claims and partial success.

**Stigmera** — Event-driven, trace → trigger → next agent; aligns with environment-mediated coordination. The spec adds: explicit **Environment** model (SignalMap, Claims, RepoSnapshot), **termination** and **human interface** (goal/scope/constraints, observability, control), and **conformance** so Stigmera could document alignment or gaps.
