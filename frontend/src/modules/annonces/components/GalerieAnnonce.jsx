import { useEffect, useState } from 'react';
import { IconCamera, IconChevron, IconGrid, IconX } from '../../../components/ui/Icons';

const LIBELLES = ['Salon', 'Chambre 1', 'Chambre 2', 'Douche + WC', 'Façade et cour'];

export default function GalerieAnnonce({ annonce }) {
  // Quand l'annonce a de vraies photos (URLs), elles remplacent les blocs gris.
  const photos = annonce.photos ?? [];
  const total = annonce.nbPhotos ?? photos.length;
  const tuiles = LIBELLES.map((libelle, i) => ({ libelle, src: photos[i] }));
  const [ouverte, setOuverte] = useState(null); // index de la photo affichée en grand, ou null

  const nb = Math.max(total, photos.length, 1);
  const aller = (delta) => setOuverte((i) => (i + delta + nb) % nb);

  useEffect(() => {
    if (ouverte === null) return undefined;
    const touche = (e) => {
      if (e.key === 'Escape') setOuverte(null);
      if (e.key === 'ArrowRight') aller(1);
      if (e.key === 'ArrowLeft') aller(-1);
    };
    document.addEventListener('keydown', touche);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', touche);
      document.body.style.overflow = '';
    };
  });

  return (
    <>
      <div className="galerie" role="group" aria-label="Photos du logement">
        {tuiles.map((t, i) => (
          <button
            type="button"
            key={t.libelle}
            className={`galerie__tuile ${i === 0 ? 'galerie__tuile--grande' : ''}`}
            onClick={() => setOuverte(i)}
            aria-label={`Agrandir : ${t.libelle}`}
          >
            {t.src ? (
              <img src={t.src} alt={`${t.libelle} — ${annonce.titre}`} loading={i === 0 ? 'eager' : 'lazy'} />
            ) : (
              <span className="galerie__vide"><IconCamera taille={16} /> {t.libelle}</span>
            )}
          </button>
        ))}
        <button type="button" className="galerie__voir" onClick={() => setOuverte(0)}>
          <IconGrid taille={15} /> Voir les {total} photos
        </button>
      </div>

      {ouverte !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photos du logement" onClick={() => setOuverte(null)}>
          <button type="button" className="lightbox__fermer" onClick={() => setOuverte(null)} aria-label="Fermer"><IconX taille={22} /></button>
          <button type="button" className="lightbox__nav lightbox__nav--prec" onClick={(e) => { e.stopPropagation(); aller(-1); }} aria-label="Photo précédente"><IconChevron taille={26} /></button>
          <figure className="lightbox__cadre" onClick={(e) => e.stopPropagation()}>
            {photos[ouverte] ? (
              <img src={photos[ouverte]} alt={`Photo ${ouverte + 1} — ${annonce.titre}`} />
            ) : (
              <div className="lightbox__vide"><IconCamera taille={28} />{LIBELLES[ouverte] ?? `Photo ${ouverte + 1}`}</div>
            )}
            <figcaption>{ouverte + 1} / {nb}</figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--suiv" onClick={(e) => { e.stopPropagation(); aller(1); }} aria-label="Photo suivante"><IconChevron taille={26} /></button>
        </div>
      )}
    </>
  );
}
