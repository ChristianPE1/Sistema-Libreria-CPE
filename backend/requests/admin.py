from django.contrib import admin
from .models import BookRequest

class BookRequestAdmin(admin.ModelAdmin):
    # Campos que se mostrarán en la lista de solicitudes en el panel de administración
    list_display = ('user', 'book', 'request_type', 'status', 'request_date', 'days_requested', 'copies_requested')
    # Campos que se pueden buscar
    search_fields = ('user__email', 'book__title', 'status', 'request_type')
    # Campos que se pueden filtrar
    list_filter = ('status', 'request_type', 'request_date')
    # Orden predeterminado
    ordering = ('-request_date',)

# Registra el modelo BookRequest con la configuración personalizada
admin.site.register(BookRequest, BookRequestAdmin)

