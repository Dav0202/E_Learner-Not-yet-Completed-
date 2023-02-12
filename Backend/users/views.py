from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from .models import User, Educator, Student
from .serializers import EducatorSerializer, StudentSerializer
# Create your views here.

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    
class EducatorViewSet(viewsets.ModelViewSet):
    serializer_class = EducatorSerializer
    queryset = Educator.objects.all()