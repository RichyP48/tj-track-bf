# 🚀 Déploiement Simple TJ-Track

## 📋 Variables d'environnement à définir

### Pour Elastic Beanstalk
```bash
eb setenv DATABASE_URL="jdbc:postgresql://tj-track.cluster-xxxxx.eu-north-1.rds.amazonaws.com:5432/postgres"
eb setenv DB_USERNAME="postgres"
eb setenv DB_PASSWORD="votre-mot-de-passe-aurora"
eb setenv JWT_SECRET="votre-cle-jwt-256-bits"
eb setenv MAIL_USERNAME="votre-email@gmail.com"
eb setenv MAIL_PASSWORD="votre-mot-de-passe-app"
```

### Récupérer les credentials Aurora
1. Aller dans AWS Console > RDS > tj-track cluster
2. Copier l'endpoint du cluster
3. Utiliser le username/password que vous avez défini

### URL de connexion Aurora
```
jdbc:postgresql://tj-track.cluster-xxxxx.eu-north-1.rds.amazonaws.com:5432/postgres
```

## ✅ Avantages méthode simple
- ✅ Pas de code AWS SDK supplémentaire
- ✅ Configuration standard Spring Boot
- ✅ Plus facile à déboguer
- ✅ Fonctionne partout (local, Docker, AWS)

## 🔐 Sécurité
- Variables d'environnement chiffrées dans EB
- Pas d'exposition des credentials dans le code
- Rotation manuelle des mots de passe