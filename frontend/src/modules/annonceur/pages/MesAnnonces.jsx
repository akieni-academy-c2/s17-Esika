import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../../../components/ui/Badge.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";
import { calculerTotalEntree, formatFCFA, tempsRelatif } from "../../../lib/format.js";
import { changerStatut, confirmerDisponibilite, getMesAnnonces, modifierPrix } from "../annonceur.service";
import "../annonceur.css";

const SEUIL_CONFIRMATION_JOURS = 10;
const joursDepuis = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

function etat(a) {
  if (a.statut === "loue") return "loue";
  if (a.statut === "pause") return "pause";
  return joursDepuis(a.modifieLe) >= SEUIL_CONFIRMATION_JOURS ? "a_confirmer" : "en_ligne";
}

const BADGES = {
  en_ligne: ["En ligne", "success"],
  a_confirmer: ["À confirmer", "warn"],
  pause: ["En pause", "neutral"],
  loue: ["Loué", "neutral"],
};

const ONGLETS = [
  { cle: "en_ligne", libelle: "En ligne", etats: ["en_ligne", "a_confirmer"] },
  { cle: "pause", libelle: "En pause", etats: ["pause"] },
  { cle: "loue", libelle: "Louées", etats: ["loue"] },
];

export default function MesAnnonces() {
  const [annonces, setAnnonces] = useState(null);
  const [onglet, setOnglet] = useState("en_ligne");
  const [edition, setEdition] = useState(null); // { id, valeur }
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    try { setAnnonces(await getMesAnnonces()); }
    catch { setErreur("Impossible de charger vos annonces."); setAnnonces([]); }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const agir = async (action) => {
    setOccupe(true);
    setErreur("");
    try { await action(); await charger(); }
    catch { setErreur("L'action a échoué. Réessayez."); }
    finally { setOccupe(false); }
  };

  if (!annonces) return <div className="mes mes--centre"><Spinner /></div>;

  const avecEtat = annonces.map((a) => ({ ...a, _etat: etat(a) }));
  const compte = (o) => avecEtat.filter((a) => o.etats.includes(a._etat)).length;
  const courant = ONGLETS.find((o) => o.cle === onglet);
  const liste = avecEtat.filter((a) => courant.etats.includes(a._etat));
  const aConfirmer = avecEtat.find((a) => a._etat === "a_confirmer");

  const enregistrerPrix = (e, a) => {
    e.preventDefault();
    const v = Number(edition.valeur);
    if (!(v >= 10000)) return setErreur("Entrez un loyer valide (10 000 FCFA minimum).");
    agir(async () => { await modifierPrix(a.id, v); setEdition(null); });
  };

  const passerEnLoue = (a) => {
    if (window.confirm(`Passer « ${a.titre} » en Loué ? L'annonce sera retirée des résultats de recherche.`)) {
      agir(() => changerStatut(a.id, "loue"));
    }
  };

  return (
    <div className="mes">
      <div className="mes__container">
        <h1>Mes annonces</h1>
        <p className="pub__aide">Gardez vos prix et votre disponibilité à jour : les locataires voient les changements immédiatement.</p>

        {aConfirmer && (
          <div className="mes__bandeau" role="status">
            <div>
              <strong>{aConfirmer.titre} : est-il toujours disponible ?</strong>
              <p>Dernière confirmation {tempsRelatif(aConfirmer.modifieLe)}. Sans réponse sous 3 jours, l'annonce est mise en pause.</p>
            </div>
            <div className="mes__bandeau-actions">
              <button type="button" className="pub__btn pub__btn--noir" disabled={occupe}
                onClick={() => agir(() => confirmerDisponibilite(aConfirmer.id))}>
                Oui, toujours disponible
              </button>
              <button type="button" className="pub__btn" disabled={occupe}
                onClick={() => agir(() => changerStatut(aConfirmer.id, "loue"))}>
                Non, c'est loué
              </button>
            </div>
          </div>
        )}

        <div className="mes__onglets" role="tablist">
          {ONGLETS.map((o) => (
            <button key={o.cle} type="button" role="tab" aria-selected={onglet === o.cle}
              className={onglet === o.cle ? "is-actif" : ""} onClick={() => { setOnglet(o.cle); setEdition(null); }}>
              {o.libelle} ({compte(o)})
            </button>
          ))}
        </div>

        <p className="pub__erreur" role="alert">{erreur}</p>

        {liste.length === 0 ? (
          <div className="mes__vide">
            <p>{annonces.length === 0 ? "Vous n'avez pas encore publié d'annonce." : "Aucune annonce dans cet onglet."}</p>
            {annonces.length === 0 && <Link to="/annonceur/publier" className="pub__btn pub__btn--plein">Publier ma première annonce</Link>}
          </div>
        ) : (
          <ul className="mes__liste">
            <li className="mes__entete" aria-hidden="true">
              <span>Annonce</span><span>Loyer</span><span>Total à l'entrée</span><span>Statut</span><span>Dernière mise à jour</span>
            </li>
            {liste.map((a) => {
              const [libelle, variante] = BADGES[a._etat];
              const total = calculerTotalEntree(a.loyer, a.cautionMois, a.avanceMois);
              const nouveauTotal = edition?.id === a.id
                ? calculerTotalEntree(Number(edition.valeur) || 0, a.cautionMois, a.avanceMois) : 0;

              return (
                <li key={a.id} className={`mes__ligne ${a._etat === "loue" ? "is-loue" : ""}`}>
                  <div className="mes__annonce">
                    <div className="mes__vignette" aria-hidden="true" />
                    <div>
                      <Link to={`/annonces/${a.id}`}><strong>{a.titre}</strong></Link>
                      <small>{a.ville}</small>
                    </div>
                  </div>
                  <span data-label="Loyer"><strong>{formatFCFA(a.loyer)}</strong></span>
                  <span data-label="Total à l'entrée">{formatFCFA(total)}</span>
                  <span data-label="Statut"><Badge variant={variante}>{libelle}</Badge></span>
                  <span data-label="Mise à jour" className={a._etat === "a_confirmer" ? "mes__alerte" : ""}>
                    {tempsRelatif(a.modifieLe)}
                  </span>

                  {edition?.id === a.id && (
                    <form className="mes__edition" onSubmit={(e) => enregistrerPrix(e, a)}>
                      <label htmlFor={`prix-${a.id}`}>Nouveau loyer</label>
                      <input id={`prix-${a.id}`} type="number" inputMode="numeric" min="0" step="5000" autoFocus
                        className="pub__champ" value={edition.valeur}
                        onChange={(e) => setEdition({ id: a.id, valeur: e.target.value })} />
                      <output aria-live="polite">Nouveau total à l'entrée : <strong>{formatFCFA(nouveauTotal)}</strong></output>
                      <button type="button" className="pub__btn" onClick={() => setEdition(null)}>Annuler</button>
                      <button type="submit" className="pub__btn pub__btn--plein" disabled={occupe}>Enregistrer le prix</button>
                    </form>
                  )}

                  <div className="mes__actions">
                    {(a._etat === "en_ligne" || a._etat === "a_confirmer") && (
                      <>
                        <button type="button" className="mes__chip" onClick={() => { setErreur(""); setEdition({ id: a.id, valeur: String(a.loyer) }); }}>Modifier le prix</button>
                        <button type="button" className="mes__chip" disabled={occupe} onClick={() => agir(() => changerStatut(a.id, "pause"))}>Mettre en pause</button>
                        <button type="button" className="mes__chip mes__chip--rouge" disabled={occupe} onClick={() => passerEnLoue(a)}>Passer en Loué</button>
                      </>
                    )}
                    {a._etat === "pause" && (
                      <>
                        <button type="button" className="mes__chip" disabled={occupe} onClick={() => agir(() => changerStatut(a.id, "disponible"))}>Remettre en ligne</button>
                        <button type="button" className="mes__chip mes__chip--rouge" disabled={occupe} onClick={() => passerEnLoue(a)}>Passer en Loué</button>
                      </>
                    )}
                    {a._etat === "loue" && (
                      <button type="button" className="mes__chip" disabled={occupe} onClick={() => agir(() => changerStatut(a.id, "disponible"))}>Remettre en ligne</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}