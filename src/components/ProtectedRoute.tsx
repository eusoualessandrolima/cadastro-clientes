import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * Componente que protege rotas que requerem autenticação
 * 
 * Uso:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    // Mostra loading enquanto verifica autenticação
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#00FF94] mx-auto mb-4" />
                    <p className="text-gray-400">Verificando autenticação...</p>
                </div>
            </div>
        );
    }

    // Se não está autenticado, redireciona para login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Se está autenticado, renderiza o conteúdo
    return <>{children}</>;
}
