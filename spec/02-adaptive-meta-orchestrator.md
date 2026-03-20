# Adaptive Meta-Orchestrator

**Document version:** 1.0  
**Date:** 2025-03-15

## Purpose

Select and adapt orchestration over time without hard-switching "patterns." Orchestration is **parameterized** (a genome); named patterns (Hive, Colony, etc.) are clusters in that parameter space.

## Components

### Classifier

- **Input:** Goal (and optionally repo/context).
- **Output:** OrchestrationGenome — a struct of continuous or discrete parameters (e.g. topology, conflict_strategy, isolation, coordinator_style).
- **Means:** Heuristics (repomap, ripple, scope) and/or one-shot LLM call. Goal dimensions: scale, interdependence, uncertainty, homogeneity, urgency, risk.
- **Contract:** Invoked at session start and optionally on explicit re-classify; not necessarily every turn.

### Shaper

- **Input:** OrchestrationGenome.
- **Output:** Live orchestration (teams, worktrees, arena, choreography preset, etc.).
- **Means:** Dispatch table from genome fields to existing primitives: e.g. topology=star → create_team; conflict_strategy=compete → arena; isolation=worktree → worktree manager. No new runtime abstraction; compile genome to calls.

### Monitor

- **Input:** Signals from running system (task status, token spend, merge results, hook exit codes).
- **Output:** Mutations to the genome (e.g. coordinator_style: none → central when stalls detected).
- **Means:** OODA loop; thresholds and rules; mutate individual genes rather than switch whole pattern.
- **Contract:** When dysfunction thresholds are crossed, re-shape from mutated genome.

## Outer choreography

The meta-orchestrator is itself a choreography. States: classify → shape → execute → reshape → converge → done. Transitions driven by hooks or tool calls. Inner choreographies still govern per-session behavior. The genome is the serializable bridge between intent and runtime.

## Genome (minimal example)

- `topology`: single | star | fan_out
- `conflict_strategy`: first_claim | compete | merge
- `isolation`: shared | worktree
- `coordinator_style`: none | central

Implementations may extend with more dimensions. Canonical field names and extension policy are in **05-signals-and-vocabulary**.
