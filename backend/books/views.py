from rest_framework import generics,permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer

class isAdminUser(permissions.BasePermission):
   def has_permission(self, request, view):
      return request.user and request.user.is_authenticated and request.user.is_admin()



class BookListCreate(generics.ListCreateAPIView):
   queryset = Book.objects.all()
   serializer_class = BookSerializer
   #permission_classes = [isAdminUser]

   def get_permissions(self):
      if self.request.method == 'POST':
         return [isAdminUser()]  # Solo admin puede crear libros
      return [permissions.AllowAny()]  # Cualquier usuario puede listar

class BookRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
   queryset = Book.objects.all()
   serializer_class = BookSerializer

   def get_permissions(self):
      # Solo admin puede actualizar o eliminar libros
      if self.request.method in ['PUT', 'PATCH', 'DELETE']:
         return [isAdminUser()]
      # Cualquier usuario puede ver detalles del libro
      return [permissions.AllowAny()]

class BookSearchView(generics.ListAPIView):
   queryset = Book.objects.all()
   serializer_class = BookSerializer
   permission_classes = [permissions.AllowAny]

   filter_backends = [filters.SearchFilter, DjangoFilterBackend]
   filterset_fields = ['title', 'author', 'genre']
   search_fields = ['title', 'author']

