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
3. **Fund the wallet with AR** (on-chain balance in **winston**). The upload script compares balance to the network **price** for your bundle and exits with a clear error if funds are short. A **0** balance often causes gateways to return **`400 Transaction verification failed`**, which is easy to misread—fund the address first, then re-run the workflow.

**Triggers**

- Manual: Actions → *Publish spec to Arweave* → Run workflow.
- Pushing a tag matching `v*` also runs the workflow.

The job log prints **`Arweave txId:`** after a successful upload. If a run fails immediately, check the secret name, JWK format, address mismatch, or wallet balance (the script logs **winston** balance). The upload script strips a leading **UTF-8 BOM** and optional outer quotes from the JWK secret, tries **`arweave.net`** then **`www.arweave.net`** (optional **`ARWEAVE_HOST`** first if you set one that resolves on your runner), and retries **PSS salt** lengths **32** and the RSA-max salt for your key—**`400 Transaction verification failed`** can still appear if the wallet has no AR for fees or the network rejects a specific gateway; see **`Posted via …`** / **`Attempt failed:`** in the log.

## Distribute spec (multi-channel)

Artifacts are built by [`scripts/build-spec-artifacts.sh`](scripts/build-spec-artifacts.sh): **`spec-permaweb-bundle.md`** (single Markdown) and **`spec-archive.zip`** (repo slice without `node_modules`).

| Channel | Workflow / trigger | What you do |
|--------|-------------------|-------------|
| **GitHub** | Source + tags | Already here. |
| **GitHub Release** | [`.github/workflows/spec-distribute.yml`](.github/workflows/spec-distribute.yml) on **`v*`** tags | Push `v1.0.0` etc. Release attaches the bundle + zip. |
| **Zenodo (DOI)** | Zenodo ↔ GitHub hook | [Enable the GitHub integration](https://docs.zenodo.org/en/latest/integrations/github/index.html) once; Zenodo mints a DOI per **GitHub Release**. |
| **IPFS** | Same `spec-distribute` job | Add repo secret **`PINATA_JWT`** ([Pinata](https://pinata.cloud/) JWT with file upload). Job pins `spec-permaweb-bundle.md` and prints **CID** + `ipfs.io` link in the job summary. |
| **Internet Archive** | Same workflow | Add secrets **`IA_ACCESS_KEY`** and **`IA_SECRET_KEY`** from [archive.org S3-like keys](https://archive.org/account/s3.php). Uploads `spec-archive.zip` (identifier `swarm-orchestration-spec-<tag>` or `…-run-<id>`). |
| **Arweave** | [`.github/workflows/arweave-publish.yml`](.github/workflows/arweave-publish.yml) | Fund wallet + `ARWEAVE_WALLET_KEY` (see above). |

**Manual run:** Actions → **Distribute spec** → *Run workflow* (builds artifacts; IPFS / IA run if secrets exist; **GitHub Release** only runs on **`v*`** tag pushes, not on manual dispatch).

## License

MIT. See [LICENSE](LICENSE).
