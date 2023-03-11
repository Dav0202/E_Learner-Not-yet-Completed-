"""
    Create models for Database
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from django.core.validators import MaxLengthValidator
import uuid
# Create your models here.

class Assignment(models.Model):
    """
        Class that defines assignment model
    """
    #Subjects
    BASIC_SCIENCE = 'BSC'
    ENGLISH = 'ENG'
    MATHEMATICS = 'MAT'
    GEOGRAPHY = 'GEO'
    HISTORY = 'HSY'

    #Class
    PRIMARY1 = 'Pry 1'
    PRIMARY2 = 'Pry 2'
    PRIMARY3 = 'Pry 3'
    PRIMARY4 = 'Pry 4'
    PRIMARY5 = 'Pry 5'
    PRIMARY6 = 'Pry 6'
    
    SUBJECT_CHOICES = [
        (BASIC_SCIENCE, 'Basic science'),
        (ENGLISH, 'English'),
        (MATHEMATICS, 'Mathematics'),
        (GEOGRAPHY, 'Geography'),
        (HISTORY, 'History'),
    ]
    
    CLASS = [
        (PRIMARY1, 'Primary 1'),
        (PRIMARY2, 'Primary 2'),
        (PRIMARY3, 'Primary 3'),
        (PRIMARY4, 'Primary 4'),
        (PRIMARY5, 'Primary 5'),
        (PRIMARY6, 'Primary 6'),
    ]
        
    title = models.CharField(max_length = 100)
    educator = models.ForeignKey(User, limit_choices_to={'is_educator': True}, on_delete=models.CASCADE)
    subject = models.CharField(
        choices=SUBJECT_CHOICES,
        max_length = 20
    )
    classes = models.CharField(
        choices=CLASS,
        max_length = 15
    )

    def __str__(self):
        return self.title


class GradedAssignment(models.Model):
    """
        Class that defines Graded assignment or score model
    """
    student = models.ForeignKey(User, limit_choices_to={'is_student': True}, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.SET_NULL,
    blank=True, null=True)
    grade = models.IntegerField(validators=[MaxLengthValidator(200)])

    def __str__(self):
        return self.student.username


class Choice(models.Model):
    """
        Class that defines choice model

    """
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class Question(models.Model):
    """
        Class that defines question model

    """
    question = models.CharField(max_length=500)
    choices = models.ManyToManyField(Choice)
    answer = models.ForeignKey(
        Choice, on_delete=models.CASCADE, related_name='answer',blank=True, null=True
    )
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='questions',blank=True, null=True)
    order = models.SmallIntegerField()

    def __str__(self):
        return self.question


class Material(models.Model):
    """
        Class that defines material upload model

    """
    uploader = models.ForeignKey(User, limit_choices_to={'is_educator': True}, on_delete=models.CASCADE)
    description = models.CharField(max_length=255, blank=True)
    material = models.FileField(upload_to=f"material/%Y/%m/%d/{uuid.uuid4()}")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.description