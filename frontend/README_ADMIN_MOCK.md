# Mode admin de démonstration

Le profil admin existe toujours via les routes `/admin` et `/admin/signalements`.

## Activer le mock admin

Dans `frontend/.env.local` :

```env
VITE_USE_ADMIN_MOCKS=true
VITE_ADMIN_MOCK_PASSWORD=esika-admin-demo
VITE_USE_MOCKS=false
```

Puis redémarrer Vite.

Compte de démonstration :
- Numéro : `060000000`
- Mot de passe : valeur de `VITE_ADMIN_MOCK_PASSWORD`

## Sécurité

- Le mock admin est activable uniquement avec `import.meta.env.DEV`. Il est donc désactivé dans un build de production, même si la variable est mal configurée.
- `VITE_USE_ADMIN_MOCKS` est indépendant de `VITE_USE_MOCKS`. Activer le mock admin ne remplace donc pas les annonces, Pass, signalements utilisateur ou autres services réels.
- Avec `VITE_USE_ADMIN_MOCKS=false`, la connexion admin utilise la route backend `/admin/signin`.
- Les données mock admin sont stockées uniquement dans le `localStorage` du navigateur et ne modifient pas la base réelle.
