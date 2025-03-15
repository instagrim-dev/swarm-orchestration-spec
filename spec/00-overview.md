# Overview

**Document version:** 1.0  
**Date:** 2025-03-15

## Scope

This specification describes:

1. **Taxonomy** — A spectrum of orchestration patterns from centralized (spawn, teams, pipelines) to decentralized (stigmergic colony, flock, swarm) and a comparative matrix.
2. **Adaptive meta-orchestrator** — A mechanism to choose and adjust orchestration by parameterizing it (genome) rather than picking discrete patterns; Classifier, Shaper, Monitor, and outer choreography.
3. **True full swarm** — A minimal model of stigmergic coordination: shared environment, local rules, no central task assigner, with pseudo-code.
4. **Human interface** — How a developer interacts with swarm-style systems via intent, environment seeding, observability, and control ("indirect coding").

The spec is implementation- and stack-agnostic. It does not prescribe APIs, languages, or storage.

## Goals

- Give implementers a single reference for concepts, terminology, and behavior.
- Separate "orchestration regime" (what the system does) from "human UX" (what the human sets and sees).
- Enable interoperability and comparison across projects (e.g. BMO, OpenClaw, Anthills, Stigmera) using a common vocabulary.

## Reading order

1. **01-taxonomy-and-patterns** — Understand the pattern space and where swarm/stigmergy sits.
2. **02-adaptive-meta-orchestrator** — How to select and mutate orchestration over time (optional layer above patterns).
3. **03-true-full-swarm** — The minimal stigmergic model and pseudo-code.
4. **04-human-interface** — How humans set goals, seed the environment, and observe/control.
