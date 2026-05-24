# Human Interface ("Indirect Coding")

**Document version:** 1.1  
**Date:** 2026-05-24

## Design goal

The human sets **conditions and intent**; the swarm responds to the **environment**. The interface should make this clear and controllable.

## 1. Intent layer

- **Single goal statement** — One goal per run (natural language or semi-structured). Feeds relevance-to-goal in local rules.
- **Scope/boundaries** — Paths or areas in/out of scope. Out-of-scope = zero relevance or excluded from sensing.
- **Hard constraints** — Invariants (e.g. no new deps, no public API change). Enforced as veto in rules or post-check.

No task list; no "agent 1 do X, agent 2 do Y."

## 2. Seeding the environment

- **Explicit markers** — e.g. "high priority" paths, "fragile" areas, "do not change." Swarm reads these as strong attraction or exclusion.
- **Convention** — e.g. comments or a small config file (.bmo/swarm.yaml, priority_paths, forbidden_paths).
- **Nudge** — One-shot "deposit strong signal here" so the human can say "look here" without assigning a task.

## 3. Observability

- **Environment view** — Signal map (strength by zone/kind), current claims, repo snapshot summary (failures, lint).
- **Per-decision rationale** — "Agent A chose Z because: high needs_review, no other claim, high relevance." Explain in terms of sensed env + rule weights.
- **Convergence** — Clear "swarm thinks done" (e.g. quiet threshold, goal predicate) and what that predicate is.

## 4. Control points

- **Pause / resume** — Freeze swarm; inspect env and code; resume.
- **Override signals** — "Ignore this area" or "Focus only here" via config or one-shot nudge.
- **Constraint change** — Update goal/scope/constraints; re-seed or restart.
- **Accept / reject outcome** — Review diff or summary; accept or reject. Reject → re-run with different intent or add nudge. When the swarm stops with partial work done, see **06-failure-and-recovery** for representing outcome (env snapshot + goal status) so the human can accept, reject, or re-seed.

## Mental model

- "I set the field; the swarm moves in it."
- "I watch the field, not the ants."
- "I correct the field when it goes wrong."
