#!/usr/bin/env bash
# Build distributable spec artifacts in the repo root (run from anywhere).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT=spec-permaweb-bundle.md
{
  echo "# Swarm Orchestration Spec — distribution bundle"
  echo ""
  echo "Repository: ${GITHUB_REPOSITORY:-(local)}"
  echo "Ref: ${GITHUB_REF:-(local)}"
  echo "SHA: ${GITHUB_SHA:-(local)}"
  echo "Built: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo ""
  echo "---"
  echo ""
  for f in README.md annex-implementation-notes.md annex-visualizations.md; do
    if [[ -f "$f" ]]; then
      echo ""
      echo "## Source file: \`$f\`"
      echo ""
      cat "$f"
      echo ""
      echo "---"
    fi
  done
  for f in $(ls spec/*.md 2>/dev/null | sort); do
    echo ""
    echo "## Source file: \`$f\`"
    echo ""
    cat "$f"
    echo ""
    echo "---"
  done
} >"$OUT"

rm -f spec-archive.zip
zip -qr spec-archive.zip \
  README.md \
  LICENSE \  annex-implementation-notes.md \
  annex-visualizations.md \
  spec \  scripts/build-spec-artifacts.sh \
  -x '*/node_modules/*' \
  -x '*/dist/*' \
  -x '*.DS_Store'

echo "Wrote $OUT ($(wc -c <"$OUT") bytes) and spec-archive.zip ($(wc -c <spec-archive.zip) bytes)."
