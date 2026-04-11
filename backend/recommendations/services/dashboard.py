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
