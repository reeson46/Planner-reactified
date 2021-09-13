from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Board, Category
from api.serializers import BoardSerializer, CategorySerializer
from api.utils import Dashboard, Sidebar


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_session(request):
    if request.method == "GET":
        dashboard = Dashboard(request)

        # if the session in not empty
        if not dashboard.session_check():

            user = request.user
            boards = user.board.all()

            # add all boards to the session
            dashboard.add_all_boards(boards)

            # grab the first board from the Board model
            active_board = boards.first()

            # save the board's id as "active board" into the session
            dashboard.set_active_board_id(active_board.id)

            # set active category as ALL (-1)
            dashboard.set_active_category_id(active_board.id, -1)

        return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
def clear_session(request):
    if request.method == "DELETE":
        request.session.clear()
        return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_boards(request):
    if request.method == "GET":
        dashboard = Dashboard(request)
        data = {}
        user = request.user
        boards = user.board.all()

        data["boards"] = BoardSerializer(boards, many=True).data
        data["active"] = int(dashboard.get_active_board_id())

        return Response(data, status=status.HTTP_200_OK)


@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_board(request):
    dashboard = Dashboard(request)
    user = request.user

    """
    Add new board
    """
    if request.method == "POST":
        data = {}
        name = request.data.get("name")

        board = Board.objects.create(name=name, created_by=user)

        dashboard.add_board(board.id)
        dashboard.set_active_board_id(board.id)
        data["board"] = BoardSerializer(board, many=False).data
        data["active"] = int(board.id)

        return Response(data, status=status.HTTP_201_CREATED)

    """
    Rename board
    """
    if request.method == "PATCH":
        name = request.data.get("name")
        board_id = request.data.get("id")
        board = Board.objects.get(pk=board_id)
        board.name = name
        board.save(update_fields=["name"])

        return Response({"id": board.id, "name": board.name}, status=status.HTTP_200_OK)

    """
    Delete board
    """
    if request.method == "DELETE":
        data_id = request.headers.get("id")
        board = Board.objects.get(pk=data_id)
        board_id = board.id
        board.delete()

        boards = user.board.all()
        # check if the active board is the same as the one we just deleted
        if int(dashboard.get_active_board_id()) == int(board_id):
            # if so, then grab the last created board and set it as active
            active_board = boards.order_by("-id")[0]
            dashboard.set_active_board_id(active_board.id)
        else:
            active_board = boards.get(pk=dashboard.get_active_board_id())
            dashboard.set_active_board_id(active_board.id)

        # remove deleted board from session
        dashboard.remove_board(board_id)
        data = {"board_id": int(board_id), "active": int(active_board.id)}

        return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
def set_active_board(request):
    dashboard = Dashboard(request)
    if request.method == "POST":
        board_id = request.data.get("id")
        dashboard.set_active_board_id(board_id)

        return Response(int(board_id), status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_categories(request):
    if request.method == "GET":
        sidebar = Sidebar(request)
        response = sidebar.categories_reload_json_response()

        return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def set_active_category(request):
    dashboard = Dashboard(request)
    board_id = dashboard.get_active_board_id()

    if request.method == "POST":
        category_id = request.data.get("id")
        dashboard.set_active_category_id(board_id, category_id)

        return Response(int(category_id), status=status.HTTP_200_OK)


@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_category(request):
    dashboard = Dashboard(request)
    user = request.user

    """
    Add new category
    """
    if request.method == "POST":
        data = {}
        sender = request.data.get("sender")
        name = request.data.get("name")

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())

        category = Category.objects.create(
            name=name, board=active_board, created_by=user
        )

        if sender == "TASK_FORM":
            dashboard.set_active_category_id(active_board.id, category.id)
            data["active"] = int(category.id)

        data["category"] = CategorySerializer(category, many=False).data

        return Response(data, status=status.HTTP_201_CREATED)

    """
    Rename category
    """
    if request.method == "PATCH":
        name = request.data.get("name")
        category_id = request.data.get("id")

        category = Category.objects.get(pk=category_id)
        category.name = name
        category.save(update_fields=["name"])

        return Response(
            {"id": category.id, "name": category.name}, status=status.HTTP_200_OK
        )

    """
    Delete category
    """
    if request.method == "DELETE":
        data_id = request.headers.get("id")
        category = Category.objects.get(pk=data_id)
        category_id = category.id
        category.delete()

        return Response(int(category_id), status=status.HTTP_200_OK)
