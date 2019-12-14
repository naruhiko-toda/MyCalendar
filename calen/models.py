import datetime
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User

SLEEP_FEEDBACK = (
(1, 'Excellent'),
(2, 'Great'),
(3, 'not bad'),
(4, 'sleepy'),
(5, 'teribble')
)

class Action(models.Model):
    user_id     = models.ForeignKey(User, on_delete = models.CASCADE)
    action      = JSONField()
    created_at  = models.DateTimeField(default = timezone.now)

class Categories(models.Model):
    user_id     = models.ForeignKey(User, on_delete = models.CASCADE)
    category    = models.CharField(max_length = 50, unique = True)
    created_at  = models.DateTimeField(default = timezone.now)

class Schedule(models.Model):
    user_id     = models.ForeignKey(User, on_delete = models.CASCADE)
    category_id = models.ForeignKey(Categories, on_delete = models.CASCADE)
    title       = models.CharField('概要',max_length = 20)
    description = models.TextField('詳細な説明', blank = True)
    start_time  = models.TimeField('開始時間', default = datetime.time(7, 0, 0))
    finish_time = models.TimeField('終了時間', default = datetime.time(7, 0, 0))
    created_at  = models.DateTimeField(default = timezone.now)

class Condition(models.Model):
    user_id     = models.ForeignKey(User, on_delete = models.CASCADE)
    date        = models.DateTimeField()
    condition   = models.IntegerField(choices = SLEEP_FEEDBACK)
    created_at  = models.DateTimeField(default = timezone.now)
