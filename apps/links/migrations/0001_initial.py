# Generated by Django 4.2.11 on 2025-04-18 07:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Link',
            fields=[
                ('link_id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID ссылки')),
                ('url', models.URLField(help_text='URL ссылки', max_length=2048)),
                ('is_favorite', models.BooleanField(default=False, help_text='Пометка избранного')),
                ('is_trashed', models.BooleanField(default=False, help_text='Пометка удаления')),
            ],
            options={
                'verbose_name': 'Ссылка',
                'verbose_name_plural': 'Ссылки',
                'ordering': ['link_id'],
            },
        ),
    ]
