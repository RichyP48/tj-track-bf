# 🚀 Déploiement TJ-Track - Checklist

## ✅ Configuration Aurora PostgreSQL

### 📋 Informations du cluster
- **Cluster ID**: tj-track
- **Region**: eu-north-1
- **Account ID**: 692018624387
- **Secret ARN**: arn:aws:secretsmanager:eu-north-1:692018624387:secret:rds!cluster-9926d4dc-59d9-4637-b285-d3735bcffa6c-SQx6Au

### 🔐 Étapes de déploiement

1. **IAM Role pour Elastic Beanstalk**
   ```bash
   aws iam create-role --role-name tj-track-eb-role --assume-role-policy-document file://eb-trust-policy.json
   aws iam attach-role-policy --role-name tj-track-eb-role --policy-arn file://aws-iam-policy.json
   ```

2. **Variables d'environnement EB**
   ```bash
   eb setenv AWS_DEFAULT_REGION=eu-north-1
   eb setenv JWT_SECRET=your-jwt-secret-256-bits
   eb setenv MAIL_USERNAME=your-email@gmail.com
   eb setenv MAIL_PASSWORD=your-app-password
   ```

3. **Test de connexion**
   ```bash
   # Vérifier l'accès au secret
   aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:eu-north-1:692018624387:secret:rds!cluster-9926d4dc-59d9-4637-b285-d3735bcffa6c-SQx6Au --region eu-north-1
   ```

4. **Déploiement**
   ```bash
   cd tj-track
   ./mvnw clean package -DskipTests
   eb deploy
   ```

### 🔍 Vérifications post-déploiement
- [ ] Application démarre sans erreur
- [ ] Connexion à Aurora réussie
- [ ] Endpoints API accessibles
- [ ] Logs sans erreur de connexion DB