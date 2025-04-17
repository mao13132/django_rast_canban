from django.contrib import admin
from .models import File, Folder

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'folder', 'size', 'is_favorite', 'is_trashed')
    list_filter = ('is_favorite', 'is_trashed')
    search_fields = ('name',)
    date_hierarchy = 'created_at'

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'parent', 'is_favorite', 'is_trashed')
    list_filter = ('is_favorite', 'is_trashed')
    search_fields = ('name',)
    date_hierarchy = 'created_at' 