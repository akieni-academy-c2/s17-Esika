import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../../components/ui/Button.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";
import AnnonceCard from "../../../components/AnnonceCard.jsx";
import { formatFCFA } from "../../../lib/format.js";
import { getAnnonces } from "../annonces.service.js";
import Filtres from "../components/Filtres.jsx";
import "../annonces.css";

const PAR_PAGE = 6;

const DEFAUT = {
  ville: "Brazzaville",
  quartiers: [],
  loyerMax: "",
  budgetMax: "",
  type: "",
  meuble: "",
  equipements: [],
  dispoMaintenant: false,
  maj7j: false,
  verifie: false,
  tri: "recentes",
  vue: "grille",
  page: 1,
};

// Les filtres vivent dans l'URL : lien partageable et bouton « retour » qui fonctionne.
function lireParams(sp) {
  const liste = (cle) => (sp.get(cle) ? sp.get(cle).split(",") : []);
  return {
    ville: sp.get("ville") || DEFAUT.ville,
    quartiers: liste("quartiers"),
    loyerMax: sp.get("loyerMax") || "",
    budgetMax: sp.get("budgetMax") || "",
    type: sp.get("type") || "",
    meuble: sp.get("meuble") || "",
    equipements: liste("equipements"),
    dispoMaintenant: sp.get("dispo") === "1",
    maj7j: sp.get("maj") === "1",
    verifie: sp.get("verifie") === "1",
    tri: sp.get("tri") || DEFAUT.tri,
    vue: sp.get("vue") || DEFAUT.vue,
    page: Number(sp.get("page")) || 1,
  };
}

function versParams(f) {
  const p = new URLSearchParams();
  p.set("ville", f.ville);
  if (f.quartiers.length) p.set("quartiers", f.quartiers.join(","));
  if (f.loyerMax) p.set("loyerMax", f.loyerMax);
  if (f.budgetMax) p.set("budgetMax", f.budgetMax);
  if (f.type) p.set("type", f.type);
  if (f.meuble) p.set("meuble", f.meuble);
  if (f.equipements.length) p.set("equipements", f.equipements.join(","));
  if (f.dispoMaintenant) p.set("dispo", "1");
  if (f.maj7j) p.set("maj", "1");
  if (f.verifie) p.set("verifie", "1");
  if (f.tri !== DEFAUT.tri) p.set("tri", f.tri);
  if (f.vue !== DEFAUT.vue) p.set("vue", f.vue);
  if (f.page > 1) p.set("page", String(f.page));
  return p;
}

