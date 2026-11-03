#!/usr/bin/env bash
# Despliega a producción EXACTAMENTE el último commit (HEAD), nunca la carpeta
# de trabajo. `vercel --prod` sube la carpeta tal cual, con lo que haya a medias
# de otras sesiones: así acabaron 428 archivos sin commitear y cada deploy
# obligaba a revisar a mano qué se colaba (12 oct 2026). Lo que no está
# commiteado aquí simplemente no sale.
#
# Uso: npm run deploy:prod
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"
SHA=$(git rev-parse --short HEAD)

PENDIENTES=$(git status --porcelain | wc -l | tr -d ' ')
if [ "$PENDIENTES" != "0" ]; then
  echo "ℹ️  $PENDIENTES cambio(s) sin commitear NO van en este deploy (solo $SHA):"
  git status --short | sed 's/^/     /'
fi

# Copia limpia de HEAD SIN carpeta .git (git archive, no worktree): con .git la
# CLI manda el autor del commit, Vercel no lo reconoce como miembro del equipo
# (email local del Mac) y deja el deploy bloqueado en UNKNOWN sin compilar
# (TEAM_ACCESS_REQUIRED, 12 oct 2026). .env y .vercel no están en git y el
# build los necesita (prerender-meta / update-sitemap leen Supabase de .env).
TMP="$(mktemp -d)/xpeak-deploy"
mkdir -p "$TMP"
git archive HEAD | tar -x -C "$TMP"
LOG="$TMP.log"
trap 'rm -rf "$TMP" "$LOG"' EXIT
cp .env "$TMP/"
[ -f .env.production ] && cp .env.production "$TMP/"
cp -R .vercel "$TMP/"

# Tests y tipos sobre la copia de HEAD, no sobre la carpeta de trabajo: se
# comprueba exactamente lo que va a salir. node_modules se enlaza para no
# reinstalar y se quita antes de subir. Si algo falla, no se despliega
# (28 oct 2026, tras Codex rompiendo producción el 23 sep).
ln -s "$ROOT/node_modules" "$TMP/node_modules"
echo "🧪 Tests de $SHA..."
if ! (cd "$TMP" && npx vitest run > "$LOG" 2>&1); then
  tail -40 "$LOG"
  echo "❌ Fallan tests, NO se despliega $SHA"
  exit 1
fi
echo "   ↳ $(grep -E 'Tests +[0-9]' "$LOG" | tail -1 | sed 's/^ *//')"
(cd "$TMP" && node scripts/check-types.mjs) || { echo "❌ Más errores de tipos que el listón, NO se despliega $SHA"; exit 1; }
rm "$TMP/node_modules"

cd "$TMP"
echo "🚀 Desplegando $SHA a producción..."
# Sin terminal: si la CLI pregunta algo, falla en vez de quedarse esperando.
# Sin TTY la CLI escribe JSON en stdout, así que la URL se saca del log entero
# (línea "Production  https://pretty-app-roles-<hash>-...vercel.app").
npx vercel --prod --force --yes < /dev/null > "$LOG" 2>&1 || true
URL=$(grep -E "Production" "$LOG" | grep -oE 'https://pretty-app-roles-[a-z0-9]+-acedonu81-bots-projects\.vercel\.app' | tail -1)
case "$URL" in
  https://*) ;;
  *) echo "❌ vercel no devolvió una URL de deploy: '$URL'"; tail -20 "$LOG"; exit 1 ;;
esac
echo "✅ Deploy listo: $URL"

# El dominio no siempre se mueve solo (ver memoria "Vercel: alias va a mano").
for DOMINIO in xpeak.es www.xpeak.es xpeak.site; do
  npx vercel alias set "$URL" "$DOMINIO" >/dev/null 2>&1 && echo "   ↳ $DOMINIO" || echo "   ⚠️ no se pudo asignar $DOMINIO"
done

# La salida de `vercel inspect` se guarda ANTES de buscar en ella. Con
# `inspect | grep -q` grep cierra la tubería al acertar y vercel muere con
# "Abort trap: 6": daba un falso "NO apunta" justo cuando todo iba bien (tres
# veces el 28 oct 2026; los reintentos no lo arreglaban).
# Cada deploy guarda su dist/ (~230 MB) y el plan Hobby tiene 10 GB de
# Deployment Storage: sin limpiar, a los ~40 deploys se llena y puede bloquear
# la web (3 nov 2026). Solo se toca ESTE proyecto: se conserva el deploy de
# producción actual y los 5 más recientes (para rollback); se borra el resto.
# Solo corre tras comprobar que xpeak.es sirve el deploy nuevo.
limpiar_deploys_antiguos() {
  local TEAM PROJ PROD IDS ID
  TEAM=$(python3 -c "import json;print(json.load(open('$ROOT/.vercel/project.json'))['orgId'])")
  PROJ=$(python3 -c "import json;print(json.load(open('$ROOT/.vercel/project.json'))['projectId'])")
  PROD=$(npx vercel api "/v9/projects/$PROJ?teamId=$TEAM" 2>/dev/null | python3 -c "import sys,json;print(((json.load(sys.stdin).get('targets') or {}).get('production') or {}).get('id',''))")
  [ -n "$PROD" ] || { echo "   ⚠️ sin id de producción, no se borra nada"; return 1; }
  IDS=$(npx vercel api "/v6/deployments?teamId=$TEAM&projectId=$PROJ&limit=100" 2>/dev/null | PROD="$PROD" python3 -c "
import sys,json,os
d=sorted(json.load(sys.stdin)['deployments'],key=lambda x:-x['created'])
keep={os.environ['PROD']}|{x['uid'] for x in d[:5]}
print(' '.join(x['uid'] for x in d if x['uid'] not in keep))")
  local N=0
  for ID in $IDS; do
    npx vercel api "/v13/deployments/$ID?teamId=$TEAM" --method DELETE --dangerously-skip-permissions >/dev/null 2>&1 && N=$((N+1))
  done
  echo "   ↳ limpieza: $N deploys antiguos borrados (quedan producción + 5 recientes)"
}

for INTENTO in 1 2 3; do
  INSPECT=$(npx vercel inspect xpeak.es 2>&1 || true)
  if grep -q "${URL#https://}" <<<"$INSPECT"; then
    echo "✅ xpeak.es sirve $SHA"
    limpiar_deploys_antiguos || echo "   ⚠️ la limpieza de deploys antiguos falló (no afecta al deploy)"
    exit 0
  fi
  sleep 5
done
echo "❌ xpeak.es NO apunta al deploy nuevo, revisa: npx vercel inspect xpeak.es"
exit 1
