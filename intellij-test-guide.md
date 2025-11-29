# 🧪 Test TJ-Track dans IntelliJ IDEA

## 📋 **Étapes de configuration**

### 1. **Ouvrir le projet**
- File → Open → Sélectionner le dossier `tj-track (2)`
- IntelliJ détectera automatiquement les projets Maven et React

### 2. **Configuration Backend (Spring Boot)**
- Aller dans `tj-track/src/main/java/com/track/TjTrackApplication.java`
- Clic droit → Run 'TjTrackApplication'
- Ou créer une Run Configuration :
  - Run → Edit Configurations
  - Add New → Spring Boot
  - Main class: `com.track.TjTrackApplication`
  - Active profiles: `dev`

### 3. **Configuration Frontend (React)**
- Ouvrir Terminal dans IntelliJ
- Naviguer vers `track-front` :
  ```bash
  cd track-front
  npm install
  npm start
  ```

### 4. **Variables d'environnement (si nécessaire)**
Dans Run Configuration → Environment Variables :
```
JWT_SECRET=dev-secret-key-for-testing-only
MAIL_USERNAME=test@gmail.com
MAIL_PASSWORD=test-password
```

## 🔧 **Configuration Database dans IntelliJ**

### Database Tool Window
1. View → Tool Windows → Database
2. Add → Data Source → PostgreSQL
3. Configuration :
   - Host: `tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com`
   - Port: `5434`
   - Database: `tjtrackdb`
   - User: `tjtrack`
   - Password: `tjrack@`

## 🚀 **Lancement des tests**

### Backend
- Port: `http://localhost:8080`
- API: `http://localhost:8080/api/v1.0`
- Swagger (si configuré): `http://localhost:8080/swagger-ui.html`

### Frontend  
- Port: `http://localhost:3000`
- Se connecte automatiquement au backend sur le port 8080

## ✅ **Vérifications**
- [ ] Backend démarre sans erreur
- [ ] Connexion à Aurora réussie
- [ ] Frontend charge correctement
- [ ] API endpoints répondent
- [ ] Authentification fonctionne