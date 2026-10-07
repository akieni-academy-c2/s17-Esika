# API — Consultation du pass d'une annonce

## Endpoint

Permet à un locataire authentifié de consulter son pass actif pour une annonce.

Un pass actif donne accès aux coordonnées du propriétaire (nom et numéro de téléphone) ainsi qu'aux informations principales de l'annonce.

- **Méthode HTTP :** `GET`
- **Route :** `/api/tenant/announces/:id/passes/active`
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

## Body attendu

Aucun body n'est attendu.

### Champs gérés automatiquement

`tenantId` n'est pas envoyé par le client.

Il est récupéré depuis le token JWT du locataire authentifié.

## Exemple de requête

```ts
const getPassInfo = async (announceId: number, token: string) => {
  const response = await fetch(`/api/tenant/announces/${announceId}/passes/active`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};
```

## Réponse en cas de succès

**HTTP `200 OK`**

```json
{
  "message": "Informations du pass renvoyées avec succès",
  "status": 200,
  "data": {
    "expiredAt": "2026-10-13T10:30:00.000Z",
    "announcer": {
      "firstName": "Jean",
      "lastName": "Makaya",
      "phoneNumber": "+242061234567"
    },
    "announce": {
      "type": "studio",
      "neighborhood": "Moungali",
      "rent": 50000,
      "landmark": "Près du marché Total"
    }
  }
}
```

### Description des champs de `data`

| Champ | Type | Description |
|---|---|---|
| `expiredAt` | `string` (date ISO) | Date et heure d'expiration du pass |
| `announcer.firstName` | `string` | Prénom du propriétaire |
| `announcer.lastName` | `string` | Nom du propriétaire |
| `announcer.phoneNumber` | `string` | Numéro de téléphone du propriétaire |
| `announce.type` | `string` | Type de logement |
| `announce.neighborhood` | `string` | Quartier |
| `announce.rent` | `number` | Montant du loyer mensuel |
| `announce.landmark` | `string` | Point de repère |

### Type complet de `data`

```ts
type PassInfo = {
    expiredAt: string;
    announcer: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    announce: {
        type: string;
        neighborhood: string;
        rent: number;
        landmark: string;
    };
};
```

`expiredAt` est reçu sous forme de chaîne ISO. Pour l'afficher, il faut le convertir :

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

### `403 Forbidden`

#### Pass expiré

Le locataire a acheté un pass pour cette annonce, mais il a expiré.


```json
{
  "message": "Le pass a expiré",
  "status": 403
}
```

### `404 Not Found`

#### Aucun pass trouvé

Le locataire n'a jamais acheté de pass pour cette annonce, ou l'annonce n'existe pas.

Le frontend peut proposer d'acheter un pass.

```json
{
  "message": "Aucun pass trouvé pour cette annonce",
  "status": 404
}
```

### `500 Internal Server Error`

Une erreur interne est survenue lors de la récupération du pass.

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.
