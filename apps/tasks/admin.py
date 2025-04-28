from django.contrib import admin
from .models.task import Task
from .models.task_status import TaskStatus
from .models.task_category import TaskCategory
from .models.task_attachment import TaskAttachment


class TaskAttachmentInline(admin.TabularInline):
    model = TaskAttachment
    extra = 0
    verbose_name = 'Вложение'
    verbose_name_plural = 'Вложения'
    can_delete = True
    fields = ('name', 'path', 'size', 'uploaded_at')
    readonly_fields = ('size', 'uploaded_at')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'title', 'user_id', 'status_id', 'category_id', 'note_id', 'priority', 'deadline_start', 'deadline_end')
    list_filter = ('status_id', 'category_id', 'note_id', 'priority')
    search_fields = ('title', 'description')
    date_hierarchy = 'deadline_start'
    list_editable = ('priority',)
    inlines = [TaskAttachmentInline]
    exclude = ('attachments',)


@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('status_id', 'name', 'order', 'color', 'user_id')
    list_filter = ('user_id',)
    search_fields = ('name',)
    list_editable = ('order', 'color')
    ordering = ('order', 'name')


@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'name', 'user_id')
    list_filter = ('user_id',)
    search_fields = ('name',)


@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ('attachment_id', 'name', 'size', 'uploaded_at', 'user_id')
    list_filter = ('user_id', 'uploaded_at')
    search_fields = ('name',)
    readonly_fields = ('size', 'uploaded_at')
    date_hierarchy = 'uploaded_at'
