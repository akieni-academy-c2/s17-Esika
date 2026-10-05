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
  form.append("type", data.type);
  form.append("rent", String(loyer));
  form.append("city", data.ville);
  form.append("neighborhood", data.quartier);
  form.append("deposit", String(Number(data.cautionMois) || 0));
  form.append("advance", String(Number(data.avanceMois) || 0));
  form.append("landmark", data.repere || "");
  form.append("description", data.description || "");
  form.append("waterElectricity", data.electriciteEau || "");
  form.append("availableAt", data.disponibleLe || "");
  form.append("favorTime", data.horaires || "");
  form.append("sanitary", data.sanitary || "À préciser");
  form.append("kitchen", data.kitchen || "À préciser");
  const equipements = data.equipements ?? [];
  form.append("airConditioning", String(equipements.includes("Climatisation")));
  form.append("wifi", String(equipements.includes("Wi-Fi")));
  form.append("generator", String(equipements.includes("Groupe électrogène")));
  form.append("parking", String(equipements.includes("Parking")));
  form.append("furnished", String(Boolean(data.meuble)));
  form.append("securityGuard", String(equipements.includes("Gardiennage")));
  photos.forEach((p, i) => form.append("images", p.blob, `photo-${i + 1}.webp`));
  const { data: cree } = await apiClient.post("/announcer/announce", form);
  effacerBrouillon();
  return { ...annonce, id: cree?.id ?? cree?.announce_id ?? annonce.id };
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
  const liste = Array.isArray(data) ? data : (data?.data ?? []);
  return liste.map((a) => ({
    ...a,
    id: a.id ?? a.announceId,
    titre: a.titre ?? `${a.type} · ${a.neighborhood}`,
    ville: a.ville ?? a.city,
    quartier: a.quartier ?? a.neighborhood,
    loyer: Number(a.loyer ?? a.rent),
    cautionMois: Number(a.cautionMois ?? a.deposit ?? 0),
    avanceMois: Number(a.avanceMois ?? a.advance ?? 0),
    statut: a.statut ?? (a.status === "rented" ? "loue" : a.paused ? "pause" : "disponible"),
    modifieLe: a.modifieLe ?? a.updatedAt ?? new Date().toISOString(),
    photos: (a.photos ?? (a.image?.path ? [a.image.path] : [])).map(urlPhoto),
  }));
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