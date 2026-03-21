# True Full Swarm (Stigmergic Model)

**Document version:** 1.0  
**Date:** 2025-03-15

## Principles

1. **No central coordinator** — No queen, lead, or task assigner.
2. **Environment as sole shared state** — Coordination only via read/write of shared environment (pheromones, claims, repo snapshot).
3. **Local rules only** — Same rule set for every agent; global behavior emerges.
4. **Decay/evaporation** — Traces weaken over time so the system doesn't lock onto stale structure.
5. **Self-organized task selection** — Agents choose work by sensing the environment.

## World model (pseudo-code)

```
Environment:
  PheromoneMap  (location, kind) → strength, last_touched
  RepoSnapshot  git status, test/lint results (read-only, refreshed periodically)
  Claims        location → (agent_id, deadline)

Evaporate(now, decayRate): strength *= decayRate^delta; prune below epsilon
Deposit(location, kind, amount): add amount, update last_touched
```

## Agent loop (pseudo-code)

```
loop until terminated:
  view = env.Sense(agentID)
  target = LocalRules.ChooseWork(view, agentID)   // attraction, separation, cohesion, alignment
  if target == nil then backoff; continue
  if !env.Claims.TryClaim(target.Location, agentID, TTL) then continue
  result = DoWork(agentID, target)
  env.Deposit(target.Location, result.Kind, result.Strength)
  if result.NeedFollowUp then env.Deposit(NeedFollowUp, "needs_review", 0.5)
  env.Claims.Release(target.Location, agentID)
```

## Local rules (same for all agents)

Normative pheromone kinds (e.g. needs_review, high_priority, do_not_change) are defined in **05-signals-and-vocabulary**.

- **Attraction:** go where pheromones say "work needed" (e.g. needs_review).
- **Separation:** avoid locations already claimed or crowded.
- **Cohesion:** stay near goal-relevant areas (relevance-to-goal from goal statement).
- **Alignment:** match style of neighboring code (optional).

ChooseWork(view) scores candidate locations by weighted sum; return best or probabilistic choice.

## System loop

- N agents run the same loop concurrently.
- One background process: refresh RepoSnapshot periodically; run Evaporate periodically.
- Termination: when env.GoalSatisfied(goal) or env.Quiet(threshold), signal agents to stop. See **Termination and convergence** below for definitions.
- No central allocator; no task queue.

## Termination and convergence

When is the swarm done? The system loop uses two predicates over the environment; both are implementation-defined but should be observable so that "done" is testable.

### GoalSatisfied(goal)

The meaning of **GoalSatisfied(goal)** is a predicate over the environment and the goal. Implementations may define it in terms of one or more of:

- **Tests green** — RepoSnapshot (or equivalent) indicates all relevant tests pass.
- **No open work-needed signals** — No pheromone strength above a threshold θ for kinds that indicate work (e.g. `needs_review`, `high_priority` from **05-signals-and-vocabulary**).
- **Explicit predicate** — A condition supplied with the goal (e.g. "all tests pass and no lint errors in path P").

The spec recommends that implementations support at least one of (test status, pheromone threshold, or explicit predicate) so that "done" is observable from repo/env.

### Quiet(threshold)

**Quiet(threshold)** indicates that the environment has stabilized and no agent is making progress. The threshold is implementation-defined. Two common definitions:

- **Time-based:** No deposit and no claim change for T seconds (wall-clock or logical ticks). The threshold is T.
- **Strength-based:** All pheromone strengths below θ (and optionally no active claims). The threshold is θ.

The spec recommends that Quiet be observable from the environment (e.g. no writes for a duration, or max strength below θ) so that a background process or human can detect convergence.

### Livelock and starvation

Implementations should ensure the swarm cannot run indefinitely without making progress toward the goal. The spec recommends at least one safeguard:

- **Timeout** — Maximum run duration; signal termination after T wall-clock time.
- **Max iterations** — Cap per-agent or system-wide work cycles; terminate when exceeded.
- **Human override** — Pause or stop (see **04-human-interface**); the human can declare done or abort.

No specific algorithm is prescribed; the requirement is that implementations consider at least one of these so that livelock or starvation does not leave the swarm running forever. Abandoned claims (agent dies or hangs while holding a claim) are addressed in **06-failure-and-recovery**.
