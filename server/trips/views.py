from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework.response import Response
from django.http import HttpResponse, Http404, JsonResponse
from rest_framework import status



from .models import Trip
from .serializers import LogInSerializer, NestedTripSerializer, DeleteTripSerializer, UserSerializer

# Access user info from request.user. Example: request.user.group, request.user.id


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer

class TripView(viewsets.ModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NestedTripSerializer

    def get_queryset(self):
        user = self.request.user
        if user.group == 'driver':
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=user)
            )
        if user.group == 'rider':
            return Trip.objects.filter(rider=user)
        return Trip.objects.none()

    # def destroyTrip(self, request, trip_id):
    #     #Get the user data that submitted the request
    #     user = request.user
    #     #Get the trip from the database only if the requester is the one that created the trip
    #     qs = Trip.objects.filter(Q(id=trip_id) & (Q(rider=user.id)))
    #     if not qs.exists():
    #         return(Response({'Trip cannot be found'}, status=404))
    #     #If the user is authorized then move on to verify that the submitted data is correct.
    #     serializer = DeleteTripSerializer(data=request.data)
    #     #Check if the submitted data is in the format that is required.
    #     if serializer.is_valid(raise_exception=True):
    #         data = serializer.validated_data
    #         status = data.get('status')
    #         #Last step is to check that the status of the trip is COMPLETED.
    #         if status != 'COMPLETED':
    #             return(Response({"Cannot remove uncompleted trips"}, status=403))
    #         #Delete the trip and send a 200 response
    #         qs.delete()
    #         return Response({"message": "Trip removed"}, status=200)

@permission_classes([IsAuthenticated])
#Removed the client first and then added this api_view. I removed the csrf token error by adding this but was no longer receiving the user data because I wasn't sending the jwt token anymore.
@api_view(['DELETE'])
def destroyTrip(request, trip_id, *args, **kwargs):
    print('request', request)
    print('trip_id', trip_id)
    #Get the user data that submitted the request
    user = request.user
    print(user)
    print('user.id', user.id)
    #Get the trip from the database only if the requester is the one that created the trip
    qs = Trip.objects.filter(Q(id=trip_id) & (Q(rider=user.id)))
    print('qs', qs)
    if not qs.exists():
        return(Response({'Trip cannot be found'}, status=404))
    #If the user is authorized then move on to verify that the submitted data is correct.
    serializer = DeleteTripSerializer(data=request.data)
    #Check if the submitted data is in the format that is required.
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        status = data.get('status')
        #Last step is to check that the status of the trip is COMPLETED.
        if status != 'COMPLETED':
            return(Response({"Cannot remove uncompleted trips"}, status=403))
        #Delete the trip and send a 200 response
        qs.delete()
        return Response({"message": "Trip removed"}, status=200)
