from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.blog.models import Category

User = get_user_model()

class SecurityAndValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(username="admin", password="password", email="admin@example.com")
        self.client.force_authenticate(user=self.user)

    def test_sql_injection_payload(self):
        """
        Tenta enviar payload malicioso na criacao de uma Categoria
        para ver se a aplicacao cai ou se trata o erro adequadamente.
        Django ORM e imune por default, entao ele vai gravar a string literal
        (ou falhar num validator de HTML que acabamos de adicionar).
        """
        payload = {
            "name": "Normal Category'; DROP TABLE apps_category; --",
        }
        response = self.client.post("/api/cms/categories/", payload)
        self.assertEqual(response.status_code, 201)
        
        # O Django deve ter criado literalmente uma categoria com o nome exato.
        # Nenhuma tabela deve ter sido dropada.
        cat = Category.objects.get(id=response.data["id"])
        self.assertEqual(cat.name, "Normal Category'; DROP TABLE apps_category; --")

    def test_wikipedia_block_validation(self):
        """
        Testa o nosso validator de strict text, assegurando que o nome não contenha wikipedia.
        """
        payload = {
            "name": "Link to wikipedia",
        }
        response = self.client.post("/api/cms/categories/", payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.data)
        self.assertTrue(any("wikipedia" in str(err).lower() for err in response.data["name"]))

    def test_html_block_validation(self):
        """
        Testa o validator de strict text contra HTML (prevenção contra XSS e lixo).
        """
        payload = {
            "name": "<script>alert('xss')</script>",
        }
        response = self.client.post("/api/cms/categories/", payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.data)
        self.assertTrue(any("html" in str(err).lower() for err in response.data["name"]))

    def test_sql_injection_in_search(self):
        """
        Testa um SQL Injection comum na query de GET / pesquisa.
        """
        response = self.client.get("/api/cms/categories/?search=' OR 1=1 --")
        self.assertEqual(response.status_code, 200)
        # O Django escapa o SQL do search. Retorna vazio pois nao ha match com OR 1=1
        self.assertEqual(len(response.data["results"]), 0)
