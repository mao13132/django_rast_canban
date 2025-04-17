from django.contrib import admin
from .models import File, Folder


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id', 'folder_id', 'size', 'is_favorite', 'is_trashed')
    list_filter = ('is_favorite', 'is_trashed')
    search_fields = ('name',)


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id', 'parent_id', 'is_favorite', 'is_trashed')
    list_filter = ('is_favorite', 'is_trashed')
    search_fields = ('name',)
