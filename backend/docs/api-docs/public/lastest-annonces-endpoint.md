# API — Les 4 annonces les plus récentes

## Endpoint

```http
GET /api/public/announces/latest
```

## Description

Cette route permet de récupérer les **4 annonces les plus récentes**.

- Route publique
- Authentification : aucune
- Nombre maximum : 4 annonces
- Tri : `created_at DESC`

## Réponse en cas de succès

```json
{
    "message": "Les annonces les plus récentes ont été récupérées avec succès",
    "status": 200,
    "data": []
}
```

## Structure d'une annonce

| Champ | Type | Description |
|---|---|---|
| `announceId` | `number` | Identifiant de l'annonce |
| `image` | `object \| null` | Première image de l'annonce |
| `image.path` | `string` | Chemin ou URL de l'image |
| `image.label` | `string` | Libellé de l'image |
| `status` | `string` | Statut de l'annonce |
| `rent` | `number` | Montant du loyer |
| `type` | `string` | Type de logement |
| `neighborhood` | `string` | Quartier |
| `landmark` | `string` | Point de repère |
| `availableAt` | `string \| null` | Date de disponibilité |
| `deposit` | `number` | Nombre de mois de caution |
| `advance` | `number` | Nombre de mois d'avance |
| `totalEntry` | `number` | Montant total à payer à l'entrée |
| `equipment` | `object` | Équipements du logement |
| `imageCount` | `number` | Nombre total d'images |

## Structure de `image`

```json
{
    "path": "https://example.com/image.jpg",
    "label": "Photo du salon"
}
```

Si aucune image n'est disponible :

```json
"image": null
```

La propriété `image` correspond à la **première image** de l'annonce.

## Structure de `equipment`

```json
{
    "airConditioning": true,
    "wifi": true,
    "generator": false,
    "parking": false,
    "furnished": false,
    "securityGuard": false
}
```

| Champ | Type | Description |
|---|---|---|
| `airConditioning` | `boolean` | Climatisation |
| `wifi` | `boolean` | Wi-Fi |
| `generator` | `boolean` | Groupe électrogène |
| `parking` | `boolean` | Parking |
| `furnished` | `boolean` | Logement meublé |
| `securityGuard` | `boolean` | Gardien |

## Exemple de réponse complète

```json
{
    "message": "Les annonces les plus récentes ont été récupérées avec succès",
    "status": 200,
    "data": [
        {
            "announceId": 24,
            "image": {
                "path": "https://jzqinifniwnntytlgxnl.supabase.co/storage/v1/object/public/announce/24/image.jpg",
                "label": "téléchargement (1).jpg"
            },
            "status": "available",
            "rent": 91,
            "type": "Repudiandae eligendi",
            "neighborhood": "Reiciendis sed fugia",
            "landmark": "Non aut voluptate te",
            "availableAt": "2026-10-04T00:00:00.000Z",
            "deposit": 41,
            "advance": 50,
            "totalEntry": 8281,
            "equipment": {
                "airConditioning": true,
                "wifi": true,
                "generator": false,
                "parking": false,
                "furnished": false,
                "securityGuard": false
            },
            "imageCount": 1
        }
    ]
}
```


## Erreurs

Une erreur `500` peut être retournée en cas de problème lors de l'accès à la base de données.

