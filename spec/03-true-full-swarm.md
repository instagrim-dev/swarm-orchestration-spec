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

- **Attraction:** go where pheromones say "work needed" (e.g. needs_review).
- **Separation:** avoid locations already claimed or crowded.
- **Cohesion:** stay near goal-relevant areas (relevance-to-goal from goal statement).
- **Alignment:** match style of neighboring code (optional).

ChooseWork(view) scores candidate locations by weighted sum; return best or probabilistic choice.

## System loop

- N agents run the same loop concurrently.
- One background process: refresh RepoSnapshot periodically; run Evaporate periodically.
- Termination: when env.GoalSatisfied(goal) or env.Quiet(threshold); then signal agents to stop.
- No central allocator; no task queue.
