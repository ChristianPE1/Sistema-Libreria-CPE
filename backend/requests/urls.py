from django.urls import path
from .views import CreateBookRequest, BiblioRequestView, UserRequestView, AdminCopiesRequestListView, CreateCopiesRequest,UpdateLoanRequestStatus, UpdateCopiesRequests

urlpatterns = [
      path('books/<uuid:book_id>/request/', CreateBookRequest.as_view(), name='create_-equest'),
      path('books/<uuid:book_id>/request-copies/', CreateCopiesRequest.as_view(), name='create-copies-request'),
      path('requests/<uuid:request_id>/update/', UpdateLoanRequestStatus.as_view(), name='update-request-status'),
      path('requests/', BiblioRequestView.as_view(), name='biblio-requests'),
      path('my-requests/', UserRequestView.as_view(), name='user-requests'),
      path('requests-copies/', AdminCopiesRequestListView.as_view(), name='admin-copies-requests'),
      path('requests-copies/<uuid:request_id>/update/', UpdateCopiesRequests.as_view(),name='update-copies-requests'),
]