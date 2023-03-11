"""
    Urls for Profile Creation
"""
from .views import StudentViewSet, EducatorViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'student', StudentViewSet, basename='student',
    
)
router.register(
    r'educator', EducatorViewSet, basename='educator'
)
urlpatterns = router.urls