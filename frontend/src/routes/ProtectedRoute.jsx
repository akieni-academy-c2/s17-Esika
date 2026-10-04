import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES } from "../config/constants.js";

// "annonceur" (constantes / backend) et "proprietaire" (mocks) sont traités comme le même rôle
const normaliser = (role) => (role === ROLES.ANNONCEUR ? "proprietaire" : role);

/**
 * <ProtectedRoute />                          -> il faut être connecté
 * <ProtectedRoute roles={["proprietaire"]} /> -> il faut aussi avoir ce rôle
 */
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={roles?.map(normaliser).includes("proprietaire") ? "/connexion?role=annonceur" : "/connexion"}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (roles && !roles.map(normaliser).includes(normaliser(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}