# Scripts de Tests QA - Exécution

## 🧪 Tests Backend API (Postman/cURL)

### Test 1: Création d'un article
```bash
curl -X POST http://localhost:8080/api/v1.0/stock/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "codeArticle": "TEST001",
    "designation": "Article Test QA",
    "description": "Article créé pour les tests QA",
    "prixUnitaireHt": 100.00,
    "tauxTva": 20.0,
    "prixUnitaireTtc": 120.00,
    "quantiteStock": 50,
    "seuilAlerte": 10
  }'
```

### Test 2: Récupération du catalogue
```bash
curl -X GET http://localhost:8080/api/v1.0/catalogue \
  -H "Accept: application/json"
```

### Test 3: Ajout au panier
```bash
curl -X POST http://localhost:8080/api/v1.0/panier/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "articleId": 1,
    "quantite": 2
  }'
```

### Test 4: Création de commande
```bash
curl -X POST http://localhost:8080/api/v1.0/commandes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🖥️ Tests Frontend (Manuel)

### Test 1: Navigation Landing Page
1. Ouvrir http://localhost:5173
2. Vérifier que la page se charge sans erreur
3. Vérifier que les produits s'affichent
4. Tester la recherche dans le header

### Test 2: Authentification
1. Cliquer sur "Connexion"
2. Saisir email/password valides
3. Vérifier la redirection vers dashboard
4. Vérifier que la sidebar affiche les bons menus

### Test 3: Gestion de Stock (Commerçant)
1. Se connecter avec un compte commerçant
2. Aller sur /stock
3. Vérifier l'affichage des statistiques
4. Tester la recherche dans le tableau
5. Tester le tri des colonnes

### Test 4: Catalogue Public
1. Aller sur /catalog (sans connexion)
2. Vérifier l'affichage des produits
3. Tester le changement de vue (grille/liste)
4. Tester la recherche de produits

### Test 5: Panier
1. Ajouter des produits au panier
2. Aller sur /cart
3. Modifier les quantités
4. Supprimer des articles
5. Passer une commande

## 🔒 Tests de Sécurité

### Test 1: Accès non autorisé
```bash
# Sans token
curl -X GET http://localhost:8080/api/v1.0/stock/articles
# Résultat attendu: 401 Unauthorized

# Avec token expiré
curl -X GET http://localhost:8080/api/v1.0/stock/articles \
  -H "Authorization: Bearer EXPIRED_TOKEN"
# Résultat attendu: 401 Unauthorized
```

### Test 2: Validation des rôles
```bash
# Client tentant d'accéder aux stats admin
curl -X GET http://localhost:8080/api/v1.0/admin/users \
  -H "Authorization: Bearer CLIENT_TOKEN"
# Résultat attendu: 403 Forbidden
```

## 📊 Tests de Performance

### Test 1: Charge API
```javascript
// Script K6 pour test de charge
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 50, // 50 utilisateurs virtuels
  duration: '30s',
};

export default function() {
  let response = http.get('http://localhost:8080/api/v1.0/catalogue');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### Test 2: Frontend Performance
1. Ouvrir DevTools > Lighthouse
2. Lancer audit Performance
3. Vérifier score > 80
4. Vérifier First Contentful Paint < 2s

## 🐛 Tests de Régression

### Checklist après chaque modification:
- [ ] Landing page accessible
- [ ] Authentification fonctionne
- [ ] Sidebar personnalisée par rôle
- [ ] Catalogue public accessible
- [ ] Panier fonctionnel
- [ ] Stock dashboard (commerçant)
- [ ] Gestion utilisateurs (admin)
- [ ] Responsive design mobile
- [ ] Notifications toast
- [ ] Gestion d'erreurs

## 📱 Tests Mobile

### Test 1: Responsive Design
1. Ouvrir DevTools > Device Toolbar
2. Tester sur iPhone 12, iPad, Android
3. Vérifier navigation tactile
4. Vérifier lisibilité du texte

### Test 2: Performance Mobile
1. Throttling réseau 3G
2. Vérifier temps de chargement < 3s
3. Tester interactions tactiles

## 🔄 Tests d'Intégration

### Test 1: Flux E-commerce Complet
1. Parcourir le catalogue
2. Ajouter produits au panier
3. Modifier quantités
4. Passer commande
5. Vérifier stock mis à jour
6. Vérifier commande dans dashboard

### Test 2: Gestion Stock Complète
1. Créer nouvel article
2. Ajouter mouvement d'entrée
3. Vérifier stock mis à jour
4. Créer mouvement de sortie
5. Vérifier alerte rupture si nécessaire

## 📋 Rapport de Tests

### Template de rapport:
```
Date: [DATE]
Testeur: [NOM]
Version: [VERSION]
Environnement: [DEV/STAGING/PROD]

Tests Exécutés: X/Y
Tests Réussis: X
Tests Échoués: Y
Bugs Trouvés: Z

Détails des échecs:
- [Description bug 1]
- [Description bug 2]

Recommandations:
- [Action 1]
- [Action 2]
```