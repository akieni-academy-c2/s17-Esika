import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button.jsx";
import { IconChat, IconClock, IconMail, IconPin } from "../../../components/ui/Icons.jsx";
import { SUPPORT_WHATSAPP, PASS_PRIX, PASS_DUREE_JOURS } from "../../../config/constants.js";
import { lienWhatsApp } from "../../../lib/whatsapp.js";
import { formatFCFA } from "../../../lib/format.js";
import "../contenu.css";

// Textes rédigés d'après le fonctionnement réel de la plateforme. À relire et valider par l'équipe
// (et un juriste) avant la mise en production.
const NOTE = "Version de démonstration : texte à valider avant la mise en production.";

export function Conditions() {
  return (
    <div className="legal">
      <div className="legal__container">
        <p className="ccm__kicker">INFORMATIONS LÉGALES</p>
        <h1>Conditions d'utilisation</h1>
        <p className="legal__note">{NOTE}</p>

        <h2>1. Ce qu'est ESIKA</h2>
        <p>ESIKA met en relation des propriétaires et des locataires pour la location longue durée à Brazzaville et à Pointe-Noire. ESIKA n'est ni agence immobilière ni intermédiaire : la visite, le bail et les paiements du logement se font directement entre le propriétaire et le locataire.</p>

        <h2>2. Gratuité et Pass Contact</h2>
        <p>Consulter les annonces et publier une annonce sont gratuits. Le seul paiement sur ESIKA est le Pass Contact : {formatFCFA(PASS_PRIX)}, valable {PASS_DUREE_JOURS} jours, qui donne accès au numéro vérifié des propriétaires. Le pass n'est ni une réservation ni un paiement du logement.</p>

        <h2>3. Ne payez jamais avant la visite</h2>
        <p>ESIKA ne vous demandera jamais d'argent pour un logement. La caution, l'avance et le loyer se règlent au propriétaire, après la visite, contre reçu et bail écrit. Toute demande d'argent avant la visite doit être signalée.</p>

        <h2>4. Obligations des propriétaires</h2>
        <p>Le propriétaire publie des informations exactes (prix, caution, avance, équipements, photos récentes), tient son annonce à jour et la passe en « Loué » dès que le logement est pris. ESIKA peut masquer une annonce signalée ou inexacte.</p>

        <h2>5. Obligations des locataires</h2>
        <p>Le locataire utilise les contacts obtenus pour organiser une visite et s'interdit tout usage abusif (démarchage, revente des numéros, harcèlement).</p>

        <h2>6. Signalements et suspension</h2>
        <p>Tout utilisateur peut signaler une annonce. L'équipe ESIKA examine les signalements et peut masquer une annonce ou suspendre un compte en cas de manquement.</p>

        <h2>7. Responsabilité</h2>
        <p>ESIKA s'efforce de fournir des informations fiables mais ne garantit ni l'exactitude de chaque annonce ni l'issue d'une location. Les accords conclus entre propriétaire et locataire relèvent de leur seule responsabilité.</p>

        <p className="legal__retour"><Link to="/">← Retour à l'accueil</Link></p>
      </div>
    </div>
  );
}

export function Confidentialite() {
  return (
    <div className="legal">
      <div className="legal__container">
        <p className="ccm__kicker">INFORMATIONS LÉGALES</p>
        <h1>Confidentialité</h1>
        <p className="legal__note">{NOTE}</p>

        <h2>Les données que nous collectons</h2>
        <p>À l'inscription : prénom, nom, numéro de téléphone, ville et, si vous le souhaitez, adresse e-mail. Pour publier une annonce : les caractéristiques du logement et ses photos. Pour acheter un Pass Contact : l'opérateur et le numéro Mobile Money utilisés pour le paiement.</p>

        <h2>Ce qui est visible par les autres</h2>
        <p>Seuls votre prénom et l'initiale de votre nom sont visibles. Le numéro de téléphone d'un propriétaire n'est communiqué qu'aux locataires disposant d'un Pass Contact actif. Votre adresse e-mail n'est jamais affichée.</p>

        <h2>À quoi servent ces données</h2>
        <p>À créer et sécuriser votre compte, à afficher les annonces, à permettre la mise en relation et à traiter les signalements. Nous ne vendons pas vos données et nous n'affichons pas de publicité.</p>

        <h2>Sur votre appareil</h2>
        <p>Le site garde sur votre appareil quelques informations de confort : votre session de connexion, la ville choisie, les annonces enregistrées et le brouillon d'une annonce en cours.</p>

        <h2>Vos droits</h2>
        <p>Vous pouvez demander l'accès, la correction ou la suppression de vos données en écrivant à l'équipe ESIKA sur WhatsApp ou via la page de contact.</p>

        <p className="legal__retour"><Link to="/">← Retour à l'accueil</Link></p>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="legal">
      <div className="legal__container">
        <p className="ccm__kicker">NOUS CONTACTER</p>
        <h1>Une question ? Écrivez-nous.</h1>
        <p className="legal__intro">Notre équipe répond sur WhatsApp, du lundi au samedi : problème avec une annonce, aide pour publier, question sur le Pass Contact.</p>

        <div className="legal__cartes">
          <div className="ccm__contact">
            <h3><IconChat taille={18} /> WhatsApp</h3>
            <p>Le moyen le plus rapide d'obtenir de l'aide.</p>
            <Button href={lienWhatsApp(SUPPORT_WHATSAPP, "Bonjour, j'ai une question sur ESIKA.")} variant="whatsapp" target="_blank" rel="noreferrer">
              <IconChat taille={17} /> Écrire sur WhatsApp
            </Button>
          </div>
          <div className="ccm__contact">
            <h3><IconClock taille={18} /> Disponibilité</h3>
            <p>Du lundi au samedi.</p>
            <small><IconPin taille={14} /> Brazzaville et Pointe-Noire</small>
          </div>
          <div className="ccm__contact">
            <h3><IconMail taille={18} /> Signaler une arnaque</h3>
            <p>Utilisez le bouton « Signaler » sur l'annonce concernée : l'équipe vérifie et peut la masquer.</p>
            <Link to="/comment-ca-marche#anti-arnaque" className="ccm__lien">Voir les règles anti-arnaque</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
