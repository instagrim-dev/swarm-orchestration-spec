# Swarm Orchestration Technical Spec

A technical specification for environment-mediated and adaptive multi-agent orchestration in software development tools: taxonomy, meta-orchestrator, full swarm behavior, and human interface.

**Status:** v1.1 — additive alignment with [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate).  
**First published:** 2025-03-15.  
**Last updated:** 2026-05-24.

## Relationship to Agent Coordination Substrate

This spec defines **orchestration patterns** — how multiple agents coordinate topology, task selection, convergence, and human interface. It is deliberately pattern-level and stack-agnostic.

The [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate) defines the **primitives layer** — the concrete signal deposits, zone pressure, mortal claims, and induction rules that realize the abstract environment described here. Implementations may use the substrate as their primitives layer and this spec as their orchestration-pattern guide.

| Layer | Spec | Concern |
|-------|------|---------|
| Primitives | Agent Coordination Substrate | Signals, claims, zones, induction |
| Orchestration patterns | **This spec** | Topology, meta-orchestrator, convergence, human interface |
| Domain profiles | [Idle-Gated Compaction Swarm](https://github.com/instagrim-dev/agent-coordination-substrate) (forthcoming) | Domain-specific application of patterns + primitives |

## Contents

| Document | Description |
|----------|-------------|
| [00-overview](spec/00-overview.md) | Scope, goals, and reading order |
| [01-taxonomy-and-patterns](spec/01-taxonomy-and-patterns.md) | Existing vs. swarm patterns (Hive, Colony, Flock, Pack, Swarm, Ecosystem) and comparative matrix |
| [02-adaptive-meta-orchestrator](spec/02-adaptive-meta-orchestrator.md) | Classifier, Shaper, Monitor; genome as parameterized orchestration; outer choreography |
| [03-environment-mediated-coordination](spec/03-true-full-swarm.md) | Environment-mediated model: shared state, local rules, agent loop, pseudo-code |
| [04-human-interface](spec/04-human-interface.md) | Intent, seeding, observability, and control for "indirect coding" |
| [05-signals-and-vocabulary](spec/05-signals-and-vocabulary.md) | Normative and extensible vocabulary: signal kinds, goal dimensions, genome fields |
| [06-failure-and-recovery](spec/06-failure-and-recovery.md) | Expected behavior for abandoned claims, stuck swarm, and partial success |
| [07-conformance](spec/07-conformance.md) | Required and optional surfaces; conformance clause and versioning |

## Primitives binding

When an implementation uses the Agent Coordination Substrate as its primitives layer:

- **Signal map** → Substrate advisory layer (`SignalStore`: deposit, readout, zone pressure)
- **Claims** → Substrate enforcement layer (`ClaimStore`: acquire, release, override)
- **Evaporation/decay** → Substrate signal mortality (TTL-based expiry)
- **Signal kinds** → Substrate signal envelope `kind` field

See [05-signals-and-vocabulary](spec/05-signals-and-vocabulary.md) for the mapping table.

## Implementation notes

**Implementation notes (non-normative):** [annex-implementation-notes.md](annex-implementation-notes.md) maps the spec to existing implementations including the substrate reference implementation.

**Visualizations (non-normative):** [annex-visualizations.md](annex-visualizations.md) — ASCII, Unicode, Mermaid, Graphviz, D2, PlantUML, Nomnoml, Structurizr DSL, Blockdiag, TikZ, SVG, tables.

## Audience

Implementers, researchers, and product designers working on multi-agent coding assistants or swarm-style coordination. The spec is stack-agnostic; bindings to a specific runtime are out of scope.

## Versioning

Spec versions follow semantic-style versioning: **1.x** releases are additive (new docs or sections, backward-compatible). **2.0** denotes breaking changes (e.g. required surface or vocabulary changes). Implementations claiming conformance should cite the spec version (e.g. 1.1).

## License

MIT. See [LICENSE](LICENSE).
