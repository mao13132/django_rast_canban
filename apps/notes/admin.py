from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_id', 'is_pinned', 'is_archived')
    list_filter = ('is_pinned', 'is_archived')
    search_fields = ('title', 'content')
