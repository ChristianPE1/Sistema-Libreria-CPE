from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_prometheus import exports


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/',include('books.urls')),
    path('api/',include('requests.urls')),
    path('metrics/', exports.ExportToDjangoView, name='prometheus-django-metrics'),
]
