import axios from "axios";

// Les mocks généraux restent une option de développement séparée.
// Le mock admin possède son propre interrupteur (voir admin.service/auth.service).
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";
export const USE_ADMIN_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_ADMIN_MOCKS === "true";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Les photos sont servies par le backend (/uploads/...), hors du préfixe /api
export const urlPhoto = (chemin) => {
  const path = typeof chemin === "string" ? chemin : chemin?.path;
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  return `${origin}/${String(path).replace(/^\/+/, "")}`;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("esika_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (reponse) => {
    // Le backend répond { message, status, data } : on ne garde que data
    const b = reponse.data;
    if (b && typeof b === "object" && "status" in b && "message" in b && "data" in b) reponse.data = b.data;
    return reponse;
  },
  (erreur) => {
    if (erreur.response?.status === 401) {
      localStorage.removeItem("esika_token");
      localStorage.removeItem("esika_user");
      if (typeof window !== "undefined") window.dispatchEvent(new Event("esika:logout"));
    }
    return Promise.reject(erreur);
  }
);

export default api;