import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button.jsx";
import {
  IconCheck, IconCheckCircle, IconChat, IconChevronDown, IconClock, IconFlag, IconHome, IconPin, IconSearch, IconWarning, IconX,
} from "../../../components/ui/Icons.jsx";
import { useLienPublier } from "../../../hooks/useLiens.js";
import { formatFCFA } from "../../../lib/format.js";
import { PASS_DUREE_JOURS, PASS_PRIX, SUPPORT_WHATSAPP } from "../../../config/constants.js";
import "../contenu.css";

const FAQ = [
  ["Qu'est-ce que le « total à l'entrée » ?",
    "C'est la somme à réunir pour entrer dans le logement : la caution plus l'avance, calculées à partir du loyer et du nombre de mois fixés par le propriétaire. Aucun frais de démarcheur ne s'y ajoute."],
  ["Comment savoir si une annonce est fiable ?",
    "Chaque fiche affiche un bloc « Fiabilité » : numéro du propriétaire vérifié par SMS, disponibilité confirmée récemment, photos publiées par le propriétaire et absence de signalement. En cas de doute, utilisez le bouton « Signaler »."],
  ["Que faire si le logement est déjà loué ?",
    "Signalez l'annonce avec le motif « Logement déjà loué ». Les propriétaires peuvent aussi passer leur annonce en « Loué » : elle disparaît alors des résultats de recherche."],
  ["Puis-je payer mon loyer ou ma caution sur ESIKA ?",
    "Non, jamais. La caution, l'avance et le loyer se règlent directement au propriétaire, après la visite, contre reçu. Le Pass Contact est le seul paiement sur ESIKA."],
  ["Publier une annonce est-il vraiment gratuit ?",
    "Oui. La publication est gratuite pour les propriétaires, sans commission. Seuls les locataires qui veulent contacter un propriétaire achètent un Pass Contact."],
];

