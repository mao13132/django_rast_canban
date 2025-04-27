from django.contrib import admin
from .models import Task, TaskStatus, TaskCategory, TaskAttachment


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_id', 'status_id', 'category_id', 'priority', 'deadline_start', 'deadline_end')
    list_filter = ('priority', 'status_id', 'category_id')
    search_fields = ('title', 'description')
    list_editable = ('priority',)


@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id', 'order', 'color')
    list_filter = ('user_id',)
    search_fields = ('name',)
    list_editable = ('order', 'color')
    ordering = ('order', 'name')


@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id')
    list_filter = ('user_id',)
    search_fields = ('name',)


@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'name', 'size')
    search_fields = ('name',)
