from rest_framework import serializers
from .models import Invoices, Users


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["rfc", "name", "zip"]

class InvoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoices
        fields = ["invoice_number", "order_number"]