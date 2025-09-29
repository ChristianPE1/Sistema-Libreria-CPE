#!/bin/bash

# Script de despliegue del stack de monitoreo
set -e

# Cambiar al directorio k8s
cd "$(dirname "$0")/.."

# Verificar namespace principal existe
if ! kubectl get namespace libreria-system &>/dev/null; then
    exit 1
fi

# Verificar Minikube
if ! minikube status > /dev/null 2>&1; then
    minikube start
fi

eval $(minikube docker-env)

# Cambiar al directorio de monitoreo
cd monitoring/

# Crear namespace y desplegar componentes  
kubectl apply -f namespace.yaml
kubectl apply -f prometheus-config.yaml
kubectl apply -f prometheus.yaml
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=180s

kubectl apply -f grafana-config.yaml
kubectl apply -f grafana.yaml
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=180s

# Volver al directorio principal
cd ..

# Estado final
kubectl get pods -n monitoring