export default function CommentCaMarche() {
  const [aide, setAide] = useState(false);
  const lienPublier = useLienPublier();
  const whatsapp = `https://wa.me/${String(SUPPORT_WHATSAPP ?? "").replace(/\D/g, "")}`;

  return (
    <div className="ccm">
      <header className="ccm__hero">
        <div className="ccm__container">
          <p className="ccm__kicker">AIDE ET CONSEILS</p>
          <h1>Tout comprendre sur ESIKA, avant de chercher ou de publier.</h1>
          <p className="ccm__lead">Comment fonctionne la plateforme, à quoi sert le Pass Contact et comment éviter les arnaques.</p>
          <nav className="ccm__ancres" aria-label="Sur cette page">
            <a href="#parcours">Comment ça marche</a>
            <a href="#pass">Le Pass Contact</a>
            <a href="#anti-arnaque"><IconWarning taille={14} /> Anti-arnaque</a>
            <a href="#faq">Questions fréquentes</a>
            <a href="#contact">Nous contacter</a>
          </nav>
        </div>
      </header>

      <div className="ccm__container">
        <section id="parcours" className="ccm__section">
          <p className="ccm__kicker">COMMENT ÇA MARCHE</p>
          <h2>Deux parcours simples, sans intermédiaire</h2>
          <p className="ccm__lead">Le locataire et le propriétaire se parlent directement. ESIKA garantit une information exacte et à jour.</p>

          <div className="ccm__duo">
            <article className="ccm__carte">
              <h3 className="ccm__titre-carte"><span className="ccm__tuile ccm__tuile--rose"><IconSearch taille={18} /></span> Vous cherchez un logement</h3>
              <ol className="ccm__etapes">
                <li><strong>Cherchez gratuitement</strong><span>Filtrez par quartier, loyer, équipements (groupe électrogène, gardiennage…). Le total à l'entrée est affiché sur chaque annonce.</span></li>
                <li><strong>Débloquez le contact</strong><span>Avec un Pass Contact à {formatFCFA(PASS_PRIX)}, valable {PASS_DUREE_JOURS} jours sur toutes les annonces.</span></li>
                <li><strong>Visitez, puis payez sur place</strong><span>Appelez ou écrivez sur WhatsApp. La caution et l'avance se règlent au propriétaire, après la visite, contre reçu.</span></li>
              </ol>
              <Button to="/annonces">Voir les annonces</Button>
            </article>

            <article className="ccm__carte">
              <h3 className="ccm__titre-carte"><span className="ccm__tuile ccm__tuile--vert"><IconHome taille={18} /></span> Vous louez un logement</h3>
              <ol className="ccm__etapes">
                <li><strong>Créez votre compte</strong><span>Par téléphone, avec un mot de passe. Votre numéro vérifié rassure les locataires.</span></li>
                <li><strong>Publiez en 5 minutes</strong><span>Formulaire guidé, total à l'entrée calculé automatiquement. Un conseiller peut publier avec vous sur WhatsApp.</span></li>
                <li><strong>Gardez l'annonce à jour</strong><span>Modifiez le prix, confirmez la disponibilité, passez en « Loué » : fini les appels pour un logement déjà pris.</span></li>
              </ol>
              <Button to={lienPublier} variant="outline">Publier gratuitement</Button>
            </article>
          </div>
        </section>

        <section id="pass" className="ccm__section">
          <p className="ccm__kicker">LE PASS CONTACT</p>
          <h2>Le seul paiement sur ESIKA</h2>
          <p className="ccm__lead">Il remplace les frais de démarcheur par un petit montant fixe, et limite les contacts aux personnes vraiment intéressées.</p>

          <div className="ccm__trio">
            <div className="ccm__pass">
              <span>PASS CONTACT · {PASS_DUREE_JOURS} JOURS</span>
              <strong>{formatFCFA(PASS_PRIX)}</strong>
              <ul>
                <li><IconCheck taille={16} /> Contact direct de tous les propriétaires</li>
                <li><IconCheck taille={16} /> Appel et WhatsApp pendant {PASS_DUREE_JOURS} jours</li>
                <li><IconCheck taille={16} /> Paiement Mobile Money (MTN, Airtel)</li>
              </ul>
            </div>
            <div className="ccm__bloc ccm__bloc--vert">
              <h3><IconCheckCircle taille={18} /> Ce que le pass est</h3>
              <p>L'accès au numéro vérifié des propriétaires, pour organiser vos visites vous-même.</p>
              <p>Un prix fixe et connu d'avance, quel que soit le loyer.</p>
            </div>
            <div className="ccm__bloc">
              <h3><IconX taille={18} /> Ce que le pass n'est pas</h3>
              <p>Ni une réservation, ni un paiement du logement.</p>
              <p>La caution, l'avance et le loyer ne passent jamais par ESIKA.</p>
            </div>
          </div>
        </section>

        <section id="anti-arnaque" className="ccm__section">
          <p className="ccm__kicker">ANTI-ARNAQUE</p>
          <h2>Ne payez jamais avant la visite</h2>
          <p className="ccm__lead">Les arnaques au logement reposent presque toujours sur un paiement demandé trop tôt. Quatre règles suffisent à s'en protéger.</p>

          <div className="ccm__regles">
            {[
              ["Visitez en personne", "Jamais de paiement sur photos ou vidéo seulement."],
              ["Rencontrez le propriétaire", "Vérifiez son identité et qu'il a bien les clés."],
              ["Payez contre reçu", "Et signez un bail écrit avant de remettre la caution."],
              ["Refusez les « réservations »", "Personne ne doit exiger un Mobile Money pour « bloquer » un logement."],
            ].map(([t, d], i) => (
              <div key={t}><b>{i + 1}</b><strong>{t}</strong><span>{d}</span></div>
            ))}
          </div>

          <div className="ccm__duo">
            <div className="ccm__carte">
              <h3>Les signaux d'alerte</h3>
              <ul className="ccm__alertes">
                <li><IconWarning taille={16} /> On vous demande une avance ou des frais avant la visite</li>
                <li><IconWarning taille={16} /> Le prix est très inférieur aux autres annonces du quartier</li>
                <li><IconWarning taille={16} /> Le « propriétaire » est absent et ne peut pas faire visiter</li>
                <li><IconWarning taille={16} /> On vous presse : « beaucoup de monde est intéressé »</li>
              </ul>
            </div>
            <div className="ccm__carte ccm__carte--noire">
              <h3>Un doute ? Signalez l'annonce</h3>
              <p>Bouton « Signaler » sur chaque annonce. L'équipe ESIKA vérifie et peut masquer l'annonce.</p>
              <button type="button" className="ccm__btn-blanc" aria-expanded={aide} onClick={() => setAide(!aide)}>
                <IconFlag taille={15} /> Comment signaler
              </button>
              {aide && (
                <ol className="ccm__signaler">
                  <li>Ouvrez l'annonce concernée.</li>
                  <li>Cliquez sur « Signaler ».</li>
                  <li>Choisissez un motif et ajoutez une précision si besoin.</li>
                </ol>
              )}
            </div>
          </div>
        </section>

        <section id="faq" className="ccm__section ccm__faq-zone">
          <div>
            <p className="ccm__kicker">QUESTIONS FRÉQUENTES</p>
            <h2>Vos questions, nos réponses</h2>
            <p className="ccm__lead">Les questions que nous posent le plus souvent locataires et propriétaires.</p>
            <div className="ccm__faq">
              {FAQ.map(([q, r], i) => (
                <details key={q} name="faq" open={i === 0}>
                  <summary>{q}<IconChevronDown taille={18} /></summary>
                  <p>{r}</p>
                </details>
              ))}
            </div>
          </div>

          <aside id="contact" className="ccm__contact">
            <h3>Nous contacter</h3>
            <p>Une question, un problème avec une annonce ou besoin d'aide pour publier ?</p>
            <a className="ccm__wa" href={whatsapp} target="_blank" rel="noreferrer"><IconChat taille={17} /> Écrire sur WhatsApp</a>
            <small><IconClock taille={14} /> Du lundi au samedi</small>
            <small><IconPin taille={14} /> Brazzaville et Pointe-Noire</small>
            <Link to="/annonces" className="ccm__lien">Retour aux annonces</Link>
          </aside>
        </section>
      </div>
    </div>
  );
}