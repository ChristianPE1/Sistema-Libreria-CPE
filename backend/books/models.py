from django.db import models
import uuid

class Book(models.Model):
      id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
      title = models.CharField(max_length=100)
      author = models.CharField(max_length=100)
      genre = models.CharField(max_length=100)
      year = models.IntegerField()
      description = models.TextField(blank=True, null=True)
      image = models.URLField(blank=True, null=True)
      available_copies = models.PositiveIntegerField(default=0)

      def __str__(self):
            return self.title
      

