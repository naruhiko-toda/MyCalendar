import json
import calendar

from django.shortcuts import render
from django.http.response import JsonResponse

def index(request):
    res = {}
    return render(request, "calen/index.html", res)
