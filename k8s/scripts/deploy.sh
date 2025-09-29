#!/bin/bash

# Script principal de despliegue
set -e

# Cambiar al directorio k8s
cd "$(dirname "$0")/.."

# Verificar kubectl configurado
if ! kubectl cluster-info &> /dev/null; then
    exit 1
fi

# Verificar Minikube
if ! minikube status &>/dev/null; then
    minikube start
fi

# Crear namespaces
kubectl apply -f namespace.yaml

# Desplegar volúmenes persistentes  
kubectl apply -f persistent-volumes.yaml

# Desplegar ConfigMaps y Secrets
kubectl apply -f configmaps-secrets.yaml

# Desplegar PostgreSQL
kubectl apply -f postgres.yaml
kubectl wait --for=condition=ready pod -l app=postgres -n libreria-system --timeout=120s

# Desplegar Backend
kubectl apply -f backend.yaml
kubectl wait --for=condition=ready pod -l app=backend -n libreria-system --timeout=120s

# Desplegar Frontend
kubectl apply -f frontend.yaml  
kubectl wait --for=condition=ready pod -l app=frontend -n libreria-system --timeout=120s

# Estado final
kubectl get pods -n libreria-system