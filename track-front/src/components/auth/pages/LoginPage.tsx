import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header, AnnouncementBanner } from '@/components/ui';
import { authService } from '@/lib/auth-service';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { AnimatedBackground } from "../promosection/animated-background"
import { PopularProducts } from "../promosection/popular-products"
import { FeaturedCarousel } from "../promosection/featured-carousel"




function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      
      // Check if OTP verification is required
      if ('requiresVerification' in result && result.requiresVerification) {
        toast.info('Code de vérification envoyé par email');
        // Navigate to OTP verification page with email
        navigate('/auth/verify-otp', { state: { email, fromLogin: true } });
      } else {
        // Direct login success
        toast.success('Connexion réussie!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <img src="/G logo.png" alt="TJ-Track Logo" className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bon retour !</h1>
        <p className="text-gray-600">Connectez-vous à votre compte TJ-Track</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email ou nom d'utilisateur
          </Label>
          <Input
            id="email"
            placeholder="votre@email.com"
            type="text"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 px-4 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded text-gray-900"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Mot de passe
            </Label>
            <Link 
              to="/auth/forgot-password" 
              className="text-xs text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-4 pr-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded text-gray-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button 
          disabled={isLoading || !email || !password} 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Pas encore de compte ?{' '}
          <Link 
            to="/auth/register" 
            className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Ou continuez avec</p>
          <div className="flex gap-3 justify-center">
            <button className="flex-1 h-10 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Google
            </button>
            <button className="flex-1 h-10 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoSidebar() {
  return (
     <aside className="relative w-full bg-blue-600 p-8 text-white hidden lg:block overflow-hidden">
      <AnimatedBackground />

      {/* Content layer */}
      <div className="relative z-10 min-h-[calc(100vh-148px)] flex flex-col">
        <FeaturedCarousel />

        {/* <div className="mt-6">
          <h2 className="text-3xl font-bold leading-tight mb-2 drop-shadow-lg">Rejoignez</h2>
          <h2 className="text-3xl font-bold drop-shadow-lg">TJ-Track</h2>
        </div> */}

        <p className="text-sm text-blue-100 mt-4 mb-20 drop-shadow-md">
          Découvrez une nouvelle façon de faire du commerce en ligne
        </p>

        {/* <button className="w-full bg-yellow-400 text-blue-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors mt-6 shadow-lg hover:shadow-xl">
          Créer un compte gratuit
        </button> */}

        {/* <p className="text-xs text-blue-100 mt-3 drop-shadow-md">
          Nouveaux utilisateurs uniquement, conditions applicables
        </p> */}

        <div className="mt-20 flex-1">
          <PopularProducts />
        </div>
      </div>
    </aside>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBanner variant="auth" />
      <Header variant="auth" showBackButton={true} />
      
      <div className="flex   items-center justify-center min-h-[calc(100vh-100px)] py-0">
        <div className="flex flex-1 h-full   gap-8 w-full  items-center justify-center">
          <PromoSidebar />
          <div className='w-full flex items-center justify-center'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}