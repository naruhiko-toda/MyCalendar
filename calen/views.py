import os
import json
import calendar
import datetime

from django.shortcuts import render
from django.http.response import JsonResponse

def index(request):
    res = {}
    now = datetime.datetime.now()
    #デフォルトで今月の月間カレンダーを表示する
    calendar.setfirstweekday(6)
    default_calendar = calendar.monthcalendar(now.year, now.month)
    res["calendar"] = default_calendar
    print(default_calendar)
    return render(request, "calen/index.html", res)
