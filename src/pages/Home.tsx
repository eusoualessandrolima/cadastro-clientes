import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Login from './Login';

/**
 * Componente para a rota raiz "/"
 * 
 * Lógica:
 * - Se usuário NÃO está logado → mostra tela de LOGIN
 * - Se usuário ESTÁ logado → redireciona para /dashboard
 */
export default function Home() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            // Usuário autenticado → vai para dashboard
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    // Se está autenticado, não renderiza nada (vai redirecionar)
    if (user) {
        return null;
    }

    // Se não está autenticado, mostra a tela de login
    return <Login />;
}
