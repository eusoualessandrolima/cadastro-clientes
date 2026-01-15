import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Welcome from './Welcome';

/**
 * Componente para a rota raiz "/"
 * 
 * Lógica:
 * - Se usuário NÃO está logado → mostra o FORMULÁRIO (Welcome)
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

    // Se não está autenticado, mostra o formulário de boas-vindas/cadastro
    return <Welcome />;
}
