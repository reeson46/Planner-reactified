from knox.models import AuthToken
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers import (LoginSerializer, RegistrationSerializer,
                             ResetPasswordEmailRequestSerializer,
                             SetNewPasswordSerializer, UpdateUserSerializer,
                             UserSerializer, VerifyAccountSerializer)
from api.utils import get_or_create, send_activation_email


@api_view(["POST"])
def get_or_create_user(request):
    if request.method == 'POST':
        data = get_or_create(request)
        return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_user(request):
    if request.method == "POST":
        user_instance = request.user
        serializer = RegistrationSerializer(data=request.data, instance=user_instance)
        data = {}
        if serializer.is_valid():
            user = serializer.save()

            send_activation_email(request, user)
            return Response(status=status.HTTP_200_OK)

        data = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user(request):
    if request.method == "PATCH":
        user = request.user
        serializer = UpdateUserSerializer(
            data=request.data, instance=user, context={"request": request}
        )
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data["user"] = UserSerializer(user).data
            return Response(data, status=status.HTTP_200_OK)

        data = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    if request.method == "POST":
        request.session.clear()
        data = {}
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data

            AuthToken.objects.filter(user=user.id).delete()

            data["user"] = UserSerializer(user).data
            data["token"] = AuthToken.objects.create(user)[1]

            return Response(data, status=status.HTTP_200_OK)

        data = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def verify_account(request):
    if request.method == "POST":
        data = {}
        serializer = VerifyAccountSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data

            AuthToken.objects.filter(user=user.id).delete()

            data["user"] = UserSerializer(user).data
            data["token"] = AuthToken.objects.create(user)[1]

            return Response(data, status=status.HTTP_200_OK)

        data = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def request_password_reset_email(request):
    if request.method == "POST":
        serializer = ResetPasswordEmailRequestSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


@api_view(["PATCH"])
def password_reset(request):
    if request.method == "PATCH":
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
