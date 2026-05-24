# Failure and Recovery

**Document version:** 1.1  
**Date:** 2026-05-24

## Purpose

When agents or the swarm fail or stop early, implementations need consistent expected behavior so the system can recover and humans can inspect or re-seed. This document defines requirements for abandoned claims, stuck swarm, and partial success.

## Abandoned claims

An agent may die or hang while holding a claim (see [03-true-full-swarm](03-true-full-swarm.md): world model `Claims`, agent loop `Acquire(..., TTL)`).

**Requirement:** Claims MUST be **mortal** — they expire automatically when their TTL elapses. This ensures abandoned claims do not block work indefinitely without requiring heartbeat or lease renewal protocols.

When using the [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate) enforcement layer, this property is guaranteed by the claim mortality invariant: all claims have a finite `expires_at_unix` and the `ClaimStore` reaps them on expiry. Remote claims (from agents on other hosts) MUST have `ttl_seconds > 0` at acquire time.

Implementations not using the substrate MUST provide equivalent mortality semantics — either TTL-based expiry or a heartbeat/lease protocol with documented timeout behavior.

## Stuck swarm

The swarm may make no progress for a defined period (e.g. no deposits, no goal advancement). Expected responses:

- **Monitor** (if present): Reshape the genome to inject a coordinator or change strategy (see [02-adaptive-meta-orchestrator](02-adaptive-meta-orchestrator.md)).
- **Human control:** Pause, nudge (deposit signals), or change goal/scope/constraints (see [04-human-interface](04-human-interface.md) control points).
- **Signal-based detection:** When using zone pressure from the substrate advisory layer, a zone in state `quiet` (zero live signals) with no active claims indicates convergence or stuckness depending on goal satisfaction.

Implementations should detect stuckness (e.g. via Quiet threshold, zone pressure, or progress metrics from [03-true-full-swarm](03-true-full-swarm.md)) and either trigger Monitor logic or surface the state to the human for override.

## Partial success

The swarm may stop with some work done and some not (e.g. timeout, human stop, or GoalSatisfied only partially met). To support accept/reject or re-seed:

- Represent the outcome as **environment snapshot + goal status**: e.g. current RepoSnapshot (or diff), signal map state (or zone pressure summary), active claims, and whether GoalSatisfied(goal) holds or which predicate failed.
- The human can then accept (keep state), reject (revert or discard), or re-seed (change goal/scope and restart). See [04-human-interface](04-human-interface.md) "Accept / reject outcome."

When using the substrate, the zone pressure readout (`Readout(zone)` → `ZonePressure{State, Score, Trend, Signals}`) provides a structured snapshot of environment state suitable for outcome representation.

No prescribed format is given; the requirement is that implementations provide enough information (snapshot + goal status) for the human to decide.

## Operator override of claims

When a swarm is stuck due to a held claim (agent unresponsive but claim not yet expired), operators SHOULD have the ability to override the claim. When using the substrate enforcement layer, this is the `Override(zone, operator_id, reason)` operation — all enforcement primitives are overridable by an authorized operator. The spec does not mandate a specific override UI; the capability must exist.
