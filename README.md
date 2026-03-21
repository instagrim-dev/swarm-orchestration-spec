# Swarm Orchestration Technical Spec

A technical specification for environment-mediated and adaptive multi-agent orchestration in software development tools: taxonomy, meta-orchestrator, full swarm behavior, and human interface.

**Status:** Spec only — no reference implementation.  
**First published:** 2025-03-15.

## Contents

| Document | Description |
|----------|-------------|
| [00-overview](spec/00-overview.md) | Scope, goals, and reading order |
| [01-taxonomy-and-patterns](spec/01-taxonomy-and-patterns.md) | Existing vs. swarm patterns (Hive, Colony, Flock, Pack, Swarm, Ecosystem) and comparative matrix |
| [02-adaptive-meta-orchestrator](spec/02-adaptive-meta-orchestrator.md) | Classifier, Shaper, Monitor; genome as parameterized orchestration; outer choreography |
| [03-true-full-swarm](spec/03-true-full-swarm.md) | Stigmergic model: environment, local rules, agent loop, pseudo-code |
| [04-human-interface](spec/04-human-interface.md) | Intent, seeding, observability, and control for "indirect coding" |
| [05-signals-and-vocabulary](spec/05-signals-and-vocabulary.md) | Normative and extensible vocabulary: pheromone kinds, goal dimensions, genome fields |
| [06-failure-and-recovery](spec/06-failure-and-recovery.md) | Expected behavior for abandoned claims, stuck swarm, and partial success |
| [07-conformance](spec/07-conformance.md) | Required and optional surfaces; conformance clause and versioning |

## Implementation notes

**Implementation notes (non-normative):** [annex-implementation-notes.md](annex-implementation-notes.md) maps the spec to BMO, Anthills, and Stigmera.

**Visualizations (non-normative):** [annex-visualizations.md](annex-visualizations.md) — ASCII, Unicode, Mermaid, Graphviz, D2, PlantUML, Nomnoml, Structurizr DSL, Blockdiag, TikZ, SVG, tables.

## Audience

Implementers, researchers, and product designers working on multi-agent coding assistants or swarm-style coordination. The spec is stack-agnostic; bindings to a specific runtime (e.g. BMO) are out of scope.

## Versioning

Spec versions follow semantic-style versioning: **1.x** releases are additive (new docs or sections, backward-compatible). **2.0** denotes breaking changes (e.g. required surface or vocabulary changes). Implementations claiming conformance should cite the spec version (e.g. 1.0).

## License

MIT. See [LICENSE](LICENSE).
