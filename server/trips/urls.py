from django.urls import path

from .views import TripView, destroyTrip, getTrips

app_name = 'taxi'

urlpatterns = [
    # path('', TripView.as_view({'get': 'list'}), name='trip_list'),
    path('', getTrips),
    path('<uuid:trip_id>/delete/', destroyTrip),
    path('<uuid:trip_id>/', TripView.as_view({'get': 'retrieve'}), name='trip_detail'),
]