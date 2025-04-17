# Generated by Django 4.2.11 on 2025-04-17 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('task_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID задачи')),
                ('title', models.CharField(help_text='Название задачи', max_length=255)),
                ('description', models.TextField(blank=True, help_text='Описание задачи')),
                ('priority', models.CharField(choices=[('low', 'Низкий'), ('medium', 'Средний'), ('high', 'Высокий')], default='medium', help_text='Приоритет задачи', max_length=10)),
                ('deadline', models.DateTimeField(blank=True, help_text='Срок выполнения', null=True)),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачи',
                'ordering': ['task_id'],
            },
        ),
        migrations.CreateModel(
            name='TaskAttachment',
            fields=[
                ('attachment_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID вложения')),
                ('name', models.CharField(help_text='Название вложения', max_length=100)),
                ('path', models.FileField(upload_to='task_attachments/', verbose_name='Файл')),
                ('size', models.BigIntegerField(default=0, help_text='Размер вложения в байтах')),
            ],
            options={
                'verbose_name': 'Вложение к задаче',
                'verbose_name_plural': 'Вложения к задачам',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='TaskCategory',
            fields=[
                ('category_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID категории')),
                ('name', models.CharField(help_text='Название категории', max_length=100)),
            ],
            options={
                'verbose_name': 'Категория задачи',
                'verbose_name_plural': 'Категории задач',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='TaskStatus',
            fields=[
                ('status_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID статуса')),
                ('name', models.CharField(help_text='Название статуса', max_length=100)),
            ],
            options={
                'verbose_name': 'Статус задачи',
                'verbose_name_plural': 'Статусы задач',
                'ordering': ['name'],
            },
        ),
    ]
