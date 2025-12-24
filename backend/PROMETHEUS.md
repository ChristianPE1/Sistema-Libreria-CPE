# Prometheus y Grafana

### Paneles de Grafana 

- Dashboard con 8 paneles usando métricas de Django:
  1. **Backend Status**: `up{job="libreria-backend"}` - Estado del backend (UP/DOWN)
  2. **HTTP Requests Total**: `sum(rate(django_http_requests_total_by_method_total[5m]))` - Tasa de requests por segundo
  3. **Prometheus Targets**: `count(up)` - Total de targets configurados
  4. **Active Targets**: `count(up == 1)` - Targets activos
  5. **HTTP Requests by Method**: `rate(django_http_requests_total_by_method_total[5m])` - Requests por método HTTP
  6. **HTTP Responses by Status**: `rate(django_http_responses_total_by_status_total[5m])` - Respuestas por código HTTP
  7. **Request Latency**: Latencia promedio de requests incluyendo middlewares
  8. **Python GC Collections**: `rate(python_gc_collections_total[5m])` - Colecciones del Garbage Collector

## Métricas Django

Django-Prometheus expone estas métricas:

### HTTP Requests
- `django_http_requests_total_by_method_total` - Total de requests por método HTTP
- `django_http_requests_latency_including_middlewares_seconds_*` - Latencia de requests
- `django_http_requests_body_total_bytes_*` - Tamaño del body de requests

### HTTP Responses
- `django_http_responses_total_by_status_total` - Total de respuestas por código HTTP
- `django_http_responses_body_total_bytes_*` - Tamaño del body de respuestas

### Python Runtime
- `python_gc_collections_total` - Colecciones del Garbage Collector por generación
- `python_gc_objects_collected_total` - Objetos recolectados por GC
- `python_info` - Información de versión de Python

### Excepciones
- `django_http_exceptions_total_by_type_total` - Excepciones por tipo
- `django_http_exceptions_total_by_view_total` - Excepciones por vista
