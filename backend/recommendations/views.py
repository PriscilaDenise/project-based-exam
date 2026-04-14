# Refactored views to improve readability, reduce duplication, and apply service-layer architecture

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserMovieInteraction, UserGenrePreference, Watchlist
from .serializers import (
    UserMovieInteractionSerializer,
    UserGenrePreferenceSerializer,
    WatchlistSerializer,
)
from .services.engine import RecommendationEngine
from movies.serializers import TMDBMovieSerializer

# Recommendation engine instance
engine = RecommendationEngine()

# =======================================================
# Recommendation Endpoints
# =====================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def personalized_recommendations(request):
    # Extract query parameter with default value to improve robustness
    page = int(request.query_params.get("page", 1))

    movies = engine.get_recommendations(request.user, page=page)
    # Inline serializer to remove unnecessary temporary variable
    return Response({"results": TMDBMovieSerializer(movies, many=True).data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def because_you_watched(request):
    """GET /api/recommendations/because-you-watched/"""

    data = engine.get_because_you_watched(request.user)
     # Refactored loop into dictionary comprehension for cleaner and more Pythonic code
    result = {
        title: TMDBMovieSerializer(movies, many=True).data
        for title, movies in data.items()
}
    return Response(result)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def genre_preferences(request):
    """GET /api/recommendations/preferences/"""

    # Trigger recomputation to ensure up-to-date user preference data
    engine.compute_genre_preferences(request.user)
    prefs = UserGenrePreference.objects.filter(user=request.user)

    # Inline serializer to remove unnecessary temporary variable
    return Response(UserGenrePreferenceSerializer(prefs, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def track_interaction(request):
    """
    POST /api/recommendations/track/
    Body: { movie_tmdb_id, movie_title, interaction_type, genre_ids?, rating? }
    """
    # Serializer handles validation and deserialization of request data
    serializer = UserMovieInteractionSerializer(data=request.data)

    # Validate input before saving to ensure data integrity
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Return validation errors for better client feedback
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#=====================================================
# Watchlist ViewSet
# =====================================================
class WatchlistViewSet(viewsets.ModelViewSet):
    """User's watchlist CRUD."""
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Restrict queryset to the authenticated user.
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate watchlist items with the current user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_watched(self, request, pk=None):
        """POST /api/recommendations/watchlist/{id}/mark_watched/"""

        # Retrieve object using DRF helper method
        item = self.get_object()
        item.watched = True
        item.watched_at = timezone.now()
        item.save()
        return Response(WatchlistSerializer(item).data)
    

# This view contains complex aggregation logic and will be refactored into a service layer
# ==============================================================================
# Dashboard Endpoints
# ============================================================================

from .services.dashboard import DashboardService

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    GET /api/recommendations/dashboard/
    Returns aggregated stats for the user's dashboard.
    """

    # Thin view pattern: delegate heavy business logic to service layer
    service = DashboardService(request.user)
    
    # Centralized data aggregation handled inside service class
    return Response(service.get_all_dashboard_data())
    
# Refactored views to improve readability, reduce duplication, and apply service-layer architecture
   
