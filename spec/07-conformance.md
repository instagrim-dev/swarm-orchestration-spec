# Conformance

**Document version:** 1.1  
**Date:** 2026-05-24

## Purpose

This document defines what an implementation must provide to claim conformance with the Swarm Orchestration Spec and what is optional. It enables interoperability claims and comparison across implementations.

## Required surface (minimal)

An implementation claiming conformance must provide the following.

### Environment

(See [03-true-full-swarm](03-true-full-swarm.md).) At least:

- **Signal map** (or equivalent): mapping from (zone, kind) to strength and expiry. Support **Deposit** (add/update) and **mortality** (TTL-based expiry or equivalent decay).
- **Claims**: mapping from zone to (actor identifier, state, expiry) so that work can be claimed and released. Support **Acquire** (with TTL) and **Release**.
- **RepoSnapshot** (or equivalent): read-only view of repo state (e.g. git status, test/lint results) that can be refreshed periodically.

### Substrate conformance (optional but recommended)

Implementations that use the [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate) as their primitives layer MAY additionally claim substrate conformance by passing the substrate's conformance runner against their `SignalStore` and `ClaimStore` implementations. This is **not** required for swarm orchestration spec conformance, but provides formal validation of the environment layer.

### Agent loop

Agents must exhibit the sequence: **Sense** (read environment view), **ChooseWork** (local rules over the view), **Acquire** (claim with TTL), **DoWork**, **Deposit** (update signals), **Release** (release claim). The loop structure may be implicit (e.g. a single agent that could scale to N), but this sequence must be present.

### Intent layer

(See [04-human-interface](04-human-interface.md).) A way for the human to supply at least:

- **Goal** — A single statement (or equivalent) per run.
- **Scope/boundaries** — What is in or out of scope (e.g. paths or areas).
- **Constraints** — Invariants (e.g. no new deps, no public API change).

No specific UI or format is required; the capability must exist.

Implementations that do not provide the full required surface above may still implement parts of the spec but must not claim "Swarm Orchestration Spec 1.x compliant."

## Optional surfaces

The following are not required for conformance. Implementations may implement any subset and should document what they support and what they omit.

- **Classifier, Shaper, Monitor** — Adaptive meta-orchestrator ([02-adaptive-meta-orchestrator](02-adaptive-meta-orchestrator.md)).
- **Human-facing observability** — Environment view, per-decision rationale, convergence status ([04-human-interface](04-human-interface.md)).
- **Seeding** — Explicit markers, nudge, config-based priority/forbidden zones.
- **Control points** — Pause/resume, override signals, constraint change, accept/reject outcome.
- **Termination** — GoalSatisfied, Quiet, livelock safeguards ([03-true-full-swarm](03-true-full-swarm.md) Termination and convergence). If omitted, document how a run stops.
- **Failure and recovery** — Abandoned-claim expiry, stuck detection, partial-success representation, operator override ([06-failure-and-recovery](06-failure-and-recovery.md)).
- **Normative signal kinds / genome fields** ([05-signals-and-vocabulary](05-signals-and-vocabulary.md)); extensions are allowed per §05.
- **Substrate conformance** — Passing the Agent Coordination Substrate conformance runner for formal primitive validation.

## Conformance clause

Implementations may claim **Swarm Orchestration Spec 1.x compliant** if they implement the required surface above and document any extensions or restrictions (e.g. custom signal kinds, genome fields, or omitted optional surfaces). Claims should cite the spec version (e.g. 1.1).

## Version history

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-03-15 | Initial specification. |
| 1.1 | 2026-05-24 | Vocabulary alignment with Agent Coordination Substrate (signal/zone/mortality); substrate binding tables; operator override; conformance runner reference. Backward-compatible; no required surface changes. |
