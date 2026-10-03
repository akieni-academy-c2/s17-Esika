# API — Affichage des annonces

## Endpoint

Permet de récupérer les annonces publiques avec pagination et filtres.

- **Méthode HTTP :** `GET`
- **Route :** `/api/public/announces`
- **Authentification :** Aucune
- **Content-Type :** `application/json`

## Query Parameters

Tous les paramètres sont facultatifs.

### Pagination

| Paramètre | Type | Défaut | Description |
|---|---|---:|---|
| `page` | `number` | `1` | Numéro de la page |
| `limit` | `number` | `10` | Nombre d'annonces par page |

Les paramètres sont ajoutés à l'URL après `?` et séparés par `&`.

```text
/api/public/announces?page=1&limit=10
```

### Filtres

| Paramètre | Type | Description |
|---|---|---|
| `city` | `string` | `brazzaville` ou `pointe-noire` |
| `neighborhood` | `string` | Quartier recherché |
| `rent` | `number` | Montant exact du loyer |
| `totalEntry` | `number` | Montant exact à fournir à l'entrée |
| `type` | `string` | Type de logement |
| `furnished` | `boolean` | `true` pour meublé, `false` pour non meublé |
| `airConditioning` | `boolean` | Présence de la climatisation |
| `wifi` | `boolean` | Présence du Wi-Fi |
| `generator` | `boolean` | Présence d'un groupe électrogène |
| `parking` | `boolean` | Présence d'un parking |
| `securityGuard` | `boolean` | Présence d'un gardien |

Les filtres peuvent être combinés. Exemple :

```text
/api/public/announces?page=1&limit=10&city=brazzaville&wifi=true&parking=true
```

Les équipements sélectionnés sont cumulatifs : `wifi=true&parking=true` recherche une annonce ayant les deux équipements.

## Données retournées

| Champ | Type | Description |
|---|---|---|
| `announceId` | `number` | Identifiant de l'annonce |
| `image` | `object \| null` | Première image de l'annonce |
| `image.path` | `string` | URL publique de l'image |
| `image.label` | `string` | Nom de l'image |
| `status` | `string` | Statut de l'annonce |
| `rent` | `number` | Montant du loyer |
| `type` | `string` | Type de logement |
| `neighborhood` | `string` | Quartier |
| `deposit` | `number` | Nombre de mois de caution |
| `advance` | `number` | Nombre de mois d'avance |
| `totalEntry` | `number` | Montant total à fournir à l'entrée |
| `equipment` | `object` | Équipements du logement |
| `imageCount` | `number` | Nombre total d'images |

### Équipements

```json
{
  "airConditioning": true,
  "wifi": true,
  "generator": false,
  "parking": true,
  "furnished": false,
  "securityGuard": true
}
```

Les valeurs des équipements sont des `boolean`.

## Calcul du montant à l'entrée

Le champ `totalEntry` est calculé par l'API :

```text
totalEntry = (rent × advance) + (rent × deposit)
```

Le frontend n'a pas besoin de recalculer cette valeur.

## Réponse

**HTTP `200 OK`**

```json
{
  "message": "Annonces récupérées avec succès",
  "status": 200,
  "data": [
    {
      "announceId": 1,
      "image": {
        "path": "https://example.com/image.jpg",
        "label": "salon.jpg"
      },
      "status": "available",
      "rent": 100000,
      "type": "studio",
      "neighborhood": "Centre-ville",
      "deposit": 2,
      "advance": 1,
      "totalEntry": 300000,
      "equipment": {
        "airConditioning": true,
        "wifi": true,
        "generator": false,
        "parking": true,
        "furnished": false,
        "securityGuard": true
      },
      "imageCount": 4
    }
  ],
  "pagination": {
    "total": 47,
    "totalPages": 5
  }
}
```

Le frontend utilise `total` et `totalPages` pour construire la navigation.

## Réponses d'erreur

### `400 Bad Request`

Paramètres de pagination invalides ou valeur de filtre numérique invalide.

```json
{
  "message": "string",
  "status": 400
}
```

### `500 Internal Server Error`

Une erreur interne est survenue lors de la récupération des annonces.

```json
{
  "message": "string",
  "status": 500
}
```
