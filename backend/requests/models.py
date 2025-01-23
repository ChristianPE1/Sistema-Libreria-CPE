from django.db import models
import uuid
from users.models import CustomUser
from books.models import Book

class BookRequest(models.Model):

      REQUEST_TYPE_CHOICES = [
            ('loan', 'Loan'),
            ('copies', 'Request for more copies')
      ]

      STATUS_CHOICES = [
            ('Pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected')
      ]

      id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
      user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
      book = models.ForeignKey(Book, on_delete=models.CASCADE)
      request_date = models.DateTimeField(auto_now_add=True)
      status = models.CharField(max_length=100,choices=STATUS_CHOICES,default='Pending')
      request_type = models.CharField(max_length=100,choices=REQUEST_TYPE_CHOICES,default='loan')
      return_date = models.DateTimeField(blank=True, null=True)
      copies_requested = models.PositiveIntegerField(null=True, blank=True)

      def __str__(self):
            return f"{self.user} - {self.book} - {self.request_date}"
      
      class Meta:
            ordering = ['-request_date']