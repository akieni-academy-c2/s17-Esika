const LIBELLES = ['Salon', 'Chambre 1', 'Chambre 2', 'Douche + WC', 'Façade et cour'];

export default function GalerieAnnonce({ annonce }) {
  // Quand le backend enverra annonce.photos (URLs), elles remplaceront les blocs gris.
  const photos = annonce.photos ?? [];
  const tuiles = LIBELLES.map((libelle, i) => ({ libelle, src: photos[i] }));

  return (
    <div className="galerie" role="group" aria-label="Photos du logement">
      {tuiles.map((t, i) => (
        <div key={t.libelle} className={`galerie__tuile ${i === 0 ? 'galerie__tuile--grande' : ''}`}>
          {t.src ? (
            <img src={t.src} alt={`${t.libelle} — ${annonce.titre}`} loading={i === 0 ? 'eager' : 'lazy'} />
          ) : (
            <span>{t.libelle}</span>
          )}
        </div>
      ))}
      <button type="button" className="galerie__voir">
        Voir les {annonce.nbPhotos} photos
      </button>
    </div>
  );
}