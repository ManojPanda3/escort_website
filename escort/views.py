from django.shortcuts import render
from dotenv import load_dotenv

load_dotenv()

def index(request):
    return render(request, 'escort/index.html')
