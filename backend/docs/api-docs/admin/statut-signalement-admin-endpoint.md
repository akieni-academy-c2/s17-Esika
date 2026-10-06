# API — Mise à jour du statut d'un signalement (admin)

## Endpoint

Permet à un administrateur authentifié de modifier le statut d'un signalement.

- **Méthode HTTP :** `PATCH`
- **Route :** `/api/admin/reports/:id/status`
- **Content-Type :** `application/json`
- **Authentification :** Bearer Token

## Authentification

L'endpoint est protégé. Le token JWT doit être transmis dans l'en-tête `Authorization`.

```http
Authorization: Bearer <token>
```

## Paramètres de route

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `number` | Oui | Identifiant du signalement |

## Body attendu

La requête utilise `application/json`.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `status` | `ReportStatus` | Oui | Nouveau statut du signalement |

```json
{
  "status": "in_progress"
}
```

### Statut

```ts
type ReportStatus = "to_process" | "in_progress" | "processed";
```

### Champs gérés automatiquement

Les champs suivants ne sont **pas** envoyés par le client :

- `updated_at` : mis à jour à chaque changement de statut.
- `handled_at` : renseigné lorsque le statut passe à `processed`.

## Validation

L'identifiant du signalement doit être un entier supérieur ou égal à `1`.

Le statut doit être l'une des valeurs suivantes : `to_process`, `in_progress`, `processed`.

## Réponse en cas de succès

**HTTP `200 OK`**

```json
{
  "message": "Statut du signalement mis à jour avec succès",
  "status": 200
}
```

## Réponses d'erreur

### `400 Bad Request`

#### Identifiant du signalement invalide

```json
{
  "message": "L'identifiant du signalement est invalide",
  "status": 400
}
```

#### Statut invalide

Le statut est absent ou ne fait pas partie des valeurs autorisées.

```json
{
  "message": "Le statut est invalide",
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

#### Signalement introuvable

Aucun signalement ne correspond à l'identifiant fourni.

```json
{
  "message": "Signalement introuvable",
  "status": 404
}
```

### `500 Internal Server Error`

Une erreur interne est survenue lors de la mise à jour du signalement.

## Gestion des signalements

Les champs mis à jour dans la table `reports` sont :

- `status`
- `updated_at`
- `handled_at` (uniquement lorsque le statut passe à `processed`)

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.
