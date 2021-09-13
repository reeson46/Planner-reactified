from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.core.mail import send_mail
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_superuser(self, email, username, password, **other_fields):

        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)

        if other_fields.get("is_staff") is not True:
            raise ValueError("Superuser must be assigned to is_staff=True.")
        if other_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must be assigned to is_superuser=True.")

        return self.create_user(email, username, password, **other_fields)

    def create_user(self, email, username, password, **other_fields):

        if not email:
            raise ValueError(_("You must provide an email address"))

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **other_fields)
        user.set_password(password)
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(_("user name"), max_length=150, unique=True)
    first_name = models.CharField(_("first name"), max_length=50, blank=True)
    last_name = models.CharField(_("last name"), max_length=50, blank=True)
    about = models.TextField(_("about"), max_length=400, blank=True)
    date_created = models.DateTimeField(_("date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("date updated"), auto_now=True)
    is_active = models.BooleanField(_("active"), default=True)
    is_guest = models.BooleanField(_("guest"), default=False)
    is_staff = models.BooleanField(_("staff"), default=False)
    fingerprint = models.CharField(max_length=32, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = _("User account")
        verbose_name_plural = _("User accounts")

    def email_user(self, subject, message):
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [self.email],
            fail_silently=False,
        )

    def __str__(self):
        return self.username


class Board(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        UserAccount, related_name="board", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Board"
        verbose_name_plural = "Boards"

    def categories(self):
        qs = self.category.all()
        result = []
        for x in qs:
            result.append(x.name)
        return result

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=250)
    board = models.ForeignKey(Board, related_name="category", on_delete=models.CASCADE)
    total_tasks = models.IntegerField(default=0)
    created_by = models.ForeignKey(
        UserAccount, related_name="category", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS = (
        ("Planned", "Planned"),
        ("In Progress", "In Progress"),
        ("Testing", "Testing"),
        ("Completed", "Completed"),
    )
    board = models.ForeignKey(Board, related_name="task", on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, related_name="task", on_delete=models.CASCADE
    )
    status = models.CharField(max_length=50, choices=STATUS, default="Planned")
    name = models.CharField(max_length=250)
    created_by = models.ForeignKey(
        UserAccount, related_name="task", on_delete=models.CASCADE
    )
    description = models.TextField(max_length=500, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    extend_state = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Task")
        verbose_name_plural = _("Tasks")

    def __str__(self):
        return self.name


class Subtask(models.Model):
    name = models.CharField(max_length=250, blank=True)
    task = models.ForeignKey(Task, related_name="subtask", on_delete=models.CASCADE)
    is_complete = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Subtask")
        verbose_name_plural = _("Subtasks")

    def __str__(self):
        return self.name
