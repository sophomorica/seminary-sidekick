#!/usr/bin/env bash
# Usage: launch.sh start | stop | doctor
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SKILL="$ROOT/.claude/skills/verify-sidekick-web"
APP_PORT="${VERIFY_PORT:-4400}"
MOCK_PORT=$((APP_PORT + 1))
FAKE_PORT=$((APP_PORT + 2))
EVID="${VERIFY_EVIDENCE:-/tmp/verify-sidekick-evidence}"
mkdir -p "$EVID"

owner() { lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | head -1; }
alive() { [ -f "$EVID/$1.pid" ] && kill -0 "$(cat "$EVID/$1.pid")" 2>/dev/null; }
cards() { curl -fsS "http://127.0.0.1:$APP_PORT/teach" 2>/dev/null | grep -o 'data-testid="idea-card"' | wc -l | tr -d ' '; }

spawn() { # name, port, then command
  local name=$1 port=$2; shift 2
  [ -z "$(owner "$port")" ] || { echo "port $port is busy; set VERIFY_PORT to a free base" >&2; exit 1; }
  (cd "$ROOT" && exec env -i HOME="$HOME" PATH="$PATH" SUPABASE_MOCK_PORT="$MOCK_PORT" \
    VERIFY_FAKE_PORT="$FAKE_PORT" VERIFY_MOCK_PORT="$MOCK_PORT" VERIFY_EVIDENCE="$EVID" "$@") \
    >"$EVID/$name.log" 2>&1 &
  echo $! >"$EVID/$name.pid"
}

wait_for() { # name, check command
  for _ in $(seq 1 60); do eval "$2" && return 0; sleep 0.5; done
  echo "$1 not ready, see $EVID/*.log" >&2; return 1
}

case "${1:-}" in
start)
  stale=$(find "$ROOT" -maxdepth 1 -name '.env*' ! -name '.env.example' ! -name '.env.test')
  [ -z "$stale" ] || { echo "refusing to start, env file present: $stale" >&2; exit 1; }
  rm -f "$EVID"/rpc-calls.jsonl
  ( cd "$ROOT" && env -i HOME="$HOME" PATH="$PATH" \
      PUBLIC_SUPABASE_URL="http://127.0.0.1:$FAKE_PORT" PUBLIC_SUPABASE_ANON_KEY=verify-anon-key \
      pnpm build ) >"$EVID/build.log" 2>&1 || { echo "build failed, see $EVID/build.log" >&2; exit 1; }
  spawn mock "$MOCK_PORT" node tests/mocks/supabase-posts.mjs
  spawn fake "$FAKE_PORT" node .claude/skills/verify-sidekick-web/fake-supabase.mjs
  spawn app "$APP_PORT" node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port "$APP_PORT" --strictPort
  wait_for app '[ "$(cards)" = 10 ]'
  echo "ready http://127.0.0.1:$APP_PORT (fake Supabase :$FAKE_PORT, repo mock :$MOCK_PORT)"
  ;;
doctor)
  ok=1
  for pair in "app:$APP_PORT" "mock:$MOCK_PORT" "fake:$FAKE_PORT"; do
    n=${pair%%:*}; p=${pair##*:}
    if alive "$n" && [ "$(owner "$p")" = "$(cat "$EVID/$n.pid")" ]; then echo "ok   $n owns :$p"
    else echo "FAIL $n does not own :$p"; ok=0; fi
  done
  c=$(cards); [ "$c" = 10 ] && echo "ok   /teach renders $c fixture ideas" || { echo "FAIL /teach shows $c ideas, expected 10"; ok=0; }
  curl -fsS "http://127.0.0.1:$FAKE_PORT/health" >/dev/null && echo "ok   fake Supabase answers" || { echo "FAIL fake Supabase down"; ok=0; }
  [ $ok = 1 ] || exit 1
  ;;
stop)
  for n in app fake mock; do
    if alive "$n"; then kill "$(cat "$EVID/$n.pid")" 2>/dev/null || true; fi
    rm -f "$EVID/$n.pid"
  done
  echo stopped
  ;;
*) echo "usage: $0 start|stop|doctor" >&2; exit 2 ;;
esac
