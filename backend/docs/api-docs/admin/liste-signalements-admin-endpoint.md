# API — Liste des signalements (admin)

## Endpoint

Permet à un administrateur authentifié de consulter la liste paginée des signalements.

- **Méthode HTTP :** `GET`
- **Route :** `/api/admin/reports`
- **Authentification :** Bearer Token

## Authentification

L'endpoint est protégé. Le token JWT doit être transmis dans l'en-tête `Authorization`.

```http
Authorization: Bearer <token>
```

## Paramètres de requête

Tous les paramètres sont facultatifs.

| Paramètre | Type | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `page` | `number` | Non | `1` | Numéro de la page |
| `limit` | `number` | Non | `10` | Nombre de signalements par page, maximum `50` |

### Exemples d'URL

```text
/api/admin/reports
/api/admin/reports?page=2
/api/admin/reports?page=1&limit=20
```

## Body attendu

Aucun body n'est attendu.


## Règles métier

`reportCount` correspond au nombre total de signalements reçus par l'annonce, tous statuts confondus.

## Réponse en cas de succès

**HTTP `200 OK`**

```json
{
  "message": "Signalements renvoyés avec succès",
  "status": 200,
  "data": {
    "reports": [
      {
        "id": 12,
        "reason": "Annonce frauduleuse",
        "status": "to_process",
        "createdAt": "2026-10-06T09:15:00.000Z",
        "reportCount": 3,
        "announce": {
          "type": "studio",
          "neighborhood": "Moungali",
          "city": "brazzaville"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Description des champs de `data`

#### `reports`

| Champ | Type | Description |
|---|---|---|
| `id` | `number` | Identifiant du signalement |
| `reason` | `string` | Motif du signalement |
| `status` | `ReportStatus` | Statut du signalement |
| `createdAt` | `string` (date ISO) | Date de création du signalement |
| `reportCount` | `number` | Nombre total de signalements reçus par l'annonce |
| `announce.type` | `string` | Type de logement |
| `announce.neighborhood` | `string` | Quartier |
| `announce.city` | `City` | Ville de l'annonce |

#### `pagination`

| Champ | Type | Description |
|---|---|---|
| `total` | `number` | Nombre total de signalements |
| `totalPages` | `number` | Nombre total de pages |

### Statut

```ts
type ReportStatus = "to_process" | "in_progress" | "processed";
```

### Ville

```ts
type City = "brazzaville" | "pointe-noire";
```

### Type complet de `data`

```ts
type ReportsPage = {
    reports: {
        id: number;
        reason: string;
        status: ReportStatus;
        createdAt: string;
        reportCount: number;
        announce: {
            type: string;
            neighborhood: string;
            city: City;
        };
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
```

## Réponses d'erreur

### `400 Bad Request`

#### Numéro de page invalide

```json
{
  "message": "Le numéro de page est invalide",
  "status": 400
}
```

#### Limite invalide

```json
{
  "message": "La limite doit être comprise entre 1 et 50",
  "status": 400
}
```

### `401 Unauthorized`

#### Token absent

```json
{
  "message": "Token manquant",
  "status": 401
}
```

#### Format du token invalide

L'en-tête ne respecte pas le format `Bearer <token>`.

```json
{
  "message": "Format du token invalide",
  "status": 401
}
```

#### Token invalide ou expiré

```json
{
  "message": "Token invalide ou expiré",
  "status": 401
}
```

### `500 Internal Server Error`

Une erreur interne est survenue lors de la récupération des signalements.

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.
