from rest_framework import serializers
from .models import Todo
from django.utils import timezone
from datetime import datetime

def validate_data(data, is_creation=True):
    date  = data.get('date_for')
    time  = data.get('time_for')
    if date is None and time is not None:
        raise serializers.ValidationError({
            'date_for': 'La date doit être définie si l\'heure est fournie.'
        })
    if time is None and date is not None:
        raise serializers.ValidationError({
            'time_for': 'L\'heure doit être définie si la date est fournie.'
        })
    
    if is_creation and date and time:
        naive_due = datetime.combine(date, time)
        due_date = timezone.make_aware(naive_due)
        now = timezone.now()
        if due_date < now:
            raise serializers.ValidationError({
                'date_for': 'La date ne peut pas être dans le passé.',
                'time_for': 'L\'heure ne peut pas être dans le passé.'
            })

    return data

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'description': {'required': False, 'allow_blank': True},
            'date_for': {'required': False},
            'time_for': {'required': False}
        }

    

class TodoListSerializer(serializers.ModelSerializer):
    time_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Todo
        fields = ['id', 'title', 'completed', 'date_for', 'time_for', 'time_remaining']

    def get_time_remaining(self, obj):
        if obj.date_for and obj.time_for:
            naive_due = datetime.combine(obj.date_for, obj.time_for)
            due_date = timezone.make_aware(naive_due)
            now = timezone.now()
            remaining = due_date - now

            if remaining.total_seconds() > 0:
                days = remaining.days
                hours, remainder = divmod(remaining.seconds, 3600)
                minutes, _ = divmod(remainder, 60)
                return f"{days}j {hours}h {minutes}min"
            else:
                return "Échéance dépassée"
        return "Date non définie"

class BaseCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['title', 'description', 'date_for', 'time_for']
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'description': {'required': False, 'allow_blank': True},
            'date_for': {'required': False},
            'time_for': {'required': False}
        }

    def validate(self, data):
        return validate_data(data, is_creation=False)

class TodoCreateSerializer(BaseCreateUpdateSerializer):
    pass
        
class TodoUpdateSerializer(BaseCreateUpdateSerializer):
    class Meta:
        model = Todo
        fields = ['title', 'description', 'date_for', 'time_for', 'completed']