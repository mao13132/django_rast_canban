# Generated by Django 4.2.11 on 2025-04-17 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Заголовок заметки', max_length=255)),
                ('content', models.TextField(help_text='Содержимое заметки')),
                ('is_pinned', models.BooleanField(default=False, help_text='Закреплена ли заметка')),
                ('is_archived', models.BooleanField(default=False, help_text='Архивирована ли заметка')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Дата обновления')),
            ],
            options={
                'verbose_name': 'Заметка',
                'verbose_name_plural': 'Заметки',
                'ordering': ['-updated_at'],
            },
        ),
    ]
