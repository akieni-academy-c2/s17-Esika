import apiClient, { USE_MOCKS } from '../../lib/apiClient';

// 'phone' = wireframes (code à 6 chiffres) | 'email' = FRD (code à 4 chiffres)
export const ID_MODE = 'phone';
export const CODE_LONGUEUR = ID_MODE === 'phone' ? 6 : 4;
export const CODE_MOCK = '123456'.slice(0, CODE_LONGUEUR);
export const ADMIN_MOCK = '060000000'; // démo : 06 000 0000 ouvre le back-office

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const CLE_ATTENTE = 'esika_inscription';
const initiale = (n) => (n ? n.trim().slice(0, 1).toUpperCase() + '.' : '');

/** Message lisible pour une erreur axios (message du backend si présent). */
export function messageErreur(err, defaut) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.request && !err.response) return 'Serveur injoignable. Vérifiez que le backend est lancé.';
  return defaut;
}

/** Envoie le code. profil : { role, prenom, nom, identifiant, ville, email? } (inscription) ou { identifiant } (connexion) */
export async function demanderCode(payload) {
  if (USE_MOCKS) {
    await attendre(600);
    sessionStorage.setItem(CLE_ATTENTE, JSON.stringify(payload));
    return { ok: true };
  }
  // On garde le profil saisi : il sert à créer le compte à la première vérification
  sessionStorage.setItem(CLE_ATTENTE, JSON.stringify(payload));
  const { data } = await apiClient.post('/auth/code', { phoneNumber: payload.identifiant });
  return data; // { devCode } uniquement si le backend est en DEMO_MODE
}

/** Vérifie le code et connecte. Retourne { user, token } */
export async function verifierCode({ identifiant, code }) {
  if (USE_MOCKS) {
    await attendre(600);
    if (code !== CODE_MOCK) throw new Error('CODE_INVALIDE');
    const attente = JSON.parse(sessionStorage.getItem(CLE_ATTENTE) || '{}');
    const estAdmin = identifiant === ADMIN_MOCK;
    const user = {
      id: 'u-' + identifiant,
      prenom: estAdmin ? 'Admin' : attente.prenom ?? 'Karine',
      nom: estAdmin ? 'ESIKA' : initiale(attente.nom) || 'M.',
      identifiant,
      role: estAdmin ? 'admin' : attente.role ?? 'locataire',
      numeroVerifie: true,
    };
    const token = 'mock-token';
    localStorage.setItem('esika_user', JSON.stringify(user));
    localStorage.setItem('esika_token', token);
    sessionStorage.removeItem(CLE_ATTENTE);
    return { user, token };
  }
  const attente = JSON.parse(sessionStorage.getItem(CLE_ATTENTE) || '{}');
  const profil = attente.identifiant === identifiant ? attente : {};
  const { data } = await apiClient.post('/auth/verify', {
    phoneNumber: identifiant,
    code,
    role: profil.role,
    firstName: profil.prenom,
    lastName: profil.nom,
    city: profil.ville,
  });
  const user = { ...data.user, identifiant: (data.user.telephone ?? identifiant).replace(/^\+242/, ''), numeroVerifie: true };
  localStorage.setItem('esika_user', JSON.stringify(user));
  localStorage.setItem('esika_token', data.token);
  sessionStorage.removeItem(CLE_ATTENTE);
  return { user, token: data.token };
}

export function deconnecter() {
  localStorage.removeItem('esika_user');
  localStorage.removeItem('esika_token');
}