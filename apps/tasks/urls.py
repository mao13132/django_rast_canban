from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet,
    TaskStatusViewSet,
    TaskCategoryViewSet,
    TaskAttachmentViewSet
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'statuses', TaskStatusViewSet, basename='task-status')
router.register(r'categories', TaskCategoryViewSet, basename='task-category')
router.register(r'attachments', TaskAttachmentViewSet, basename='task-attachment')

urlpatterns = router.urls 