import { useRef } from "react";
import { PHOTOS_MAX, PHOTOS_MIN } from "../annonceur.data";

export default function EtapePhotos({ photos, ajouter, retirer, enCours }) {
  const ref = useRef(null);

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
            <button type="button" aria-label={`Retirer la photo ${i + 1}`} onClick={() => retirer(i)}>×</button>
            <small>{Math.round(p.taille / 1024)} Ko</small>
          </li>
        ))}
        {photos.length < PHOTOS_MAX && (
          <li>
            <button type="button" className="pub__ajout" disabled={enCours} onClick={() => ref.current?.click()}>
              {enCours ? "Traitement…" : "+ Ajouter"}
            </button>
          </li>
        )}
      </ul>

      <input ref={ref} type="file" accept="image/*" multiple hidden
        onChange={(e) => { ajouter([...e.target.files]); e.target.value = ""; }} />
    </>
  );
}