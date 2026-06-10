from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChargerViewSet, BookingViewSet, register

router = DefaultRouter()
router.register(r'chargers', ChargerViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register),
]