from django.contrib import admin
from .models import Task, TaskStatus, TaskCategory, TaskAttachment

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_id', 'status_id', 'category_id', 'priority', 'deadline')
    list_filter = ('priority', 'is_favorite', 'is_trashed')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id')
    list_filter = ('user_id',)
    search_fields = ('name',)

@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id')
    list_filter = ('user_id',)
    search_fields = ('name',)

@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'name', 'size')
    search_fields = ('name',) 
    