#!/bin/bash

# Script de prueba completa del sistema
set -e

# Verificar e iniciar Minikube si es necesario
if ! minikube status &>/dev/null; then
    minikube start
fi

MINIKUBE_IP=$(minikube ip)
FRONTEND_PORT=$(kubectl get svc frontend-service -n libreria-system -o jsonpath='{.spec.ports[0].nodePort}')
BACKEND_PORT=$(kubectl get svc backend-service -n libreria-system -o jsonpath='{.spec.ports[0].nodePort}')

# Verificar pods
kubectl get pods -n libreria-system
kubectl get pods -n monitoring

# Test conectividad servicios
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:${BACKEND_PORT}/api/books/
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:${FRONTEND_PORT}/
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:30090/
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:32000/
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:${BACKEND_PORT}/metrics/

# Test registro usuario
TEST_USER=$(date +%s)
curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"user${TEST_USER}\",\"password\":\"test123\",\"email\":\"user${TEST_USER}@test.com\"}" \
    http://${MINIKUBE_IP}:${BACKEND_PORT}/api/users/register/