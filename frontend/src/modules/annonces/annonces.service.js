import api, { USE_MOCKS, urlPhoto } from "../../lib/apiClient.js";
import { annoncesMock, attendre } from "../../mocks/annonces.js";
import { calculerTotalEntree, estDisponibleMaintenant } from "../../lib/format.js";
import { lireMesAnnoncesLocales } from "../annonceur/annonceur.service.js";
import { lireAnnoncesMasquees } from "../admin/admin.service.js";

// Seul fichier à adapter quand le backend de Virgile sera prêt :
// la route (/annonces), les noms des paramètres de filtre et le format de réponse.

const JOUR = 86400000;
const toutesLesAnnonces = () =>
  [...lireMesAnnoncesLocales(), ...annoncesMock].filter(
    (a) => !lireAnnoncesMasquees().includes(String(a.id))
  );

// Mock uniquement : relie un filtre d'équipement aux libellés des annonces factices.
const MOTIFS_EQUIPEMENTS = {
  Gardiennage: /gardiennage/i,
  "Groupe électrogène": /groupe/i,
  Climatisation: /climatis/i,
  "Wi-Fi": /wi-?fi/i,
  Internet: /internet|wi-?fi/i,
  Parking: /parking/i,
};

// Comparaison sans accents ni majuscules : « moungali » trouve « Moungali »
const sansAccent = (t = "") => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function filtrer(annonces, f = {}) {
  const quartiers = f.quartiers ?? [];
  // Recherche libre : chaque mot saisi (séparé par une virgule ou un espace) doit apparaître dans l'annonce
  const mots = sansAccent(f.q).split(/[,\s]+/).filter((m) => m.length > 1);
  const equipements = f.equipements ?? [];

  return annonces.filter(
    (a) =>
      a.statut === "disponible" &&
      // Certaines versions de l'API ne renvoient pas encore city.
      // Dans ce cas on ne doit pas masquer toutes les annonces.
      (!f.ville || !a.ville || sansAccent(a.ville) === sansAccent(f.ville)) &&
      (quartiers.length === 0 || quartiers.includes(a.quartier)) &&
      (mots.length === 0 || mots.every((m) => sansAccent(`${a.titre} ${a.quartier} ${a.repere}`).includes(m))) &&
      (!f.loyerMax || a.loyer <= Number(f.loyerMax)) &&
      (!f.budgetMax || calculerTotalEntree(a.loyer, a.cautionMois, a.avanceMois) <= Number(f.budgetMax)) &&
      (!f.type || a.type === f.type) &&
      (!f.meuble || a.meuble === (f.meuble === "oui")) &&
      equipements.every((e) => (MOTIFS_EQUIPEMENTS[e] ?? new RegExp(e, "i")).test(a.equipements.join(" "))) &&
      (!f.dispoMaintenant || estDisponibleMaintenant(a.disponibleLe)) &&
      (!f.maj7j || Date.now() - new Date(a.modifieLe).getTime() <= 7 * JOUR) &&
      (!f.verifie || a.numeroVerifie)
  );
}

function trier(annonces, tri = "recentes") {
  const liste = [...annonces];
  if (tri === "prix_asc") return liste.sort((a, b) => a.loyer - b.loyer);
  if (tri === "prix_desc") return liste.sort((a, b) => b.loyer - a.loyer);
  return liste.sort((a, b) => new Date(b.modifieLe) - new Date(a.modifieLe));
}

// Réponse backend -> format front (photos : URLs absolues)
const LIBELLES_EQUIP = { airConditioning: "Climatisation", wifi: "Wi-Fi", generator: "Groupe électrogène", parking: "Parking", furnished: "Meublé", securityGuard: "Gardiennage" };
const normaliser = (a) => {
  if (!a) return a;
  const equipment = a.equipment ?? {};
  // Le endpoint de liste renvoie `image` (une seule couverture),
  // tandis que le endpoint de détail renvoie `images` (tableau d'objets { path, label }).
  // On normalise les trois formats pour que la galerie reçoive toujours des URLs.
  const rawPhotos = a.photos ?? a.images ?? (a.image?.path ? [a.image] : []);
  const photos = (Array.isArray(rawPhotos) ? rawPhotos : [rawPhotos])
    .map((photo) => typeof photo === "string" ? photo : photo?.path)
    .filter(Boolean)
    .map(urlPhoto);
  return {
    ...a,
    id: a.id ?? a.announceId,
    titre: a.titre ?? `${a.type} · ${a.neighborhood}`,
    ville: a.ville ?? a.city,
    quartier: a.quartier ?? a.neighborhood,
    repere: a.repere ?? a.landmark,
    loyer: Number(a.loyer ?? a.rent),
    cautionMois: Number(a.cautionMois ?? a.deposit ?? 0),
    avanceMois: Number(a.avanceMois ?? a.advance ?? 0),
    totalEntry: Number(a.totalEntry ?? 0),
    statut: a.statut ?? (a.status === "rented" ? "loue" : a.status === "paused" || a.status === "hidden" ? "pause" : "disponible"),
    modifieLe: a.modifieLe ?? a.updatedAt ?? a.updated_at ?? new Date().toISOString(),
    disponibleLe: a.disponibleLe ?? a.availableAt,
    photos,
    nbPhotos: Number(a.nbPhotos ?? a.imageCount ?? photos.length),
    equipements: a.equipements ?? Object.entries(equipment).filter(([, v]) => v).map(([k]) => LIBELLES_EQUIP[k]).filter(Boolean),
    meuble: a.meuble ?? Boolean(equipment.furnished),
    proprietaire: a.proprietaire ?? (a.firstName || a.lastName ? { nom: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() } : undefined),
    numeroVerifie: a.numeroVerifie ?? true,
  };
};

export async function getAnnonces(filtres = {}) {
  if (USE_MOCKS) {
    await attendre();
        return trier(filtrer(toutesLesAnnonces(), filtres), filtres.tri);
  }
  // Le backend renvoie toutes les annonces disponibles : filtres et tri se font côté front
  const first = await api.get("/public/announces", { params: { page: 1, limit: 100 } });
  const firstData = first.data;
  const firstList = Array.isArray(firstData) ? firstData : (firstData?.data ?? []);
  const totalPages = Number(firstData?.pagination?.totalPages ?? 1);
  let liste = [...firstList];
  if (totalPages > 1) {
    const pages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        api.get("/public/announces", { params: { page: i + 2, limit: 100 } })
      )
    );
    for (const response of pages) {
      const payload = response.data;
      liste.push(...(Array.isArray(payload) ? payload : (payload?.data ?? [])));
    }
  }
  return trier(filtrer(liste.map(normaliser), filtres), filtres.tri);
}

export async function getAnnonceById(id) {
  if (USE_MOCKS) {
    await attendre();
    const annonce = toutesLesAnnonces().find((a) => String(a.id) === String(id));
    if (!annonce) throw new Error("Annonce introuvable");
    return annonce;
  }
  const { data } = await api.get(`/public/announces/${id}`);
  return normaliser(data);
}