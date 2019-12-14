import os
import json
import calendar
import datetime

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http.response import JsonResponse
from django.core import serializers
from django.views.generic import CreateView
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User

from .forms import UserCreateForm, LoginForm
from .models import Action, Schedule, Condition, Categories

calendar.setfirstweekday(6)

def index(request):
    res = {}

    if request.GET.get('username'):
        res["user"] = json.dumps({
            "login"     : True,
            "username"  : str(request.GET.get('username'))
        })
    else:
        res["user"] = json.dumps({
            "login"     : False,
            "username"  : None
        })

    now = datetime.datetime.now()
    #デフォルトで今月の月間カレンダーを表示する
    default_calendar = calendar.monthcalendar(now.year, now.month)
    res["calendar"] = json.dumps({
        "value" : default_calendar,
        "type"  : "month"
    })

    res["display_time"] = json.dumps({
        "display_date"  : str(now.day),
        "display_year"  : str(now.year),
        "display_month" : str(now.month),
    })

    res["sign_in_form"] = LoginForm()
    res["sign_up_form"] = UserCreateForm()

    caregories = []
    print(Categories.objects.all())
    print(res)
    return render(request, "calen/index.html", res)

@csrf_exempt
def create_shedule(request):
    res = {}
    user_id     = User.objects.get(username = request.POST.get('user')).id
    category    = request.POST.get('category')
    title       = request.POST.get('title')
    description = request.POST.get('description')
    start_time  = request.POST.get('start_time')
    finish_time = request.POST.get('finish_time')

    print(Categories.objects.filter(
        category = category,
        user_id  = user_id
    ))
    if Categories.objects.filter(
        category = category,
        user_id  = user_id
    ):
        Categories.objects.create(category = category)

    Schedule.objects.create(
        user_id     = user_id,
        category    = category,
        title       = title,
        description = description,
        start_time  = start_time,
        finish_time = finish_time
    )
    return JsonResponse(res)

@csrf_exempt
def get_calendar(request):
    res={}
    display_year    = int(request.POST["display_year"])
    display_month   = int(request.POST["display_month"])
    display_date    = int(request.POST["display_date"])
    if request.POST["type"]=="forward":
        tar_calendar,tar_year,tar_month = get_forward_calendar(display_year, display_month)
    else:
        tar_calendar,tar_year,tar_month = get_before_calendar(display_year, display_month)
    res["calendar"] = json.dumps({
        "value" : tar_calendar,
        "type"  : "month"
    })
    res["display_time"] = json.dumps({
        "display_date"  : str(display_date),
        "display_year"  : str(tar_year),
        "display_month" : str(tar_month),
    })
    return JsonResponse(res)

def get_before_calendar(year, month):
    if month == 1:
        tar_year    = year - 1
        tar_month   = 12
    else:
        tar_year    = year
        tar_month   = month - 1
    return calendar.monthcalendar(tar_year, tar_month),tar_year,tar_month

def get_forward_calendar(year, month):
    if month == 12:
        tar_year    = year + 1
        tar_month   = 1
    else:
        tar_year    = year
        tar_month   = month + 1
    return calendar.monthcalendar(tar_year, tar_month),tar_year,tar_month

@csrf_exempt
def sign_up(request):
    form = UserCreateForm(data=request.POST)
    print(request.POST)
    res = {}
    if form.is_valid():
        form.save()
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = authenticate(username=username, password=password)
        login(request, user)
        user = str(user)
        res["user"] = user
        res["message"] = "sign up successed!!!"
        return JsonResponse(res)
    res["message"] = "sign up failed!!!!"
    return JsonResponse(res)

@csrf_exempt
def sign_in(request):
    form = LoginForm(data=request.POST)
    res = {}
    if form.is_valid():
        username = form.cleaned_data.get('username')
        user = User.objects.get(username=username)
        login(request, user)
        user = str(user)
        res["user"] = user
        res["message"] = "sing in successed!!!!!"
        return JsonResponse(res)
    res["message"] = "sign in failed!!!!!!"
    return JsonResponse(res)
