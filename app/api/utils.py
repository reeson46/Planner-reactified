import random
import string

from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from knox.models import AuthToken

from .models import Board, UserAccount
from .serializers import CategorySerializer, TaskSerializer, UserSerializer
from .token import account_activation_token


def random_string(stringLength):
    letters = string.ascii_letters
    return "".join(random.choice(letters) for i in range(stringLength))


def get_or_create(request):
    data = {}
    if not request.headers.get("Authorization"):
        fp = request.data.get('fp')

        if UserAccount.objects.filter(fingerprint=fp).exists():
            user = UserAccount.objects.get(fingerprint=fp)

        else:
            random_username = f"{random_string(10)}_guest"
            random_email = f"{random_string(5)}_guest@example.com"

            user = UserAccount.objects.create(
                username=random_username,
                email=random_email,
                fingerprint=fp,
                is_guest=True,
            )
    else:
        user = request.user
    
    AuthToken.objects.filter(user=user.id).delete()
    
    data["user"] = UserSerializer(user).data
    data["token"] = AuthToken.objects.create(user)[1]

    return data


def send_activation_email(request, user):
    current_site = get_current_site(request)
    subject = "Activate your Account"
    message = render_to_string(
        "account_activation_email.html",
        {
            "user": user,
            "domain": current_site.domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
        },
    )
    user.email_user(subject=subject, message=message)


class Dashboard:
    def __init__(self, request):
        self.session = request.session
        dashboard = self.session.get("dashboard")

        if "dashboard" not in request.session:
            dashboard = self.session["dashboard"] = {}

        self.dashboard = dashboard

    """
    SESSION
    """

    def session_check(self):
        if self.dashboard:
            return True
        else:
            return False

    """
    BOARD
    """

    def add_all_boards(self, boards):
        for board in boards:
            board_ = str(board.id)
            self.dashboard[board_] = {}

        self.session.modified = True

    def add_board(self, board_id):
        board = str(board_id)

        self.dashboard[board] = {}
        self.session.modified = True

    def remove_board(self, board_id):
        board = str(board_id)

        del self.dashboard[board]
        self.session.modified = True

    def set_active_board_id(self, board_id):
        board = str(board_id)

        for k, v in self.dashboard.items():
            if k == board:
                v["active"] = True
            else:
                v["active"] = False

        self.session.modified = True

    def get_active_board_id(self):
        for k, v in self.dashboard.items():
            if v["active"]:
                return k

    """
    CATEGORY
    """

    def set_active_category_id(self, board_id, category_id):
        board = str(board_id)

        self.dashboard[board]["category"] = category_id
        self.session.modified = True

    def get_active_category_id(self, board_id):
        board = str(board_id)

        if "category" not in self.dashboard[board]:
            self.dashboard[board]["category"] = -1
            self.session.modified = True
            return -1
        else:
            return self.dashboard[board]["category"]


class Sidebar:
    def __init__(self, request):
        self.dashboard = Dashboard(request)

    # returns needed data for refreshing the sidebar categories
    def categories_reload_json_response(self):
        data = {}
        active_board = Board.objects.get(pk=self.dashboard.get_active_board_id())
        categories = active_board.category.all()
        serialize = CategorySerializer(categories, many=True)
        data["categories"] = serialize.data
        data["active"] = int(self.dashboard.get_active_category_id(active_board.id))

        return data

    # returns needed data for refreshing the sidebar boards
    # def boards_reload_json_response(self, request):
    #     user = get_user(request)
    #     boards = user.board.all()

    #     serialize = BoardSerializer(boards, many=True)

    #     response = {"boards": serialize.data}

    #     return response


class Task:
    def getCompletedSubtasks(self, tasks):

        result = [task.subtask.filter(is_complete=True).count() for task in tasks]
        return result

    def getTaskIds(self, tasks):

        result = [task.id for task in tasks]
        return result

    def getTasks(self, category_id, active_board):

        if category_id == -1:

            tasks = active_board.task.all()
        else:

            tasks = active_board.task.filter(category=category_id)

        return tasks

    def get_tasks_json_response(self, active_category_id, active_board):

        if active_category_id == -1:

            tasks_ = active_board.task.all()
        else:

            tasks_ = active_board.task.filter(category=active_category_id)

        serializer = TaskSerializer(instance=tasks_, many=True)

        return serializer.data
