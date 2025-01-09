from django.shortcuts import  render
def index(request):
    print("HelloWorld")
    return render(request, "index.html")
