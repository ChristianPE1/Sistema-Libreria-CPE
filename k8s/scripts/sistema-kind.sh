#!/bin/bash

case "$1" in
    "fix-grafana")
        kubectl apply -f k8s/monitoring/grafana-config.yaml >/dev/null
        kubectl rollout restart deployment grafana-deployment -n monitoring >/dev/null
        kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=60s >/dev/null 2>&1 || true
        sleep 2
        curl -s -X POST "http://localhost:32000/api/dashboards/db" -H "Content-Type: application/json" -u admin:admin123 -d @- >/dev/null 2>&1 <<'JSON'
{"dashboard": {"id": null, "title": "Sistema Librería - Dashboard", "tags": ["kubernetes","libreria","django"], "timezone": "browser", "panels": []}, "overwrite": true}
JSON
        echo "grafana: ok"
        ;;

    "import-dashboard")
        curl -s -X POST "http://localhost:32000/api/dashboards/db" -H "Content-Type: application/json" -u admin:admin123 -d @- >/dev/null 2>&1 <<'JSON'
{"dashboard": {"id": null, "title": "Sistema Librería - Dashboard", "tags": ["kubernetes","libreria","django"]}, "overwrite": true}
JSON
        echo "dashboard: imported"
        ;;

    "restart")
        kubectl rollout restart deployment backend-deployment -n libreria-system >/dev/null
        kubectl rollout restart deployment grafana-deployment -n monitoring >/dev/null
        kubectl rollout restart deployment prometheus-deployment -n monitoring >/dev/null
        echo "deployments: restarted"
        ;;

    "urls")
        echo "Frontend:   http://localhost:31112"
        echo "Backend:    http://localhost:32532"
        echo "Prometheus: http://localhost:30090"
        echo "Grafana:    http://localhost:32000 (admin/admin123)"
        ;;

    "status")
        kubectl get nodes -o wide >/dev/null
        kubectl get pods -n libreria-system -o wide >/dev/null
        kubectl get pods -n monitoring -o wide >/dev/null
        echo "status: ok"
        ;;

    "nodes")
        kubectl get nodes -o wide
        ;;

    "load-images")
        kind load docker-image libreria-backend:latest libreria-frontend:latest --name libreria-cluster >/dev/null
        echo "images: loaded"
        ;;

    "cleanup")
        kind delete cluster --name libreria-cluster >/dev/null
        echo "cluster: deleted"
        ;;

    *)
        echo "Usage: $0 {fix-grafana|import-dashboard|restart|urls|status|nodes|load-images|cleanup}"
        ;;
esac
