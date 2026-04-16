from rest_framework.test import APITestCase


class UsersAPITests(APITestCase):
    def test_register_returns_201(self):
        r = self.client.post(
            "/api/users/register/",
            {
                "username": "apitest_user",
                "email": "apitest@example.com",
                "password": "securepass1",
                "password_confirm": "securepass1",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["username"], "apitest_user")

    def test_register_password_mismatch_400(self):
        r = self.client.post(
            "/api/users/register/",
            {
                "username": "u2",
                "email": "u2@example.com",
                "password": "securepass1",
                "password_confirm": "other",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 400)

    def test_token_obtain_after_register(self):
        self.client.post(
            "/api/users/register/",
            {
                "username": "token_user",
                "email": "token@example.com",
                "password": "securepass1",
                "password_confirm": "securepass1",
            },
            format="json",
        )
        r = self.client.post(
            "/api/auth/token/",
            {"username": "token_user", "password": "securepass1"},
            format="json",
        )
        self.assertEqual(r.status_code, 200)
        self.assertIn("access", r.data)
        self.assertIn("refresh", r.data)

    def test_profile_requires_auth(self):
        r = self.client.get("/api/users/profile/")
        self.assertEqual(r.status_code, 401)

    def test_profile_get_with_jwt(self):
        self.client.post(
            "/api/users/register/",
            {
                "username": "prof_user",
                "email": "prof@example.com",
                "password": "securepass1",
                "password_confirm": "securepass1",
            },
            format="json",
        )
        tok = self.client.post(
            "/api/auth/token/",
            {"username": "prof_user", "password": "securepass1"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tok.data['access']}")
        r = self.client.get("/api/users/profile/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["username"], "prof_user")
