from .serializers import AssignmentSerializer, GradedAssignmentSerializer
from .models import Assignment, GradedAssignment, Question
# Create your views here.
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from rest_framework.generics import ListAPIView, CreateAPIView

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
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = queryset.filter(student__username = username)
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
