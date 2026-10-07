import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

/** Affichée à la place d'une page blanche quand un composant plante. */
export default function ErreurPage() {
  const erreur = useRouteError();
  const detail = isRouteErrorResponse(erreur)
    ? `${erreur.status} ${erreur.statusText}`
    : erreur?.message ?? String(erreur ?? "Erreur inconnue");

  return (
    <div className="erreur-page">
      <h1>Oups, une erreur est survenue</h1>
      <p>La page n'a pas pu s'afficher. Rechargez-la ou revenez à l'accueil.</p>
      <p className="erreur-page__detail">{detail}</p>
      <div className="erreur-page__actions">
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>Recharger la page</button>
        <Link to="/" className="btn btn--outline">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
