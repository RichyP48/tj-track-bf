# 🚀 Configuration IntelliJ pour TJ-Track

## ⚙️ **Méthode 1: application.properties (Recommandée)**
✅ Fichier `application.properties` créé avec :
```properties
spring.profiles.active=dev
```

## ⚙️ **Méthode 2: Run Configuration IntelliJ**
1. Run → Edit Configurations
2. Sélectionner TjTrackApplication
3. Dans "Active profiles" : `dev`
4. Apply → OK

## ⚙️ **Méthode 3: VM Options**
Dans Run Configuration → VM options :
```
-Dspring.profiles.active=dev
```

## 🔄 **Redémarrer l'application**
- Stop l'application actuelle
- Run à nouveau
- Vérifier les logs : `The following 1 profile is active: "dev"`

## ✅ **Logs attendus**
```
INFO --- [tj-track] [main] com.track.TjTrackApplication : The following 1 profile is active: "dev"
INFO --- [tj-track] [main] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port(s): 8080
INFO --- [tj-track] [main] com.track.TjTrackApplication : Started TjTrackApplication
```

## 🎯 **Test de connexion**
- http://localhost:8080/api/v1.0
- Vérifier connexion à Aurora PostgreSQL dans les logs