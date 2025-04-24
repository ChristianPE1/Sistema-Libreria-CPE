from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
   # Campos que se mostrarán en la lista de usuarios en el panel de administración
   list_display = ('email', 'username', 'role', 'is_staff', 'is_active')
   # Campos que se pueden buscar
   search_fields = ('email', 'username', 'role')
   # Campos que se pueden editar directamente desde la lista
   list_editable = ('role', 'is_active')
   # Campos que se pueden filtrar
   list_filter = ('role', 'is_staff', 'is_active')
   # Configuración de los campos en el formulario de edición
   fieldsets = (
      (None, {'fields': ('email', 'username', 'password')}),
      ('Personal Info', {'fields': ('age', 'role')}),
      ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
   )
   # Campos requeridos al crear un nuevo usuario desde el panel de administración
   add_fieldsets = (
      (None, {
         'classes': ('wide',),
         'fields': ('email', 'username', 'password1', 'password2', 'role', 'is_staff', 'is_active'),
      }),
   )
   ordering = ('email',)

# Registra el modelo CustomUser con la configuración personalizada
admin.site.register(CustomUser, CustomUserAdmin)
