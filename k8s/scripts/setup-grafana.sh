#!/bin/bash

# Script de configuración de Grafana
set -e

# Verificar que Grafana esté ejecutándose
if ! kubectl get pod -n monitoring -l app=grafana | grep -q Running; then
    exit 1
fi

MINIKUBE_IP=$(minikube ip)
GRAFANA_URL="http://$MINIKUBE_IP:32000"

# Esperar Grafana listo
sleep 30

# Verificar conectividad
for i in {1..10}; do
    if curl -s -f "$GRAFANA_URL/api/health" >/dev/null; then
        break
    else
        sleep 10
    fi
    if [ $i -eq 10 ]; then
        exit 1
    fi
done

# Configurar datasource Prometheus
PROMETHEUS_URL="http://prometheus-service.monitoring.svc.cluster.local:9090"

cat > /tmp/prometheus-datasource.json << EOF
{
  "name": "Prometheus",
  "type": "prometheus",
  "url": "$PROMETHEUS_URL",
  "access": "proxy",
  "isDefault": true,
  "basicAuth": false
}
EOF

curl -s -X POST \
  -H "Content-Type: application/json" \
  -d @/tmp/prometheus-datasource.json \
  -u admin:admin123 \
  "$GRAFANA_URL/api/datasources" || true

rm -f /tmp/prometheus-datasource.json

# Generar tráfico para métricas
kubectl run traffic-generator --rm -i --restart=Never --image=busybox -- sh -c "
for i in \$(seq 1 20); do
    wget -q --timeout=2 http://backend-service.libreria-system.svc.cluster.local:8000/metrics/ -O /dev/null &
    sleep 0.5
done
wait
" > /dev/null 2>&1 &