import { Link } from "react-router-dom";
import { SUPPORT_WHATSAPP } from "../config/constants.js";
import { lienWhatsApp } from "../lib/whatsapp.js";
import { useLienMesAnnonces, useLienPublier } from "../hooks/useLiens.js";
import Button from "./ui/Button.jsx";
import { IconChat, IconFlag, IconPin } from "./ui/Icons.jsx";

export default function Footer() {
  const lienPublier = useLienPublier();
  const lienMesAnnonces = useLienMesAnnonces();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <p className="logo logo--light"><span className="logo__mark" />ESIKA</p>
          <p>La location longue durée sans démarcheur : des annonces publiées par les propriétaires, le prix réel et le total à l'entrée.</p>
          <p className="footer__villes">
            {["Brazzaville", "Pointe-Noire"].map((v) => (
              <Link key={v} to={`/annonces?ville=${v}`} className="pill"><IconPin taille={13} /> {v}</Link>
            ))}
          </p>
        </div>

        <nav className="footer__col" aria-label="Locataires">
          <h2>Locataires</h2>
          <Link to="/annonces">Rechercher un logement</Link>
          <Link to="/comment-ca-marche#pass">Pass Contact</Link>
          <Link to="/inscription">Créer un compte</Link>
        </nav>

        <nav className="footer__col" aria-label="Propriétaires">
          <h2>Propriétaires</h2>
          <Link to={lienPublier}>Publier une annonce</Link>
          <Link to={lienMesAnnonces}>Mes annonces</Link>
          <a href={lienWhatsApp(SUPPORT_WHATSAPP, "Bonjour, je souhaite être accompagné pour publier mon annonce sur ESIKA.")} target="_blank" rel="noreferrer">
            Publication assistée
          </a>
        </nav>

        <div className="footer__col">
          <h2>Besoin d'aide ?</h2>
          <p>Notre équipe répond sur WhatsApp, du lundi au samedi.</p>
          <Button href={lienWhatsApp(SUPPORT_WHATSAPP)} variant="whatsapp" size="sm" target="_blank" rel="noreferrer">
            <IconChat taille={16} /> Écrire sur WhatsApp
          </Button>
          <Link to="/comment-ca-marche#anti-arnaque" className="footer__arnaque"><IconFlag taille={14} /> Signaler une arnaque</Link>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 ESIKA · Tous droits réservés</span>
        <span className="footer__legal">
          <Link to="/conditions">Conditions d'utilisation</Link>
          <Link to="/confidentialite">Confidentialité</Link>
          <Link to="/contact">Nous contacter</Link>
        </span>
      </div>
    </footer>
  );
}
