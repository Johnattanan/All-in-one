from django.contrib import admin

from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "completed",
        "date_for",
        "time_for",
        "created_at",
        "updated_at",
    )
    list_editable = ("completed",)
    list_filter = ("completed", "date_for", "created_at")
    search_fields = ("title", "description")
    date_hierarchy = "created_at"

    fieldsets = (
        ("Informations de base", {"fields": ("title", "description", "completed")}),
        (
            "Planification",
            {"fields": ("date_for", "time_for"), "classes": ("collapse",)},
        ),
        (
            "Métadonnées",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
                "description": "Informations automatiquement générées",
            },
        ),
    )

    readonly_fields = ("created_at", "updated_at")

    actions = ["mark_as_completed", "mark_as_incomplete", "clear_dates"]

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(completed=True)
        self.message_user(request, f"{updated} tâches marquées comme complétées")

    def mark_as_incomplete(self, request, queryset):
        updated = queryset.update(completed=False)
        self.message_user(request, f"{updated} tâches marquées comme incomplètes")

    def clear_dates(self, request, queryset):
        updated = queryset.update(date_for=None, time_for=None)
        self.message_user(request, f"Dates supprimées pour {updated} tâches")

    list_per_page = 25
    list_display_links = ("title",)

    ordering = ("-created_at",)
