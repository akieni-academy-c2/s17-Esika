import { useRef } from "react";
import { PHOTOS_MAX, PHOTOS_MIN } from "../annonceur.data";
import { IconCamera, IconPlus, IconX } from "../../../components/ui/Icons.jsx";

export default function EtapePhotos({ photos, ajouter, retirer, enCours }) {
  const ref = useRef(null);
  const vides = Math.max(PHOTOS_MAX - photos.length - 1, 0);

  return (
    <>
      <p className="pub__aide">
        {PHOTOS_MIN} photos minimum, {PHOTOS_MAX} maximum : salon, chambres, sanitaires, façade.
        Elles sont réduites automatiquement (WebP, moins de 200 Ko) pour charger vite en 3G.
      </p>

      <ul className="pub__photos">
        {photos.map((p, i) => (
          <li key={p.url}>
            <img src={p.url} alt={`Photo ${i + 1}`} />
            {i === 0 && <span className="pub__couv">Couverture</span>}
            <button type="button" aria-label={`Retirer la photo ${i + 1}`} onClick={() => retirer(i)}><IconX taille={14} /></button>
            <small>{Math.round(p.taille / 1024)} Ko</small>
          </li>
        ))}
        {photos.length < PHOTOS_MAX && (
          <li>
            <button type="button" className="pub__ajout" disabled={enCours} onClick={() => ref.current?.click()}>
              {enCours ? "Traitement…" : <><IconCamera taille={20} /><span><IconPlus taille={13} /> Ajouter</span></>}
            </button>
          </li>
        )}
        {Array.from({ length: vides }, (_, i) => <li key={`vide-${i}`} className="pub__photo-vide" aria-hidden="true" />)}
      </ul>
      <p className="pub__compte-photos">{photos.length} / {PHOTOS_MAX} photos{photos.length < PHOTOS_MIN ? ` · encore ${PHOTOS_MIN - photos.length} à ajouter` : ""}</p>

      <input ref={ref} type="file" accept="image/*" multiple hidden
        onChange={(e) => { ajouter([...e.target.files]); e.target.value = ""; }} />
    </>
  );
}
