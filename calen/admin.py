from django.contrib import admin
from .models import User, Action, Schedule, Condition, Categories

admin.site.register(User)
admin.site.register(Action)
admin.site.register(Schedule)
admin.site.register(Condition)
admin.site.register(Categories)
