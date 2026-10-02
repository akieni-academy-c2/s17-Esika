import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES } from "../config/constants.js";
import Button from "./ui/Button.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Accepte la valeur de ROLES.ANNONCEUR et "proprietaire" (valeur utilisée par auth.service.js)
  const estProprietaire = !!user && [ROLES.ANNONCEUR, "proprietaire"].includes(user.role);

  const deconnecter = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="logo" aria-label="ESIKA, accueil">
          <span className="logo__mark" />
          ESIKA
        </Link>

        <nav className="navbar__links" aria-label="Navigation principale">
          <NavLink to="/annonces">Trouver un logement</NavLink>
          <NavLink to="/comment-ca-marche">Comment ça marche</NavLink>
        </nav>

        <div className="navbar__actions">
          {estProprietaire ? (
            <Button to="/annonceur/mes-annonces" variant="outline" size="sm">
              Mon espace
            </Button>
          ) : (
            <Button to={`/connexion?role=${ROLES.ANNONCEUR}`} variant="outline" size="sm">
              Je suis propriétaire
            </Button>
          )}

          {user ? (
            <>
              <span className="navbar__user">
                <span className="navbar__avatar" aria-hidden="true">
                  {user.prenom?.[0]}
                </span>
                {user.prenom} {user.nom?.[0]}.
              </span>
              <button type="button" className="navbar__logout" onClick={deconnecter}>
                Déconnexion
              </button>
            </>
          ) : (
            <Button to="/connexion" size="sm">Se connecter</Button>
          )}
        </div>
      </div>
    </header>
  );
}