from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import FolderViewSet, FileViewSet

router = DefaultRouter()
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'files', FileViewSet, basename='file')

urlpatterns = router.urls 