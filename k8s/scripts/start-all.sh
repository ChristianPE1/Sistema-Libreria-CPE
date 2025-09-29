#!/bin/bash

# Script para iniciar todos los deployments  
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

# Iniciar aplicación principal
kubectl scale deployment postgres-deployment --replicas=1 -n libreria-system
kubectl wait --for=condition=ready pod -l app=postgres -n libreria-system --timeout=120s

kubectl scale deployment backend-deployment --replicas=1 -n libreria-system
kubectl wait --for=condition=ready pod -l app=backend -n libreria-system --timeout=120s

kubectl scale deployment frontend-deployment --replicas=1 -n libreria-system
kubectl wait --for=condition=ready pod -l app=frontend -n libreria-system --timeout=120s

# Iniciar monitoreo
kubectl scale deployment prometheus-deployment --replicas=1 -n monitoring
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=120s

kubectl scale deployment grafana-deployment --replicas=1 -n monitoring
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=120s

# Estado final
kubectl get pods -n libreria-system
kubectl get pods -n monitoring