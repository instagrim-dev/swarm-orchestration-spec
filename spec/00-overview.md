# Overview

**Document version:** 1.0  
**Date:** 2025-03-15

## Scope

This specification describes:

1. **Taxonomy** — A spectrum of orchestration patterns from centralized (spawn, teams, pipelines) to decentralized (stigmergic colony, flock, swarm) and a comparative matrix.
2. **Adaptive meta-orchestrator** — A mechanism to choose and adjust orchestration by parameterizing it (genome) rather than picking discrete patterns; Classifier, Shaper, Monitor, and outer choreography.
3. **True full swarm** — A minimal model of stigmergic coordination: shared environment, local rules, no central task assigner, with pseudo-code.
4. **Human interface** — How a developer interacts with swarm-style systems via intent, environment seeding, observability, and control ("indirect coding").
5. **Signals and vocabulary** — Normative and extensible ontology for pheromone kinds, goal dimensions, and genome fields.
6. **Failure and recovery** — Expected behavior when claims are abandoned, the swarm is stuck, or the swarm stops with partial success.
7. **Conformance** — Required and optional surfaces; when implementations may claim spec compliance; versioning.

The spec is implementation- and stack-agnostic. It does not prescribe APIs, languages, or storage.

## Goals

- Give implementers a single reference for concepts, terminology, and behavior.
- Separate "orchestration regime" (what the system does) from "human UX" (what the human sets and sees).
- Enable interoperability and comparison across projects (e.g. BMO, Anthills, Stigmera) using a common vocabulary.

## Reading order

1. **01-taxonomy-and-patterns** — Understand the pattern space and where swarm/stigmergy sits.
2. **02-adaptive-meta-orchestrator** — How to select and mutate orchestration over time (optional layer above patterns).
3. **03-true-full-swarm** — The minimal stigmergic model and pseudo-code.
4. **04-human-interface** — How humans set goals, seed the environment, and observe/control.
5. **05-signals-and-vocabulary** — Shared terms for pheromones, Classifier dimensions, and genome; extension policy.
6. **06-failure-and-recovery** — Abandoned claims, stuck swarm, partial success; links to Monitor and human interface.
7. **07-conformance** — Required surface, optional surfaces, conformance clause; read after 03, 04, 05, 06.
