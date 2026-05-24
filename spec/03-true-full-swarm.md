# Environment-Mediated Coordination

**Document version:** 1.1  
**Date:** 2026-05-24

## Principles

1. **No central coordinator** — No queen, lead, or task assigner.
2. **Environment as sole shared state** — Coordination only via read/write of shared environment (signals, claims, repo snapshot).
3. **Local rules only** — Same rule set for every agent; global behavior emerges.
4. **Decay (mortality)** — Signals weaken over time so the system does not lock onto stale structure.
5. **Self-organized task selection** — Agents choose work by sensing the environment.

## World model (pseudo-code)

```
Environment:
  SignalMap     (zone, kind) → strength, deposited_at, expires_at
  RepoSnapshot  git status, test/lint results (read-only, refreshed periodically)
  Claims        zone → (actor_id, state, expires_at)

Expire(now): prune signals and claims where expires_at < now
Deposit(zone, kind, strength, ttl): add signal, set expires_at = now + ttl
```

### Substrate binding

When using the [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate) as the primitives layer:

| This spec | Substrate primitive |
|-----------|-------------------|
| `SignalMap` | Advisory layer `SignalStore` — `Deposit()`, `Readout()` |
| `Claims` | Enforcement layer `ClaimStore` — `Acquire()`, `Release()`, `Override()` |
| `Expire` | Signal/claim mortality (TTL-based; no explicit evaporation call needed) |
| `Deposit` | `SignalStore.Deposit(Signal{Zone, Kind, StrengthMilli, TTL, Actor, Lineage})` |
| Zone pressure | `SignalStore.Readout(zone)` → `ZonePressure{State, Score, Trend, Signals}` |

Implementations not using the substrate MUST provide equivalent semantics: mortal signals with zone-scoped deposit, strength, and expiry; exclusive claims with actor identity and TTL.

## Agent loop (pseudo-code)

```
loop until terminated:
  view = env.Sense(agentID)
  target = LocalRules.ChooseWork(view, agentID)   // attraction, separation, cohesion, alignment
  if target == nil then backoff; continue
  if !env.Claims.Acquire(target.Zone, agentID, TTL) then continue
  result = DoWork(agentID, target)
  env.Deposit(target.Zone, result.Kind, result.Strength, result.TTL)
  if result.NeedFollowUp then env.Deposit(target.Zone, "needs_review", 500, 3600)
  env.Claims.Release(target.Zone, agentID)
```

## Local rules (same for all agents)

Normative signal kinds (e.g. `needs_review`, `high_priority`, `do_not_change`) are defined in **05-signals-and-vocabulary**.

- **Attraction:** go where signals say "work needed" (e.g. `needs_review` with strength above threshold).
- **Separation:** avoid zones already claimed or with high concurrent activity (zone pressure state `convergent`).
- **Cohesion:** stay near goal-relevant areas (relevance-to-goal from goal statement).
- **Alignment:** match style of neighboring code (optional).

ChooseWork(view) scores candidate zones by weighted sum; return best or probabilistic choice.

## System loop

- N agents run the same loop concurrently.
- One background process: refresh RepoSnapshot periodically. Signal expiry is handled by mortality (TTL); no explicit evaporation sweep is required if the primitives layer handles it.
- Termination: when env.GoalSatisfied(goal) or env.Quiet(threshold), signal agents to stop. See **Termination and convergence** below for definitions.
- No central allocator; no task queue.

## Termination and convergence

When is the swarm done? The system loop uses two predicates over the environment; both are implementation-defined but should be observable so that "done" is testable.

### GoalSatisfied(goal)

The meaning of **GoalSatisfied(goal)** is a predicate over the environment and the goal. Implementations may define it in terms of one or more of:

- **Tests green** — RepoSnapshot (or equivalent) indicates all relevant tests pass.
- **No open work-needed signals** — No signal strength above a threshold θ for kinds that indicate work (e.g. `needs_review`, `high_priority` from **05-signals-and-vocabulary**).
- **Explicit predicate** — A condition supplied with the goal (e.g. "all tests pass and no lint errors in path P").

The spec recommends that implementations support at least one of (test status, signal threshold, or explicit predicate) so that "done" is observable from repo/env.

### Quiet(threshold)

**Quiet(threshold)** indicates that the environment has stabilized and no agent is making progress. The threshold is implementation-defined. Two common definitions:

- **Time-based:** No deposit and no claim change for T seconds (wall-clock or logical ticks). The threshold is T.
- **Strength-based:** All signal strengths below θ (and optionally no active claims). The threshold is θ.

When using the substrate, zone pressure state `quiet` (zero live signals in zone) is a natural implementation of this predicate.

### Livelock and starvation

Implementations should ensure the swarm cannot run indefinitely without making progress toward the goal. The spec recommends at least one safeguard:

- **Timeout** — Maximum run duration; signal termination after T wall-clock time.
- **Max iterations** — Cap per-agent or system-wide work cycles; terminate when exceeded.
- **Human override** — Pause or stop (see **04-human-interface**); the human can declare done or abort.

No specific algorithm is prescribed; the requirement is that implementations consider at least one of these so that livelock or starvation does not leave the swarm running forever. Abandoned claims (agent dies or hangs while holding a claim) are addressed in **06-failure-and-recovery**.
