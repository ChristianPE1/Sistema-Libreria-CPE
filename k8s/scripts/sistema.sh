#!/bin/bash

case "$1" in
    "fix-grafana")
        kubectl apply -f /home/christianpe/Documentos/proyectos/Sistema-Libreria-CPE/k8s/monitoring/grafana-config.yaml
        kubectl rollout restart deployment grafana-deployment -n monitoring
        kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=60s
        sleep 5
        curl -X POST "http://$(minikube ip):32000/api/dashboards/db" \
          -H "Content-Type: application/json" \
          -H "Authorization: Basic $(echo -n admin:admin123 | base64)" \
          -d '{"dashboard": {"id": null, "title": "Sistema Librería - Dashboard", "tags": ["kubernetes", "libreria", "django"], "style": "dark", "timezone": "browser", "panels": [{"id": 1, "title": "Python GC Objects", "type": "stat", "targets": [{"expr": "sum(rate(python_gc_objects_collected_total[5m]))", "legendFormat": "Objects/sec"}], "fieldConfig": {"defaults": {"color": {"mode": "thresholds"}, "thresholds": {"steps": [{"color": "green", "value": null}, {"color": "yellow", "value": 10}, {"color": "red", "value": 50}]}, "unit": "short"}}, "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0}}, {"id": 2, "title": "Backend Status", "type": "stat", "targets": [{"expr": "up{job=\"libreria-backend\"}", "legendFormat": "Backend Up"}], "fieldConfig": {"defaults": {"color": {"mode": "thresholds"}, "thresholds": {"steps": [{"color": "red", "value": 0}, {"color": "green", "value": 1}]}, "unit": "short"}}, "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0}}, {"id": 3, "title": "Python Memory Objects", "type": "timeseries", "targets": [{"expr": "python_gc_objects_collected_total", "legendFormat": "Objects - Gen {{ generation }}"}], "fieldConfig": {"defaults": {"color": {"mode": "palette-classic"}, "unit": "short"}}, "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4}}], "time": {"from": "now-15m", "to": "now"}, "refresh": "5s", "schemaVersion": 27, "version": 1}, "overwrite": true}' > /dev/null 2>&1
        ;;
    
    "import-dashboard")
        curl -X POST "http://$(minikube ip):32000/api/dashboards/db" \
          -H "Content-Type: application/json" \
          -H "Authorization: Basic $(echo -n admin:admin123 | base64)" \
          -d '{"dashboard": {"id": null, "title": "Sistema Librería - Dashboard", "tags": ["kubernetes", "libreria", "django"], "style": "dark", "timezone": "browser", "panels": [{"id": 1, "title": "Python GC Objects", "type": "stat", "targets": [{"expr": "sum(rate(python_gc_objects_collected_total[5m]))", "legendFormat": "Objects/sec"}], "fieldConfig": {"defaults": {"color": {"mode": "thresholds"}, "thresholds": {"steps": [{"color": "green", "value": null}, {"color": "yellow", "value": 10}, {"color": "red", "value": 50}]}, "unit": "short"}}, "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0}}, {"id": 2, "title": "Backend Status", "type": "stat", "targets": [{"expr": "up{job=\"libreria-backend\"}", "legendFormat": "Backend Up"}], "fieldConfig": {"defaults": {"color": {"mode": "thresholds"}, "thresholds": {"steps": [{"color": "red", "value": 0}, {"color": "green", "value": 1}]}, "unit": "short"}}, "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0}}, {"id": 3, "title": "Python Memory Objects", "type": "timeseries", "targets": [{"expr": "python_gc_objects_collected_total", "legendFormat": "Objects - Gen {{ generation }}"}], "fieldConfig": {"defaults": {"color": {"mode": "palette-classic"}, "unit": "short"}}, "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4}}], "time": {"from": "now-15m", "to": "now"}, "refresh": "5s", "schemaVersion": 27, "version": 1}, "overwrite": true}' > /dev/null 2>&1
        ;;
    
    "restart")
        kubectl rollout restart deployment backend-deployment -n libreria-system
        kubectl rollout restart deployment grafana-deployment -n monitoring
        kubectl rollout restart deployment prometheus-deployment -n monitoring
        ;;
    
    "urls")
        echo "Frontend: http://$(minikube ip):31112"
        echo "Backend: http://$(minikube ip):32532"
        echo "Prometheus: http://$(minikube ip):30090"
        echo "Grafana: http://$(minikube ip):32000 (admin/admin123)"
        ;;
    
    "status")
        kubectl get pods -n libreria-system
        kubectl get pods -n monitoring
        ;;
    
    *)
        echo "Uso: $0 {fix-grafana|import-dashboard|restart|urls|status}"
        ;;
esac