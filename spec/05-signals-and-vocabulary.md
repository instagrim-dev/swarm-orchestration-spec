# Signals and Vocabulary

**Document version:** 1.1  
**Date:** 2026-05-24

## Purpose

A shared vocabulary enables interoperability between implementations, consistent terminology in documentation and tooling, and safe extension without name collisions. This document defines normative terms for signal kinds, goal dimensions (Classifier), and genome fields, plus a minimal extension policy so implementations can add terms without fragmenting the spec.

## Signal kinds

Agents and the environment use **kinds** to label deposits in the signal map (see [03-true-full-swarm](03-true-full-swarm.md)). Each kind has a one-line semantics for how agents should interpret strength at a zone.

### Normative kinds

Implementations that claim alignment with this spec should support at least these kinds with the following semantics:

| Kind | Semantics |
|------|-----------|
| `needs_review` | Work at this zone should attract reviewer-like behavior (e.g. after a change or failed check). |
| `recent_activity` | Zone was recently touched; agents may use this for separation (avoid crowding) or recency weighting. |
| `high_priority` | Human or system marked this zone as priority; strong attraction for agents seeking work. |
| `fragile` | Area is sensitive or error-prone; attract careful or review behavior rather than heavy mutation. |
| `do_not_change` | Exclusion; agents should not select this zone for work. |

### Substrate binding

When using the [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate) advisory layer, these kinds map directly to the `kind` field in the substrate's signal envelope schema:

```json
{
  "zone": "internal/auth/",
  "kind": "fragile",
  "actor": "monitor-agent",
  "lineage": "session-001",
  "strength_milli": 800,
  "ttl_seconds": 7200
}
```

The substrate does not define normative kinds — it provides the envelope. This spec defines the **application-level vocabulary** that populates that envelope.

### Extensible kinds

Implementations may define additional signal kinds. To avoid collisions:

- Use a prefix or namespace (e.g. `x-` for experimental, or an implementation-specific prefix).
- Document custom kinds when describing spec alignment or interoperability.

Normative kinds must not be redefined with different semantics.

### Vocabulary mapping (v1.0 → v1.1)

For continuity with v1.0 of this spec, the following terminology mapping applies:

| v1.0 term | v1.1 term | Rationale |
|-----------|-----------|-----------|
| Pheromone | Signal | Engineering-native; matches substrate vocabulary |
| Pheromone map | Signal map | Consistent with signal deposit semantics |
| Pheromone kind | Signal kind | Same |
| Location | Zone | Matches substrate zone-scoped addressing |
| Strength (float) | Strength (milli-integer) | Substrate uses `strength_milli` (integer, 1000 = full) |
| Evaporation/decay | Mortality/TTL | Substrate uses time-to-live expiry, not decay rate |

Both terminologies remain understood for backward compatibility; v1.1 normative text uses the right column.

## Goal dimensions (Classifier)

The Classifier (see [02-adaptive-meta-orchestrator](02-adaptive-meta-orchestrator.md)) may use the following dimensions to produce an OrchestrationGenome. Each is a one-sentence definition; implementations may derive them from heuristics, repo analysis, or an LLM.

| Dimension | Definition |
|-----------|------------|
| **scale** | Number of files, modules, or subsystems likely affected by the goal. |
| **interdependence** | Degree to which work items depend on each other (e.g. shared types, call graphs). |
| **uncertainty** | How ill-defined the goal or solution is (exploratory vs. well-specified). |
| **homogeneity** | Whether work is similar across units (e.g. mechanical refactor) or heterogeneous. |
| **urgency** | Time or priority pressure (e.g. hotfix vs. long-running improvement). |
| **risk** | Impact of mistakes (e.g. public API, security-sensitive paths). |

Implementations may add dimensions; the same extension policy as genome fields applies (namespaced or prefixed, documented).

## Genome fields

The genome is the parameterized representation of orchestration (see [02-adaptive-meta-orchestrator](02-adaptive-meta-orchestrator.md)). The following minimal set is normative for spec alignment.

### Minimal set

| Field | Allowed values | Meaning |
|-------|----------------|---------|
| `topology` | `single` \| `star` \| `fan_out` | Shape of agent layout: one agent, lead plus members, or parallel fan-out. |
| `conflict_strategy` | `first_claim` \| `compete` \| `merge` | How overlapping work is resolved: first-come-wins, competitive selection (e.g. arena), or merge reconciliation. |
| `isolation` | `shared` \| `worktree` | Whether agents share one workspace or get isolated worktrees/branches. |
| `coordinator_style` | `none` \| `central` | No central coordinator (e.g. environment-mediated) vs. an explicit lead or decomposer. |

### Conflict strategy and claims

The `conflict_strategy` genome field determines how the enforcement layer (claims) is used:

| Strategy | Claim behavior |
|----------|---------------|
| `first_claim` | Hard exclusive claim; second acquire attempt is rejected (`ConflictError`). |
| `compete` | Soft claims or arena selection; multiple agents may work, best result wins. |
| `merge` | No exclusive claims; agents work in parallel and a reconciler merges results. |

When using the substrate's enforcement layer, `first_claim` maps to hard claims, `compete` maps to soft claims, and `merge` may bypass claims entirely.

### Extension policy

Implementations may add genome fields (e.g. `cost_budget`, `max_agents`). To avoid collisions:

- Use namespaced or prefixed keys (e.g. `x-max_agents`, or implementation-specific prefix).
- Document extensions when describing spec compliance or interoperability.

Normative field names must not be redefined with different allowed values or semantics.
