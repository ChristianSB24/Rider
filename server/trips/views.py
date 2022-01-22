from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework.response import Response



from .models import Trip
from .serializers import LogInSerializer, NestedTripSerializer, DeleteTripSerializer, UserSerializer

# Access user info from request.user. Example: request.user.group, request.user.id


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def getTrips(request):
    user = request.user
    if user.id == None:
        return(Response({'No trips available'}, status=404))
    if user.group == 'driver':
        qs = Trip.objects.filter(Q(status=Trip.REQUESTED) | Q(driver=user))
        serializer = NestedTripSerializer(qs, many=True)
        return(Response(serializer.data))
    if user.group == 'rider':
        qs = Trip.objects.filter(rider=user)
        serializer = NestedTripSerializer(qs, many=True)
        return(Response(serializer.data))
    qs = Trip.objects.none()
    serializer = NestedTripSerializer(qs, many=True)
    return(Response(serializer.data))

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def getTrip(request, trip_id):
    qs = Trip.objects.filter(id=trip_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = NestedTripSerializer(obj)
    return Response(serializer.data)


@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def deleteTrip(request, trip_id, *args, **kwargs):
    #Get the user data that submitted the request
    user = request.user
    #Get the trip from the database only if the requester is the one that created the trip
    qs = Trip.objects.filter(Q(id=trip_id) & (Q(rider=user.id)))
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
