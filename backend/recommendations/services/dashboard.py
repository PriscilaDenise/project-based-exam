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

    def get_genre_distribution(self) -> list:
        """Calculates the distribution of genres based on recent positive interactions."""
        genre_counter = Counter()
        positive_interactions = self.interactions.filter(
            interaction_type__in=["like", "watched", "watchlist"]
        )
        
        for interaction in positive_interactions:
            for gid in interaction.genre_ids:
                genre_counter[gid] += 1

        genre_distribution = []
        for gid, count in genre_counter.most_common(10):
            try:
                genre = Genre.objects.get(tmdb_id=gid)
                genre_distribution.append({"name": genre.name, "tmdb_id": gid, "count": count})
            except Genre.DoesNotExist:
                genre_distribution.append({"name": f"Genre {gid}", "tmdb_id": gid, "count": count})
                
        return genre_distribution

    def get_preference_scores(self) -> list:
        """Retrieves and computes genre preference scores."""
        self.engine.compute_genre_preferences(self.user)
        prefs = UserGenrePreference.objects.filter(user=self.user).order_by("-weight")[:10]
        
        return [
            {"name": p.genre_name, "weight": round(p.weight, 1), "count": p.interaction_count}
            for p in prefs
        ]

    def get_activity_timeline(self) -> list:
        """Generates a daily activity timeline for the last 30 days."""
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_activity = (
            self.interactions.filter(created_at__gte=thirty_days_ago)
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )
        
        return [
            {"date": str(d["date"]), "count": d["count"]}
            for d in daily_activity
        ]

    def get_recent_activity(self) -> list:
        """Fetches the 10 most recent interactions."""
        recent = self.interactions.order_by("-created_at")[:10]
        return UserMovieInteractionSerializer(recent, many=True).data

    def get_all_dashboard_data(self) -> dict:
        """Aggregates all dashboard data components into a single dictionary payload."""
        return {
            "summary": self.get_summary_stats(),
            "genre_distribution": self.get_genre_distribution(),
            "preference_scores": self.get_preference_scores(),
            "activity_timeline": self.get_activity_timeline(),
            "recent_activity": self.get_recent_activity(),
        }
