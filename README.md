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

## Permaweb (Arweave)

CI uploads a single UTF-8 Markdown bundle (`spec-permaweb-bundle.md`) to **arweave.net** via [arweave-js](https://github.com/ArweaveTeam/arweave-js) and [`scripts/permaweb-upload.mjs`](scripts/permaweb-upload.mjs) (see `.github/workflows/arweave-publish.yml`).

**Setup**

1. Create a repository secret **`ARWEAVE_WALLET_KEY`** — paste the **entire JSON** contents of your Arweave wallet keyfile (JWK). Never commit this file.
2. The workflow checks that the JWK matches `ARWEAVE_WALLET_ADDRESS` in `.github/workflows/arweave-publish.yml` (currently `-KIUv_cHtZfbHywqFQ-6Rf7CYzl_99YqNj1nde4uFxQ`). If you use a different key in the secret, update that env value to the matching address or replace the secret with the JWK for the address you want.
3. The publishing wallet needs enough **AR** to pay the transaction fee.

**Triggers**

- Manual: Actions → *Publish spec to Arweave* → Run workflow.
- Pushing a tag matching `v*` also runs the workflow.

The job log prints **`Arweave txId:`** after a successful upload. If a run fails immediately, check the secret name, JWK format, address mismatch, or wallet balance (the script logs **winston** balance). The upload script strips a leading **UTF-8 BOM** and optional outer quotes from the JWK secret, tries **`ar-io.net`** then **`arweave.net`**, and retries **PSS salt** lengths **32** and the RSA-max salt for your key—**`400 Transaction verification failed`** can still appear if the wallet has no AR for fees or the network rejects a specific gateway; see the workflow log lines **`Posted via …`** / **`Attempt failed:`**.

## License

MIT. See [LICENSE](LICENSE).
