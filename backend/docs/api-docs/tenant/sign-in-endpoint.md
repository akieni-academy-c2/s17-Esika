# API — Connexion d'un locataire

## Endpoint

Permet à un annonceur inscrit de se connecter.

- **Méthode HTTP :** `POST`
- **Route :** `/api/tenant/signin`
- **Content-Type :** `application/json`

## Body attendu

```ts
{
    phoneNumber: string;
    password: string;
};
```

### Exemple

```json
{
  "phoneNumber": "+242060000000",
  "password": "Password123!"
}
```

### Champs

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `phoneNumber` | `string` | Oui | Numéro de téléphone de l'annonceur |
| `password` | `string` | Oui | Mot de passe de l'annonceur |

## Réponse en cas de succès

**HTTP `200 OK`**

```json
{
  "message": "Connexion réussie",
  "status": 200,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Réponses d'erreur

### `400 Bad Request`

#### Champs obligatoires manquants

```json
{
  "message": "Le numéro de téléphone et le mot de passe sont obligatoires",
  "status": 400
}
```

#### Format du numéro de téléphone invalide

```json
{
  "message": "Format numéro de téléphone invalide",
  "status": 400
}
```

#### Mot de passe incorrect

```json
{
  "message": "Mot de passe incorrect",
  "status": 400
}
```

### `404 Not Found`

#### Numéro de téléphone inexistant

```json
{
  "message": "Numéro de téléphone inexistant",
  "status": 404
}
```
