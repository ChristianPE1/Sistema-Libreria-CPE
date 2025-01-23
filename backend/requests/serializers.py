from rest_framework import serializers
from .models import BookRequest

class BookRequestSerializer(serializers.ModelSerializer):
   class Meta:
      model = BookRequest
      fields = ['id','request_date','status','request_type','return_date','copies_requested','book','user']
      depth = 1