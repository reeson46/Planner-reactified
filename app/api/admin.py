from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.forms import Textarea

from .models import *


class UserAdminConfig(UserAdmin):
    model = UserAccount
    search_fields = (
        "email",
        "username",
        "first_name",
    )
    list_filter = (
        "email",
        "username",
        "first_name",
        "is_superuser",
        "is_active",
        "is_guest",
        "is_staff",
    )
    ordering = ("-date_created",)
    list_display = (
        "email",
        "id",
        "username",
        "first_name",
        "is_staff",
        "is_active",
        "is_guest",
    )
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "last_name",
                    "password",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_superuser",
                    "is_staff",
                    "is_active",
                    "is_guest",
                )
            },
        ),
        ("Personal", {"fields": ("about",)}),
    )
    formfield_overrides = {
        UserAccount.about: {"widget": Textarea(attrs={"rows": 10, "cols": 40})}
    }
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "password1",
                    "password2",
                    "is_active",
                    "is_guest",
                    "is_staff",
                ),
            },
        ),
    )


class BoardAdminConfig(admin.ModelAdmin):
    model = Board
    search_fields = (
        "name",
        "created_by",
    )
    list_filter = (
        "name",
        "created_by",
    )
    list_display = (
        "name",
        "categories",
        "created_by",
    )


class CategoryAdminConfig(admin.ModelAdmin):
    model = Category
    list_display = ("name", "board", "created_by")


class SubtaskTabularInline(admin.TabularInline):
    model = Subtask


class TaskAdminConfig(admin.ModelAdmin):
    model = Task
    search_fields = (
        "board",
        "status",
        "category",
        "name",
        "created_by",
    )
    list_filter = (
        "board",
        "status",
        "category",
        "name",
        "created_by",
    )
    list_display = (
        "board",
        "category",
        "name",
        "created_by",
        "date_created",
        "status",
    )
    inlines = [SubtaskTabularInline]


admin.site.register(UserAccount, UserAdminConfig)
admin.site.register(Category, CategoryAdminConfig)
admin.site.register(Board, BoardAdminConfig)
admin.site.register(Task, TaskAdminConfig)
