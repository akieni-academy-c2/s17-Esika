# API — Création d'une annonce

## Endpoint

Permet à un annonceur authentifié de créer une annonce.

- **Méthode HTTP :** `POST`
- **Route :** `/api/anouncer/announce`
- **Content-Type :** `multipart/form-data`
- **Authentification :** Bearer Token

## Authentification

L'endpoint est protégé. Le token JWT doit être transmis dans l'en-tête `Authorization`.

```http
Authorization: Bearer <token>
```

## Body attendu

La requête utilise `multipart/form-data`.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `type` | `string` | Oui | Type de logement |
| `rent` | `number` | Oui | Montant du loyer |
| `city` | `City` | Oui | Ville de l'annonce |
| `neighborhood` | `string` | Oui | Quartier |
| `deposit` | `number` | Oui | Nombre de mois de caution |
| `advance` | `number` | Oui | Nombre de mois d'avance |
| `description` | `string` | Non | Description du logement |
| `availableAt` | `date` | Non | Date de disponibilité |
| `sanitary` | `string` | Oui | Informations sur le sanitaire |
| `kitchen` | `string` | Oui | Informations sur la cuisine |
| `address` | `string` | Non | Adresse du logement |
| `landmark` | `string` | Oui | Point de repère |
| `waterElectricity` | `string` | Non | Informations sur l'eau et l'électricité |
| `favorTime` | `string` | Oui | Moment favorable pour la visite |
| `airConditioning` | `boolean` | Oui | Présence de la climatisation |
| `wifi` | `boolean` | Oui | Présence du Wi-Fi |
| `generator` | `boolean` | Oui | Présence d'un groupe électrogène |
| `parking` | `boolean` | Oui | Présence d'un parking |
| `furnished` | `boolean` | Oui | Logement meublé ou non |
| `securityGuard` | `boolean` | Oui | Présence d'un gardien |
| `images` | `file[]` | Non | Images de l'annonce, maximum 6 |

### Ville

```ts
type City = "brazzaville" | "pointe-noire";
```

### Équipements

Les équipements sont envoyés comme des champs du `multipart/form-data`.

Chaque équipement attend une valeur booléenne :

- `true` : l'équipement est présent.
- `false` : l'équipement est absent.

Comme la requête utilise `multipart/form-data`, les valeurs sont reçues sous forme de chaînes de caractères :

```text
airConditioning : "true" | "false"
wifi            : "true" | "false"
generator       : "true" | "false"
parking         : "true" | "false"
furnished       : "true" | "false"
securityGuard   : "true" | "false"
```

Le controller convertit ensuite ces valeurs en `boolean` avant de les transmettre au service.

Le type utilisé par le service est :

```ts
type Equipment = {
    airConditioning: boolean;
    wifi: boolean;
    generator: boolean;
    parking: boolean;
    furnished: boolean;
    securityGuard: boolean;
};
```

### Champs gérés automatiquement

`announcerId` n'est pas envoyé par le client.

Il est récupéré depuis le token JWT de l'annonceur authentifié.

## Validation

Les champs obligatoires doivent être renseignés.

Le montant du loyer doit être supérieur à `0`.

La caution et l'avance doivent être supérieures ou égales à `0`.

La ville est convertie en minuscules avant son enregistrement.

Les équipements doivent recevoir les valeurs `"true"` ou `"false"`.

Les images sont facultatives et leur nombre est limité à 6.

### Images

Les images sont envoyées dans le champ `images` de type `file[]`.

- Le nom du champ doit être `images`.
- Plusieurs fichiers peuvent être envoyés avec le même champ.
- Le nombre maximum d'images est de 6.
- Les formats acceptés sont `JPEG`, `PNG` et `WebP`.

## Réponse en cas de succès

**HTTP `201 Created`**

```json
{
  "message": "Annonce créée avec succès",
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

#### Montant du loyer invalide

```json
{
  "message": "Le montant du loyer est invalide",
  "status": 400
}
```

#### Montant de la caution invalide

```json
{
  "message": "Le montant de la caution est invalide",
  "status": 400
}
```

#### Montant de l'avance invalide

```json
{
  "message": "Le montant de l'avance est invalide",
  "status": 400
}
```

### `401 Unauthorized`

Le token est absent, invalide ou expiré.

### `500 Internal Server Error`

Une erreur interne est survenue lors de la création de l'annonce ou du stockage des images.

## Gestion des équipements

Les équipements sont enregistrés dans la table `equipments` et sont associés à l'annonce créée.

Les champs enregistrés sont :

- `air_conditioning`
- `wifi`
- `generator`
- `parking`
- `furnished`
- `security_guard`
- `announce_id`

## Gestion des images

Les images sont stockées dans Supabase Storage.

Les métadonnées des images sont enregistrées dans PostgreSQL :

- `format`
- `label`
- `path`
- `announce_id`

Le champ `path` contient l'URL publique de l'image.

## Format général des réponses API

```json
{
  "message": "string",
  "status": 200,
  "data": {}
}
```

`data` est optionnel selon l'endpoint.

