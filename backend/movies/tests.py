from django.test import TestCase
from movies.models import Genre, Person, Movie, WatchProvider


class MoviesModelsTests(TestCase):

    def test_genre_str(self):
        """Test the string representation of a Genre."""
        genre = Genre(tmdb_id=28, name="Action", slug="action")
        self.assertEqual(str(genre), "Action")

    def test_person_str(self):
        """Test the string representation of a Person."""
        person = Person(tmdb_id=1, name="Christopher Nolan")
        self.assertEqual(str(person), "Christopher Nolan")

    def test_movie_urls(self):
        """Test the generation of movie property URLs."""
        movie = Movie(
            tmdb_id=550,
            title="Fight Club",
            poster_path="/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            backdrop_path="/rr7E0NoGKxjmcfmeeENqxPTZQRW.jpg",
            trailer_key="qtRKdVHc-cE"
        )
        self.assertEqual(
            movie.poster_url,
            "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
        )
        self.assertEqual(
            movie.backdrop_url,
            "https://image.tmdb.org/t/p/w1280/rr7E0NoGKxjmcfmeeENqxPTZQRW.jpg"
        )
        self.assertEqual(
            movie.trailer_url,
            "https://www.youtube.com/watch?v=qtRKdVHc-cE"
        )

    def test_movie_empty_urls(self):
        """Test that properties return None when paths/keys are empty."""
        movie = Movie(tmdb_id=999, title="Unknown")
        self.assertIsNone(movie.poster_url)
        self.assertIsNone(movie.backdrop_url)
        self.assertIsNone(movie.trailer_url)

    def test_watch_provider_str(self):
        """Test the string representation of a WatchProvider."""
        movie = Movie.objects.create(tmdb_id=1, title="Test Movie")
        provider = WatchProvider(
            movie=movie,
            provider_name="Netflix",
            provider_type=WatchProvider.ProviderType.STREAM
        )
        self.assertEqual(str(provider), "Netflix (stream) - Test Movie")
