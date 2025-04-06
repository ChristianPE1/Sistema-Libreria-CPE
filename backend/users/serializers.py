from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
   @classmethod
   def get_token(cls, user):
      token = super().get_token(user)
      token['role'] = user.role
      return token

class CustomUserSerializer(serializers.ModelSerializer):
   class Meta:
      model = CustomUser
      fields = ['id', 'username','password', 'email', 'age', 'role']
      extra_kwargs = {
         'password': {'write_only': True}
      }
   def create(self, validated_data):
      password = validated_data.pop('password', None)
      user = CustomUser(**validated_data)
      if password is not None:
         user.set_password(password)
      user.save()
      return user

class CustomUserLoginSerializer(serializers.Serializer):
   email = serializers.EmailField()
   password = serializers.CharField(max_length=68, write_only=True)
   tokens = serializers.SerializerMethodField()


   def get_tokens(self,user):
      #refresh = RefreshToken.for_user(user)
      token = CustomTokenObtainPairSerializer.get_token(user)
      return {
         'refresh': str(token),
         'access': str(token.access_token)
      }
      

   def validate(self, attrs):
      email = attrs.get('email', '')
      password = attrs.get('password', '')
      user = CustomUser.objects.filter(email=email).first()

      if user is None:
         raise serializers.ValidationError('User not found')
      if not user.check_password(password):
         raise serializers.ValidationError('Incorrect password')

      data = {
         'user': {
               'id': user.id,
               'username': user.username,
               'email': user.email,
               'role': user.role,
         },
         'tokens': self.get_tokens(user),
      }


      return data