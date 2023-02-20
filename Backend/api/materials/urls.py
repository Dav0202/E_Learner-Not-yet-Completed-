from api.views import MaterialView
from django.urls import path

urlpatterns = [
    path("", MaterialView.as_view()),
]