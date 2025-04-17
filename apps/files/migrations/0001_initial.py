# Generated by Django 4.2.11 on 2025-04-17 14:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('file_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID файла')),
                ('name', models.CharField(help_text='Название файла', max_length=255)),
                ('file', models.FileField(help_text='Файл', upload_to='files/')),
                ('size', models.BigIntegerField(default=0, help_text='Размер файла в байтах')),
                ('is_favorite', models.BooleanField(default=False, help_text='Пометка избранного')),
                ('is_trashed', models.BooleanField(default=False, help_text='Пометка удаления')),
            ],
            options={
                'verbose_name': 'Файл',
                'verbose_name_plural': 'Файлы',
                'ordering': ['file_id'],
            },
        ),
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('folder_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID папки')),
                ('name', models.CharField(help_text='Название папки', max_length=255)),
                ('is_favorite', models.BooleanField(default=False, help_text='Пометка избранного')),
                ('is_trashed', models.BooleanField(default=False, help_text='Пометка удаления')),
                ('size', models.BigIntegerField(default=0, help_text='Размер папки в байтах')),
                ('parent_id', models.ForeignKey(blank=True, help_text='Родительская папка', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='files.folder')),
            ],
            options={
                'verbose_name': 'Папка',
                'verbose_name_plural': 'Папки',
                'ordering': ['folder_id'],
            },
        ),
    ]
