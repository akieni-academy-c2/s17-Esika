# API — Informations d'une annonce (page de déblocage)

## Endpoint

Permet à un utilisateur authentifié de récupérer les informations résumées d'une annonce, ainsi que le montant total à prévoir pour l'entrée dans le logement.

- **Méthode HTTP :** `GET`
- **Route :** `/api/announces/:id/contact`
- **Authentification :** Bearer Token

## Authentification

L'endpoint est protégé. Le token JWT doit être transmis dans l'en-tête `Authorization`.

```http
Authorization: Bearer <token>
```

## Paramètres de route

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `number` | Oui | Identifiant de l'annonce |

## Validation

L'identifiant de l'annonce doit être un entier supérieur ou égal à `1`.

## Réponse en cas de succès

**HTTP `200 OK`**

```json
{
  "message": "informations renvoyées avec succes",
  "status": 200,
  "data": {
    "type": "studio",
    "neighborhood": "Moungali",
    "landmark": "Près du marché Total",
    "city": "brazzaville",
    "rent": 50000,
    "totalEntry": 250000,
    "image": {
      "path": "https://<supabase-url>/storage/v1/object/public/announces/image.webp",
      "label": "image.webp"
    }
  }
}
```

### Description des champs de `data`

| Champ | Type | Description |
|---|---|---|
| `type` | `string` | Type de logement |
| `neighborhood` | `string` | Quartier |
| `landmark` | `string` | Point de repère |
| `city` | `City` | Ville de l'annonce |
| `rent` | `number` | Montant du loyer mensuel |
| `totalEntry` | `number` | Montant total à prévoir pour l'entrée (caution + avance) |
| `image` | `Image \| null` | Première image de l'annonce, ou `null` si l'annonce n'a pas d'image |

### Image

```ts
type Image = {
    path: string;  // URL publique de l'image
    label: string; // Nom de l'image
};
```
### Type complet de `data`

```ts
type UnlockPage = {
    type: string;
    neighborhood: string;
    landmark: string;
    city: City;
    rent: number;
    totalEntry: number;
    image: Image | null;
};
```

## Réponses d'erreur

### `400 Bad Request`

#### Identifiant de l'annonce invalide

```json
{
  "message": "L'identifiant de l'annonce est invalide",
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

### `404 Not Found`

#### Annonce introuvable

Aucune annonce ne correspond à l'identifiant fourni.

```json
{
  "message": "Annonce introuvable",
  "status": 404
}
```

### `500 Internal Server Error`

Une erreur interne est survenue lors de la récupération de l'annonce.

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.
