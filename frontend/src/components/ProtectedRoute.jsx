import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children, allowedRoles }) {
   const { isLogged, role, loading } = useAuth();

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-neutral-400">Verificando autenticación...</span>
         </div>
      );
   }

   // No está logueado
   if (!isLogged) {
      return <Navigate to="/login" replace />;
   }

   // Está logueado pero no tiene el rol necesario
   if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      console.log(`Acceso denegado. Rol requerido: ${allowedRoles}, Rol actual: ${role}`);
      return <Navigate to="/unauthorized" replace />;
   }

   return children;
}

ProtectedRoute.propTypes = {
   children: PropTypes.node.isRequired,
   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};