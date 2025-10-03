#!/bin/bash
set -e

# Esperar a que Grafana esté disponible
until curl -s http://localhost:32000/api/health > /dev/null 2>&1; do
  sleep 3
done

# Configurar datasource
curl -X POST http://localhost:32000/api/datasources \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://prometheus-service.monitoring.svc.cluster.local:9090",
    "access": "proxy",
    "isDefault": true,
    "jsonData": {"httpMethod": "POST"}
  }' 2>/dev/null || true

# Crear dashboard
curl -X POST http://localhost:32000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  -d '{
    "dashboard": {
      "id": null,
      "uid": "libreria-dashboard",
      "title": "Sistema Librería - Métricas",
      "tags": ["kubernetes", "libreria", "django"],
      "timezone": "browser",
      "schemaVersion": 16,
      "version": 0,
      "refresh": "5s",
      "panels": [
        {
          "id": 1,
          "gridPos": {"h": 6, "w": 6, "x": 0, "y": 0},
          "type": "stat",
          "title": "Backend Status",
          "targets": [
            {
              "expr": "up{job=\"libreria-backend\"}",
              "refId": "A"
            }
          ],
          "fieldConfig": {
            "defaults": {
              "color": {"mode": "thresholds"},
              "mappings": [
                {"type": "value", "value": "0", "text": "DOWN"},
                {"type": "value", "value": "1", "text": "UP"}
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {"value": 0, "color": "red"},
                  {"value": 1, "color": "green"}
                ]
              }
            }
          }
        },
        {
          "id": 2,
          "gridPos": {"h": 6, "w": 6, "x": 6, "y": 0},
          "type": "stat",
          "title": "HTTP Requests Total",
          "targets": [
            {
              "expr": "sum(rate(django_http_requests_total_by_method_total[5m]))",
              "refId": "A"
            }
          ],
          "fieldConfig": {
            "defaults": {
              "color": {"mode": "thresholds"},
              "unit": "reqps",
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {"value": 0, "color": "blue"}
                ]
              }
            }
          }
        },
        {
          "id": 3,
          "gridPos": {"h": 6, "w": 6, "x": 12, "y": 0},
          "type": "stat",
          "title": "Prometheus Targets",
          "targets": [
            {
              "expr": "count(up)",
              "refId": "A"
            }
          ],
          "fieldConfig": {
            "defaults": {
              "color": {"mode": "thresholds"},
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {"value": 0, "color": "red"},
                  {"value": 1, "color": "green"}
                ]
              }
            }
          }
        },
        {
          "id": 4,
          "gridPos": {"h": 6, "w": 6, "x": 18, "y": 0},
          "type": "stat",
          "title": "Active Targets",
          "targets": [
            {
              "expr": "count(up == 1)",
              "refId": "A"
            }
          ],
          "fieldConfig": {
            "defaults": {
              "color": {"mode": "thresholds"},
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {"value": 0, "color": "red"},
                  {"value": 1, "color": "green"}
                ]
              }
            }
          }
        },
        {
          "id": 5,
          "gridPos": {"h": 8, "w": 12, "x": 0, "y": 6},
          "type": "graph",
          "title": "HTTP Requests by Method",
          "targets": [
            {
              "expr": "rate(django_http_requests_total_by_method_total[5m])",
              "legendFormat": "{{method}}",
              "refId": "A"
            }
          ]
        },
        {
          "id": 6,
          "gridPos": {"h": 8, "w": 12, "x": 12, "y": 6},
          "type": "graph",
          "title": "HTTP Responses by Status",
          "targets": [
            {
              "expr": "rate(django_http_responses_total_by_status_total[5m])",
              "legendFormat": "Status {{status}}",
              "refId": "A"
            }
          ]
        },
        {
          "id": 7,
          "gridPos": {"h": 8, "w": 12, "x": 0, "y": 14},
          "type": "graph",
          "title": "Request Latency (avg)",
          "targets": [
            {
              "expr": "rate(django_http_requests_latency_including_middlewares_seconds_sum[5m]) / rate(django_http_requests_latency_including_middlewares_seconds_count[5m])",
              "legendFormat": "Avg Latency",
              "refId": "A"
            }
          ]
        },
        {
          "id": 8,
          "gridPos": {"h": 8, "w": 12, "x": 12, "y": 14},
          "type": "graph",
          "title": "Python GC Collections",
          "targets": [
            {
              "expr": "rate(python_gc_collections_total[5m])",
              "legendFormat": "Gen {{generation}}",
              "refId": "A"
            }
          ]
        }
      ]
    },
    "overwrite": true
  }' 2>/dev/null

echo "✅ Dashboard configurado: http://localhost:32000/d/libreria-dashboard"
