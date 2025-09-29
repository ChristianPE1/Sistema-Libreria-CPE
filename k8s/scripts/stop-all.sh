#!/bin/bash

set -e

#!/bin/bash

# Script para detener todos los deployments sin eliminar
set -e

# Verificar e iniciar Minikube si es necesario
if ! minikube status &>/dev/null; then
    minikube start
fi

# Verificar que los namespaces existen antes de detener
if kubectl get namespace libreria-system &>/dev/null; then
    # Detener aplicación principal
    kubectl scale deployment backend-deployment --replicas=0 -n libreria-system 2>/dev/null || true
    kubectl scale deployment frontend-deployment --replicas=0 -n libreria-system 2>/dev/null || true
    kubectl scale deployment postgres-deployment --replicas=0 -n libreria-system 2>/dev/null || true
fi

if kubectl get namespace monitoring &>/dev/null; then
    # Detener monitoreo
    kubectl scale deployment prometheus-deployment --replicas=0 -n monitoring 2>/dev/null || true
    kubectl scale deployment grafana-deployment --replicas=0 -n monitoring 2>/dev/null || true
fi

# Estado final
kubectl get pods -n libreria-system 2>/dev/null || echo "Namespace libreria-system no existe"
kubectl get pods -n monitoring 2>/dev/null || echo "Namespace monitoring no existe"