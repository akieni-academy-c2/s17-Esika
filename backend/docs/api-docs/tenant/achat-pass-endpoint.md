# API — Achat d'un pass

## Endpoint

Permet à un utilisateur authentifié d'acheter un pass pour une annonce.

Un pass est valable **7 jours** à partir de sa création.

- **Méthode HTTP :** `POST`
- **Route :** `/api/announces/:id/passes`
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
| `id` | `number` | Oui | Identifiant de l'annonce pour laquelle le pass est acheté |

## Body attendu

La requête utilise `application/json`.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `phoneNumber` | `string` | Oui | Numéro de téléphone utilisé pour l'achat du pass |

```json
{
  "phoneNumber": "+242061234567"
}
```

### Champs gérés automatiquement

Les champs suivants ne sont **pas** envoyés par le client :

- `tenantId` : récupéré depuis le token JWT de l'utilisateur authentifié.
- `announceId` : récupéré depuis le paramètre `id` de la route.
- `created_at` : date de création, définie par le serveur.
- `expired_at` : date d'expiration, définie par le serveur à `created_at + 7 jours`.

## Validation

Le numéro de téléphone est obligatoire.

Le numéro de téléphone doit respecter le format suivant :

- un `+` facultatif au début ;
- uniquement des chiffres ensuite ;
- entre 5 et 15 chiffres ;
- aucun espace, tiret ou point.

```text
"+242061234567"   → valide
"061234567"       → valide
"06 123 45 67"    → invalide (espaces)
"+242-06-123-456" → invalide (tirets)
```

L'identifiant de l'annonce doit être un entier supérieur ou égal à `1`.

> Le numéro de téléphone est validé **avant** l'identifiant de l'annonce. Si les deux sont invalides, seule l'erreur sur le numéro de téléphone est retournée.

## Exemple de requête

```ts
const buyPass = async (announceId: number, phoneNumber: string, token: string) => {
  const response = await fetch(`/api/announces/${announceId}/passes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};
```

## Réponse en cas de succès

**HTTP `201 Created`**

```json
{
  "message": "Pass créé avec succès",
  "status": 201
}
```

La réponse ne contient pas de champ `data` : l'identifiant et la date d'expiration du pass ne sont pas retournés.

## Réponses d'erreur

### `400 Bad Request`

#### Numéro de téléphone absent ou invalide

```json
{
  "message": "Format numéro de téléphone invalide",
  "status": 400
}
```

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

### `500 Internal Server Error`

Une erreur interne est survenue lors de la création du pass.

Cette erreur est notamment retournée si l'annonce correspondant à l'`id` n'existe pas.

## Gestion des pass

Les pass sont enregistrés dans la table `passes`.

Les champs enregistrés sont :

- `created_at`
- `expired_at`
- `announce_id`
- `tenant_id`

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.