export default function ListeAnnonces() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cle = searchParams.toString();
  const filtres = lireParams(searchParams);

  const [resultats, setResultats] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  useEffect(() => {
    let annule = false;
    setChargement(true);
    setErreur("");
    getAnnonces(lireParams(new URLSearchParams(cle)))
      .then((liste) => !annule && setResultats(liste))
      .catch(() => !annule && setErreur("Impossible de charger les annonces. Vérifiez votre connexion et réessayez."))
      .finally(() => !annule && setChargement(false));
    return () => {
      annule = true;
    };
  }, [cle]);

  const changer = (patch) => setSearchParams(versParams({ ...filtres, page: 1, ...patch }));
  const reinitialiser = () => setSearchParams(versParams({ ...DEFAUT, ville: filtres.ville, vue: filtres.vue }));

  // Pastilles des filtres actifs, chacune avec sa croix pour la retirer.
  const pastilles = [
    ...filtres.quartiers.map((q) => ({ libelle: q, retirer: { quartiers: filtres.quartiers.filter((x) => x !== q) } })),
    filtres.loyerMax && { libelle: `≤ ${formatFCFA(filtres.loyerMax)}`, retirer: { loyerMax: "" } },
    filtres.budgetMax && { libelle: `Entrée ≤ ${formatFCFA(filtres.budgetMax)}`, retirer: { budgetMax: "" } },
    filtres.type && { libelle: filtres.type, retirer: { type: "" } },
    filtres.meuble && { libelle: filtres.meuble === "oui" ? "Meublé" : "Non meublé", retirer: { meuble: "" } },
    ...filtres.equipements.map((e) => ({ libelle: e, retirer: { equipements: filtres.equipements.filter((x) => x !== e) } })),
    filtres.dispoMaintenant && { libelle: "Disponible maintenant", retirer: { dispoMaintenant: false } },
    filtres.maj7j && { libelle: "Mis à jour récemment", retirer: { maj7j: false } },
    filtres.verifie && { libelle: "Numéro vérifié", retirer: { verifie: false } },
  ].filter(Boolean);

  const total = resultats.length;
  const nbPages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const pageCourante = Math.min(filtres.page, nbPages);
  const visibles = resultats.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);

  return (
    <div className="container liste">
      <Button variant="outline" size="sm" className="liste__bouton-filtres" aria-expanded={filtresOuverts} onClick={() => setFiltresOuverts((o) => !o)}>
        Filtres{pastilles.length > 0 && ` (${pastilles.length})`}
      </Button>

      <Filtres filtres={filtres} onChange={changer} onReset={reinitialiser} ouverts={filtresOuverts} />

      <section className="liste__resultats">
        <header className="liste__entete">
          <div>
            <h1>Logements à louer à {filtres.ville}</h1>
            <p className="muted" aria-live="polite">
              {chargement ? "Recherche en cours…" : `${total} annonce${total > 1 ? "s" : ""} · total d'entrée calculé pour chaque annonce`}
            </p>
          </div>
          <div className="liste__outils">
            <label className="sr-only" htmlFor="tri">Trier les annonces</label>
            <select id="tri" className="select" value={filtres.tri} onChange={(e) => changer({ tri: e.target.value })}>
              <option value="recentes">Trier : plus récentes</option>
              <option value="prix_asc">Trier : loyer croissant</option>
              <option value="prix_desc">Trier : loyer décroissant</option>
            </select>
            <div className="segmente" role="group" aria-label="Affichage">
              <button type="button" aria-pressed={filtres.vue === "grille"} onClick={() => changer({ vue: "grille", page: filtres.page })}>Grille</button>
              <button type="button" aria-pressed={filtres.vue === "liste"} onClick={() => changer({ vue: "liste", page: filtres.page })}>Liste</button>
            </div>
          </div>
        </header>

        <p className="banner banner--info">
          Consultation gratuite. Le total à l'entrée (caution + avance) est affiché sur chaque annonce, sans frais de démarcheur.
        </p>

        {pastilles.length > 0 && (
          <ul className="pastilles" aria-label="Filtres actifs">
            {pastilles.map((p) => (
              <li key={p.libelle}>
                <button type="button" className="pastille" onClick={() => changer(p.retirer)} aria-label={`Retirer le filtre ${p.libelle}`}>
                  {p.libelle} <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {chargement && <Spinner />}
        {erreur && <p className="banner banner--warn">{erreur}</p>}

        {!chargement && !erreur && total === 0 && (
          <div className="vide">
            <h2>Aucune annonce ne correspond</h2>
            <p>Élargissez le budget ou retirez un filtre pour voir plus de logements.</p>
            <Button variant="outline" onClick={reinitialiser}>Réinitialiser les filtres</Button>
          </div>
        )}

        {!chargement && total > 0 && (
          <div className={`grid-annonces${filtres.vue === "liste" ? " grid-annonces--liste" : ""}`}>
            {visibles.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </div>
        )}

        {!chargement && nbPages > 1 && (
          <nav className="pagination" aria-label="Pagination">
            <button type="button" disabled={pageCourante === 1} onClick={() => changer({ page: pageCourante - 1 })} aria-label="Page précédente">‹</button>
            {Array.from({ length: nbPages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" aria-current={n === pageCourante ? "page" : undefined} onClick={() => changer({ page: n })}>
                {n}
              </button>
            ))}
            <button type="button" disabled={pageCourante === nbPages} onClick={() => changer({ page: pageCourante + 1 })} aria-label="Page suivante">›</button>
          </nav>
        )}
      </section>
    </div>
  );
}