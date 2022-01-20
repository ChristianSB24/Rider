from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, viewsets
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

    def destroy(self, request, trip_id):
        serializer = DeleteTripSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = serializer.validated_data
            status = data.get('status')
            qs = Trip.objects.filter(id=trip_id)
            if not qs.exists():
                return(Response({}, status=404))
            if status != 'COMPLETED':
                return(Response({"Cannot remove uncompleted trips"}, status=403))
            qs.delete()
            return Response({"message": "Trip removed"}, status=200)
