#!/bin/bash

# Script de reinicio completo del sistema
set -e

# Verificar e iniciar Minikube si es necesario
if ! minikube status &>/dev/null; then
    minikube start
fi

# Verificar que los namespaces existen
if ! kubectl get namespace libreria-system &>/dev/null; then
    echo "Error: namespace libreria-system no existe. Ejecuta ./setup.sh primero"
    exit 1
fi

if ! kubectl get namespace monitoring &>/dev/null; then
    echo "Error: namespace monitoring no existe. Ejecuta ./deploy-monitoring.sh primero"
    exit 1
fi

# Reiniciar deployments aplicación
kubectl rollout restart deployment/backend-deployment -n libreria-system
kubectl rollout restart deployment/frontend-deployment -n libreria-system
kubectl rollout restart deployment/postgres-deployment -n libreria-system

# Reiniciar deployments monitoreo
kubectl rollout restart deployment/prometheus-deployment -n monitoring
kubectl rollout restart deployment/grafana-deployment -n monitoring

# Esperar pods ready
kubectl wait --for=condition=ready pod -l app=backend -n libreria-system --timeout=120s
kubectl wait --for=condition=ready pod -l app=frontend -n libreria-system --timeout=120s
kubectl wait --for=condition=ready pod -l app=postgres -n libreria-system --timeout=120s
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=120s
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=120s

kubectl get pods -n libreria-system
kubectl get pods -n monitoring