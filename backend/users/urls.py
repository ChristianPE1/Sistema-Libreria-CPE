from django.urls import path
from .views import CustomUserCreate, CustomUserLogin, CustomUserLogout

urlpatterns = [
      path('register/', CustomUserCreate.as_view(), name="register"),
      path('login/', CustomUserLogin.as_view(), name="login"),
      path('logout/', CustomUserLogout.as_view(), name="logout"),
]



