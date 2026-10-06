// Images du site (dossier public/images, déjà compressées en WebP)
const dossier = "/images/";
const img = (nom) => `${dossier}${nom}.webp`;

// Diaporama du hero de l'accueil : ajouter une image ici suffit à l'ajouter au défilement
export const HERO_IMAGES = [
  { src: img("accueil-1"), alt: "Salon lumineux avec une grande baie vitrée donnant sur les toits d'une ville au coucher du soleil" },
  { src: img("accueil-2"), alt: "Maison clôturée avec un portail et des bougainvilliers au coucher du soleil" },
  { src: img("maison-3"), alt: "Maison clôturée avec un portail et des bougainvilliers au coucher du soleil" },
  { src: img("maison-4"), alt: "Maison clôturée avec un portail et des bougainvilliers au coucher du soleil" },
  { src: img("maison-5"), alt: "Maison clôturée avec un portail et des bougainvilliers au coucher du soleil" },
];
export const HERO_INTERVALLE_MS = 3000;

export const IMG = {
  bandeau: { src: img("bandeau-final"), alt: "Chambre claire avec un lit, une moustiquaire et une fenêtre ouverte sur des palmiers", largeur: 1600, hauteur: 686 },
  proprietaire: { src: img("proprietaire"), alt: "Maison de plain-pied avec sa cour et son portail rouge ouvert, sous un manguier", largeur: 1100, hauteur: 733 },
  confiance: { src: img("confiance"), alt: "Clés, reçu, stylo et téléphone posés sur une table en bois", largeur: 1100, hauteur: 733 },
  etapes: [
    { src: img("etape-1"), alt: "Smartphone affichant des annonces de logements, posé sur une table en bois" },
    { src: img("etape-2"), alt: "Smartphone affichant un cadenas ouvert, à côté d'un trousseau de clés" },
    { src: img("etape-3"), alt: "Porte d'entrée ouverte sur un salon vide, avec les clés dans la serrure" },
  ],
};

// Photos d'exemple des annonces de démonstration
export const PHOTOS_DEMO = {
  salon: img("accueil-1"),
  facade: img("accueil-2"),
  chambre: img("bandeau-final"),
  porte: img("etape-3"),
  cour: img("proprietaire"),
};
