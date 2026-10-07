# API — Modifier le statut d'une annonce

## PATCH `/api/anouncer/announce/:id/status`

Modifie uniquement le statut d'une annonce.

### Authentification

La route nécessite un token JWT :

```http
Authorization: Bearer <token>
```

### Content-Type

```http
Content-Type: application/json
```

---

## Paramètres de route

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `number` | Oui | Identifiant de l'annonce |

Exemple :

```http
PATCH /api/anouncer/announce/24/status
```

---

## Corps de la requête

```json
{
    "status": "rented"
}
```

| Champ | Type | Obligatoire | Valeurs acceptées | Description |
|---|---|---|---|---|
| `status` | `string` | Oui | `available`, `rented` | Nouveau statut de l'annonce |

### Valeurs possibles

- `available` : annonce disponible
- `rented` : annonce louée

---

## Exemple de requête

```http
PATCH /api/anouncer/announce/24/status
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
    "status": "rented"
}
```

---

## Réponse — Succès

### HTTP 200

```json
{
    "message": "Le statut de l'annonce a été mis à jour avec succès",
    "status": 200,
    "data": "rented"
}
```

| Champ | Type | Description |
|---|---|---|
| `message` | `string` | Message de confirmation |
| `status` | `number` | Code HTTP |
| `data` | `string` | Nouveau statut |

---

## Erreurs

### 400 — Identifiant invalide

```json
{
    "message": "L'identifiant de l'annonce est invalide",
    "status": 400
}
```

### 400 — Statut invalide

```json
{
    "message": "Le statut doit être available ou rented",
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
