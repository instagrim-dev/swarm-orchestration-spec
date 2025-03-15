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

## Audience

Implementers, researchers, and product designers working on multi-agent coding assistants or swarm-style coordination. The spec is stack-agnostic; bindings to a specific runtime (e.g. BMO, OpenClaw) are out of scope.

## License

MIT. See [LICENSE](LICENSE).
