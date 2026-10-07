import { Fragment } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

/**
 * Remplace <Outlet /> dans les layouts :
 * - la clé force un nouveau rendu à chaque changement de page, ce qui déclenche l'animation CSS `main > *` (voir polish.css)
 * - ScrollRestoration remet la page en haut à chaque navigation (et restaure la position avec le bouton « précédent »)
 */
export default function PageTransition({ context }) {
  const { pathname } = useLocation();
  return (
    <>
      <Fragment key={pathname}>
        <Outlet context={context} />
      </Fragment>
      <ScrollRestoration />
    </>
  );
}
