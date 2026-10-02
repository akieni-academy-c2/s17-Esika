import { Link } from "react-router-dom";
import { SUPPORT_WHATSAPP } from "../config/constants.js";
import { lienWhatsApp } from "../lib/whatsapp.js";
import Button from "./ui/Button.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <p className="logo logo--light"><span className="logo__mark" />ESIKA</p>
          <p>La location longue durée sans démarcheur : des annonces publiées par les propriétaires, le prix réel et le total à l'entrée.</p>
          <p className="footer__villes">
            <span className="pill">Brazzaville</span>
            <span className="pill">Pointe-Noire</span>
          </p>
        </div>

        <nav className="footer__col" aria-label="Locataires">
          <h2>Locataires</h2>
          <Link to="/annonces">Rechercher un logement</Link>
          <Link to="/comment-ca-marche#pass-contact">Pass Contact</Link>
          <Link to="/inscription">Créer un compte</Link>
        </nav>

        <nav className="footer__col" aria-label="Propriétaires">
          <h2>Propriétaires</h2>
          <Link to="/proprietaire/publier">Publier une annonce</Link>
          <Link to="/proprietaire/annonces">Mes annonces</Link>
        </nav>

        <div className="footer__col">
          <h2>Besoin d'aide ?</h2>
          <p>Notre équipe répond sur WhatsApp, du lundi au samedi.</p>
          <Button href={lienWhatsApp(SUPPORT_WHATSAPP)} variant="whatsapp" size="sm" target="_blank" rel="noreferrer">
            Écrire sur WhatsApp
          </Button>
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