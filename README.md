# Weather Application

Une application météo complète avec React et Node.js/Express. Permet de chercher une ville et d'afficher la météo actuelle ainsi que les prévisions.

## Structure du projet

```
metio/
├── backend/          # API Express
│   ├── server.js     # Serveur principal
│   ├── package.json  # Dépendances
│   ├── .env          # Variables d'environnement
│   └── .env.example  # Template .env
├── frontend/         # Application React
│   ├── public/       # Fichiers statiques
│   ├── src/          # Code source
│   │   ├── components/  # Composants React
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation et démarrage

### 1. Backend

```bash
cd backend
npm install
```

Configurez votre clé API OpenWeatherMap dans `.env` :

```
PORT=5000
WEATHER_API_KEY=votre_clé_api_ici
NODE_ENV=development
```

Obtenir une clé API gratuite : https://openweathermap.org/api

Démarrer le serveur :

```bash
npm run dev  # Avec nodemon
# ou
npm start    # Mode production
```

Le backend sera disponible sur `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

L'application React démarrera sur `http://localhost:3000`

## Fonctionnalités

- **Recherche de ville** : Entrez le nom d'une ville pour voir sa météo
- **Météo actuelle** : Température, humidité, vent, pression
- **Prévisions** : Prévisions sur 5 jours (8 prévisions de 3h)
- **Icônes météo** : Affichage visuel des conditions météorologiques
- **Design responsive** : Fonctionne sur desktop et mobile

## Architecture

### Backend (Express)

- **Routes API** :
  - `GET /api/health` - Vérifier l'état du serveur
  - `GET /api/weather/current?city=<city>` - Météo actuelle
  - `GET /api/weather/forecast?city=<city>` - Prévisions
  
- **Technologies** :
  - Express.js : Framework web
  - Axios : Appels HTTP
  - CORS : Gestion des requêtes cross-origin
  - Dotenv : Variables d'environnement
  - OpenWeatherMap API : Source de données météo

### Frontend (React)

- **Composants** :
  - `App` : Composant principal
  - `SearchBar` : Barre de recherche
  - `CurrentWeather` : Affichage de la météo actuelle
  - `Forecast` : Affichage des prévisions

- **Technologies** :
  - React 18
  - CSS3 avec gradients et animations
  - Fetch API pour les requêtes
  - Responsive Design

## API OpenWeatherMap

L'application utilise l'API OpenWeatherMap gratuite.

- Inscrivez-vous : https://openweathermap.org/api
- Générez une clé API
- Ajoutez-la dans le fichier `.env` du backend

## Dépendances principales

### Backend
- express
- axios
- cors
- dotenv
- nodemon (dev)

### Frontend
- react
- react-dom
- axios

## Troubleshooting

### Backend ne répond pas
- Vérifiez que le port 5000 est libre
- Vérifiez que `WEATHER_API_KEY` est bien définie dans `.env`
- Consultez les logs du serveur

### Les appels API échouent
- Assurez-vous que votre clé API est valide
- Vérifiez votre connexion Internet
- Vérifiez que le backend est en cours d'exécution

### Erreur CORS
- Vérifiez que le proxy est configuré dans `frontend/package.json`
- Le proxy doit pointer vers `http://localhost:5000`

## Développement futur

- [ ] Ajouter la géolocalisation automatique
- [ ] Ajouter des graphiques de prévisions
- [ ] Ajouter plusieurs villes favorites
- [ ] Ajouter la possibilité de changer les unités (°C/°F)
- [ ] Ajouter les prévisions détaillées horaires
- [ ] Ajouter l'historique des recherches

## Licence

MIT

## Contact

Pour toute question ou suggestion, créez une issue sur le projet.
