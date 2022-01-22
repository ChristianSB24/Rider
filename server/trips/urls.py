from django.urls import path

from .views import deleteTrip, getTrips, getTrip

app_name = 'taxi'

urlpatterns = [
    path('', getTrips),
    path('<uuid:trip_id>/delete/', deleteTrip),
    path('<uuid:trip_id>/', getTrip),
]