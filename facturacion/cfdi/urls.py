from django.urls import path
from .views import UserListApiView
from .views import InvoiceListApiView

urlpatterns = [
    path("api/customer", UserListApiView.as_view()),
    path("api/invoice", InvoiceListApiView.as_view())
]