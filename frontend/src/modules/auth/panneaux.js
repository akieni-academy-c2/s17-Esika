import { IconChat, IconFlag, IconLock, IconPhone, IconPlus, IconReceipt, IconShield, IconTag } from '../../components/ui/Icons.jsx';

// Icônes disponibles pour les listes d'atouts du panneau de gauche
export const ICONES = {
  tag: IconTag, receipt: IconReceipt, phone: IconPhone, plus: IconPlus,
  chat: IconChat, shield: IconShield, lock: IconLock, flag: IconFlag,
};

const ATOUTS_LOCATAIRE = [
  ['tag', 'Zéro commission, zéro démarcheur'],
  ['receipt', "Le total à l'entrée affiché sur chaque annonce"],
  ['phone', 'Le contact direct du propriétaire, par appel ou WhatsApp'],
];
const ATOUTS_PROPRIO = [
  ['plus', 'Publication gratuite, en 5 minutes'],
  ['phone', 'Des locataires qui vous appellent directement, sans démarcheur'],
  ['chat', 'Un conseiller ESIKA peut publier avec vous sur WhatsApp'],
];
const ATOUTS_VERIFICATION = [
  ['shield', "Le badge « Numéro vérifié » s'affiche sur vos contacts et vos annonces"],
  ['lock', "Votre numéro n'est visible qu'après déblocage par un Pass Contact"],
  ['flag', "Les comptes signalés sont contrôlés par l'équipe ESIKA"],
];

// Contenu du panneau sombre de gauche selon la page (voir wireframes)
export const PANNEAUX = {
  connexion: { eyebrow: 'Connexion', titre: 'Content de vous revoir.', atouts: ATOUTS_LOCATAIRE },
  'connexion-proprio': { eyebrow: 'Connexion · Propriétaire', titre: 'Votre espace propriétaire.', atouts: ATOUTS_PROPRIO },
  inscription: { eyebrow: 'Inscription · Locataire', titre: 'Le logement, directement avec le propriétaire.', atouts: ATOUTS_LOCATAIRE },
  'inscription-proprio': { eyebrow: 'Inscription · Propriétaire', titre: 'Votre logement, directement auprès des locataires.', atouts: ATOUTS_PROPRIO },
  verification: { eyebrow: 'Inscription · Vérification', titre: "Un numéro vérifié, c'est une annonce plus fiable.", atouts: ATOUTS_VERIFICATION },
};
