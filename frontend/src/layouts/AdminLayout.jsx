import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getSignalements } from "../modules/admin/admin.service";
import "../modules/admin/admin.css";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [aTraiter, setATraiter] = useState(0);

  const rafraichir = useCallback(async () => {
    try {
      const liste = await getSignalements();
      setATraiter(liste.filter((s) => s.statut === "a_traiter").length);
    } catch { /* le compteur est facultatif */ }
  }, []);

  useEffect(() => { rafraichir(); }, [rafraichir]);

  const deconnecter = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="adm">
      <aside className="adm__menu">
        <Link to="/" className="adm__logo" aria-label="ESIKA, accueil du site">ESIKA</Link>
        <p className="adm__titre">ADMINISTRATION</p>
        <nav aria-label="Administration">
          <NavLink to="/admin/signalements">
            Signalements
            {aTraiter > 0 && <span className="adm__pastille">{aTraiter}</span>}
          </NavLink>
          {["Annonces", "Utilisateurs", "Pass Contact"].map((n) => (
            <span key={n} className="adm__bientot" title="Bientôt disponible">{n}</span>
          ))}
        </nav>
        <button type="button" className="adm__logout" onClick={deconnecter}>Déconnexion</button>
      </aside>

      <main className="adm__contenu">
        <Outlet context={{ rafraichir }} />
      </main>
    </div>
  );
}