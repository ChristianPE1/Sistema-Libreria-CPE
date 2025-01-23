from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer, CustomUserLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import AllowAny

class CustomUserCreate(APIView):
   permission_classes = [AllowAny]

   def post(self, request):
      serializer = CustomUserSerializer(data=request.data)
      if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserLogin(APIView):
   permission_classes = [AllowAny]

   def post(self, request):
      serializer = CustomUserLoginSerializer(data=request.data)
      if serializer.is_valid():
         return Response(serializer.validated_data, status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
class CustomUserLogout(APIView):
   def post(self, request):
      try:
         refresh_token = request.data["refresh"]
         token = RefreshToken(refresh_token)
         token.blacklist()
         return Response(status=status.HTTP_205_RESET_CONTENT)
      except TokenError:
         return Response(status=status.HTTP_400_BAD_REQUEST)