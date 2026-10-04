# API — Modifier le loyer d'une annonce

## PATCH `/api/anouncer/announce/:id/rent`

Modifie le montant du loyer d'une annonce appartenant à l'annonceur authentifié.

## Authentification

```http
Authorization: Bearer <token>
```

## Content-Type

```http
Content-Type: application/json
```

## Paramètre de route

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `number` | Oui | Identifiant de l'annonce |

Exemple :

```http
PATCH /api/anouncer/announce/24/rent
```

## Corps de la requête

```json
{
    "rent": 150000
}
```

| Champ | Type | Obligatoire | Contraintes |
|---|---|---|---|
| `rent` | `number` | Oui | Entier supérieur à 0 |

```

## Vérification du propriétaire

L'identifiant de l'annonceur n'est pas fourni par le client.

Il est récupéré depuis le JWT :

```ts
const announcerId = req.user!.userId;
```

Ainsi, un annonceur ne peut pas modifier le loyer d'une annonce appartenant à un autre annonceur.

## Réponse — Succès

### HTTP 200

```json
{
    "message": "Le loyer de l'annonce a été mis à jour avec succès",
    "status": 200,
    "data": 150000
}
```

| Champ | Type | Description |
|---|---|---|
| `message` | `string` | Message de confirmation |
| `status` | `number` | Code HTTP |
| `data` | `number` | Nouveau montant du loyer |

## Erreurs

### 400 — Identifiant invalide

```json
{
    "message": "L'identifiant de l'annonce est invalide",
    "status": 400
}
```

### 400 — Loyer invalide

```json
{
    "message": "Le loyer doit être un nombre entier supérieur à 0",
    "status": 400
}
```

### 401 — Non authentifié

```json
{
    "message": "Non authentifié",
    "status": 401
}
```

### 404 — Annonce introuvable

L'annonce n'existe pas ou n'appartient pas à l'annonceur authentifié.

```json
{
    "message": "Annonce introuvable",
    "status": 404
}
```

### 500 — Erreur serveur

```json
{
    "message": "Une erreur interne est survenue",
    "status": 500
}
```