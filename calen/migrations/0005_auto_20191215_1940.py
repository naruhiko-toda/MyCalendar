# Generated by Django 2.2.8 on 2019-12-15 19:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calen', '0004_auto_20191215_1921'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='roop_type',
            field=models.CharField(default='none', max_length=20),
        ),
    ]