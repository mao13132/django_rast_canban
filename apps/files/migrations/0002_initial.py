# Generated by Django 4.2.11 on 2025-04-18 07:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('files', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='user_id',
            field=models.ForeignKey(help_text='Владелец папки', on_delete=django.db.models.deletion.CASCADE, related_name='folders', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='file',
            name='folder_id',
            field=models.ForeignKey(help_text='Папка файла', on_delete=django.db.models.deletion.CASCADE, related_name='files', to='files.folder'),
        ),
        migrations.AddField(
            model_name='file',
            name='user_id',
            field=models.ForeignKey(help_text='Владелец файла', on_delete=django.db.models.deletion.CASCADE, related_name='files', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='folder',
            unique_together={('name', 'parent_id', 'user_id')},
        ),
        migrations.AlterUniqueTogether(
            name='file',
            unique_together={('name', 'folder_id')},
        ),
    ]
