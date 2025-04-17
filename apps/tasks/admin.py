from django.contrib import admin
from .models import Task, TaskStatus, TaskCategory, TaskAttachment

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'category', 'priority', 'deadline')
    list_filter = ('status', 'category', 'priority')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'order')
    list_filter = ('user',)
    search_fields = ('name',)

@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'color')
    list_filter = ('user',)
    search_fields = ('name',)

@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ('task', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('task__title',) 