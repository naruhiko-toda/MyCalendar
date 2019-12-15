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

    roop_schedules = Schedule.objects.filter(
        user_id                 = user_id,
        roop_type__startswith   = "ev"
    )
    for r_s in roop_schedules:
        roop_schedule_dict = model_to_dict(r_s)
        roop_schedule_dict["start_date"]     = str(roop_schedule_dict["start_date"])
        roop_schedule_dict["start_time"]     = str(roop_schedule_dict["start_time"])
        roop_schedule_dict["finish_date"]    = str(roop_schedule_dict["finish_date"])
        roop_schedule_dict["finish_time"]    = str(roop_schedule_dict["finish_time"])
        roop_schedule_dict["created_at"]     = str(roop_schedule_dict["created_at"])
        roop_schedule_dict["category_name"]  = Categories.objects.get(
            id = roop_schedule_dict["category_id"]
        ).category
        schedules.append(roop_schedule_dict)

    schedule_object = Schedule.objects.filter(
        user_id             = user_id,
        start_date__gte     = start_month,
        finish_date__lte    = finish_month,
    )
    for s in schedule_object:
        schedule_dict = model_to_dict(s)
        schedule_dict["start_date"]     = str(schedule_dict["start_date"])
        schedule_dict["start_time"]     = str(schedule_dict["start_time"])
        schedule_dict["finish_date"]    = str(schedule_dict["finish_date"])
        schedule_dict["finish_time"]    = str(schedule_dict["finish_time"])
        schedule_dict["created_at"]     = str(schedule_dict["created_at"])
        schedule_dict["category_name"]  = Categories.objects.get(
            id = schedule_dict["category_id"]
        ).category
        schedules.append(schedule_dict)
    schedules = list(map(json.loads, set(map(json.dumps, schedules))))
    return schedules

@csrf_exempt
def create_schedule(request):
    res = {}
    user_id     = User.objects.get(username = request.POST.get('username')).id
    title       = request.POST.get('title')
    roop_type   = request.POST.get('roop_type')
    start_date  = datetime.datetime.strptime(request.POST.get('start_date'), '%Y/%m/%d')
    start_time  = request.POST.get('start_time')
    finish_date = datetime.datetime.strptime(request.POST.get('finish_date'), '%Y/%m/%d')
    finish_time = request.POST.get('finish_time')
    category    = request.POST.get('category')
    place       = request.POST.get('place')
    description = request.POST.get('description')
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
            title       = title,
            roop_type   = roop_type,
            start_date  = start_date,
            start_time  = start_time,
            finish_date = finish_date,
            finish_time = finish_time,
            category_id = Categories.objects.get(category = category),
            place       = place,
            description = description,
        )
        # Action.objects.create(
        #     user_id     = User.objects.get(username = request.POST.get('username')),
        #     action      = "{\"type\":\"create_schedule\"}"
        # )
        res["message"]="create schedule successed"
    except Exception as e:
        print(e)
        res["message"]=e
    return JsonResponse(res)

@csrf_exempt
def edit_schedule(request):
    res = {}
    schedule_id = request.POST.get('schedule_id')
    user_id     = User.objects.get(username = request.POST.get('username')).id
    title       = request.POST.get('title')
    roop_type   = request.POST.get('roop_type')
    start_date  = datetime.datetime.strptime(request.POST.get('start_date'), '%Y-%m-%d')
    start_time  = request.POST.get('start_time')
    finish_date = datetime.datetime.strptime(request.POST.get('finish_date'), '%Y-%m-%d')
    finish_time = request.POST.get('finish_time')
    category    = request.POST.get('category')
    place       = request.POST.get('place')
    description = request.POST.get('description')
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

        schedule_instance                = Schedule.objects.get(id = schedule_id)
        schedule_instance.title          = title
        schedule_instance.roop_type      = roop_type
        schedule_instance.start_date     = start_date
        schedule_instance.start_time     = start_time
        schedule_instance.finish_date    = finish_date
        schedule_instance.finish_time    = finish_time
        schedule_instance.category_id    = Categories.objects.get(category = category)
        schedule_instance.place          = place
        schedule_instance.description    = description
        schedule_instance.save()

        res["message"]="edit schedule successed"
    except Exception as e:
        print(e)
        res["message"]=e
    return JsonResponse(res)

