#!/usr/bin/env bash
# Usage: run.sh [all|teach|printouts|groupplay]  (launch, doctor, drive, teardown)
set -euo pipefail
SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SKILL/../../.." && pwd)"
export VERIFY_EVIDENCE="${VERIFY_EVIDENCE:-/tmp/verify-sidekick-evidence}"
export VERIFY_PORT="${VERIFY_PORT:-4400}"
mkdir -p "$VERIFY_EVIDENCE"
trap '"$SKILL/launch.sh" stop' EXIT
"$SKILL/launch.sh" start
"$SKILL/launch.sh" doctor
filter=()
[ "${1:-all}" = all ] || filter=(--grep "\\[$1\\]")
cd "$ROOT" && pnpm exec playwright test -c .claude/skills/verify-sidekick-web/verify.config.ts ${filter[@]+"${filter[@]}"}
