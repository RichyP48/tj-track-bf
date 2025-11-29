#!/bin/bash
# Script de déploiement avec les vraies credentials

echo "🚀 Configuration des variables d'environnement pour TJ-Track"

# Variables de base de données
eb setenv DATABASE_URL="jdbc:postgresql://tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com:5434/tjtrackdb"
eb setenv DB_USERNAME="tjtrack"
eb setenv DB_PASSWORD="123tjrack"

# Variables JWT et Mail (à personnaliser)
eb setenv JWT_SECRET="your-jwt-secret-key-min-256-bits-change-this"
eb setenv MAIL_USERNAME="your-email@gmail.com"
eb setenv MAIL_PASSWORD="your-app-password"

# Variables AWS
eb setenv AWS_DEFAULT_REGION="eu-north-1"

echo "✅ Variables d'environnement configurées"
echo "🔧 Déploiement en cours..."

# Build et déploiement
cd tj-track
./mvnw clean package -DskipTests
eb deploy

echo "🎉 Déploiement terminé !"