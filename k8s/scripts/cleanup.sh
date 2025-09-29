#!/bin/bash

# Script de limpieza completa del sistema
set -e

# Confirmación
read -p "Eliminar TODOS los recursos? (y/N): " -r confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    exit 0
fi

# Eliminar recursos
kubectl delete namespace monitoring --ignore-not-found=true
kubectl delete namespace libreria-system --ignore-not-found=true
kubectl delete pv --all --ignore-not-found=true

# Esperar eliminación
sleep 10

# Estado final
kubectl get namespaces