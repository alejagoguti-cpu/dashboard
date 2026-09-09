#!/usr/bin/env sh
# Importa los workflows del panel en la instancia de docker-compose, los activa
# y reinicia n8n.
#
# Dos detalles que solo se descubren ejecutándolo:
#
#   - `import:workflow` no puede activar nada por sí solo: su flag
#     --activeState=fromJson exige que n8n corra en modo queue.
#   - `publish:workflow` marca el workflow como activo en la base de datos, pero
#     el propio comando avisa de que los cambios no surten efecto hasta
#     reiniciar. Sin el reinicio, los webhooks siguen devolviendo 404.
set -eu

SERVICE=${SERVICE:-n8n}
run() { docker compose exec -T "$SERVICE" "$@"; }

echo "→ Importando workflows desde n8n/workflows…"
run n8n import:workflow --separate --input=/workflows

echo "→ Activando los workflows importados…"
# list:workflow imprime "id|nombre" y también avisos; se filtran los ids reales.
run n8n list:workflow --onlyId 2>/dev/null | tr -d '\r' | grep -E '^[A-Za-z0-9]{16}$' | while read -r id; do
  run n8n publish:workflow --id="$id" >/dev/null 2>&1 \
    && echo "  · $id activado" \
    || echo "  ! $id no se pudo activar"
done

echo "→ Reiniciando n8n para que los webhooks queden registrados…"
docker compose restart "$SERVICE" >/dev/null

echo "→ Esperando a que responda…"
i=0
while [ "$i" -lt 60 ]; do
  if [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:5678/healthz 2>/dev/null)" = "200" ]; then
    echo "→ Listo. Webhooks en http://localhost:5678/webhook/bitaxus/…"
    exit 0
  fi
  i=$((i + 1))
  sleep 2
done

echo "! n8n no respondió a tiempo; revisa 'npm run n8n:logs'." >&2
exit 1
