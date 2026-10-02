import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";
import AnnonceCard from "../../../components/AnnonceCard.jsx";
import BandeauAntiArnaque from "../../../components/BandeauAntiArnaque.jsx";
import { PASS_PRIX, PASS_DUREE_JOURS } from "../../../config/constants.js";
import { formatFCFA } from "../../../lib/format.js";
import { getAnnonces } from "../annonces.service.js";

export default function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    getAnnonces()
      .then((liste) => setAnnonces(liste.slice(0, 4)))
      .catch(() => setErreur("Impossible de charger les annonces. Vérifiez votre connexion et réessayez."))
      .finally(() => setChargement(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="hero__eyebrow">Location longue durée · Brazzaville et Pointe-Noire</p>
            <h1>Trouvez votre logement, sans démarcheur.</h1>
            <p className="hero__texte">
              Des annonces publiées par les propriétaires eux-mêmes, avec le prix réel et le montant à réunir pour entrer. Zéro commission.
            </p>
            <Button to="/annonces" size="lg">Voir les annonces</Button>
          </div>
          <div className="hero__visuel photo-placeholder">Photo : salon lumineux, Brazzaville</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__tete">
            <div>
              <h2>Annonces récentes</h2>
              <p className="muted">Mises à jour par les propriétaires cette semaine</p>
            </div>
            <Button to="/annonces" variant="ghost">Voir toutes les annonces</Button>
          </div>

          {chargement && <Spinner />}
          {erreur && <p className="banner banner--warn">{erreur}</p>}
          <div className="grid-annonces">
            {annonces.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container steps">
          <div className="step">
            <span className="step__num">1</span>
            <h3>Cherchez gratuitement</h3>
            <p>Prix, total d'entrée, équipements et fiabilité : tout est visible avant la visite.</p>
          </div>
          <div className="step">
            <span className="step__num">2</span>
            <h3>Débloquez le contact</h3>
            <p>Pass Contact à {formatFCFA(PASS_PRIX)}, valable {PASS_DUREE_JOURS} jours sur toutes les annonces.</p>
          </div>
          <div className="step">
            <span className="step__num">3</span>
            <h3>Visitez, puis payez</h3>
            <p>Appel ou WhatsApp direct. La caution se règle au propriétaire, après la visite.</p>
          </div>
          <div className="step step--proprio">
            <p className="step__label">Propriétaires</p>
            <h3>Publiez gratuitement, en 5 minutes.</h3>
            <Button to="/proprietaire/publier" variant="light">Publier une annonce</Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><BandeauAntiArnaque /></div>
      </section>
    </>
  );
}