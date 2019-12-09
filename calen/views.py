import os
import json
import calendar
import datetime

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http.response import JsonResponse

calendar.setfirstweekday(6)

def index(request):
    res = {}
    now = datetime.datetime.now()
    #デフォルトで今月の月間カレンダーを表示する
    default_calendar = calendar.monthcalendar(now.year, now.month)
    res["calendar"] = json.dumps({
        "value": default_calendar,
        "type": "month"
    })
    res["this_time"] = json.dumps({
        "this_date":str(now.day),
        "this_year":str(now.year),
        "this_month":str(now.month),
    })
    print(res)
    return render(request, "calen/index.html", res)

@csrf_exempt
def get_calendar(request):
    res={}
    this_year = int(request.POST["thisYear"])
    this_month = int(request.POST["thisMonth"])
    this_date = int(request.POST["thisDate"])
    if request.POST["type"]=="forward":
        tar_calendar,tar_year,tar_month = get_forward_calendar(this_year, this_month)
    else:
        tar_calendar,tar_year,tar_month = get_before_calendar(this_year, this_month)
    res["calendar"] = json.dumps({
        "value": tar_calendar,
        "type": "month"
    })
    res["this_time"] = json.dumps({
        "this_date":str(this_date),
        "this_year":str(tar_year),
        "this_month":str(tar_month),
    })
    res["status"]=200
    print(res)
    return JsonResponse(res)


def get_before_calendar(year, month):
    if month == 1:
        tar_year = year - 1
        tar_month = 12
    else:
        tar_year = year
        tar_month = month - 1
    return calendar.monthcalendar(tar_year, tar_month),tar_year,tar_month

def get_forward_calendar(year, month):
    if month == 12:
        tar_year = year + 1
        tar_month = 1
    else:
        tar_year = year
        tar_month = month + 1
    return calendar.monthcalendar(tar_year, tar_month),tar_year,tar_month
