import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Spinner from "../../../components/ui/Spinner.jsx";
import { formatFCFA } from "../../../lib/format.js";
import { getSignalements, traiterSignalement } from "../admin.service";
import "../admin.css";

const JOUR = 86400000;
const BADGES = { urgent: "Urgent", a_traiter: "À traiter", en_cours: "En cours", traite: "Traité" };
const RESULTATS = {
  masquee: "Annonce masquée : elle n'apparaît plus dans les résultats.",
  sans_suite: "Classé sans suite.",
  contact: "Propriétaire contacté par l'équipe.",
};

const etat = (s) => (s.statut === "a_traiter" && s.urgent ? "urgent" : s.statut);
const jour = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
const heure = (iso) => {
  const d = new Date(iso);
  return `${d.getHours()} h ${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function Signalements() {
  const { rafraichir } = useOutletContext();
  const [liste, setListe] = useState(null);
  const [filtre, setFiltre] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState(null);
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(async () => {
    try { setListe(await getSignalements()); }
    catch { setErreur("Impossible de charger les signalements."); setListe([]); }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const stats = useMemo(() => {
    const l = liste ?? [];
    return {
      a_traiter: l.filter((s) => s.statut === "a_traiter").length,
      en_cours: l.filter((s) => s.statut === "en_cours").length,
      traite: l.filter((s) => s.statut === "traite" && Date.now() - new Date(s.traiteLe ?? s.creeLe) <= 7 * JOUR).length,
    };
  }, [liste]);

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return (liste ?? [])
      .filter((s) => filtre === "tous" || s.statut === filtre)
      .filter((s) => !q || `${s.annonceTitre} ${s.motifLibelle} ${s.ville}`.toLowerCase().includes(q))
      .sort((a, b) => (etat(b) === "urgent") - (etat(a) === "urgent"));
  }, [liste, filtre, recherche]);

  if (!liste) return <div className="adm__centre"><Spinner /></div>;

  const courant = visibles.find((s) => s.id === selection) ?? visibles[0];

  const agir = async (s, statut, action) => {
    setOccupe(true);
    setErreur("");
    try {
      await traiterSignalement(s.id, { statut, action, annonceId: s.annonceId });
      await charger();
      rafraichir();
    } catch { setErreur("L'action a échoué. Réessayez."); }
    finally { setOccupe(false); }
  };

  const CARTES = [
    ["a_traiter", "À traiter"],
    ["en_cours", "En cours"],
    ["traite", "Traités cette semaine"],
  ];

  return (
    <>
      <header className="adm__entete">
        <div>
          <h1>Signalements</h1>
          <p>Annonces signalées par les locataires</p>
        </div>
        <input type="search" className="adm__recherche" placeholder="Rechercher une annonce, un motif…"
          aria-label="Rechercher" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
      </header>

      <div className="adm__corps">
        <div className="adm__gauche">
          <div className="adm__stats">
            {CARTES.map(([cle, libelle]) => (
              <button key={cle} type="button" aria-pressed={filtre === cle}
                className={filtre === cle ? "is-actif" : ""}
                onClick={() => setFiltre(filtre === cle ? "tous" : cle)}>
                <span>{libelle}</span>
                <strong>{stats[cle]}</strong>
              </button>
            ))}
          </div>

          <p className="adm__erreur" role="alert">{erreur}</p>

          {visibles.length === 0 ? (
            <div className="adm__vide">Aucun signalement ne correspond.</div>
          ) : (
            <ul className="adm__table">
              <li className="adm__thead" aria-hidden="true">
                <span>Motif</span><span>Annonce</span><span>Signalé par</span><span>Statut</span><span />
              </li>
              {visibles.map((s) => (
                <li key={s.id} className={`adm__ligne ${courant?.id === s.id ? "is-actif" : ""} ${etat(s) === "urgent" ? "is-urgent" : ""}`}>
                  <strong>{s.motifLibelle}</strong>
                  <span>{s.annonceTitre}<small>{s.ville}</small></span>
                  <span>{s.signalePar} · {jour(s.creeLe)}</span>
                  <span><i className={`adm__badge adm__badge--${etat(s)}`}>{BADGES[etat(s)]}</i></span>
                  <button type="button" className="adm__lien" onClick={() => setSelection(s.id)}>Examiner</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {courant && (
          <aside className="adm__detail" aria-label="Détail du signalement">
            <div className="adm__detail-tete">
              {courant.urgent ? <i className="adm__badge adm__badge--urgent">Urgent</i> : <span />}
              <small>Reçu le {jour(courant.creeLe)} à {heure(courant.creeLe)}</small>
            </div>
            <h2>{courant.motifLibelle}</h2>

            <div className="adm__annonce">
              <div className="adm__vignette" aria-hidden="true" />
              <div>
                <strong>{courant.annonceTitre}</strong>
                <small>{formatFCFA(courant.loyer)}{courant.publieLe ? ` · publié le ${jour(courant.publieLe)}` : ""}</small>
                {courant.annonceId != null && <Link to={`/annonces/${courant.annonceId}`} className="adm__lien">Voir l'annonce</Link>}
              </div>
            </div>

            <p className="adm__etiquette">Message du locataire</p>
            <p className="adm__message">{courant.message ? `« ${courant.message} »` : "Aucune précision."}</p>

            {courant.statut === "traite" ? (
              <p className="adm__resultat">{RESULTATS[courant.action] ?? "Traité."}</p>
            ) : (
              <div className="adm__actions">
                <button type="button" className="adm__btn adm__btn--plein" disabled={occupe}
                  onClick={() => agir(courant, "traite", "masquee")}>Masquer l'annonce</button>
                <button type="button" className="adm__btn" disabled={occupe || courant.action === "contact"}
                  onClick={() => agir(courant, "en_cours", "contact")}>
                  {courant.action === "contact" ? "Propriétaire contacté" : "Contacter le propriétaire"}
                </button>
                <button type="button" className="adm__lien adm__lien--centre" disabled={occupe}
                  onClick={() => agir(courant, "traite", "sans_suite")}>Classer sans suite</button>
              </div>
            )}
          </aside>
        )}
      </div>
    </>
  );
}