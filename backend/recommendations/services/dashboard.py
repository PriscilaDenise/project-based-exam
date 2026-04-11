from collections import Counter
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate

from recommendations.models import UserMovieInteraction, UserGenrePreference, Watchlist
from recommendations.serializers import UserMovieInteractionSerializer
from movies.models import Genre
from recommendations.services.engine import RecommendationEngine

class DashboardService:
    """
    A service class designated to fetch and compute dashboard statistics
    for a given user. This abstracts the data processing logic out of the view layer.
    """

    def __init__(self, user):
        self.user = user
        self.interactions = UserMovieInteraction.objects.filter(user=self.user)
        self.engine = RecommendationEngine()

    def get_summary_stats(self) -> dict:
        """Computes summary statistics relating to interactions and the watchlist."""
        total_interactions = self.interactions.count()
        likes = self.interactions.filter(interaction_type="like").count()
        dislikes = self.interactions.filter(interaction_type="dislike").count()
        watched = self.interactions.filter(interaction_type="watched").count()
        searches = self.interactions.filter(interaction_type="search").count()

        watchlist = Watchlist.objects.filter(user=self.user)
        watchlist_total = watchlist.count()
        watchlist_watched = watchlist.filter(watched=True).count()

        avg_result = self.interactions.filter(rating__isnull=False).aggregate(avg=Avg("rating"))
        avg_rating = avg_result["avg"]

        return {
            "total_interactions": total_interactions,
            "likes": likes,
            "dislikes": dislikes,
            "watched": watched,
            "searches": searches,
            "watchlist_total": watchlist_total,
            "watchlist_watched": watchlist_watched,
            "average_rating": round(avg_rating, 1) if avg_rating else None,
        }