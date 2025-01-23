from django.urls import path
from .views import BookListCreate, BookRetrieveUpdateDestroy, BookSearchView

urlpatterns = [
   path('books/', BookListCreate.as_view(), name='book-list-create'),  # Listar y crear libros
   path('books/<uuid:pk>/', BookRetrieveUpdateDestroy.as_view(), name='book-detail'),  # Detalles, actualización y eliminación de un libro
   path('books/search/', BookSearchView.as_view(), name='book-search'),  # Búsqueda de libros
]
