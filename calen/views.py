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
from django.forms.models import model_to_dict

from .forms import UserCreateForm, LoginForm
from .models import Action, Schedule, Condition, Categories

calendar.setfirstweekday(6)

def index(request):
    res = {}

    now = datetime.datetime.now()
    #デフォルトで今月の月間カレンダーを表示する
    default_calendar = calendar.monthcalendar(now.year, now.month)
    res["calendar"] = json.dumps({
    "value" : default_calendar,
    "type"  : "month"
    })

    res["display_time"] = json.dumps({
    "display_year"  : str(now.year),
    "display_month" : str(now.month),
    "display_date"  : str(now.day),
    })

    # category候補を選択するため
    categories = []
    # 予定をカレンダーに反映するため
    schedules = []

    if request.GET.get('username'):
        res["user"] = json.dumps({
            "login"     : True,
            "username"  : str(request.GET.get('username'))
        })
        user_id = User.objects.get(username = str(request.GET.get('username'))).id
        category_object = Categories.objects.filter(user_id = user_id)
        for c in category_object:
            categories.append(c.category)

        schedules = get_schedules(user_id, now.year, now.month, now.date)
    else:
        res["user"] = json.dumps({
            "login"     : False,
            "username"  : None
        })

    res["categories"] = str(categories)
    res["schedules"]  = str(schedules)


    res["sign_in_form"] = LoginForm()
    res["sign_up_form"] = UserCreateForm()

    print(res)
    return render(request, "calen/index.html", res)

def get_schedules(user_id, year, month, date):
    schedules = []
    start_month = datetime.date(year, month, 1)
    if month == 12:
        finish_month = datetime.date(year+1, 1, 1)
    else:
        finish_month = datetime.date(year, month+1, 1)
    schedule_object = Schedule.objects.filter(
        user_id             = user_id,
        start_date__gte     = start_month,
        finish_date__lte    = finish_month,
    )
    for s in schedule_object:
        schedule_dict = model_to_dict(s)
        schedule_dict["start_date"] = str(schedule_dict["start_date"])
        schedule_dict["start_time"] = str(schedule_dict["start_time"])
        schedule_dict["finish_date"] = str(schedule_dict["finish_date"])
        schedule_dict["finish_time"] = str(schedule_dict["finish_time"])
        schedule_dict["created_at"] = str(schedule_dict["created_at"])
        schedules.append(schedule_dict)
    return schedules

@csrf_exempt
def create_schedule(request):
    res = {}
    user_id     = User.objects.get(username = request.POST.get('username')).id
    category    = request.POST.get('category')
    title       = request.POST.get('title')
    description = request.POST.get('description')
    start_date  = datetime.datetime.strptime(request.POST.get('start_date'), '%Y/%m/%d')
    start_time  = request.POST.get('start_time')
    finish_date = datetime.datetime.strptime(request.POST.get('finish_date'), '%Y/%m/%d')
    finish_time = request.POST.get('finish_time')
    try:
        if Categories.objects.filter(
            category = category,
            user_id  = user_id
        ):
            print()
        else:
            Categories.objects.create(
                category = category,
                user_id  = User.objects.get(username = request.POST.get('username'))
            )
        Schedule.objects.create(
            user_id     = User.objects.get(username = request.POST.get('username')),
            category_id = Categories.objects.get(category = category),
            title       = title,
            description = description,
            start_date  = start_date,
            start_time  = start_time,
            finish_date = finish_date,
            finish_time = finish_time
        )
        res["message"]="create schedule successed"
    except Exception as e:
        print(e)
        res["message"]=e
    return JsonResponse(res)

@csrf_exempt
def get_calendar(request):
    res={}
    display_year    = int(request.POST["display_year"])
    display_month   = int(request.POST["display_month"])
    display_date    = int(request.POST["display_date"])
    if request.POST["type"] == "forward":
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

# カテゴリをまとめたり消したりする機能をつけたい。
@csrf_exempt
def edit_category(request):
    return True

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
