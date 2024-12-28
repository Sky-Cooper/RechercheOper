from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import GraphInputSerializer, GraphOutputSerializer


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
                for (x, y), distance_x_to_y in sommets.items():
                    if path_lengths[x] + distance_x_to_y < path_lengths[y]:
                        path_lengths[y] = path_lengths[x] + distance_x_to_y
                        paths[y] = paths[x] + [y]

            for (x, y), distance_x_to_y in sommets.items():
                if path_lengths[x] + distance_x_to_y < path_lengths[y]:
                    return Response(
                        {"error": "il y a un arc négatif qui cause un circuit"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            result_key = f"{noeuds}-{sommets}-{la_source}"
            stored_results[result_key] = {"path_lengths": path_lengths, "paths": paths}

            output_serializer = GraphOutputSerializer(
                {"path_lengths": path_lengths, "paths": paths}
            )
            return Response(output_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):

        result_key = request.query_params.get("key", None)
        if result_key:
            result = stored_results.get(result_key, None)
            if not result:
                return Response(
                    {"error": "Result not found for the given key"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response(result, status=status.HTTP_200_OK)

        return Response(stored_results, status=status.HTTP_200_OK)
