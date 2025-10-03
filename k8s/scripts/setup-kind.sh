#!/usr/bin/env bash
set -e


command -v kind >/dev/null || { echo "kind not found"; exit 1; }
command -v kubectl >/dev/null || { echo "kubectl not found"; exit 1; }
command -v docker >/dev/null || { echo "docker not found"; exit 1; }

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Borrar cluster existente si existe
if kind get clusters | grep -q "^libreria-cluster$"; then
  kind delete cluster --name libreria-cluster >/dev/null 2>&1 || true
fi

# Crear cluster usando k8s/kind-config.yaml
kind create cluster --config=k8s/kind-config.yaml --wait 120s >/dev/null

# Build and load images
docker build -q -t libreria-backend:latest backend/ >/dev/null
docker build -q -t libreria-frontend:latest frontend/ >/dev/null
kind load docker-image libreria-backend:latest libreria-frontend:latest --name libreria-cluster >/dev/null

cd k8s

# Aplicar configuraciones core (namespaces, configmaps, PVs)
kubectl apply -f namespace.yaml -f monitoring/namespace.yaml >/dev/null
kubectl apply -f configmaps-secrets.yaml >/dev/null
kubectl apply -f persistent-volumes.yaml -f monitoring/grafana-pv.yaml >/dev/null

# PostgreSQL
kubectl apply -f postgres.yaml >/dev/null
kubectl wait --for=condition=ready pod -l app=postgres -n libreria-system --timeout=180s >/dev/null 2>&1 || true
kubectl exec -n libreria-system deployment/postgres-deployment -- psql -U admin -d postgres -c "CREATE DATABASE libreria_db;" >/dev/null 2>&1 || true

# Backend
kubectl apply -f backend.yaml >/dev/null
sleep 5
kubectl exec -n libreria-system deployment/backend-deployment -- python manage.py migrate >/dev/null 2>&1 || true
kubectl wait --for=condition=ready pod -l app=backend -n libreria-system --timeout=180s >/dev/null 2>&1 || true

# Frontend
kubectl apply -f frontend.yaml >/dev/null
kubectl wait --for=condition=ready pod -l app=frontend -n libreria-system --timeout=180s >/dev/null 2>&1 || true

# Monitoring
kubectl apply -f monitoring/prometheus-config.yaml -f monitoring/prometheus.yaml >/dev/null
kubectl apply -f monitoring/grafana-config.yaml -f monitoring/grafana.yaml >/dev/null
kubectl apply -f monitoring/metrics-server.yaml >/dev/null

# Configure Grafana (best effort)
./scripts/configurar-grafana.sh >/dev/null 2>&1 || true

# Status
echo "Deployment finished"
echo "Frontend:   http://localhost:31112"
echo "Backend:    http://localhost:32532"
echo "Prometheus: http://localhost:30090"
echo "Grafana:    http://localhost:32000 (admin/admin123)"
