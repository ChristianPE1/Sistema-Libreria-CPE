# Sistema de Gestión de Librería - CPE

**Sistema de Gestión de Librería CPE** es una aplicación web full-stack que permite gestionar un sistema bibliotecario completo. La aplicación está construida con tecnologías modernas y cuenta con roles diferenciados para usuarios, bibliotecarios y administradores.

### Características Principales

- **Sistema de Autenticación**: Registro, login y gestión de usuarios con JWT
- **Control de Roles**: 3 niveles de acceso (Usuario, Bibliotecario, Admin)
- **Gestión de Libros**: CRUD completo de libros con información detallada
- **Sistema de Solicitudes**: Préstamos de libros y solicitudes de más copias
- **Dashboard Administrativo**: Panel de control para gestión completa
- **Containerización**: Despliegue completo con Docker

### Acceso a la Aplicación

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Base de Datos**: PostgreSQL en el contenedor `libreria_db` - Puerto: 5433

### Modelos de Datos

#### **CustomUser**
- **Roles**: Admin, Bibliotecario, Usuario
- **Campos**: email, username, age, role
- **Autenticación**: JWT Token-based

#### **Book**
- **Campos**: title, author, genre, year, description, image, available_copies
- **Identificador**: UUID

#### **BookRequest**
- **Tipos**: Loan (Préstamo), Copies (Solicitud de copias)
- **Estados**: Pending, Approved, Rejected
- **Relaciones**: User M2M Book

---

## Docker

La aplicación está distribuida en **3 contenedores independientes** que funcionan de manera coordinada:

- libreria_db
- libreria_backend
- libreria_frontend

### Estado de los servicios:
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
```

#### Detalles de red:
```bash
sudo docker network ls

# Inspeccionar la red del proyecto
sudo docker network inspect sistema-libreria-cpe_libreria_network
```

#### Volúmenes persistentes:
```bash
sudo docker volume ls

# Inspeccionar volumen de datos
sudo docker volume inspect sistema-libreria-cpe_postgres_data
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


## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
