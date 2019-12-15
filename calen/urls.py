from django.urls import path
from . import views

urlpatterns = [
    path(''                         , views.index, name = "index"),
    path('calen/get_calendar'       , views.get_calendar),
    path('calen/sign_up'            , views.sign_up),
    path('calen/sign_in'            , views.sign_in),
    path('calen/create_schedule'    , views.create_schedule),
    path('calen/edit_schedule'      , views.edit_schedule),
    path('calen/delete_schedule'      , views.delete_schedule),
]
