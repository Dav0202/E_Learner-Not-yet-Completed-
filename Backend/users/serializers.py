from rest_framework import serializers
from allauth.account.adapter import get_adapter
from rest_auth.registration.serializers import RegisterSerializer
from .models import User, Student, Educator

from .models import User

class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"
        
class EducatorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Educator
        fields = "__all__"
        

class RegisterSerializer(RegisterSerializer):

    email = serializers.EmailField()
    first_name = serializers.CharField(required=True,write_only=True)
    last_name = serializers.CharField(required=True,write_only=True)
    username = serializers.CharField(required=True,write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    is_student = serializers.BooleanField(required=True,)
    is_educator = serializers.BooleanField(required=True,)
    
    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                ("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),

            'is_student': self.validated_data.get('is_student', ''),
            'is_educator': self.validated_data.get('is_educator', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user.is_student = self.cleaned_data.get('is_student')
        user.is_educator  = self.cleaned_data.get('is_educator')
        user.save()
        adapter.save_user(request, user, self)
        return user

