from django.contrib import admin
from .models import Link

@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ('url', 'user_id', 'is_favorite', 'is_trashed')
    list_filter = ('is_favorite', 'is_trashed', 'user_id')
    search_fields = ('url',) 