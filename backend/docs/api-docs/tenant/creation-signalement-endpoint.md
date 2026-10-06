# API — Création d'un signalement

## Endpoint

Permet à un locataire authentifié de signaler une annonce.

- **Méthode HTTP :** `POST`
- **Route :** `/api/tenant/announces/:id/reports`
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
| `id` | `number` | Oui | Identifiant de l'annonce signalée |

## Body attendu

La requête utilise `application/json`.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `reason` | `string` | Oui | Motif du signalement |
| `description` | `string` | Non | Précisions sur le signalement |


### Champs gérés automatiquement

Les champs suivants ne sont **pas** envoyés par le client :

- `tenantId` : récupéré depuis le token JWT du locataire authentifié.
- `announceId` : récupéré depuis le paramètre `id` de la route.
- `created_at` : date de création, définie par le serveur.
- `status` : défini à `to_process` à la création.

## Réponse en cas de succès

**HTTP `201 Created`**

```json
{
  "message": "Signalement créé avec succès",
  "status": 201
}
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

#### Motif absent ou vide

```json
{
  "message": "Le motif du signalement est obligatoire",
  "status": 400
}
```

#### Description invalide

La description n'est pas une chaîne de caractères.

```json
{
  "message": "La description est invalide",
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

Une erreur interne est survenue lors de la création du signalement.

## Gestion des signalements

Les signalements sont enregistrés dans la table `reports`.

Les champs enregistrés sont :

- `created_at`
- `reason`
- `announce_id`
- `tenant_id`
- `status`
- `description`

À la création, le statut est toujours `to_process`. Les statuts possibles sont :

```ts
type ReportStatus = "to_process" | "in_progress" | "processed";
```

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.
