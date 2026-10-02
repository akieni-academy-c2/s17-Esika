import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { MOTIFS, signalerAnnonce } from "./signalements.service";
import "./signalements.css";

export default function SignalerModal({ annonce, ouvert, onFermer }) {
  const { user } = useAuth();
  const [motif, setMotif] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const boite = useRef(null);
  const fermerRef = useRef(onFermer);
  fermerRef.current = onFermer;

  useEffect(() => {
    if (!ouvert) return;
    setMotif(""); setMessage(""); setErreur(""); setEnvoye(false);
    const precedent = document.activeElement;
    const touche = (e) => e.key === "Escape" && fermerRef.current();
    document.addEventListener("keydown", touche);
    document.body.style.overflow = "hidden";
    boite.current?.focus();
    return () => {
      document.removeEventListener("keydown", touche);
      document.body.style.overflow = "";
      precedent?.focus?.();
    };
  }, [ouvert]);

  if (!ouvert) return null;

  const envoyer = async (e) => {
    e.preventDefault();
    if (!motif) return setErreur("Choisissez un motif.");
    setEnvoi(true);
    setErreur("");
    try {
      await signalerAnnonce({ annonce, motif, message, user });
      setEnvoye(true);
    } catch (err) {
      setErreur(
        err.message === "DEJA_SIGNALE"
          ? "Vous avez déjà signalé cette annonce : l'équipe ESIKA la vérifie."
          : "L'envoi a échoué. Réessayez."
      );
    } finally {
      setEnvoi(false);
    }
  };

  return createPortal(
    <div className="sig__fond" onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <div className="sig__boite" role="dialog" aria-modal="true" aria-labelledby="sig-titre" tabIndex={-1} ref={boite}>
        {envoye ? (
          <div className="sig__fin">
            <h2 id="sig-titre">Merci, signalement envoyé</h2>
            <p>L'équipe ESIKA vérifie l'annonce et peut la masquer si le problème est confirmé.</p>
            <button type="button" className="sig__btn sig__btn--plein" onClick={onFermer}>Fermer</button>
          </div>
        ) : (
          <form onSubmit={envoyer} noValidate>
            <h2 id="sig-titre">Signaler l'annonce</h2>
            <p className="sig__sous">{annonce.titre}</p>

            <fieldset className="sig__motifs">
              <legend>Quel est le problème ?</legend>
              {MOTIFS.map((m) => (
                <label key={m.cle} className={motif === m.cle ? "is-actif" : ""}>
                  <input type="radio" name="motif" value={m.cle} checked={motif === m.cle}
                    onChange={() => { setMotif(m.cle); setErreur(""); }} />
                  {m.libelle}
                </label>
              ))}
            </fieldset>

            <label htmlFor="sig-msg" className="sig__label">Précisions (facultatif)</label>
            <textarea id="sig-msg" rows={3} maxLength={300} className="sig__champ"
              placeholder="Que s'est-il passé ?" value={message} onChange={(e) => setMessage(e.target.value)} />

            <p className="sig__erreur" role="alert">{erreur}</p>

            <div className="sig__actions">
              <button type="button" className="sig__btn" onClick={onFermer}>Annuler</button>
              <button type="submit" className="sig__btn sig__btn--plein" disabled={envoi}>
                {envoi ? "Envoi…" : "Envoyer le signalement"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}