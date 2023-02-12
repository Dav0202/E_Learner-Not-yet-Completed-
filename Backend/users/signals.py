from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Student, Educator, User
        
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    sender: sender model from which you'll receive signal from
    instance: model instance(record) which is saved (it will be instance of sender model)
    """
    if created:
        if instance.is_student:
            Student.objects.create(user=instance) # you have correctly passed instance to foreign key and you just need to check condition for the same        

        else:
            Educator.objects.create(user=instance)

