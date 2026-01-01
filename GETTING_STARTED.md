# Weather App - Guide de démarrage rapide

## Prérequis

- Node.js (v14 ou plus)
- npm ou yarn
- Une clé API OpenWeatherMap (gratuit)

## Étapes pour démarrer

### 1. Obtenez une clé API OpenWeatherMap
- Allez sur https://openweathermap.org/api
- Créez un compte gratuit
- Générez une clé API

### 2. Configurez le backend

```bash
# Allez dans le dossier backend
cd backend

# Éditez le fichier .env
# Windows : notepad .env
# Linux/Mac : nano .env

# Remplacez votre_openweathermap_api_key_here par votre clé API
# Sauvegardez le fichier
```

Contenu du `.env` :
```
PORT=5000
WEATHER_API_KEY=VOTRE_CLE_API_ICI
NODE_ENV=development
```

### 3. Démarrez le backend

```bash
# Dans le dossier backend
npm run dev
```

Vous devriez voir : "Weather API backend running on http://localhost:5000"

### 4. Dans un nouveau terminal, démarrez le frontend

```bash
# Retournez au dossier root ou ouvrez un nouveau terminal
cd frontend
npm start
```

### 5. Accédez à l'application

Ouvrez votre navigateur et allez sur `http://localhost:3000`

## Dépannage

### "City not found"
- Assurez-vous que vous entrez le nom de la ville en anglais
- Exemples : Paris, London, New York, Tokyo

### "Failed to fetch weather data"
- Vérifiez que votre clé API est correcte
- Vérifiez que le backend s'exécute sur le port 5000
- Vérifiez votre connexion Internet

### Port 5000 ou 3000 déjà utilisé
- Changez le PORT dans `backend/.env`
- Changez le port dans `frontend/package.json` : `"start": "PORT=3001 react-scripts start"`

## Fichiers importants

- `backend/.env` : Configuration du backend
- `backend/server.js` : Code du serveur Express
- `frontend/src/App.js` : Composant principal React
- `frontend/src/components/` : Composants réutilisables

## Structure finale

```
metio/
├── backend/
│   ├── node_modules/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Prochaines étapes

Une fois l'application en cours d'exécution, vous pouvez :
- Rechercher des villes
- Voir les informations météorologiques détaillées
- Consulter les prévisions sur 5 jours

Bon développement ! 🌤️
