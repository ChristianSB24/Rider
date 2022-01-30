from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model


from .models import Trip, User
from .serializers import LogInSerializer, NestedTripSerializer, DeleteTripSerializer, UserSerializer

# Access user info from request.user. Example: request.user.group, request.user.id

@api_view(['POST'])
def signUpUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return(Response(status=200))
    return(Response(status=400))


@api_view(['POST'])
def loginUser(request):
    #Serialize the data that was sent.
    serializer = LogInSerializer(data=request.data)
    #The serializer will verify if the user exists or not and if the data sent was valid.
    if serializer.is_valid(raise_exception=True):
        token = serializer.validated_data
        #If the data is valid the serializer will create a token that we then send back to the client that stores the users data.
        return(Response(token, status=200))
    return(Response(status=400))


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def getTrips(request):
    user = request.user
    #We first check if the user exists.
    if user.id == None:
        return(Response(status=200))
    #If they do exist then check if they are a driver or a rider.
    if user.group == 'driver':
        #If they are a driver then return all the trips where they are the driver or the status of the trip is REQUESTED.
        qs = Trip.objects.filter(Q(status=Trip.REQUESTED) | Q(driver=user))
        #Serialize the data and send back to the user.
        serializer = NestedTripSerializer(qs, many=True)
        return(Response(serializer.data, status=200))
    if user.group == 'rider':
        #If they are a rider then send back all the trips where they are the rider.
        qs = Trip.objects.filter(rider=user)
        #Serialize the data and send back.
        serializer = NestedTripSerializer(qs, many=True)
        return(Response(serializer.data, status=200))
    return(Response(status=400))


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def getTrip(request, trip_id):
    #We first extract the trip id from the url and access it through trip_id
    qs = Trip.objects.filter(id=trip_id)
    #If that id does not exist then return a 404 error
    if not qs.exists():
        return Response(status=404)
    #If it does then serialize the trip data and send back to the user.
    #We need to specify qs.first() because qs is an array. We will get an error if we don't pick out an element from that array.
    #So we pick out one element and send that to be serialized and then we send the data to the user.
    serializer = NestedTripSerializer(qs.first())
    return Response(serializer.data, status=200)


@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def deleteTrip(request, trip_id, *args, **kwargs):
    #Get the user data that submitted the request
    user = request.user
    #Get the trip from the database only if the requester is the one that created the trip
    qs = Trip.objects.filter(Q(id=trip_id) & (Q(rider=user.id)))
    if not qs.exists():
        return(Response({"Trip cannot be found"}, status=404))
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
        return(Response({"Trip removed"}, status=200))
    return(Response(status=400))
