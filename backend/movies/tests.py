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
