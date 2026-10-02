import apiClient, { USE_MOCKS, urlPhoto } from "../../lib/apiClient";

const CLE_BROUILLON = "esika_brouillon_annonce";
const CLE_ANNONCES = "esika_mes_annonces";
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// Brouillon : toujours local, sans les photos (trop lourdes pour localStorage)
export const lireBrouillon = () => {
  try { return JSON.parse(localStorage.getItem(CLE_BROUILLON)); } catch { return null; }
};
export const sauverBrouillon = (data) => localStorage.setItem(CLE_BROUILLON, JSON.stringify(data));
export const effacerBrouillon = () => localStorage.removeItem(CLE_BROUILLON);

export function lireMesAnnoncesLocales() {
  try { return JSON.parse(localStorage.getItem(CLE_ANNONCES)) ?? []; } catch { return []; }
}

/** Publie une annonce. photos : [{ blob, url, taille }] */
export async function publierAnnonce(data, photos, user) {
  const loyer = Number(data.loyer);
  const annonce = {
    id: "u" + Date.now(),
    titre: `${data.type} · ${data.quartier}`,
    ville: data.ville,
    quartier: data.quartier,
    repere: data.repere,
    type: data.type,
    meuble: data.meuble,
    loyer,
    cautionMois: data.cautionMois,
    avanceMois: data.avanceMois,
    nbPhotos: photos.length,
    equipements: data.equipements,
    description: data.description,
    electriciteEau: data.electriciteEau,
    disponibleLe:
      data.disponibleLe > new Date().toISOString().slice(0, 10)
        ? new Date(data.disponibleLe).toISOString()
        : null,
    modifieLe: new Date().toISOString(),
    statut: "disponible",
    numeroVerifie: true,
    proprietaire: {
      nom: user ? `${user.prenom} ${user.nom ?? ""}`.trim() : "Propriétaire",
      telephone: user?.identifiant ? `+242 ${user.identifiant}` : undefined,
      horaires: data.horaires,
    },
  };

  if (USE_MOCKS) {
    await attendre(900);
    localStorage.setItem(CLE_ANNONCES, JSON.stringify([annonce, ...lireMesAnnoncesLocales()]));
    effacerBrouillon();
    return annonce;
  }

  const form = new FormData();
  form.append("announce", JSON.stringify(annonce)); // le backend attend le champ « announce »
  photos.forEach((p, i) => form.append("photos", p.blob, `photo-${i + 1}.webp`));
  const { data: cree } = await apiClient.post("/announcer/announces", form);
  effacerBrouillon();
  return { ...annonce, id: cree?.id ?? annonce.id };
}
// ---------- Mes annonces ----------
const ecrireLocales = (liste) => localStorage.setItem(CLE_ANNONCES, JSON.stringify(liste));

function modifierLocale(id, patch) {
  const liste = lireMesAnnoncesLocales().map((a) =>
    String(a.id) === String(id) ? { ...a, ...patch } : a
  );
  ecrireLocales(liste);
  return liste.find((a) => String(a.id) === String(id));
}

export async function getMesAnnonces() {
  if (USE_MOCKS) {
    await attendre(300);
    return lireMesAnnoncesLocales();
  }
  const { data } = await apiClient.get("/announcer/announces");
  return (data ?? []).map((a) => ({ ...a, photos: (a.photos ?? []).map(urlPhoto) }));
}

export async function modifierPrix(id, loyer) {
  if (USE_MOCKS) {
    await attendre(300);
    return modifierLocale(id, { loyer: Number(loyer), modifieLe: new Date().toISOString() });
  }
  const { data } = await apiClient.patch(`/announcer/announces/${id}/price`, { loyer: Number(loyer) });
  return data;
}

/** statut : "disponible" | "pause" | "loue" */
export async function changerStatut(id, statut) {
  if (USE_MOCKS) {
    await attendre(300);
    return modifierLocale(id, {
      statut,
      modifieLe: new Date().toISOString(),
      ...(statut === "loue" ? { loueLe: new Date().toISOString() } : {}),
    });
  }
  const { data } = await apiClient.patch(`/announcer/announces/${id}/status`, { statut });
  return data;
}

/** « Oui, toujours disponible » */
export async function confirmerDisponibilite(id) {
  if (USE_MOCKS) {
    await attendre(300);
    return modifierLocale(id, { statut: "disponible", modifieLe: new Date().toISOString() });
  }
  const { data } = await apiClient.post(`/announcer/announces/${id}/confirm`);
  return data;
}