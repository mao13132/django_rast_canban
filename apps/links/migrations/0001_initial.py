# Generated by Django 4.2.11 on 2025-04-17 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(help_text='URL ссылки', max_length=2048)),
                ('title', models.CharField(blank=True, help_text='Название ссылки', max_length=255)),
                ('description', models.TextField(blank=True, help_text='Описание ссылки')),
                ('is_favorite', models.BooleanField(default=False, help_text='Пометка избранного')),
                ('is_trashed', models.BooleanField(default=False, help_text='Пометка удаления')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Дата обновления')),
            ],
            options={
                'verbose_name': 'Ссылка',
                'verbose_name_plural': 'Ссылки',
                'ordering': ['-updated_at'],
            },
        ),
    ]
