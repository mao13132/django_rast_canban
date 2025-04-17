from django.contrib import admin
from .models import Link

@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ('url', 'is_favorite', 'is_trashed')
    list_filter = ('is_favorite', 'is_trashed')
    search_fields = ('url',) 