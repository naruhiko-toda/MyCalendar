from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


GENDER_CHOICES = (
(1, '男性'),
(2, '女性'),
)
SLEEP_FEEDBACK = (
(1, 'Excellent'),
(2, 'Great'),
(3, 'not bad'),
(4, 'sleepy'),
(5, 'teribble')
)

class User(models.Model):
    name = models.CharField(max_length=20)
    age = models.IntegerField()
    gender = models.IntegerField(choices=GENDER_CHOICES)
    email = models.EmailField(max_length=255, unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.name

class Action(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    action = JSONField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

class Categories(models.Model):
    category = models.CharField(max_length=50)
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

class Schedule(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    category_id = models.ForeignKey(Categories, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    start_plan = models.DateTimeField()
    finish_plan = models.DateTimeField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

class Condition(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    condition = models.IntegerField(choices=SLEEP_FEEDBACK)
