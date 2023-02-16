from api.views import GradedAssignmentListView, GradedAssignmentCreateView
from django.urls import path

urlpatterns = [
    path("", GradedAssignmentListView.as_view()),
    path("create/", GradedAssignmentCreateView.as_view())
]
