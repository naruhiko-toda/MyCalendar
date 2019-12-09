from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = "index"),
    path('calen/get_calendar', views.get_calendar)
]
