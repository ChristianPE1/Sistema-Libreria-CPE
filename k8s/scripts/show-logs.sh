#!/bin/bash

# Script de logs unificados
set -e

NAMESPACE_APP="libreria-system"
NAMESPACE_MON="monitoring"

# Función para mostrar logs
show_logs() {
    local pod_name=$1
    local namespace=$2
    local lines=${3:-20}
    
    POD=$(kubectl get pods -n $namespace -l app=$pod_name -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -n "$POD" ]; then
        kubectl logs $POD -n $namespace --tail=$lines 2>/dev/null
    fi
}

# Logs aplicación
show_logs "backend" $NAMESPACE_APP 30
show_logs "frontend" $NAMESPACE_APP 15
show_logs "postgres" $NAMESPACE_APP 10

# Logs monitoreo
show_logs "prometheus" $NAMESPACE_MON 15
show_logs "grafana" $NAMESPACE_MON 15

# Estado pods
kubectl get pods -n $NAMESPACE_APP -o wide
kubectl get pods -n $NAMESPACE_MON -o wide