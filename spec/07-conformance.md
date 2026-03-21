# Conformance

**Document version:** 1.0  
**Date:** 2025-03-15

## Purpose

This document defines what an implementation must provide to claim conformance with the Swarm Orchestration Spec and what is optional. It enables interoperability claims and comparison across implementations.

## Required surface (minimal)

An implementation claiming conformance must provide the following.

### Environment

(See [03-true-full-swarm](03-true-full-swarm.md).) At least:

- **PheromoneMap** (or equivalent): mapping from (location, kind) to strength and timestamp (or last_touched). Support **Deposit** (add/update) and **Evaporate** (decay over time).
- **Claims**: mapping from location to (agent identifier, deadline or TTL) so that work can be claimed and released. Support **TryClaim** (with TTL) and **Release**.
- **RepoSnapshot** (or equivalent): read-only view of repo state (e.g. git status, test/lint results) that can be refreshed periodically.

### Agent loop

Agents must exhibit the sequence: **Sense** (read environment view), **ChooseWork** (local rules over the view), **Claim** (TryClaim with TTL), **DoWork**, **Deposit** (update pheromones), **Release** (release claim). The loop structure may be implicit (e.g. a single agent that could scale to N), but this sequence must be present.

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
- **Seeding** — Explicit markers, nudge, config-based priority/forbidden paths.
- **Control points** — Pause/resume, override pheromones, constraint change, accept/reject outcome.
- **Termination** — GoalSatisfied, Quiet, livelock safeguards ([03-true-full-swarm](03-true-full-swarm.md) Termination and convergence). If omitted, document how a run stops.
- **Failure and recovery** — Abandoned-claim expiry, stuck detection, partial-success representation ([06-failure-and-recovery](06-failure-and-recovery.md)).
- **Normative pheromone kinds / genome fields** ([05-signals-and-vocabulary](05-signals-and-vocabulary.md)); extensions are allowed per 05.

## Conformance clause

Implementations may claim **Swarm Orchestration Spec 1.x compliant** if they implement the required surface above and document any extensions or restrictions (e.g. custom pheromone kinds, genome fields, or omitted optional surfaces). Claims should cite the spec version (e.g. 1.0).
