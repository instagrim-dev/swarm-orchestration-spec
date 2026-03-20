# Signals and Vocabulary

**Document version:** 1.0  
**Date:** 2025-03-15

## Purpose

A shared vocabulary enables interoperability between implementations, consistent terminology in documentation and tooling, and safe extension without name collisions. This document defines normative terms for pheromone kinds, goal dimensions (Classifier), and genome fields, plus a minimal extension policy so implementations can add terms without fragmenting the spec.

## Pheromone kinds

Agents and the environment use **kinds** to label deposits in the pheromone map (see [03-true-full-swarm](03-true-full-swarm.md)). Each kind has a one-line semantics for how agents should interpret strength at a location.

### Normative kinds

Implementations that claim alignment with this spec should support at least these kinds with the following semantics:

| Kind | Semantics |
|------|-----------|
| `needs_review` | Work at this location should attract reviewer-like behavior (e.g. after a change or failed check). |
| `recent_activity` | Location was recently touched; agents may use this for separation (avoid crowding) or recency weighting. |
| `high_priority` | Human or system marked this location as priority; strong attraction for agents seeking work. |
| `fragile` | Area is sensitive or error-prone; attract careful or review behavior rather than heavy mutation. |
| `do_not_change` | Exclusion; agents should not select this location for work. |

### Extensible kinds

Implementations may define additional pheromone kinds. To avoid collisions:

- Use a prefix or namespace (e.g. `x-` for experimental, or an implementation-specific prefix such as `bmo-`, `openclaw-`).
- Document custom kinds when describing spec alignment or interoperability.

Normative kinds must not be redefined with different semantics.

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
| `coordinator_style` | `none` \| `central` | No central coordinator (e.g. stigmergy) vs. an explicit lead or decomposer. |

### Extension policy

Implementations may add genome fields (e.g. `cost_budget`, `max_agents`). To avoid collisions:

- Use namespaced or prefixed keys (e.g. `x-max_agents`, or implementation-specific prefix).
- Document extensions when describing spec compliance or interoperability.

Normative field names must not be redefined with different allowed values or semantics.
