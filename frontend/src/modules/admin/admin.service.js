import api, { USE_ADMIN_MOCKS } from "../../lib/apiClient.js";
import { attendre } from "../../mocks/annonces.js";
import { signalementsMock } from "../../mocks/signalements.js";
import { lireSignalementsLocaux, MOTIFS } from "../signalements/signalements.service.js";

const CLE_ETATS = "esika_signalements_etat";
const CLE_MASQUEES = "esika_annonces_masquees";
const lire = (cle, defaut) => { try { return JSON.parse(localStorage.getItem(cle)) ?? defaut; } catch { return defaut; } };
export const lireAnnoncesMasquees = () => lire(CLE_MASQUEES, []);
const libelle = (cle) => MOTIFS.find((m) => m.cle === cle)?.libelle ?? "Autre problème";

export async function getSignalements() {
  if (USE_ADMIN_MOCKS) {
    await attendre(250);
    const etats = lire(CLE_ETATS, {});
    return [...lireSignalementsLocaux(), ...signalementsMock].map((s) => ({ ...s, motifLibelle: libelle(s.motif), ...(etats[s.id] ?? {}) })).sort((a,b) => new Date(b.creeLe) - new Date(a.creeLe));
  }
  const { data } = await api.get("/admin/reports");
  const rows = Array.isArray(data) ? data : (data?.reports ?? []);
  return rows.map((s) => ({
    ...s,
    annonceId: s.annonceId ?? s.announceId,
    annonceTitre: s.annonceTitre ?? (s.annonce ? `${s.annonce.type} · ${s.annonce.neighborhood}` : "Annonce"),
    ville: s.ville ?? s.annonce?.city,
    motif: s.motif ?? s.reason,
    motifLibelle: libelle(s.motif ?? s.reason),
    creeLe: s.creeLe ?? s.createdAt,
    statut: s.statut ?? ({ to_process:"a_traiter", in_progress:"en_cours", processed:"traite" }[s.status] ?? s.status),
    message: s.message ?? s.description,
    action: s.action ?? s.handledAction,
    traiteLe: s.traiteLe ?? s.handledAt,
    loyer: Number(s.loyer ?? 0),
    publieLe: s.publieLe ?? s.announceCreatedAt,
    urgent: s.urgent ?? (MOTIFS.find((m) => m.cle === (s.motif ?? s.reason))?.urgent ?? false),
  })).sort((a,b) => new Date(b.creeLe) - new Date(a.creeLe));
}

export async function traiterSignalement(id, { statut, action, annonceId }) {
  if (USE_ADMIN_MOCKS) {
    await attendre(250);
    const etats = lire(CLE_ETATS, {});
    etats[id] = { statut, action, traiteLe: statut === "traite" ? new Date().toISOString() : undefined };
    localStorage.setItem(CLE_ETATS, JSON.stringify(etats));
    if (action === "masquee" && annonceId != null) {
      const masquees = lireAnnoncesMasquees();
      if (!masquees.includes(String(annonceId))) localStorage.setItem(CLE_MASQUEES, JSON.stringify([...masquees, String(annonceId)]));
    }
    return;
  }
  const decision = action === "masquee" ? "masquer" : action === "contact" ? "contact" : "sans_suite";
  await api.patch(`/admin/reports/${id}`, { decision });
}
