import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Lock, Mail, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function validateEmail(email: string): { valid: boolean; message: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Email inválido' };
  }

  return { valid: true, message: '' };
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (email) {
      const validation = validateEmail(email);
      setEmailError(validation.valid ? '' : validation.message);
    } else {
      setEmailError('');
    }
  }, [email]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    // Validações
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      toast.error(emailValidation.message);
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      toast.success('Conta criada com sucesso! Você já pode fazer login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00FF94]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00FF94] to-[#00CC75] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00FF94]/20">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            CompanyChat IA
          </h1>
          <p className="text-gray-400">
            Criar Conta de Administrador
          </p>
        </div>

        {/* Card de Registro */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Registrar
          </h2>
          
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="bg-black border-white/10 text-white placeholder:text-gray-600 focus:border-[#00FF94]/50"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={`bg-black border-white/10 text-white placeholder:text-gray-600 focus:border-[#00FF94]/50 ${
                  emailError ? 'border-red-500/50' : ''
                }`}
                required
              />
              {emailError && (
                <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
            </div>
            
            {/* Senha */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="bg-black border-white/10 text-white placeholder:text-gray-600 focus:border-[#00FF94]/50"
                required
                minLength={6}
              />
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmar Senha
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className={`bg-black border-white/10 text-white placeholder:text-gray-600 focus:border-[#00FF94]/50 ${
                  confirmPassword && password !== confirmPassword ? 'border-red-500/50' : ''
                }`}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  As senhas não coincidem
                </p>
              )}
            </div>
            
            {/* Botão Registrar */}
            <Button
              type="submit"
              disabled={isLoading || !!emailError || (confirmPassword !== '' && password !== confirmPassword)}
              className="w-full bg-gradient-to-r from-[#00FF94] to-[#00CC75] text-black font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          {/* Link para login */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Já tem uma conta?{' '}
            <Link 
              to="/login" 
              className="text-[#00FF94] hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          © 2026 CompanyChat IA. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
}
