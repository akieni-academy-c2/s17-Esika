import Badge from '../../../components/ui/Badge';
import { tempsRelatif } from '../../../lib/format';

export default function FiabiliteAnnonce({ annonce }) {
  const jours = (Date.now() - new Date(annonce.modifieLe).getTime()) / 86400000;

  const criteres = [
    {
      ok: !!annonce.numeroVerifie,
      titre: 'Numéro du propriétaire vérifié',
      detail: 'Confirmé par code SMS à l\'inscription',
    },
    {
      ok: jours <= 7 && annonce.statut !== 'a_confirmer',
      titre: `Disponibilité confirmée ${tempsRelatif(annonce.modifieLe)}`,
      detail: 'Relance automatique chaque semaine',
    },
    {
      ok: annonce.nbPhotos >= 3,
      titre: `${annonce.nbPhotos} photos publiées par le propriétaire`,
      detail: 'Minimum 3 photos exigées',
    },
    {
      ok: !annonce.signalements,
      titre: 'Aucun signalement',
      detail: 'Les annonces signalées sont vérifiées par ESIKA',
    },
  ];

  const score = criteres.filter((c) => c.ok).length;
  const niveau = score >= 4 ? 'Élevée' : score >= 3 ? 'Bonne' : 'Moyenne';

  return (
    <section className="fiabilite" aria-labelledby="fiab-titre">
      <div className="fiabilite__tete">
        <h2 id="fiab-titre">Fiabilité de l'annonce</h2>
        <Badge variant={score >= 3 ? 'success' : 'warn'}>{niveau}</Badge>
      </div>
      <ul className="fiabilite__liste">
        {criteres.map((c) => (
          <li key={c.titre} className={c.ok ? '' : 'fiabilite__ko'}>
            <span aria-hidden="true">{c.ok ? '✓' : '!'}</span>
            <div>
              <strong>{c.titre}</strong>
              <small>{c.detail}</small>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}