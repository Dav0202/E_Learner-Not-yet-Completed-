from rest_framework import serializers
from allauth.account.adapter import get_adapter
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Student, Educator
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken

class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['student'] = user.is_student
        token['educator'] = user.is_educator
        # ...
        return token
    
    def finalize_response(self, request, response, *args, **kwargs):
      if response.data.get('refresh'):
          cookie_max_age = 300 # 14 days
          response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True )
          del response.data['refresh']
      return super().finalize_response(request, response, *args, **kwargs)

class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class StudentSerializer(serializers.ModelSerializer):
    user = StringSerializer(many=False)
    class Meta:
        model = Student
        fields = ('__all__')
        
class EducatorSerializer(serializers.ModelSerializer):
    user = StringSerializer(many=False)
    class Meta:
        model = Educator
        fields = ('__all__')
        

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

