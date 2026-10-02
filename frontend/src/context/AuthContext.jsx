import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function lireUtilisateur() {
  try {
    return JSON.parse(localStorage.getItem("esika_user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(lireUtilisateur);

  const login = (utilisateur, token) => {
    localStorage.setItem("esika_user", JSON.stringify(utilisateur));
    if (token) localStorage.setItem("esika_token", token);
    setUser(utilisateur);
  };

  const logout = () => {
    localStorage.removeItem("esika_user");
    localStorage.removeItem("esika_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}