import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAnnonceById } from '../../annonces/annonces.service';
import { getContactAnnonce, getPassActif } from '../passContact.service';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
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
      const p = await getPassActif();
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
  const lienWhatsApp = `https://wa.me/${chiffres}?text=${encodeURIComponent(message)}`;
  const expire = new Date(pass.expireLe).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <div className="pass">
      <div className="pass__container">
        <div className="pass__confirm" role="status">
          <div>
            <strong>Paiement confirmé : votre Pass Contact est actif</strong>
            <p>Valable jusqu'au {expire} · contacts illimités pendant 7 jours</p>
          </div>
          <Button to="/annonces" variant="outline" size="sm">Voir d'autres annonces</Button>
        </div>

        <div className="pass__grille pass__grille--contact">
          <section className="pass__carte">
            <div className="pass__proprio">
              <div className="pass__avatar" aria-hidden="true">
                {contact.nom.slice(0, 1)}
              </div>
              <div>
                <h1>{contact.nom}</h1>
                <p>{annonce.titre} · {formatFCFA(annonce.loyer)}/mois</p>
              </div>
              {annonce.numeroVerifie && <Badge variant="success">Numéro vérifié</Badge>}
            </div>

            <div className="pass__numero">
              <strong>{contact.telephone}</strong>
              <small>{contact.horaires}</small>
            </div>

            <div className="pass__boutons">
              <Button href={`tel:+${chiffres}`} block size="lg">Appeler</Button>
              <Button href={lienWhatsApp} variant="whatsapp" block size="lg">
                Ouvrir WhatsApp
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
              <h2>Avant de payer quoi que ce soit</h2>
              <ul>
                <li>Visitez le logement en personne</li>
                <li>Rencontrez le propriétaire, vérifiez son identité</li>
                <li>Payez contre reçu et bail écrit</li>
                <li>Refusez tout envoi d'argent « pour réserver »</li>
              </ul>
            </div>
            <div className="pass__signaler">
              <h2>Un problème avec cette annonce ?</h2>
              <p>Prix différent, logement déjà loué, demande d'argent avant la visite : prévenez-nous.</p>
              {/* TODO : ouvrir SignalerModal */}
              <button type="button" className="sig__declencheur sig__declencheur--bloc" onClick={() => setSignaler(true)}>
                Signaler l'annonce
              </button>
              <Link to={`/annonces/${annonce.id}`} className="pass__retour">← Retour à l'annonce</Link>
            </div>
          </aside>
        </div>
      </div>
      <SignalerModal annonce={annonce} ouvert={signaler} onFermer={() => setSignaler(false)} />
    </div>
  );
}