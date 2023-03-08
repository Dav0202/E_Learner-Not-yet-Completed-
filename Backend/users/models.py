from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    
    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.is_student  = False 
        user.is_educator = False
        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    is_staff = models.BooleanField(
        default=False,
        help_text=("Designates whether the user can log into this admin site."),
    )
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(
        default=True,
        help_text=(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    username = models.CharField(max_length=100, unique=True, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    last_name = models.CharField(max_length=100)
    is_student = models.BooleanField()
    is_educator = models.BooleanField()
    date_joined=models.DateTimeField(verbose_name='datejoined',auto_now_add=True)
    last_login= models.DateTimeField(verbose_name='last login', auto_now=True)
    
    def __str__(self):
        return self.email
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=30, default="I am a student Learning")
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.user.username
    
class Educator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='edu-pictures/', default="C:\\Users\\lenovo\\Desktop\\E_Learner\\Backend\\media\\edu-pictures\\default_image.png")
    current_institution = models.CharField(max_length=300)
    
#   def save(self):
#       super().save()
#   
#       img = Image.open(self.profile_image.path)
#   
#       if img.height > 300 or img.width > 300:
#           output_size = (300, 300)
#           img.thumbnail(output_size)
#           img.save(self.profile_image.path)

    def __str__(self):
        return self.user.username
