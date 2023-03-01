from .serializers import AssignmentSerializer, GradedAssignmentSerializer, MaterialSerializer
from .models import Assignment, GradedAssignment, Question, Material
# Create your views here.
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from rest_framework.generics import ListAPIView, CreateAPIView, ListCreateAPIView

class MaterialView(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    
    def get_queryset(self):
        queryset = Material.objects.all()
        if queryset is not None:
            return queryset
        
    def create(self, request):
        print(request.data)
        serializer = MaterialSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            material = serializer.create(request)
            if material:
                return Response(status=HTTP_201_CREATED)
            #else:
        return Response(status= HTTP_400_BAD_REQUEST)

class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    queryset = Assignment.objects.all()

    def create(self, request):
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            assignment = serializer.create(request)
            if assignment:
                return Response(status=HTTP_201_CREATED)
            #else:
        return Response(status= HTTP_400_BAD_REQUEST)
    
    
class GradedAssignmentListView(ListAPIView):
    serializer_class = GradedAssignmentSerializer

    def get_queryset(self):
        queryset = GradedAssignment.objects.all()
        email = self.request.query_params.get('email', None)
        if email is not None:
            queryset = queryset.filter(student__email = email)
        return queryset

class GradedAssignmentCreateView(CreateAPIView):
    serializer_class = GradedAssignmentSerializer
    queryset = GradedAssignment.objects.all()

    def post(self, request):
        serializer = GradedAssignmentSerializer(data=request.data)
        serializer.is_valid()
        graded_assignment = serializer.create(request)
        if graded_assignment:
            return Response(status=HTTP_201_CREATED)
            #else:
        return Response(status= HTTP_400_BAD_REQUEST)
