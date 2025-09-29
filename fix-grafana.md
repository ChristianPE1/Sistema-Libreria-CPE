# Sistema Librería - Configuración Final


### Script de Gestión Simple

```bash
./k8s/scripts/sistema.sh fix-grafana      # Fix completo de Grafana + Dashboard
./k8s/scripts/sistema.sh import-dashboard # Solo importar dashboard  
./k8s/scripts/sistema.sh restart          # Reiniciar deployments
./k8s/scripts/sistema.sh urls             # Mostrar URLs
./k8s/scripts/sistema.sh status           # Ver estado
```

### Dashboard de Grafana

El dashboard se importa automáticamente y muestra:
- Estado del backend (UP/DOWN)
- Objetos Python recolectados por GC
- Métricas en tiempo real

### Persistencia 

- **Backend**: django-prometheus configurado permanentemente
- **Grafana**: Volúmenes persistentes + import automático de dashboard
- **Prometheus**: Detecta backend automáticamente

### Para tu Presentación

Si algo falla después de reiniciar dispositivo:

```bash
./k8s/scripts/sistema.sh fix-grafana
```
