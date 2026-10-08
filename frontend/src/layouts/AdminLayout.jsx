import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getSignalements } from "../modules/admin/admin.service";
import { IconBuilding, IconFlag, IconKey, IconLogout, IconUsers } from "../components/ui/Icons.jsx";
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
    navigate("/connexion", { replace: true });
  };

  return (
    <div className="adm">
      <aside className="adm__menu">
        <Link to="/" className="logo logo--light adm__logo" aria-label="ESIKA, accueil du site"><span className="logo__mark" />ESIKA</Link>
        <p className="adm__titre">ADMINISTRATION</p>
        <nav aria-label="Administration">
          <NavLink to="/admin/signalements">
            <span className="adm__nav-item"><IconFlag taille={17} /> Signalements</span>
            {aTraiter > 0 && <span className="adm__pastille">{aTraiter}</span>}
          </NavLink>
          {[["Annonces", IconBuilding], ["Utilisateurs", IconUsers], ["Pass Contact", IconKey]].map(([n, Icone]) => (
            <span key={n} className="adm__bientot" title="Bientôt disponible"><span className="adm__nav-item"><Icone taille={17} /> {n}</span></span>
          ))}
        </nav>
        <button type="button" className="adm__logout" onClick={deconnecter}><IconLogout taille={15} /> Déconnexion</button>
      </aside>

      <main className="adm__contenu">
        <PageTransition context={{ rafraichir }} />
      </main>
    </div>
  );
}