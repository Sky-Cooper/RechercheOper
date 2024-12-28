from rest_framework import serializers


class GraphInputSerializer(serializers.Serializer):
    noeuds = serializers.ListField(child=serializers.CharField(), required=True)
    sommets = serializers.DictField(child=serializers.IntegerField(), required=True)
    la_source = serializers.CharField(required=True)


class GraphOutputSerializer(serializers.Serializer):
    path_lengths = serializers.DictField(child=serializers.FloatField(), required=True)
    paths = serializers.DictField(
        child=serializers.ListField(child=serializers.CharField()), required=True
    )
