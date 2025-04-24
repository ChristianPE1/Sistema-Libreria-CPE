from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import PermissionDenied
from books.models import Book
from .models import BookRequest
from .serializers import BookRequestSerializer


class CreateBookRequest(APIView):
   permission_classes = [permissions.IsAuthenticated]

   def post(self, request,book_id):
      user = request.user

      if not user.is_usuario():
         return Response({"error": "Rol no autorizado para esta acción."}, status=403)

      # Validar si el libro existe
      try:
         book = Book.objects.get(id=book_id)
      except Book.DoesNotExist:
         return Response({"error": "El libro no existe."}, status=404)

      # Validar days_requested
      try:
         days_requested = int(request.data.get('days_requested', 0))
         if days_requested <= 0:
            return Response({"error": "El número de días solicitados debe ser mayor que cero."}, status=400)
      except ValueError:
         return Response({"error": "El número de días solicitados debe ser un número entero."}, status=400)

      # Crear la solicitud
      book_request = BookRequest.objects.create(
         user=user,
         book=book,
         request_type='loan',
         status='pending',
         days_requested = int(days_requested)
      )

      return Response({"message": "Solicitud creada con éxito.", "request_id": book_request.id}, status=201)
      

class BiblioRequestView(ListAPIView):
   permission_classes = [permissions.IsAuthenticated]
   serializer_class = BookRequestSerializer

   def get_queryset(self):
      user = self.request.user

      if user.is_bibliotecario():
         print("All requests")
         # Mostrar solo solicitudes de copias pendientes
         return BookRequest.objects.filter(request_type='loan', status='pending').order_by('-request_date')
      
      raise PermissionDenied("Rol no autorizado para esta acción.")

class CreateCopiesRequest(APIView):
   permission_classes = [permissions.IsAuthenticated]

   def post(self, request,book_id):
      user = request.user

      if not user.is_bibliotecario():
         return Response({"error": "Rol no autorizado para esta acción."}, status=403)
      
      try:
         book = Book.objects.get(id=book_id)
      except Book.DoesNotExist:
         return Response({"error": "El libro no existe."}, status=404)
      
      copies_requested = request.data.get('copies_requested')
      if not copies_requested:
         return Response({"error": "Debe especificar la cantidad de copias solicitadas."}, status=400)
      
      book_request = BookRequest.objects.create(
         user=user,
         book=book,
         request_type='copies',
         status='pending',
         copies_requested=int(copies_requested)
      )
      return Response({"message": "Solicitud creada con éxito.", "request_id": book_request.id}, status=201)


class UserRequestView(ListAPIView):
   permission_classes = [permissions.IsAuthenticated]
   serializer_class = BookRequestSerializer

   def get_queryset(self):
      user = self.request.user
      if user.is_usuario():
         return BookRequest.objects.filter(user=user).order_by('-request_date')
      raise PermissionDenied("Rol no autorizado para esta acción.")
   
class UpdateLoanRequestStatus(APIView):
   permission_classes = [permissions.IsAuthenticated]

   def patch(self, request, request_id):
      user = request.user

      if not user.is_bibliotecario():
         return Response({"error": "Rol no autorizado para esta acción."}, status=403)

      try:
         book_request = BookRequest.objects.get(id=request_id, request_type='loan')
      except BookRequest.DoesNotExist:
         return Response({"error": "La solicitud no existe o no es de préstamo."}, status=404)

      new_status = request.data.get('status')
      if new_status not in ['approved', 'rejected']:
         return Response({"error": "El estado debe ser 'approved' o 'rejected'."}, status=400)

      book_request.status = new_status
      book_request.save()

      return Response({"message": f"Estado de la solicitud actualizado a '{new_status}'."}, status=200)


class AdminCopiesRequestListView(ListAPIView):
   permission_classes = [permissions.IsAuthenticated]
   serializer_class = BookRequestSerializer

   def get_queryset(self):
      user = self.request.user

      if user.is_admin():
         return BookRequest.objects.filter(status='pending', request_type='copies').order_by('-request_date')
      raise PermissionDenied("Rol no autorizado para esta acción.")
      
class UpdateCopiesRequests(APIView):
   permission_classes = [permissions.IsAuthenticated]

   def patch(self, request, request_id):
      user = request.user

      if not user.is_admin():
         return Response({"error": "Rol no autorizado para esta acción."}, status=403)
      
      try:
         book_request = BookRequest.objects.get(id=request_id, request_type='copies')
      except BookRequest.DoesNotExist:
         return Response({"error": "La solicitud no existe o no es de copias."}, status=404)
      
      new_status = request.data.get('status')
      if new_status not in ['approved','rejected']:
         return Response({"error": "El estado debe ser 'approved' o 'rejected'."}, status=400)
      
      if new_status == 'approved':
         book = book_request.book
         book.available_copies += book_request.copies_requested
         book.save()

      book_request.status = new_status
      book_request.save()

      return Response({"message": f"Estado de la solicitud de copias actualizado a '{new_status}'."}, status=200)
