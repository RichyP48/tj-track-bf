# TJ-Track - Plateforme E-commerce Ultra-Moderne

## 🚀 Description
TJ-Track est une plateforme e-commerce nouvelle génération avec une interface ultra-moderne et des fonctionnalités avancées de gestion des commandes et livraisons.

## 🏗️ Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Spring Boot + Java
- **Base de données**: MySQL/PostgreSQL
- **Authentification**: JWT + OTP

## 📁 Structure du Projet
```
tj-track/
├── track-front/          # Application React
├── tj-track/            # API Spring Boot
└── README.md
```

## 🛠️ Installation

### Frontend
```bash
cd track-front
npm install
npm start
```

### Backend
```bash
cd tj-track
./mvnw spring-boot:run
```

## ✨ Fonctionnalités
- 🎨 Design ultra-moderne avec glassmorphism
- 🔐 Authentification sécurisée (JWT + OTP)
- 👥 Gestion des utilisateurs avec approbation admin
- 📊 Dashboard interactif avec analytics
- 📱 Interface responsive
- 🌐 Multi-rôles (Client, Commerçant, Livreur, Admin)

## 🚀 Déploiement
Le projet est configuré pour un déploiement sur AWS avec:
- S3 + CloudFront (Frontend)
- Elastic Beanstalk (Backend)
- RDS (Base de données)

## 👨‍💻 Développeur
Développé par RichyP48