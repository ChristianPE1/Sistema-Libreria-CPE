#!/bin/bash

# Script de configuración inicial del sistema
set -e

# Cambiar al directorio k8s/scripts
cd "$(dirname "$0")"

# Verificar dependencias
command -v minikube >/dev/null 2>&1 || { exit 1; }
command -v kubectl >/dev/null 2>&1 || { exit 1; }

# Iniciar Minikube si no está ejecutándose
if ! minikube status &>/dev/null; then
    minikube start --driver=docker --memory=4096 --cpus=2
fi

# Habilitar addons necesarios
minikube addons enable metrics-server
minikube addons enable dashboard

# Desplegar aplicación principal
./deploy.sh

# Desplegar stack de monitoreo
./deploy-monitoring.sh

# Configurar Grafana
./setup-grafana.sh

# Estado final
kubectl get pods -A