# Failure and Recovery

**Document version:** 1.0  
**Date:** 2025-03-15

## Purpose

When agents or the swarm fail or stop early, implementations need consistent expected behavior so the system can recover and humans can inspect or re-seed. This document defines requirements for abandoned claims, stuck swarm, and partial success.

## Abandoned claims

An agent may die or hang while holding a claim (see [03-true-full-swarm](03-true-full-swarm.md): world model `Claims`, agent loop `TryClaim(..., TTL)`).

**Requirement:** Claims should be **released or expired** (e.g. TTL or heartbeat) so other agents can take over the location. The spec does not prescribe a normative protocol (e.g. no mandated lease renewal); implementations must ensure abandoned claims do not block work indefinitely.

## Stuck swarm

The swarm may make no progress for a defined period (e.g. no deposits, no goal advancement). Expected responses:

- **Monitor** (if present): Reshape the genome to inject a coordinator or change strategy (see [02-adaptive-meta-orchestrator](02-adaptive-meta-orchestrator.md)).
- **Human control:** Pause, nudge (seed pheromones), or change goal/scope/constraints (see [04-human-interface](04-human-interface.md) control points).

Implementations should detect stuckness (e.g. via Quiet or progress metrics from [03-true-full-swarm](03-true-full-swarm.md)) and either trigger Monitor logic or surface the state to the human for override.

## Partial success

The swarm may stop with some work done and some not (e.g. timeout, human stop, or GoalSatisfied only partially met). To support accept/reject or re-seed:

- Represent the outcome as **env snapshot + goal status**: e.g. current RepoSnapshot (or diff), pheromone map (or summary), and whether GoalSatisfied(goal) holds or which predicate failed.
- The human can then accept (keep state), reject (revert or discard), or re-seed (change goal/scope and restart). See [04-human-interface](04-human-interface.md) "Accept / reject outcome."

No prescribed format is given; the requirement is that implementations provide enough information (snapshot + goal status) for the human to decide.
