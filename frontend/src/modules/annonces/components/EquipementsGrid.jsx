const ITEMS = [
  { cle: 'gardien', titre: 'Gardiennage', sous: 'Portail + clôture' },
  { cle: 'groupe', titre: 'Groupe électrogène', sous: 'Parties communes' },
  { cle: 'clim', titre: 'Climatisation', sous: 'Pièce équipée' },
  { cle: 'parking', titre: 'Parking', sous: 'Place dans la cour' },
  { cle: 'internet', titre: 'Internet possible', sous: 'Fibre ou box 4G' },
  { cle: 'wifi', titre: 'Wi-Fi', sous: 'Inclus dans le loyer' },
];

const normaliser = (s) =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function EquipementsGrid({ equipements = [], meuble }) {
  const texte = equipements.map(normaliser).join(' | ');
  const a = (mot) => texte.includes(mot);

  const presence = {
    gardien: a('gardien') || a('securite'),
    groupe: a('groupe') || a('electrogene'),
    clim: a('clim'),
    parking: a('parking'),
    internet: a('internet') || a('fibre'),
    wifi: a('wi-fi') || a('wifi'),
  };

  return (
    <ul className="equip">
      {ITEMS.map((it) => (
        <li key={it.cle} className={presence[it.cle] ? '' : 'equip__off'}>
          <strong>{it.titre}</strong>
          <small>{presence[it.cle] ? it.sous : 'Non inclus'}</small>
        </li>
      ))}
      <li>
        <strong>{meuble ? 'Meublé' : 'Non meublé'}</strong>
        <small>{meuble ? 'Équipé' : 'Cuisine aménagée possible'}</small>
      </li>
    </ul>
  );
}