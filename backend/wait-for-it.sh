#!/bin/bash
set -e

HOST_PORT=$1
TIMEOUT=${2:-60}

# Separar host y puerto
IFS=':' read -r HOST PORT <<< "$HOST_PORT"

# Función para verificar conexión usando nc o telnet
check_connection() {
    nc -z "$HOST" "$PORT" 2>/dev/null || \
    timeout 1 bash -c "</dev/tcp/$HOST/$PORT" 2>/dev/null
}

for i in $(seq 1 $TIMEOUT); do
    if check_connection; then
        exit 0
    fi
    sleep 2
done

exit 1
