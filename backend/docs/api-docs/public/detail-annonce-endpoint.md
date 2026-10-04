# API — Détail d'une annonce

## Endpoint

```http
GET /api/public/announces/:id
```

Permet de récupérer les informations détaillées d'une annonce à partir de son identifiant.

Cette route est publique et ne nécessite pas d'authentification.

---

## Paramètre de route

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | number | Oui | Identifiant de l'annonce |

### Exemple

```http
GET /api/public/announces/15
```

---

## Réponse — Succès

### Status HTTP

```http
200 OK
```

### Exemple

```json
{
    "message": "Annonce récupérée avec succès",
    "status": 200,
    "data": {
        "announceId": 15,
        "city": "brazzaville",
        "neighborhood": "Moungali",
        "type": "appartement",
        "availableAt": "2026-10-10T00:00:00.000Z",
        "updatedAt": "2026-10-03T10:30:00.000Z",
        "landmark": "Près de la pharmacie",
        "images": [
            {
                "label": "salon.jpg",
                "path": "https://example.supabase.co/storage/v1/object/public/announce/15/salon.jpg"
            }
        ],
        "equipment": {
            "airConditioning": true,
            "wifi": true,
            "generator": false,
            "parking": true,
            "furnished": false,
            "securityGuard": true
        },
        "rent": 150000,
        "caution": 2,
        "advance": 3,
        "description": "Appartement moderne situé dans un quartier calme.",
        "firstName": "Jean",
        "lastName": "Dupont",
        "announceCount": 8,
        "favorTime": "journée",
        "advanceAmount": 450000,
        "cautionAmount": 300000,
        "totalEntry": 750000
    }
}
```

---

## Structure de la réponse

| Champ | Type | Description |
|---|---|---|
| `announceId` | number | Identifiant de l'annonce |
| `city` | string | Ville |
| `neighborhood` | string | Quartier |
| `type` | string | Type de logement |
| `availableAt` | string | Date de disponibilité |
| `updatedAt` | string | Date de dernière modification |
| `landmark` | string | Point de repère |
| `images` | array | Toutes les images |
| `images[].label` | string | Nom de l'image |
| `images[].path` | string | URL de l'image |
| `equipment` | object | Équipements |
| `rent` | number | Montant du loyer |
| `caution` | number | Nombre de mois de caution |
| `advance` | number | Nombre de mois d'avance |
| `description` | string \| null | Description |
| `firstName` | string | Prénom de l'annonceur |
| `lastName` | string | Nom de l'annonceur |
| `announceCount` | number | Nombre total d'annonces de l'annonceur |
| `favorTime` | string | Moment privilégié pour les visites |
| `advanceAmount` | number | Montant de l'avance |
| `cautionAmount` | number | Montant de la caution |
| `totalEntry` | number | Montant total à prévoir à l'entrée |

---

## Équipements

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

---

## Erreurs

### Identifiant invalide

```http
400 Bad Request
```

```json
{
    "message": "L'identifiant de l'annonce est invalide",
    "status": 400
}
```

### Annonce introuvable

```http
404 Not Found
```

```json
{
    "message": "Annonce introuvable",
    "status": 404
}
```

---

## Résumé

```text
GET /api/public/announces/:id
```

- Route publique
- Aucun token requis
- `id` obligatoire
- Retourne le détail complet de l'annonce
- Retourne toutes les images
- Retourne les équipements
- Retourne les informations de l'annonceur
- Retourne le nombre d'annonces de l'annonceur
- Les montants `advanceAmount`, `cautionAmount` et `totalEntry` sont calculés dans le service
