from django.contrib import admin

print("Настройки админки загружаются...")

# Изменяем заголовок админки
admin.site.site_header = 'Администрирование Канбан-доски'
admin.site.site_title = 'Канбан-доска'
admin.site.index_title = 'Панель управления'

print("Настройки админки применены!") 