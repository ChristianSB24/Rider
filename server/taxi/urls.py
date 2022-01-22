from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from trips.views import loginUser, signUpUser

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/sign_up/', signUpUser),
    path('api/log_in/', loginUser),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/trip/', include('trips.urls', 'trip',)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
