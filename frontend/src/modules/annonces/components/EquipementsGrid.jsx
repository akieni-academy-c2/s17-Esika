import { IconBolt, IconCar, IconGlobe, IconShield, IconSnow, IconSofa, IconWifi } from '../../../components/ui/Icons';

const ITEMS = [
  { cle: 'gardien', titre: 'Gardiennage', sous: 'Portail + clôture', Icone: IconShield },
  { cle: 'groupe', titre: 'Groupe électrogène', sous: 'Parties communes', Icone: IconBolt },
  { cle: 'clim', titre: 'Climatisation', sous: 'Pièce équipée', Icone: IconSnow },
  { cle: 'parking', titre: 'Parking', sous: 'Place dans la cour', Icone: IconCar },
  { cle: 'internet', titre: 'Internet possible', sous: 'Fibre ou box 4G', Icone: IconGlobe },
  { cle: 'wifi', titre: 'Wi-Fi', sous: 'Inclus dans le loyer', Icone: IconWifi },
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
      {ITEMS.map(({ cle, titre, sous, Icone }) => (
        <li key={cle} className={presence[cle] ? '' : 'equip__off'}>
          <Icone taille={22} />
          <div>
            <strong>{titre}</strong>
            <small>{presence[cle] ? sous : 'Non inclus'}</small>
          </div>
        </li>
      ))}
      <li className={meuble ? '' : 'equip__off'}>
        <IconSofa taille={22} />
        <div>
          <strong>{meuble ? 'Meublé' : 'Non meublé'}</strong>
          <small>{meuble ? 'Équipé' : 'Cuisine aménagée possible'}</small>
        </div>
      </li>
    </ul>
  );
}
