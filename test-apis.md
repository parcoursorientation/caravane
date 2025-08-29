# Test des APIs créées

## 1. API Événements publics

- **GET** `/api/evenements-public` - Liste tous les événements
- **GET** `/api/evenements-public/[id]` - Détails d'un événement spécifique

## 2. API Exposants d'un événement

- **GET** `/api/evenements/[id]/exposants` - Liste des exposants pour un événement

## 3. API Inscriptions

- **POST** `/api/inscriptions` - Créer une nouvelle inscription

### Exemple de données pour l'inscription :

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "telephone": "0612345678",
  "evenementId": "id-de-l-evenement",
  "typeParticipant": "ETUDIANT",
  "etablissement": "Lycée Victor Hugo",
  "niveau": "Terminale",
  "branche": "Scientifique",
  "interets": "Informatique, Ingénierie",
  "message": "Je souhaite en savoir plus sur les formations",
  "souhaiteNewsletter": true
}
```

## 4. Fonctionnalités implémentées dans la page Programme

### Bouton "Voir les détails"

- Ouvre un modal avec les détails complets de l'événement
- Affiche les informations du lycée
- Montre la liste des exposants participants
- Affiche les programmes détaillés

### Bouton "S'inscrire"

- Redirige vers la page d'inscription avec l'ID de l'événement pré-rempli
- URL : `/inscription?evenement=[id]`

## 5. Configuration Email

Pour que les emails fonctionnent, configurez dans `.env.local` :

```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
SMTP_FROM="votre-email@gmail.com"
ADMIN_EMAIL="admin@atlantisevents.ma"
```

## 6. Tests à effectuer

1. **Page Programme** : http://localhost:3000/programme

   - Cliquer sur "Voir les détails" pour ouvrir le modal
   - Cliquer sur "S'inscrire" pour aller à la page d'inscription

2. **Page Inscription** : http://localhost:3000/inscription

   - Tester l'inscription avec et sans événement spécifique
   - Vérifier la réception des emails (si configuré)

3. **APIs** : Tester avec un outil comme Postman ou curl
   - GET /api/evenements-public
   - GET /api/evenements-public/[id]
   - POST /api/inscriptions
