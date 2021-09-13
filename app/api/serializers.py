from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from .models import Board, Category, Subtask, Task, UserAccount
from .token import account_activation_token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["username", "email", "first_name", "last_name", "about", "is_guest"]


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def update(self, instance, validated_data):

        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)

        password = validated_data.get("password")
        instance.set_password(password)
        instance.is_guest = True
        instance.fingerprint = None
        instance.save()
        return instance


class VerifyAccountSerializer(serializers.Serializer):
    uid = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ["uid", "token"]

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")

        uidb64 = force_text(urlsafe_base64_decode(uid))
        user = UserAccount.objects.get(pk=uidb64)

        if user is None:
            raise AuthenticationFailed("Invalid account. Please contant support")


        if not account_activation_token.check_token(user, token):
            raise AuthenticationFailed(
                "Account verify link is invalid. Please contant support."
            )

        user.is_guest = False
        user.save()

        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["username", "email", "first_name", "last_name", "about", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect Password")

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.about = validated_data.get("about", instance.about)

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    def validate(self, data):

        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials.")


class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ["email"]

    def validate(self, attrs):
        email = attrs.get("email", "")
        if UserAccount.objects.filter(email=email).exists():
            request = self.context["request"]
            user = UserAccount.objects.get(email=email)
            current_site = get_current_site(request)
            message = render_to_string(
                "password_reset_email.html",
                {
                    "user": user,
                    "domain": current_site.domain,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "token": PasswordResetTokenGenerator().make_token(user),
                },
            )
            user.email_user(subject="Password Reset", message=message)
            return attrs
        raise serializers.ValidationError("No Email found")


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, write_only=True)
    uid = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ["password", "uid", "token"]

    def validate(self, attrs):
        password = attrs.get("password")
        uid = attrs.get("uid")
        token = attrs.get("token")

        uidb64 = force_text(urlsafe_base64_decode(uid))
        user = UserAccount.objects.get(pk=uidb64)
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise AuthenticationFailed("Password reset link is invalid")

        user.set_password(password)
        user.save()

        return attrs


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    subtask = SubtaskSerializer(many=True)
    created_by = serializers.ReadOnlyField(source="created_by.username")

    class Meta:
        model = Task
        fields = "__all__"


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ("name", "id")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "id", "total_tasks")
