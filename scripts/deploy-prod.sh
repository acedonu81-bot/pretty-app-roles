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
trap 'rm -rf "$TMP"' EXIT
cp .env "$TMP/"
[ -f .env.production ] && cp .env.production "$TMP/"
cp -R .vercel "$TMP/"

cd "$TMP"
echo "🚀 Desplegando $SHA a producción..."
# Sin terminal: si la CLI pregunta algo, falla en vez de quedarse esperando.
URL=$(npx vercel --prod --force --yes < /dev/null 2>"$TMP.log" | tail -1) || true
case "$URL" in
  https://*) ;;
  *) echo "❌ vercel no devolvió una URL de deploy: '$URL'"; tail -20 "$TMP.log"; exit 1 ;;
esac
echo "✅ Deploy listo: $URL"

# El dominio no siempre se mueve solo (ver memoria "Vercel: alias va a mano").
for DOMINIO in xpeak.es www.xpeak.es xpeak.site; do
  npx vercel alias set "$URL" "$DOMINIO" >/dev/null 2>&1 && echo "   ↳ $DOMINIO" || echo "   ⚠️ no se pudo asignar $DOMINIO"
done

if npx vercel inspect xpeak.es 2>&1 | grep -q "${URL#https://}"; then
  echo "✅ xpeak.es sirve $SHA"
else
  echo "❌ xpeak.es NO apunta al deploy nuevo, revisa: npx vercel inspect xpeak.es"
  exit 1
fi
