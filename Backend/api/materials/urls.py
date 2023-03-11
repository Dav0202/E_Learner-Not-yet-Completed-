"""
    Url for uploading materials and downloading materials
"""
from api.views import MaterialView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'', MaterialView, basename='assignments'
)

urlpatterns = router.urls
