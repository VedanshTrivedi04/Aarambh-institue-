from rest_framework import serializers
from .models import FeeStructure, StudentFee, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'payment_date']

class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class StudentFeeSerializer(serializers.ModelSerializer):
    fee_structure_details = FeeStructureSerializer(source='fee_structure', read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    total_payable = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_paid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    remaining_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = StudentFee
        fields = [
            'id', 'student', 'fee_structure', 'fee_structure_details', 
            'discount', 'is_fully_paid', 'created_at', 'payments',
            'total_payable', 'total_paid', 'remaining_balance'
        ]
        read_only_fields = ['id', 'is_fully_paid', 'created_at']
