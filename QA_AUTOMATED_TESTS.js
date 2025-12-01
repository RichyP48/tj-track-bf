// Tests Automatisés QA - TJ-Track Stock & E-commerce
// Framework: Jest + Axios pour les tests API

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/v1.0';
let authToken = '';
let testArticleId = null;

// Configuration des tests
beforeAll(async () => {
  // Authentification pour obtenir un token
  try {
    const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
      email: 'admin@test.com',
      password: 'password123'
    });
    authToken = loginResponse.data.token;
  } catch (error) {
    console.error('Erreur authentification:', error.message);
  }
});

// Headers avec authentification
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${authToken}`,
  'Content-Type': 'application/json'
});

describe('🏪 Tests API Gestion de Stock', () => {
  
  test('TC001: Récupération liste articles', async () => {
    const response = await axios.get(`${API_BASE_URL}/stock/articles`, {
      headers: getAuthHeaders()
    });
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('TC002: Création nouvel article', async () => {
    const newArticle = {
      codeArticle: `TEST-${Date.now()}`,
      designation: 'Article Test QA',
      description: 'Article créé automatiquement par les tests',
      prixUnitaireHt: 100.00,
      tauxTva: 20.0,
      prixUnitaireTtc: 120.00,
      quantiteStock: 50,
      seuilAlerte: 10
    };

    const response = await axios.post(`${API_BASE_URL}/stock/articles`, newArticle, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(201);
    expect(response.data.codeArticle).toBe(newArticle.codeArticle);
    expect(response.data.designation).toBe(newArticle.designation);
    
    testArticleId = response.data.id;
  });

  test('TC003: Modification article', async () => {
    if (!testArticleId) {
      throw new Error('Article de test non créé');
    }

    const updatedData = {
      designation: 'Article Test QA - Modifié',
      prixUnitaireHt: 150.00
    };

    const response = await axios.put(`${API_BASE_URL}/stock/articles/${testArticleId}`, updatedData, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(200);
    expect(response.data.designation).toBe(updatedData.designation);
    expect(response.data.prixUnitaireHt).toBe(updatedData.prixUnitaireHt);
  });

  test('TC004: Récupération statistiques stock', async () => {
    const response = await axios.get(`${API_BASE_URL}/stock/stats`, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('totalArticles');
    expect(response.data).toHaveProperty('totalValeurStock');
    expect(response.data).toHaveProperty('articlesEnRupture');
    expect(response.data).toHaveProperty('mouvementsAujourdhui');
  });

  test('TC005: Création mouvement de stock', async () => {
    if (!testArticleId) {
      throw new Error('Article de test non créé');
    }

    const mouvement = {
      article: { id: testArticleId },
      typeMouvement: 'ENTREE',
      quantite: 20,
      motif: 'Test automatisé - Entrée stock'
    };

    const response = await axios.post(`${API_BASE_URL}/stock/mouvements`, mouvement, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(201);
    expect(response.data.typeMouvement).toBe('ENTREE');
    expect(response.data.quantite).toBe(20);
  });
});

describe('🛒 Tests API E-commerce', () => {
  
  test('TC008: Récupération catalogue public', async () => {
    const response = await axios.get(`${API_BASE_URL}/catalogue`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('TC009: Ajout article au panier', async () => {
    if (!testArticleId) {
      throw new Error('Article de test non créé');
    }

    const response = await axios.post(`${API_BASE_URL}/panier/add`, {
      articleId: testArticleId,
      quantite: 2
    }, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(200);
    expect(response.data.items).toBeDefined();
    expect(response.data.totalTtc).toBeGreaterThan(0);
  });

  test('TC010: Récupération contenu panier', async () => {
    const response = await axios.get(`${API_BASE_URL}/panier`, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('items');
    expect(response.data).toHaveProperty('totalHt');
    expect(response.data).toHaveProperty('totalTtc');
  });

  test('TC011: Création commande', async () => {
    const response = await axios.post(`${API_BASE_URL}/commandes`, {}, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('numeroCommande');
    expect(response.data.statut).toBe('EN_ATTENTE');
  });

  test('TC012: Ajout à la wishlist', async () => {
    if (!testArticleId) {
      throw new Error('Article de test non créé');
    }

    const response = await axios.post(`${API_BASE_URL}/wishlist/add`, {
      articleId: testArticleId
    }, {
      headers: getAuthHeaders()
    });

    expect(response.status).toBe(201);
    expect(response.data.article.id).toBe(testArticleId);
  });
});

describe('🔒 Tests de Sécurité', () => {
  
  test('TC027: Accès non autorisé aux articles', async () => {
    try {
      await axios.get(`${API_BASE_URL}/stock/articles`);
      fail('Devrait retourner une erreur 401');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });

  test('TC028: Accès admin avec token client', async () => {
    // Simuler un token client (à adapter selon votre implémentation)
    const clientHeaders = {
      'Authorization': 'Bearer CLIENT_TOKEN_INVALID',
      'Content-Type': 'application/json'
    };

    try {
      await axios.get(`${API_BASE_URL}/admin/users`, { headers: clientHeaders });
      fail('Devrait retourner une erreur 403');
    } catch (error) {
      expect([401, 403]).toContain(error.response.status);
    }
  });
});

describe('⚡ Tests de Performance', () => {
  
  test('TC031: Temps de réponse catalogue < 500ms', async () => {
    const startTime = Date.now();
    
    const response = await axios.get(`${API_BASE_URL}/catalogue`);
    
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(500);
  });

  test('TC032: Temps de réponse articles < 300ms', async () => {
    const startTime = Date.now();
    
    const response = await axios.get(`${API_BASE_URL}/stock/articles`, {
      headers: getAuthHeaders()
    });
    
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(300);
  });
});

// Nettoyage après les tests
afterAll(async () => {
  // Supprimer l'article de test créé
  if (testArticleId && authToken) {
    try {
      await axios.delete(`${API_BASE_URL}/stock/articles/${testArticleId}`, {
        headers: getAuthHeaders()
      });
      console.log(`Article de test ${testArticleId} supprimé`);
    } catch (error) {
      console.error('Erreur suppression article test:', error.message);
    }
  }
});

// Utilitaires pour les tests
const TestUtils = {
  // Générer des données de test aléatoires
  generateTestArticle: () => ({
    codeArticle: `TEST-${Math.random().toString(36).substr(2, 9)}`,
    designation: `Article Test ${Date.now()}`,
    description: 'Article généré pour les tests automatisés',
    prixUnitaireHt: Math.floor(Math.random() * 1000) + 10,
    tauxTva: 20.0,
    quantiteStock: Math.floor(Math.random() * 100) + 1,
    seuilAlerte: 5
  }),

  // Attendre un délai
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Valider la structure d'un article
  validateArticleStructure: (article) => {
    expect(article).toHaveProperty('id');
    expect(article).toHaveProperty('codeArticle');
    expect(article).toHaveProperty('designation');
    expect(article).toHaveProperty('prixUnitaireHt');
    expect(article).toHaveProperty('quantiteStock');
    expect(article).toHaveProperty('seuilAlerte');
  }
};

module.exports = { TestUtils };