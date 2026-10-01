# Inscription d'un annonceur

## Endpoint

Permet d'inscrire un nouvel annonceur.

- **Méthode HTTP :** `POST`
- **Route :** `/api/announcer/signup`
- **Content-Type :** `application/json`

## Body attendu

```ts
export type BodyAnnouncerCreate = {
    lastName: string;
    firstName: string;
    phoneNumber: string;
    password: string;
    passwordVerify: string;
    email?: string;
    city: City;
};

type City = "brazzaville" | "pointe-noire";
```

### Exemple

```json
{
  "lastName": "Dupont",
  "firstName": "Jean",
  "phoneNumber": "+242060000000",
  "password": "Password123!",
  "passwordVerify": "Password123!",
  "email": "jean.dupont@example.com",
  "city": "brazzaville"
}
```

### Champs

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `lastName` | `string` | Oui | Nom de famille de l'annonceur |
| `firstName` | `string` | Oui | Prénom de l'annonceur |
| `phoneNumber` | `string` | Oui | Numéro de téléphone |
| `password` | `string` | Oui | Mot de passe |
| `passwordVerify` | `string` | Oui | Confirmation du mot de passe |
| `email` | `string` | Non | Adresse email |
| `city` | `"brazzaville" \| "pointe-noire"` | Oui | Ville de l'annonceur |

## Réponse en cas de succès

**HTTP `201 Created`**

```json
{
  "message": "Vous êtes inscrit avec succès",
  "status": 201
}
```

## Réponses d'erreur

### `400 Bad Request`

#### Champ(s) obligatoire(s) manquant(s)

```json
{
  "message": "Champ(s) obligatoire(s) manquant(s)",
  "status": 400
}
```

#### Numéro de téléphone invalide

```json
{
  "message": "Numéro de téléphone invalide",
  "status": 400
}
```

#### Mots de passe différents

```json
{
  "message": "Les mots de passe ne correspondent pas",
  "status": 400
}
```

#### Adresse email invalide

```json
{
  "message": "Adresse email invalide",
  "status": 400
}
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
