#!/bin/bash
set -e

# Minimal system verification
kubectl get nodes -o wide
echo ""
kubectl get pods -n libreria-system -o wide
echo ""
kubectl get pods -n monitoring -o wide
echo ""
echo "Backend: $(curl -sS --max-time 3 http://localhost:32532/api/books/ >/dev/null 2>&1 && echo OK || echo FAIL)"
echo "Prometheus: $(curl -sS --max-time 3 http://localhost:30090/-/healthy >/dev/null 2>&1 && echo OK || echo FAIL)"
echo "Grafana: $(curl -sS --max-time 3 http://localhost:32000/api/health >/dev/null 2>&1 && echo OK || echo FAIL)"

if kubectl top nodes >/dev/null 2>&1; then
    kubectl top nodes
fi

echo "verification: done"
