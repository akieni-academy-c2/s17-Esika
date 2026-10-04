import { Link, NavLink, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import { IconPlus } from "../components/ui/Icons.jsx";
import "../modules/annonceur/annonceur.css";

export default function AnnonceurLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const deconnecter = () => {
    logout();
    navigate("/", { replace: true });
  };

  const initiales = `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.toUpperCase();

  return (
    <>
      <header className="esp">
        <div className="esp__inner">
          <Link to="/" className="logo" aria-label="ESIKA, accueil">
            <span className="logo__mark" />
            ESIKA
          </Link>
          <span className="esp__badge">Espace propriétaire</span>

          <nav className="esp__liens" aria-label="Espace propriétaire">
            <NavLink to="/annonceur/mes-annonces">Mes annonces</NavLink>
            <NavLink to="/annonceur/publier">Publier</NavLink>
            <NavLink to="/comment-ca-marche">Comment ça marche</NavLink>
          </nav>

          <div className="esp__droite">
            <Link to="/annonceur/publier" className="btn btn--primary btn--sm esp__cta">
              <IconPlus taille={16} /> Publier une annonce
            </Link>
            <span className="esp__user">
              <span className="esp__avatar" aria-hidden="true">{initiales}</span>
              <span className="esp__nom">{user?.prenom} {user?.nom?.[0]}.</span>
            </span>
            <button type="button" className="esp__logout" onClick={deconnecter}>Déconnexion</button>
          </div>
        </div>
      </header>

      <main>
        <PageTransition />
      </main>
      <Footer />
    </>
  );
}
