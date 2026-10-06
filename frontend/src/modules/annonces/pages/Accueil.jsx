import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";
import AnnonceCard from "../../../components/AnnonceCard.jsx";
import BandeauAntiArnaque from "../../../components/BandeauAntiArnaque.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Diaporama from "../../../components/Diaporama.jsx";
import { HERO_IMAGES, HERO_INTERVALLE_MS, IMG } from "../../../config/images.js";
import {
  IconBolt, IconCheck, IconChevron, IconGlobe, IconCar, IconSearch, IconShield, IconSnow, IconSofa, IconTag, IconReceipt, IconChevronDown, IconPin,
} from "../../../components/ui/Icons.jsx";
import { PASS_PRIX, PASS_DUREE_JOURS, TYPES_LOGEMENT, VILLES } from "../../../config/constants.js";
import { formatFCFA, calculerTotalEntree } from "../../../lib/format.js";
import { lireVille } from "../../../lib/ville.js";
import { useLienPublier } from "../../../hooks/useLiens.js";
import { getAnnonces } from "../annonces.service.js";

// Critères populaires : libellé affiché, filtre appliqué (équipement ou meublé), icône
const CRITERES = [
  { libelle: "Gardiennage", equipement: "Gardiennage", Icone: IconShield },
  { libelle: "Groupe électrogène", equipement: "Groupe électrogène", Icone: IconBolt },
  { libelle: "Climatisé", equipement: "Climatisation", Icone: IconSnow },
  { libelle: "Wi-Fi", equipement: "Wi-Fi", Icone: IconGlobe },
  { libelle: "Internet", equipement: "Internet", Icone: IconGlobe },
  { libelle: "Parking", equipement: "Parking", Icone: IconCar },
  { libelle: "Meublé", meuble: true, Icone: IconSofa },
];

