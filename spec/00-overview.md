# Overview

**Document version:** 1.1  
**Date:** 2026-05-24

## Scope

This specification describes:

1. **Taxonomy** — A spectrum of orchestration patterns from centralized (spawn, teams, pipelines) to decentralized (environment-mediated colony, flock, swarm) and a comparative matrix.
2. **Adaptive meta-orchestrator** — A mechanism to choose and adjust orchestration by parameterizing it (genome) rather than picking discrete patterns; Classifier, Shaper, Monitor, and outer choreography.
3. **Environment-mediated coordination** — A minimal model of indirect coordination: shared environment, local rules, no central task assigner, with pseudo-code.
4. **Human interface** — How a developer interacts with environment-mediated systems via intent, environment seeding, observability, and control ("indirect coding").
5. **Signals and vocabulary** — Normative and extensible ontology for signal kinds, goal dimensions, and genome fields.
6. **Failure and recovery** — Expected behavior when claims are abandoned, the swarm is stuck, or the swarm stops with partial success.
7. **Conformance** — Required and optional surfaces; when implementations may claim spec compliance; versioning.

The spec is implementation- and stack-agnostic. It does not prescribe APIs, languages, or storage.

## Relationship to primitives

This spec defines **patterns** — topology, convergence, task selection, human interface. The underlying **primitives** (signal deposit, zone pressure, mortal claims, induction) are defined by the [Agent Coordination Substrate](https://github.com/instagrim-dev/agent-coordination-substrate). Implementations that use the substrate as their primitives layer and this spec as their orchestration guide get formal schemas, a conformance runner, and a reference implementation for the environment layer described in §03.

## Goals

- Give implementers a single reference for concepts, terminology, and behavior.
- Separate "orchestration regime" (what the system does) from "human UX" (what the human sets and sees).
- Enable interoperability and comparison across projects using a common vocabulary.
- Position clearly relative to the Agent Coordination Substrate: this spec composes patterns over those primitives.

## Non-goals

- Redefine or duplicate the substrate's primitive semantics (signals, claims, zones).
- Prescribe a specific primitives layer; implementations may use the substrate or their own equivalent.

## Reading order

1. **01-taxonomy-and-patterns** — Understand the pattern space and where environment-mediated coordination sits.
2. **02-adaptive-meta-orchestrator** — How to select and mutate orchestration over time (optional layer above patterns).
3. **03-true-full-swarm** — The minimal environment-mediated model and pseudo-code.
4. **04-human-interface** — How humans set goals, seed the environment, and observe/control.
5. **05-signals-and-vocabulary** — Shared terms for signal kinds, Classifier dimensions, and genome; extension policy.
6. **06-failure-and-recovery** — Abandoned claims, stuck swarm, partial success; links to Monitor and human interface.
7. **07-conformance** — Required surface, optional surfaces, conformance clause; read after 03, 04, 05, 06.

## Terminology note

This spec uses the term **"environment-mediated coordination"** as the engineering-native description of the pattern historically called "stigmergy" in biological literature. The intellectual lineage is acknowledged; the vocabulary is chosen for precision in software engineering contexts. See the [Agent Coordination Substrate theory document](https://github.com/instagrim-dev/agent-coordination-substrate/blob/main/docs/theory.md) for the full intellectual lineage.
