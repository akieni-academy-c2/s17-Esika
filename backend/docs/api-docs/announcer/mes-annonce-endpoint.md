# API — Mes annonces Annonnceur

## Endpoint

```http
GET /api/anouncer/announces
```

Permet à un annonceur authentifié de récupérer uniquement ses propres annonces.

L'identifiant de l'annonceur est récupéré automatiquement depuis le JWT.

## Authentification

Header obligatoire :

```http
Authorization: Bearer <token>
```

## Paramètres de requête

| Paramètre | Type | Défaut | Description |
|---|---|---:|---|
| `page` | number | `1` | Numéro de la page |
| `limit` | number | `10` | Nombre d'annonces par page |
| `status` | string | — | Filtre par statut |

### Valeurs de `status`

- `available` : annonces disponibles
- `rented` : annonces louées
- absent : toutes les annonces

## Exemples

```http
GET /api/anouncer/announces
```

```http
GET /api/anouncer/announces?page=1&limit=10
```

```http
GET /api/anouncer/announces?status=available
```

```http
GET /api/anouncer/announces?status=rented
```

```http
GET /api/anouncer/announces?page=2&limit=5&status=available
```

## Réponse — Succès

### Status HTTP

```http
200 OK
```

### Exemple

```json
{
    "message": "Vos annonces ont été récupérées avec succès",
    "status": 200,
    "data": [
        {
            "announceId": 15,
            "image": {
                "path": "https://example.supabase.co/storage/v1/object/public/announce/15/image.jpg",
                "label": "salon.jpg"
            },
            "type": "appartement",
            "neighborhood": "Moungali",
            "city": "brazzaville",
            "createdAt": "2026-10-03T10:30:00.000Z",
            "rent": 150000,
            "total": 750000,
            "status": "available",
            "updatedAt": "2026-10-03T10:30:00.000Z"
        }
    ],
    "pagination": {
        "total": 12,
        "totalPages": 2
    }
}
```

## Structure d'une annonce

| Champ | Type | Description |
|---|---|---|
| `announceId` | number | Identifiant de l'annonce |
| `image` | object \| null | Première image de l'annonce |
| `image.path` | string | URL publique de l'image |
| `image.label` | string | Nom de l'image |
| `type` | string | Type de logement |
| `neighborhood` | string | Quartier |
| `city` | string | Ville |
| `createdAt` | string | Date de création |
| `rent` | number | Montant du loyer |
| `total` | number | Montant total à l'entrée |
| `status` | string | Statut de l'annonce |
| `updatedAt` | string | Date de dernière modification |

### Calcul de `total`

```text
total = (rent × advance) + (rent × deposit)
```

## Pagination

```json
{
    "pagination": {
        "total": 12,
        "totalPages": 2
    }
}
```

- `total` : nombre total d'annonces correspondant au filtre.
- `totalPages` : nombre total de pages.

## Erreurs

### Token absent ou invalide

```http
401 Unauthorized
```

### Pagination invalide

```http
400 Bad Request
```

```json
{
    "message": "Les paramètres page et limit doivent être supérieurs à 0",
    "status": 400
}
```

### Statut invalide

```http
400 Bad Request
```

```json
{
    "message": "Le statut doit être available ou rented",
    "status": 400
}
```

## Résumé

```text
GET /api/anouncer/announces
```

- JWT obligatoire
- `announcerId` récupéré depuis le JWT
- pagination
- filtre `available` / `rented`
- absence de `status` = toutes les annonces
