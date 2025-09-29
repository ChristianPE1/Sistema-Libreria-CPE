# 📚 Sistema de Gestión de Librería - CPE

**Sistema de Gestión de Librería CPE** es una aplicación web full-stack que permite gestionar un sistema bibliotecario completo. La aplicación está construida con tecnologías modernas y cuenta con roles diferenciados para usuarios, bibliotecarios y administradores.

### Características Principales

- **🔐 Sistema de Autenticación**: Registro, login y gestión de usuarios con JWT
- **👥 Control de Roles**: 3 niveles de acceso (Usuario, Bibliotecario, Admin)
- **📖 Gestión de Libros**: CRUD completo de libros con información detallada
- **📝 Sistema de Solicitudes**: Préstamos de libros y solicitudes de más copias
- **📊 Dashboard Administrativo**: Panel de control para gestión completa
- **🎨 Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- **🐳 Containerización**: Despliegue completo con Docker

### Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   DATABASE      │
│   React + Vite  │◄──►│  Django + DRF   │◄──►│  PostgreSQL     │
│   Tailwind CSS  │    │   JWT + CORS    │    │   Persistent    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5433    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Modelos de Datos

#### 👤 **CustomUser**
- **Roles**: Admin, Bibliotecario, Usuario
- **Campos**: email, username, age, role
- **Autenticación**: JWT Token-based

#### 📚 **Book**
- **Campos**: title, author, genre, year, description, image, available_copies
- **Identificador**: UUID

#### 📄 **BookRequest**
- **Tipos**: Loan (Préstamo), Copies (Solicitud de copias)
- **Estados**: Pending, Approved, Rejected
- **Relaciones**: User M2M Book

---

## 🐳 Arquitectura Docker

### Contenedores

La aplicación está distribuida en **3 contenedores independientes** que funcionan de manera coordinada:

#### 1. **Contenedor de Base de Datos** (`libreria_db`)
```dockerfile
# Imagen ubuntu para configuracion desde cero
FROM ubuntu:22.04

# Variables de entorno
POSTGRES_DB=libreria_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
```

#### 2. **Contenedor Backend** (`libreria_backend`)
```dockerfile
# Imagen Python 3.11
FROM python:3.11-slim

# Dependencias del sistema
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev

# Dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Script de espera para DB
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh
```

#### 3. **Contenedor Frontend** (`libreria_frontend`)
```dockerfile
# Build stage - Node.js 18
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### 🌐 **Gestión con Docker Compose**

Los contenedores están **orquestados** pero son **independientes**:

```yaml
# docker-compose.yml
services:
  db:      # Contenedor independiente
  backend: # Depende de 'db', pero es independiente
  frontend:# Depende de 'backend', pero es independiente

networks:
  libreria_network:  # Red privada compartida
    driver: bridge

volumes:
  postgres_data:     # Persistencia de datos
```

---

## 🚀 Instalación y Despliegue

### Prerrequisitos
```bash
# Verificar instalaciones
docker --version          # Docker 20.10+
docker-compose --version  # Docker Compose 2.0+
git --version             # Git para clonar el repo
```

### Clonar el Repositorio
```bash
git clone https://github.com/ChristianPE1/Sistema-Libreria-CPE.git
cd Sistema-Libreria-CPE
```

### 🐳 Despliegue con Docker

#### Opción 1: Despliegue Completo
```bash
# Construir y ejecutar todos los servicios
sudo docker-compose up --build

# En segundo plano
sudo docker-compose up --build -d
```

#### Opción 2: Despliegue por Etapas
```bash
# 1. Solo base de datos
sudo docker-compose up db

# 2. Backend + Base de datos
sudo docker-compose up db backend

# 3. Sistema completo
sudo docker-compose up
```

### 🌐 Acceso a la Aplicación
- **Frontend (React)**: http://localhost:3000
- **Backend API (Django)**: http://localhost:8000
- **Base de Datos**: localhost:5433

---

## Verificación y Monitoreo de Contenedores

### **Estado de los Contenedores**

#### Ver todos los contenedores:
```bash
# Contenedores en ejecución
sudo docker ps

# Todos los contenedores (incluso detenidos)
sudo docker ps -a
```


#### Estado específico por servicio:
```bash
# Estado de los servicios en Docker Compose
sudo docker-compose ps

# Logs en tiempo real
sudo docker-compose logs -f

# Logs de un servicio específico
sudo docker-compose logs -f backend
sudo docker-compose logs -f frontend
sudo docker-compose logs -f db
```


### **Monitoreo de Recursos**

#### Uso de recursos por contenedor:
```bash
# CPU, Memoria, Red, I/O en tiempo real
sudo docker stats

# Una sola medición
sudo docker stats --no-stream
```

#### Detalles de red:
```bash
# Ver la red personalizada
sudo docker network ls

# Inspeccionar la red del proyecto
sudo docker network inspect sistema-libreria-cpe_libreria_network
```

#### Volúmenes persistentes:
```bash
# Listar volúmenes
sudo docker volume ls

# Inspeccionar volumen de datos
sudo docker volume inspect sistema-libreria-cpe_postgres_data
```

### Gestión Individual:
```bash
# Detener un contenedor
sudo docker stop libreria_frontend

# Reiniciar un contenedor
sudo docker restart libreria_backend

# Ver logs de un contenedor
sudo docker logs libreria_db --tail 100
```

### Gestión Orquestada:
```bash
# Toda la aplicación
sudo docker-compose up      # Iniciar
sudo docker-compose down    # Detener y limpiar
sudo docker-compose restart # Reiniciar todos


# Servicios específicos
sudo docker-compose up db backend      # Solo DB y Backend
sudo docker-compose restart frontend   # Solo frontend
sudo docker-compose logs backend       # Logs del backend
```

---


## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙋‍♂️ Autor

**Christian PE** - [@ChristianPE1](https://github.com/ChristianPE1)

---

