# Backend - Weather API

API Express pour fournir des données météorologiques.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du dossier backend :

```
PORT=5000
WEATHER_API_KEY=votre_clé_api_openweathermap
NODE_ENV=development
```

## Démarrage

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Endpoints

### Santé du serveur
```
GET /api/health
```

### Météo actuelle
```
GET /api/weather/current?city=<city>
```

Réponse :
```json
{
  "city": "Paris",
  "country": "FR",
  "temperature": 12.5,
  "feelsLike": 11.2,
  "humidity": 65,
  "pressure": 1013,
  "description": "partly cloudy",
  "icon": "02d",
  "windSpeed": 3.5,
  "cloudiness": 40
}
```

### Prévisions
```
GET /api/weather/forecast?city=<city>
```

Réponse :
```json
{
  "city": "Paris",
  "country": "FR",
  "forecast": [
    {
      "date": "2024-01-01 12:00:00",
      "temperature": 10,
      "description": "cloudy",
      "icon": "04d",
      "windSpeed": 2.5,
      "humidity": 70
    }
  ]
}
```

## Dépendances

- **express** : Framework web
- **axios** : Client HTTP
- **cors** : Middleware CORS
- **dotenv** : Gestion des variables d'environnement
- **nodemon** : Rechargement automatique en développement

## Gestion d'erreurs

L'API retourne les codes HTTP appropriés :
- `200` : Succès
- `400` : Paramètres manquants
- `404` : Ville non trouvée
- `500` : Erreur serveur
