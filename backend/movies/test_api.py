from rest_framework.test import APITestCase


class MoviesPublicAPITests(APITestCase):
    def test_mood_list_returns_slugs(self):
        r = self.client.get("/api/movies/moods/")
        self.assertEqual(r.status_code, 200)
        self.assertIsInstance(r.data, list)
        self.assertTrue(any(m.get("slug") == "cozy-night" for m in r.data))

    def test_search_movies_requires_query(self):
        r = self.client.get("/api/movies/search/")
        self.assertEqual(r.status_code, 400)

    def test_time_machine_requires_valid_year(self):
        r = self.client.get("/api/movies/time-machine/")
        self.assertEqual(r.status_code, 400)

        r2 = self.client.get("/api/movies/time-machine/", {"year": "1800"})
        self.assertEqual(r2.status_code, 400)

    def test_movie_list_ok_when_empty(self):
        r = self.client.get("/api/movies/list/")
        self.assertEqual(r.status_code, 200)
        self.assertIn("results", r.data)
