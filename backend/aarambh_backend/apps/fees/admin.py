from django.contrib import admin
from .models import FeeStructure, StudentFee, Payment

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ('payment_date',)

@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ('title', 'batch', 'amount', 'due_date')
    list_filter = ('batch', 'due_date')

@admin.register(StudentFee)
class StudentFeeAdmin(admin.ModelAdmin):
    list_display = ('student', 'fee_structure', 'total_payable', 'remaining_balance', 'is_fully_paid')
    list_filter = ('is_fully_paid', 'fee_structure__batch')
    search_fields = ('student__email', 'student__first_name')
    inlines = [PaymentInline]

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student_fee', 'amount', 'payment_date', 'payment_method', 'status')
    list_filter = ('status', 'payment_method', 'payment_date')
    search_fields = ('transaction_id', 'student_fee__student__email')