export default function Accueil() {
  const navigate = useNavigate();
  const lienPublier = useLienPublier();
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [ville, setVille] = useState(lireVille);
  const [q, setQ] = useState("");
  const [loyerMax, setLoyerMax] = useState("");
  const [type, setType] = useState("");
  const [criteres, setCriteres] = useState([]);

  useEffect(() => {
    getAnnonces()
      .then((liste) => setAnnonces(liste))
      .catch(() => setErreur("Impossible de charger les annonces. Vérifiez votre connexion et réessayez."))
      .finally(() => setChargement(false));
  }, []);

  const basculer = (libelle) =>
    setCriteres((c) => (c.includes(libelle) ? c.filter((x) => x !== libelle) : [...c, libelle]));

  const rechercher = (e) => {
    e.preventDefault();
    const p = new URLSearchParams({ ville });
    if (q.trim()) p.set("q", q.trim());
    const budget = loyerMax.replace(/\D/g, "");
    if (budget) p.set("loyerMax", budget);
    if (type) p.set("type", type);
    const actifs = CRITERES.filter((c) => criteres.includes(c.libelle));
    const equipements = actifs.filter((c) => c.equipement).map((c) => c.equipement);
    if (equipements.length) p.set("equipements", equipements.join(","));
    if (actifs.some((c) => c.meuble)) p.set("meuble", "oui");
    navigate(`/annonces?${p.toString()}`);
  };

  const vedette = annonces[0];

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__texte-bloc">
            <p className="hero__eyebrow">Location longue durée · Brazzaville et Pointe-Noire</p>
            <h1>Trouvez votre logement, sans démarcheur.</h1>
            <p className="hero__texte">
              Des annonces publiées par les propriétaires eux-mêmes, avec le prix réel et le montant à réunir pour entrer. Zéro commission.
            </p>
            <ul className="hero__atouts">
              <li><IconTag taille={16} /> Zéro commission</li>
              <li><IconReceipt taille={16} /> Total d'entrée affiché</li>
              <li><IconShield taille={16} /> Numéros vérifiés</li>
            </ul>
          </div>

          <div className="hero__visuel">
            <div className="hero__diapo">
              <Diaporama images={HERO_IMAGES} intervalle={HERO_INTERVALLE_MS} label="Photos de logements à Brazzaville et Pointe-Noire" />
            </div>
            {vedette && (
              <Link to={`/annonces/${vedette.id}`} className="hero__carte">
                <span className="hero__carte-tete">
                  <Badge variant="success">Disponible</Badge>
                  <small>MAJ récente</small>
                </span>
                <strong>{vedette.titre}</strong>
                <span className="hero__carte-total">
                  <small>Total à l'entrée</small>
                  <b>{formatFCFA(calculerTotalEntree(vedette.loyer, vedette.cautionMois, vedette.avanceMois))}</b>
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="container">
          <form className="recherche" onSubmit={rechercher} role="search" aria-label="Rechercher un logement">
            <div className="recherche__champ">
              <label htmlFor="r-ville">Ville</label>
              <div className="recherche__entree">
                <IconPin taille={16} />
                <select id="r-ville" value={ville} onChange={(e) => setVille(e.target.value)}>
                  {VILLES.map((v) => <option key={v}>{v}</option>)}
                </select>
                <IconChevronDown taille={14} />
              </div>
            </div>
            <div className="recherche__champ recherche__champ--large">
              <label htmlFor="r-q">Quartier ou repère</label>
              <div className="recherche__entree">
                <input id="r-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex. Bacongo, Moungali, marché Total…" />
              </div>
            </div>
            <div className="recherche__champ">
              <label htmlFor="r-loyer">Loyer max / mois</label>
              <div className="recherche__entree">
                <input id="r-loyer" inputMode="numeric" value={loyerMax} onChange={(e) => setLoyerMax(e.target.value)} placeholder="Ex. 150 000" />
                <span className="recherche__unite">FCFA</span>
              </div>
            </div>
            <div className="recherche__champ">
              <label htmlFor="r-type">Type</label>
              <div className="recherche__entree">
                <select id="r-type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Tous les types</option>
                  {TYPES_LOGEMENT.map((t) => <option key={t}>{t}</option>)}
                </select>
                <IconChevronDown taille={14} />
              </div>
            </div>
            <Button type="submit" size="lg" className="recherche__bouton"><IconSearch taille={18} /> Rechercher</Button>
          </form>

          <div className="criteres">
            <span>Critères populaires :</span>
            {CRITERES.map(({ libelle, Icone }) => (
              <button key={libelle} type="button" className={`critere${criteres.includes(libelle) ? " critere--actif" : ""}`} aria-pressed={criteres.includes(libelle)} onClick={() => basculer(libelle)}>
                <Icone taille={14} /> {libelle}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__tete">
            <div>
              <h2>Annonces récentes</h2>
              <p className="muted">Mises à jour par les propriétaires cette semaine</p>
            </div>
            <Link to="/annonces" className="lien-fleche">Voir toutes les annonces <IconChevron taille={16} /></Link>
          </div>

          {chargement && <Spinner />}
          {erreur && <p className="banner banner--warn">{erreur}</p>}
          {!chargement && !erreur && annonces.length === 0 && (
            <p className="vide-inline">Aucune annonce pour le moment. Revenez bientôt ou publiez la vôtre gratuitement.</p>
          )}
          <div className="grid-annonces grid-annonces--accueil">
            {annonces.slice(0, 4).map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__tete">
            <div>
              <h2>Comment ça marche</h2>
              <p className="muted">Trois étapes, sans intermédiaire</p>
            </div>
            <Link to="/comment-ca-marche" className="lien-fleche">En savoir plus <IconChevron taille={16} /></Link>
          </div>
          <div className="etapes">
            {[
              ["Cherchez gratuitement", "Prix, total d'entrée, équipements et fiabilité : tout est visible avant la visite."],
              ["Débloquez le contact", `Pass Contact à ${formatFCFA(PASS_PRIX)}, valable ${PASS_DUREE_JOURS} jours sur toutes les annonces.`],
              ["Visitez, puis payez", "Appel ou WhatsApp direct. La caution se règle au propriétaire, après la visite."],
            ].map(([titre, texte], i) => (
              <article key={titre} className="etape">
                <img src={IMG.etapes[i].src} alt={IMG.etapes[i].alt} width="720" height="720" loading="lazy" decoding="async" />
                <div className="etape__corps">
                  <span className="etape__num">{i + 1}</span>
                  <h3>{titre}</h3>
                  <p>{texte}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container confiance">
          <img className="confiance__img" src={IMG.confiance.src} alt={IMG.confiance.alt} width={IMG.confiance.largeur} height={IMG.confiance.hauteur} loading="lazy" decoding="async" />
          <div className="confiance__texte">
            <p className="hero__eyebrow">Pourquoi ESIKA</p>
            <h2>Zéro démarcheur, information vérifiée.</h2>
            <p className="muted">Vous voyez le vrai prix et le montant à réunir avant de vous déplacer, et vous parlez directement au propriétaire.</p>
            <ul className="confiance__liste">
              <li><IconCheck taille={16} /> Prix réel et total à l'entrée affichés sur chaque annonce</li>
              <li><IconCheck taille={16} /> Numéros de téléphone vérifiés</li>
              <li><IconCheck taille={16} /> Annonces mises à jour chaque semaine par les propriétaires</li>
              <li><IconCheck taille={16} /> Un signalement en un clic, traité par l'équipe ESIKA</li>
            </ul>
            <Button to="/annonces" variant="outline">Voir les annonces</Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container proprio-section">
          <div className="proprio-section__texte">
            <p className="step__label">Propriétaires</p>
            <h2>Publiez gratuitement, en 5 minutes.</h2>
            <p>Des locataires qui vous appellent directement, sans démarcheur. Un conseiller ESIKA peut même publier l'annonce avec vous sur WhatsApp.</p>
            <Button to={lienPublier} variant="light" size="lg">Publier une annonce</Button>
          </div>
          <img className="proprio-section__img" src={IMG.proprietaire.src} alt={IMG.proprietaire.alt} width={IMG.proprietaire.largeur} height={IMG.proprietaire.hauteur} loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="section">
        <div className="container"><BandeauAntiArnaque /></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="bandeau-final">
            <img src={IMG.bandeau.src} alt="" width={IMG.bandeau.largeur} height={IMG.bandeau.hauteur} loading="lazy" decoding="async" />
            <div className="bandeau-final__contenu">
              <h2>Prêt à trouver votre prochain logement ?</h2>
              <p>Parcourez les annonces des propriétaires, ou publiez la vôtre gratuitement.</p>
              <div className="bandeau-final__actions">
                <Button to="/annonces" size="lg">Rechercher un logement</Button>
                <Button to={lienPublier} variant="light" size="lg">Publier une annonce</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
