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

function filtrer(annonces, f = {}) {
  const quartiers = f.quartiers ?? [];
  const equipements = f.equipements ?? [];

  return annonces.filter(
    (a) =>
      a.statut === "disponible" &&
      (!f.ville || a.ville === f.ville) &&
      (quartiers.length === 0 || quartiers.includes(a.quartier)) &&
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
const normaliser = (a) => ({ ...a, photos: (a.photos ?? []).map(urlPhoto), equipements: a.equipements ?? [] });

export async function getAnnonces(filtres = {}) {
  if (USE_MOCKS) {
    await attendre();
        return trier(filtrer(toutesLesAnnonces(), filtres), filtres.tri);
  }
  // Le backend renvoie toutes les annonces disponibles : filtres et tri se font côté front
  const { data } = await api.get("/announces");
  return trier(filtrer((data ?? []).map(normaliser), filtres), filtres.tri);
}

export async function getAnnonceById(id) {
  if (USE_MOCKS) {
    await attendre();
    const annonce = toutesLesAnnonces().find((a) => String(a.id) === String(id));
    if (!annonce) throw new Error("Annonce introuvable");
    return annonce;
  }
  const { data } = await api.get(`/announces/${id}`);
  return normaliser(data);
}