# Generated by Django 2.2.8 on 2019-12-15 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calen', '0003_auto_20191215_1911'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule',
            name='roop_flag',
        ),
        migrations.AddField(
            model_name='schedule',
            name='roop_type',
            field=models.CharField(default=0, max_length=20),
            preserve_default=False,
        ),
    ]