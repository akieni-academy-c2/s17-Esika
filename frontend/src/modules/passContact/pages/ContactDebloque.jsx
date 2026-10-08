import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAnnonceById } from '../../annonces/annonces.service';
import { getContactAnnonce, getPassActif } from '../passContact.service';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import BandeauAntiArnaque from '../../../components/BandeauAntiArnaque';
import { IconArrowLeft, IconCheck, IconChat, IconClock, IconFlag, IconPhone, IconShield, IconWarning } from '../../../components/ui/Icons';
import { PASS_DUREE_JOURS } from '../../../config/constants';
import Spinner from '../../../components/ui/Spinner';
import { formatFCFA } from '../../../lib/format';
import '../passContact.css';
import SignalerModal from '../../signalements/SignalerModal';

export default function ContactDebloque() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [contact, setContact] = useState(null);
  const [pass, setPass] = useState(null);
  const [message, setMessage] = useState('');
  const [signaler, setSignaler] = useState(false);

  useEffect(() => {
    let annule = false;
    (async () => {
      const p = await getPassActif(id);
      if (!p) return navigate(`/annonces/${id}/debloquer`, { replace: true });
      const a = await getAnnonceById(id);
      if (!a) return navigate('/annonces', { replace: true });
      try {
        const c = await getContactAnnonce(id, a);
        if (annule) return;
        setPass(p);
        setAnnonce(a);
        setContact(c);
        setMessage(
          `Bonjour, je vous contacte via ESIKA pour votre ${a.titre} (${formatFCFA(a.loyer)}). ` +
            `Est-il toujours disponible ? Quand puis-je le visiter ?`
        );
      } catch {
        navigate(`/annonces/${id}/debloquer`, { replace: true });
      }
    })();
    return () => {
      annule = true;
    };
  }, [id, navigate]);

  if (!contact) {
    return <div className="pass pass--centre"><Spinner /></div>;
  }

  const chiffres = contact.telephone.replace(/\D/g, '');
  const initiales = contact.nom.split(/\s+/).slice(0, 2).map((m) => m[0]).join('').toUpperCase();
  const lienWhatsApp = `https://wa.me/${chiffres}?text=${encodeURIComponent(message)}`;
  const expire = new Date(pass.expireLe).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <div className="pass">
      <div className="pass__container">
        <div className="pass__confirm" role="status">
          <span className="pass__confirm-icone"><IconCheck taille={20} /></span>
          <div className="pass__confirm-texte">
            <strong>Paiement confirmé : votre Pass Contact est actif</strong>
            <p>Valable jusqu'au {expire} · contacts illimités pendant {PASS_DUREE_JOURS} jours</p>
          </div>
          <Button to="/annonces" variant="outline" size="sm">Voir d'autres annonces</Button>
        </div>

        <div className="pass__bandeau">
          <BandeauAntiArnaque>
            Ne versez aucun argent (caution, avance, « frais de réservation ») avant d'avoir visité le logement et
            rencontré le propriétaire. ESIKA ne vous demandera jamais d'argent pour un logement : si quelqu'un l'exige,
            signalez l'annonce.
          </BandeauAntiArnaque>
        </div>

        <div className="pass__grille pass__grille--contact">
          <section className="pass__carte">
            <div className="pass__proprio">
              <div className="pass__avatar" aria-hidden="true">{initiales}</div>
              <div className="pass__proprio-texte">
                <h1>{contact.nom}</h1>
                <p>{annonce.titre} · {formatFCFA(annonce.loyer)} /mois</p>
              </div>
              {annonce.numeroVerifie && <Badge variant="mint"><IconShield taille={13} /> Numéro vérifié</Badge>}
            </div>

            <div className="pass__numero">
              <span className="pass__numero-valeur"><IconPhone taille={20} /> <strong>{contact.telephone}</strong></span>
              <small><IconClock taille={13} /> {contact.horaires}</small>
            </div>

            <div className="pass__boutons">
              <Button href={`tel:+${chiffres}`} block size="lg"><IconPhone taille={18} /> Appeler</Button>
              <Button href={lienWhatsApp} variant="whatsapp" block size="lg" target="_blank" rel="noreferrer">
                <IconChat taille={18} /> Ouvrir WhatsApp
              </Button>
            </div>

            <label htmlFor="msg-wa" className="pass__champ">
              Message WhatsApp pré-rempli (modifiable)
            </label>
            <textarea
              id="msg-wa"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </section>

          <aside className="pass__aside">
            <div className="pass__conseils">
              <h2><IconWarning taille={18} /> Avant de payer quoi que ce soit</h2>
              <ul>
                <li><IconCheck taille={15} /> Visitez le logement en personne</li>
                <li><IconCheck taille={15} /> Rencontrez le propriétaire, vérifiez son identité</li>
                <li><IconCheck taille={15} /> Payez contre reçu et bail écrit</li>
                <li><IconCheck taille={15} /> Refusez tout envoi d'argent « pour réserver »</li>
              </ul>
            </div>
            <div className="pass__signaler">
              <h2>Un problème avec cette annonce ?</h2>
              <p>Prix différent, logement déjà loué, demande d'argent avant la visite : prévenez-nous.</p>
              <Button variant="outline" block onClick={() => setSignaler(true)}><IconFlag taille={16} /> Signaler l'annonce</Button>
              <Link to={`/annonces/${annonce.id}`} className="pass__retour"><IconArrowLeft taille={14} /> Retour à l'annonce</Link>
            </div>
          </aside>
        </div>
      </div>
      <SignalerModal annonce={annonce} ouvert={signaler} onFermer={() => setSignaler(false)} />
    </div>
  );
}