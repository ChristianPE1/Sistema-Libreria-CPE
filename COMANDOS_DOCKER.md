# 📋 Comandos Docker Compose - Sistema de Librería

## Rutas

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Base de datos**: localhost:5432

## DETENER Contenedores

```bash
# Detener todos los contenedores y eliminarlos
sudo docker compose down

# Detener sin eliminar (solo parar)
sudo docker compose stop
```

## INICIAR Contenedores

### Opción 1: Iniciar SIN reconstruir (Más rápido)
```bash
# Iniciar contenedores existentes (sin build)
sudo docker compose up

# Iniciar en segundo plano (background)
sudo docker compose up -d
```

### Opción 2: Iniciar CON reconstrucción (Cuando hay cambios)
```bash
# Reconstruir y iniciar todo
sudo docker compose up --build

# Reconstruir e iniciar en background
sudo docker compose up --build -d

# Reconstruir solo un servicio específico
sudo docker compose up --build backend
```

## MONITOREO y DIAGNÓSTICO

```bash
# Ver estado de contenedores
sudo docker compose ps

# Ver logs de todos los servicios
sudo docker compose logs

# Ver logs de un servicio específico
sudo docker compose logs backend
sudo docker compose logs db
sudo docker compose logs frontend

# Ver logs en tiempo real
sudo docker compose logs -f

# Ver logs de un servicio en tiempo real
sudo docker compose logs -f backend
```

## LIMPIEZA

```bash
# Limpiar contenedores, imágenes y volúmenes no utilizados
sudo docker system prune -f

# Limpiar TODO (incluyendo volúmenes)
sudo docker system prune -a --volumes -f
```

