HOST_PORT=$1
TIMEOUT=${2:-30}

# Separar host y puerto
IFS=':' read -r HOST PORT <<< "$HOST_PORT"

for i in $(seq 1 $TIMEOUT); do
    if (echo >/dev/tcp/$HOST/$PORT) >/dev/null 2>&1; then
        exit 0
    fi
    sleep 1
done
exit 1
