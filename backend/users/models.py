from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class CustomUser(AbstractUser):
   ROLES = (
        ('admin', 'Admin'),
        ('bibliotecario', 'Bibliotecario'),
        ('usuario', 'Usuario'),
    )
   id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
   email = models.EmailField(unique=True)
   username = models.CharField(max_length=100, unique=True)
   age = models.PositiveIntegerField(null=True, blank=True)
   role = models.CharField(max_length=20, choices=ROLES, default='usuario')

   USERNAME_FIELD = 'email'
   REQUIRED_FIELDS = ['username']

   def __str__(self):
      return self.username
   
   def is_admin(self):
      return self.role == 'admin'
   
   def is_bibliotecario(self):
      return self.role == 'bibliotecario'
   
   def is_usuario(self):
      return self.role == 'usuario'
