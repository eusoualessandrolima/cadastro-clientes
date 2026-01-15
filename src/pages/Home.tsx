import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Componente de redirecionamento inteligente para a rota raiz "/"
 * 
 * Lógica:
 * - Se usuário NÃO está logado → redireciona para /login
 * - Se usuário ESTÁ logado → redireciona para /dashboard
 */
export default function Home() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // Usuário autenticado → vai para dashboard
                navigate('/dashboard', { replace: true });
            } else {
                // Usuário não autenticado → vai para login
                navigate('/login', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    // Mostra loading enquanto verifica autenticação
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#00FF94] mx-auto mb-4" />
                <p className="text-gray-400">Carregando...</p>
            </div>
        </div>
    );
}
