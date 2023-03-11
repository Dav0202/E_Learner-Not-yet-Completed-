"""
    API views
"""
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
    """
        Material API View
    """
    serializer_class = MaterialSerializer
    
    def get_queryset(self):
        """
            returns query set of Material
        """
        queryset = Material.objects.all()
        if queryset is not None:
            return queryset
        
    def create(self, request):
        """
            creates material api view and returns a response
        """
        print(request.data)
        serializer = MaterialSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            material = serializer.create(request)
            if material:
                return Response(status=HTTP_201_CREATED)
        return Response(status= HTTP_400_BAD_REQUEST)

class AssignmentViewSet(viewsets.ModelViewSet):
    """
        Assignment Api view
    """
    serializer_class = AssignmentSerializer
    queryset = Assignment.objects.all()

    def create(self, request):
        """
            creates assignment api view
        """
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            assignment = serializer.create(request)
            if assignment:
                return Response(status=HTTP_201_CREATED)
        return Response(status= HTTP_400_BAD_REQUEST)
    
    
class GradedAssignmentListView(ListAPIView):
    """
        Graded assignment List Api view
    """
    serializer_class = GradedAssignmentSerializer

    def get_queryset(self):
        """
            returns queryset based on email
            for Graded assignment(scores)
        """
        queryset = GradedAssignment.objects.all()
        email = self.request.query_params.get('email', None)
        if email is not None:
            queryset = queryset.filter(student__email = email)
        return queryset

class GradedAssignmentCreateView(CreateAPIView):
    """
        Graded assignment Create API view
    """
    serializer_class = GradedAssignmentSerializer
    queryset = GradedAssignment.objects.all()

    def post(self, request):
        """
            Create Api view for Graded assignment
        """
        serializer = GradedAssignmentSerializer(data=request.data)
        serializer.is_valid()
        graded_assignment = serializer.create(request)
        if graded_assignment:
            return Response(status=HTTP_201_CREATED)
        return Response(status= HTTP_400_BAD_REQUEST)
