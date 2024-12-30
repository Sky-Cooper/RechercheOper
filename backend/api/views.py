from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import GraphInputSerializer


stored_results = {}


class FordBellmanAPIView(APIView):
    def post(self, request):
        serializer = GraphInputSerializer(data=request.data)
        if serializer.is_valid():
            noeuds = serializer.validated_data["noeuds"]
            sommets = serializer.validated_data["sommets"]
            la_source = serializer.validated_data["la_source"]

            path_lengths = {noeud: float("inf") for noeud in noeuds}
            path_lengths[la_source] = 0
            paths = {noeud: [] for noeud in noeuds}
            paths[la_source] = [la_source]

            for _ in range(len(noeuds) - 1):
                for edge, distance_x_to_y in sommets.items():
                    x, y = edge.split(",")
                    if (
                        path_lengths[x] != float("inf")
                        and path_lengths[x] + distance_x_to_y < path_lengths[y]
                    ):
                        path_lengths[y] = path_lengths[x] + distance_x_to_y
                        paths[y] = paths[x] + [y]

            for edge, distance_x_to_y in sommets.items():
                x, y = edge.split(",")
                if (
                    path_lengths[x] != float("inf")
                    and path_lengths[x] + distance_x_to_y < path_lengths[y]
                ):
                    return Response(
                        {"error": "il y a un arc négatif qui cause un circuit"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            response_data = {
                "path_lengths": {
                    key: ("Infinity" if value == float("inf") else value)
                    for key, value in path_lengths.items()
                },
                "paths": paths,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
