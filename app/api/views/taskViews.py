from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Board, Category, Subtask, Task
from api.serializers import TaskSerializer
from api.utils import Dashboard


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    dashboard = Dashboard(request)

    active_board_id = dashboard.get_active_board_id()
    active_category_id = dashboard.get_active_category_id(active_board_id)

    active_board = Board.objects.get(pk=active_board_id)

    if active_category_id == -1:

        tasks = active_board.task.all()
    else:
        category = Category.objects.get(pk=active_category_id)
        tasks = category.task.all()

    serializer = TaskSerializer(tasks, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    if request.method == "POST":
        dashboard = Dashboard(request)
        user = request.user
        category_id = request.data.get("category")
        name = request.data.get("name")
        description = request.data.get("description")
        subtasks = request.data.get("subtasks")

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())
        category = Category.objects.get(pk=category_id)
        dashboard.set_active_category_id(active_board.id, category.id)

        task = Task.objects.create(
            board=active_board,
            category=category,
            status="Planned",
            name=name,
            description=description,
            created_by=user,
        )

        if subtasks:
            for sub in subtasks:
                Subtask.objects.create(name=sub, task=task)

        category.total_tasks += 1
        category.save(update_fields=["total_tasks"])

        serializer = TaskSerializer(task, many=False)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_task(request):
    if request.method == "PATCH":
        dashboard = Dashboard(request)
        task_id = request.data.get("id")
        category_id = request.data.get("category")
        status_ = request.data.get("status")
        name = request.data.get("name")
        description = request.data.get("description")
        subtasks = request.data.get("subtasks")
        removed_subs = request.data.get("removedSubtasks")

        category = Category.objects.get(pk=category_id)

        if removed_subs:
            for sub_id in removed_subs:
                Subtask.objects.get(pk=sub_id).delete()

        task = Task.objects.get(pk=task_id)
        current_category = task.category

        task.category = category
        task.status = status_
        task.name = name
        task.description = description
        task.save(update_fields=["category", "status", "name", "description"])

        if subtasks:
            for sub in subtasks:
                Subtask.objects.create(name=sub, task=task)

        serializer = TaskSerializer(task, many=False)

        if category != current_category:
            current_category.total_tasks -= 1
            current_category.save(update_fields=["total_tasks"])

            category.total_tasks += 1
            category.save(update_fields=["total_tasks"])

        return Response(
            {
                "task": serializer.data,
                "activeCategory": int(dashboard.get_active_category_id(task.board.id)),
            },
            status=status.HTTP_200_OK,
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def set_status(request):
    if request.method == "PATCH":
        status_ = request.data.get("status")
        task_id = request.data.get("id")

        task = Task.objects.get(pk=task_id)
        task.status = status_
        task.save(update_fields=["status"])

        return Response(
            {"status": task.status, "id": task.id}, status=status.HTTP_200_OK
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_task(request):
    if request.method == "POST":
        task_id = request.data.get("id")
        task = Task.objects.get(pk=task_id)
        serializer = TaskSerializer(task, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def set_task_extend_state(request):
    if request.method == "PATCH":
        task_id = request.data.get("id")
        task = Task.objects.get(pk=task_id)
        current_state = task.extend_state
        task.extend_state = not current_state
        task.save(update_fields=["extend_state"])

        return Response(
            {"id": task.id, "extend": task.extend_state}, status=status.HTTP_200_OK
        )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request):
    if request.method == "DELETE":
        data_id = request.headers.get("id")
        task = Task.objects.get(pk=data_id)
        task_id = task.id
        category = task.category

        category.total_tasks -= 1
        category.save(update_fields=["total_tasks"])

        task.delete()

        return Response(task_id, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def subtask_state(request):
    if request.method == "PATCH":
        subtask_id = request.data.get("id")
        state = request.data.get("state")
        subtask = Subtask.objects.get(pk=subtask_id)
        subtask.is_complete = state
        subtask.save(update_fields=["is_complete"])

        return Response(
            {
                "task_id": subtask.task.id,
                "sub_id": subtask.id,
                "sub_state": subtask.is_complete,
            },
            status=status.HTTP_200_OK,
        )
