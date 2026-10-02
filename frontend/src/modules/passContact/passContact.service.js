import apiClient, { USE_MOCKS } from '../../lib/apiClient';
import { PASS_DUREE_JOURS } from '../../config/constants';

const CLE = 'esika_pass';
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

function lirePassLocal() {
  try {
    const p = JSON.parse(localStorage.getItem(CLE));
    return p && new Date(p.expireLe) > new Date() ? p : null;
  } catch {
    return null;
  }
}

// "+242061234567" -> "+242 06 123 4567"
const formaterTel = (t = '') => {
  const n = t.replace(/\s/g, '');
  return /^\+242\d{9}$/.test(n) ? `+242 ${n.slice(4, 6)} ${n.slice(6, 9)} ${n.slice(9)}` : t;
};

/** Pass actif ou null. Retour : { expireLe: ISO string } */
export async function getPassActif() {
  if (USE_MOCKS) return lirePassLocal();
  try {
    const { data } = await apiClient.get('/passes/active');
    return data?.actif ? { expireLe: data.expireLe } : null;
  } catch {
    return null;
  }
}

/** Paiement Mobile Money simulé. operateur : 'mtn' | 'airtel' */
export async function acheterPass({ operateur, numero }) {
  if (USE_MOCKS) {
    await attendre(1200);
    const expireLe = new Date(Date.now() + PASS_DUREE_JOURS * 86400000).toISOString();
    const pass = { operateur, numero, expireLe };
    localStorage.setItem(CLE, JSON.stringify(pass));
    return pass;
  }
  const { data } = await apiClient.post('/passes', { operateur, numero });
  return data;
}

/** Coordonnées du propriétaire, uniquement si un pass est actif. */
export async function getContactAnnonce(annonceId, annonce) {
  if (USE_MOCKS) {
    if (!lirePassLocal()) throw new Error('PASS_REQUIS');
    return {
      nom: annonce?.proprietaire?.nom ?? 'Didier M.',
      telephone: annonce?.proprietaire?.telephone ?? '+242 06 000 00 00',
      horaires: annonce?.proprietaire?.horaires ?? 'Préfère 18 h – 20 h en semaine, samedi matin',
    };
  }
  try {
    const { data } = await apiClient.get(`/announces/${annonceId}/contact`);
    return { ...data, telephone: formaterTel(data.telephone) };
  } catch (err) {
    if (err.response?.status === 403) throw new Error('PASS_REQUIS', { cause: err });
    throw err;
  }
}