# Generated by Django 4.1.6 on 2023-02-14 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_alter_assignment_educator"),
    ]

    operations = [
        migrations.AlterField(
            model_name="question",
            name="question",
            field=models.CharField(max_length=500),
        ),
    ]
