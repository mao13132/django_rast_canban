from django_filters import rest_framework as filters
from .models import Task

class TaskFilter(filters.FilterSet):
    """
    Фильтры для задач
    """
    search = filters.CharFilter(method='search_filter')
    status = filters.CharFilter(field_name='status_id__name')
    category = filters.CharFilter(field_name='category_id__name')
    priority = filters.CharFilter()
    deadline_start = filters.DateFilter(field_name='deadline', lookup_expr='gte')
    deadline_end = filters.DateFilter(field_name='deadline', lookup_expr='lte')

    class Meta:
        model = Task
        fields = ['status', 'category', 'priority', 'deadline_start', 'deadline_end']

    def search_filter(self, queryset, name, value):
        """
        Поиск по названию и описанию задачи
        """
        return queryset.filter(
            title__icontains=value
        ) | queryset.filter(
            description__icontains=value
        ) 