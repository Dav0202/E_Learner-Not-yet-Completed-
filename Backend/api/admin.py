"""
    Register models for admin page
"""
from django.contrib import admin
from api.models import GradedAssignment, Assignment, Question, Choice, Material
# Register your models here.

admin.site.register(GradedAssignment)
admin.site.register(Assignment)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Material)