@csrf_exempt
def delete_schedule(request):
    res = {}
    schedule_id = request.POST.get('schedule_id')
    try:
        schedule_instance = Schedule.objects.get(id = schedule_id)
        schedule_instance.delete()
        res["message"]="edit schedule successed"
    except Exception as e:
        print(e)
        res["message"]=e
    return JsonResponse(res)

@csrf_exempt
def get_calendar(request):
    res={}
    # 送信時点で表示している年、月、日
    display_year    = int(request.POST["display_year"])
    display_month   = int(request.POST["display_month"])
    display_date    = int(request.POST["display_date"])
    if request.POST["type"] == "forward":
        tar_calendar, tar_year, tar_month, tar_date = get_forward_calendar(
            display_year,
            display_month,
            display_date,
            request.POST["format"]
        )
    elif request.POST["type"] == "back":
        tar_calendar,tar_year,tar_month, tar_date = get_before_calendar(
            display_year,
            display_month,
            display_date,
            request.POST["format"]
        )
    else:
        tar_year        = display_year
        tar_month       = display_month
        tar_date        = display_date

        if request.POST["format"] == "day":
            tar_calendar = [display_date]
        else:
            tar_calendar = calendar.monthcalendar(display_year, display_month)

    res["calendar"] = json.dumps({
        "value" : tar_calendar,
        "type"  : request.POST["format"]
    })
    res["display_time"] = json.dumps({
        "display_year"  : str(tar_year),
        "display_month" : str(tar_month),
        "display_date"  : str(tar_date),
    })
    return JsonResponse(res)

# カテゴリをまとめたり消したりする機能をつけたい。
@csrf_exempt
def edit_category(request):
    return True

def get_before_calendar(year, month, date, type):
    if type == "month":
        if month == 1:
            tar_year    = year - 1
            tar_month   = 12
            tar_date    = date
        else:
            tar_year    = year
            tar_month   = month - 1
            tar_date    = date
        return calendar.monthcalendar(tar_year, tar_month), tar_year, tar_month, tar_date
    else:
        if date == 1:
            if month == 1:
                tar_year        = year - 1
                tar_month       = 12
                tar_date        = str(calendar.monthrange(tar_year, tar_month)[1])
            else:
                tar_year        = year
                tar_month       = month - 1
                tar_date        = str(calendar.monthrange(tar_year, tar_month)[1])
        else:
            tar_year            = year
            tar_month           = month
            tar_date            = date - 1
        return [tar_date], tar_year, tar_month, tar_date

def get_forward_calendar(year, month, date, type):
    if type == "month":
        if month == 12:
            tar_year    = year + 1
            tar_month   = 1
            tar_date    = date
        else:
            tar_year    = year
            tar_month   = month + 1
            tar_date    = date
        return calendar.monthcalendar(tar_year, tar_month), tar_year, tar_month, tar_date
    else:
        if month == 12:
            if date == 31:
                tar_year    = year + 1
                tar_month   = 1
                tar_date    = 1
            else:
                tar_year    = year
                tar_month   = month
                tar_date    = date + 1
        else:
            if date == calendar.monthrange(year, month)[1]:
                tar_year    = year
                tar_month   = month + 1
                tar_date    = 1
            else:
                tar_year    = year
                tar_month   = month
                tar_date    = date + 1
        return [tar_date], tar_year, tar_month, tar_date

@csrf_exempt
def sign_up(request):
    form = UserCreateForm(data=request.POST)
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
