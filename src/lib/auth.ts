/**
 * Funções de autenticação usando Supabase Auth
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// AUTENTICAÇÃO
// =====================================================

/**
 * Login com email e senha
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }

    return data;
}

/**
 * Cadastro de novo usuário
 */
export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        console.error('Erro ao cadastrar:', error);
        throw error;
    }

    return data;
}

/**
 * Logout
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }

    return true;
}

/**
 * Obter sessão atual
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Erro ao obter sessão:', error);
        throw error;
    }

    return session;
}

/**
 * Obter usuário atual
 */
export async function getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Erro ao obter usuário:', error);
        throw error;
    }

    return user;
}

/**
 * Ouvir mudanças de autenticação
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

/**
 * Resetar senha
 */
export async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
        console.error('Erro ao resetar senha:', error);
        throw error;
    }

    return data;
}

/**
 * Atualizar senha
 */
export async function updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error('Erro ao atualizar senha:', error);
        throw error;
    }

    return data;
}

/**
 * Atualizar dados do usuário
 */
export async function updateUser(updates: {
    email?: string;
    password?: string;
    data?: any;
}) {
    const { data, error } = await supabase.auth.updateUser(updates);

    if (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }

    return data;
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Verificar se usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
}

/**
 * Obter ID do usuário atual
 */
export async function getCurrentUserId(): Promise<string | null> {
    const user = await getUser();
    return user?.id || null;
}

/**
 * Obter email do usuário atual
 */
export async function getCurrentUserEmail(): Promise<string | null> {
    const user = await getUser();
    return user?.email || null;
}
