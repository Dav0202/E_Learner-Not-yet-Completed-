# Generated by Django 3.2.7 on 2023-02-12 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_educator_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='bio',
            field=models.TextField(default='I am a student Learning', max_length=30),
        ),
    ]
