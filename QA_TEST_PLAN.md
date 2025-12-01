# Plan de Tests QA - TJ-Track Stock & E-commerce

## 🎯 Objectifs
- Valider la fonctionnalité complète du système de gestion de stock
- Tester l'intégration e-commerce (catalogue, panier, commandes)
- Vérifier la sécurité et les autorisations par rôle
- Valider l'expérience utilisateur frontend

## 📊 Matrice de Tests

### 1. TESTS BACKEND API

#### 1.1 Gestion de Stock
| Test Case | Endpoint | Méthode | Données | Résultat Attendu | Statut |
|-----------|----------|---------|---------|------------------|--------|
| TC001 | `/stock/articles` | GET | - | Liste articles | ⏳ |
| TC002 | `/stock/articles` | POST | Article valide | Article créé | ⏳ |
| TC003 | `/stock/articles/{id}` | PUT | Données modifiées | Article mis à jour | ⏳ |
| TC004 | `/stock/articles/{id}` | DELETE | ID valide | Article supprimé | ⏳ |
| TC005 | `/stock/categories` | GET | - | Liste catégories | ⏳ |
| TC006 | `/stock/mouvements` | POST | Mouvement valide | Mouvement créé | ⏳ |
| TC007 | `/stock/stats` | GET | - | Statistiques stock | ⏳ |

#### 1.2 E-commerce
| Test Case | Endpoint | Méthode | Données | Résultat Attendu | Statut |
|-----------|----------|---------|---------|------------------|--------|
| TC008 | `/catalogue` | GET | - | Catalogue produits | ⏳ |
| TC009 | `/panier/add` | POST | Article + quantité | Ajout au panier | ⏳ |
| TC010 | `/panier` | GET | - | Contenu panier | ⏳ |
| TC011 | `/commandes` | POST | - | Commande créée | ⏳ |
| TC012 | `/wishlist/add` | POST | Article ID | Ajout favoris | ⏳ |

### 2. TESTS FRONTEND

#### 2.1 Navigation & Authentification
| Test Case | Page | Action | Résultat Attendu | Statut |
|-----------|------|--------|------------------|--------|
| TC013 | Landing | Accès sans auth | Page accessible | ⏳ |
| TC014 | Stock Dashboard | Accès sans auth | Redirection login | ⏳ |
| TC015 | Catalogue | Accès sans auth | Page accessible | ⏳ |
| TC016 | Sidebar | Connexion admin | Menus admin visibles | ⏳ |
| TC017 | Sidebar | Connexion commerçant | Menus commerçant | ⏳ |

#### 2.2 Fonctionnalités Stock
| Test Case | Composant | Action | Résultat Attendu | Statut |
|-----------|-----------|--------|------------------|--------|
| TC018 | StockDashboard | Chargement | Stats affichées | ⏳ |
| TC019 | DataTable | Recherche | Filtrage articles | ⏳ |
| TC020 | DataTable | Tri | Tri par colonne | ⏳ |
| TC021 | Article | Suppression | Confirmation + suppression | ⏳ |

#### 2.3 Fonctionnalités E-commerce
| Test Case | Composant | Action | Résultat Attendu | Statut |
|-----------|-----------|--------|------------------|--------|
| TC022 | ProductCatalog | Chargement | Produits affichés | ⏳ |
| TC023 | ProductCatalog | Recherche | Filtrage produits | ⏳ |
| TC024 | ProductCatalog | Ajout panier | Toast succès | ⏳ |
| TC025 | ShoppingCart | Modification quantité | Mise à jour prix | ⏳ |
| TC026 | ShoppingCart | Commande | Création commande | ⏳ |

### 3. TESTS DE SÉCURITÉ

| Test Case | Endpoint/Page | Test | Résultat Attendu | Statut |
|-----------|---------------|------|------------------|--------|
| TC027 | `/stock/**` | Accès non-auth | 401 Unauthorized | ⏳ |
| TC028 | `/admin/**` | Accès non-admin | 403 Forbidden | ⏳ |
| TC029 | JWT Token | Token expiré | Déconnexion auto | ⏳ |
| TC030 | CORS | Origine invalide | Requête bloquée | ⏳ |

### 4. TESTS DE PERFORMANCE

| Test Case | Endpoint | Charge | Temps Réponse | Statut |
|-----------|----------|--------|---------------|--------|
| TC031 | `/catalogue` | 100 req/s | < 500ms | ⏳ |
| TC032 | `/stock/articles` | 50 req/s | < 300ms | ⏳ |
| TC033 | Frontend | Chargement initial | < 2s | ⏳ |

## 🔧 Environnement de Test
- **Backend**: http://localhost:8080/api/v1.0
- **Frontend**: http://localhost:5173
- **Base de données**: H2 (test) / PostgreSQL (prod)
- **Navigateurs**: Chrome, Firefox, Safari
- **Outils**: Postman, Jest, Cypress

## 📝 Critères d'Acceptation
- ✅ Tous les tests critiques (TC001-TC015) passent
- ✅ Aucune régression sur les fonctionnalités existantes
- ✅ Performance acceptable (< 2s chargement)
- ✅ Sécurité validée (authentification/autorisation)
- ✅ Interface responsive sur mobile/desktop

## 🚨 Bugs Identifiés
1. **BUG001**: Redirection incorrecte vers login page
2. **BUG002**: Token JWT non validé correctement
3. **BUG003**: Sidebar non personnalisée par rôle

## 📊 Métriques de Qualité
- **Couverture de code**: > 80%
- **Tests automatisés**: > 90%
- **Temps de réponse API**: < 500ms
- **Disponibilité**: > 99.5%