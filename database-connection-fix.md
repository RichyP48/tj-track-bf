# 🔧 Correction URL PostgreSQL

## ❌ **URL incorrecte**
```
jdbc:postgresql:///tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com
```

## ✅ **URL correcte**
```
jdbc:postgresql://tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com:5432/postgres
```

## 📋 **Format URL PostgreSQL**
```
jdbc:postgresql://[HOST]:[PORT]/[DATABASE_NAME]
```

## 🔧 **Variables d'environnement à définir**
```bash
# Pour Elastic Beanstalk
eb setenv DATABASE_URL="jdbc:postgresql://tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com:5432/postgres"
eb setenv DB_USERNAME="postgres"
eb setenv DB_PASSWORD="votre-mot-de-passe"
```

## 🧪 **Test de connexion**
```bash
# Test avec psql
psql -h tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com -p 5432 -U postgres -d postgres
```

## 📝 **Notes importantes**
- **Host** : tjtrackdb.c7uoowekgnjx.eu-north-1.rds.amazonaws.com
- **Port** : 5432 (port par défaut PostgreSQL)
- **Database** : postgres (base par défaut)
- **SSL** : Activé par défaut sur RDS