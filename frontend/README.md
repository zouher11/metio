# Frontend - Weather App

Application React pour afficher les données météorologiques.

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

L'application démarre sur `http://localhost:3000`

## Fonctionnalités

1. **Recherche** : Entrez le nom d'une ville
2. **Météo actuelle** : Affichage détaillé des conditions
3. **Prévisions** : Prévisions sur 5 jours

## Structure des composants

```
src/
├── components/
│   ├── SearchBar.js       # Barre de recherche
│   ├── SearchBar.css
│   ├── CurrentWeather.js  # Affichage météo actuelle
│   ├── CurrentWeather.css
│   ├── Forecast.js        # Affichage prévisions
│   └── Forecast.css
├── App.js                 # Composant principal
├── App.css
├── index.js               # Point d'entrée
└── index.css              # Styles globaux
```

## Configuration

Le proxy API est configuré dans `package.json` :
```json
"proxy": "http://localhost:5000"
```

Assurez-vous que le backend s'exécute sur le port 5000.

## Dépendances

- **react** : Librairie UI
- **react-dom** : Rendu DOM
- **react-scripts** : Scripts de build

## Scripts disponibles

- `npm start` : Démarrer le serveur de développement
- `npm build` : Créer une version de production
- `npm test` : Exécuter les tests
