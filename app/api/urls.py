from django.urls import path
from knox import views as knox_views

from api.views.accountViews import *
from api.views.dashboardViews import *
from api.views.taskViews import *

app_name = "api"

urlpatterns = [
    ### Account ####
    path("auth/register/", register_user, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/logout/", knox_views.LogoutView.as_view(), name="knox-logout"),
    path(
        "auth/get-or-create-user/",
        get_or_create_user,
        name="get-or-create-user",
    ),
    path("auth/update-user/", update_user, name="update-user"),
    path("auth/verify/", verify_account, name="verify"),
    path("auth/request-password-reset/", request_password_reset_email),
    path("auth/password-reset-confirm/", password_reset),
    ### Dashboard ###
    path("get-session/", get_session, name="get-session"),
    path("clear-session/", clear_session, name="clear-session"),
    # Board
    path("get-boards/", get_boards, name="get-boards"),
    path("set-active-board/", set_active_board, name="set-active-board"),
    path("manage-board/", manage_board, name="manage-board"),
    # Category
    path("get-categories/", get_categories, name="get-categories"),
    path("set-active-category/", set_active_category, name="set-active-category"),
    path("manage-category/", manage_category, name="manage-category"),
    ### Task ###
    path("get-tasks/", get_tasks, name="get-tasks"),
    path("create-task/", create_task, name="create-task"),
    path("update-task/", update_task, name="update-task"),
    path("delete-task/", delete_task, name="delete-task"),
    path("set-status/", set_status, name="set-status"),
    path("get-task/", get_task, name="get-task"),
    path("set-extend/", set_task_extend_state, name="set-extend"),
    path("subtask-state/", subtask_state, name="subtask-state"),
]
