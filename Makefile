# Makefile para gestión de Kubernetes
.PHONY: help build deploy test monitor clean status logs

# Variables
NAMESPACE=libreria-system
SCRIPTS_DIR=k8s/scripts

help: ## Mostrar ayuda
	@echo "🚀 Sistema Librería - Comandos Kubernetes"
	@echo "========================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Construir imágenes Docker
	@echo "🐳 Construyendo imágenes Docker..."
	@cd $(SCRIPTS_DIR) && ./build-images.sh

deploy: ## Desplegar aplicación en Kubernetes
	@echo "🚀 Desplegando en Kubernetes..."
	@cd $(SCRIPTS_DIR) && ./deploy.sh

test: ## Ejecutar pruebas de escalabilidad
	@echo "🧪 Ejecutando pruebas de escalabilidad..."
	@cd $(SCRIPTS_DIR) && ./scalability-test.sh

monitor: ## Abrir monitor de sistema
	@echo "📊 Abriendo monitor del sistema..."
	@cd $(SCRIPTS_DIR) && ./monitor.sh

clean: ## Limpiar todos los recursos
	@echo "🧹 Limpiando recursos..."
	@cd $(SCRIPTS_DIR) && ./cleanup.sh

status: ## Mostrar estado actual
	@echo "📊 Estado actual del sistema:"
	@kubectl get all -n $(NAMESPACE) 2>/dev/null || echo "❌ Sistema no desplegado"

logs-backend: ## Ver logs del backend
	@echo "📋 Logs del backend:"
	@kubectl logs -n $(NAMESPACE) -l app=backend --tail=50 -f

logs-frontend: ## Ver logs del frontend
	@echo "📋 Logs del frontend:"
	@kubectl logs -n $(NAMESPACE) -l app=frontend --tail=50 -f

logs-db: ## Ver logs de la base de datos
	@echo "📋 Logs de PostgreSQL:"
	@kubectl logs -n $(NAMESPACE) -l app=postgres --tail=50 -f

scale-up: ## Escalar servicios hacia arriba
	@echo "📈 Escalando servicios..."
	@kubectl scale deployment backend-deployment --replicas=5 -n $(NAMESPACE)
	@kubectl scale deployment frontend-deployment --replicas=5 -n $(NAMESPACE)
	@echo "✅ Escalado completado"

scale-down: ## Escalar servicios hacia abajo
	@echo "📉 Reduciendo réplicas..."
	@kubectl scale deployment backend-deployment --replicas=3 -n $(NAMESPACE)
	@kubectl scale deployment frontend-deployment --replicas=3 -n $(NAMESPACE)
	@echo "✅ Reducción completada"

restart: ## Reiniciar deployments
	@echo "🔄 Reiniciando deployments..."
	@kubectl rollout restart deployment/backend-deployment -n $(NAMESPACE)
	@kubectl rollout restart deployment/frontend-deployment -n $(NAMESPACE)
	@echo "✅ Reinicio completado"

health: ## Verificar salud del sistema
	@echo "🏥 Verificación de salud:"
	@kubectl get pods -n $(NAMESPACE) -o wide
	@echo ""
	@kubectl get hpa -n $(NAMESPACE) 2>/dev/null || echo "HPA no disponible"

port-forward: ## Hacer port forwarding para acceso local
	@echo "🌐 Configurando port forwarding..."
	@echo "Backend disponible en: http://localhost:8000"
	@echo "Frontend disponible en: http://localhost:3000"
	@kubectl port-forward -n $(NAMESPACE) service/backend-service 8000:8000 &
	@kubectl port-forward -n $(NAMESPACE) service/frontend-service 3000:80 &
	@echo "✅ Port forwarding configurado (Ctrl+C para detener)"

install-deps: ## Instalar dependencias necesarias (kubectl, etc.)
	@echo "📦 Verificando dependencias..."
	@which kubectl > /dev/null || (echo "❌ kubectl no instalado"; exit 1)
	@which docker > /dev/null || (echo "❌ docker no instalado"; exit 1)
	@echo "✅ Dependencias verificadas"

quick-start: install-deps build deploy status ## Inicio rápido completo
	@echo "🎉 ¡Sistema desplegado y listo!"

update: ## Actualizar deployments con nuevas imágenes
	@echo "🔄 Actualizando deployments..."
	@kubectl set image deployment/backend-deployment backend=christianpe/libreria-backend:latest -n $(NAMESPACE)
	@kubectl set image deployment/frontend-deployment frontend=christianpe/libreria-frontend:latest -n $(NAMESPACE)
	@kubectl rollout status deployment/backend-deployment -n $(NAMESPACE)
	@kubectl rollout status deployment/frontend-deployment -n $(NAMESPACE)
	@echo "✅ Actualización completada"