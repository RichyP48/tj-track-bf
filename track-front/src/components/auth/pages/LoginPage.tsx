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
    <div className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl p-8 w-full max-w-md relative overflow-hidden">
      {/* Login form filaments */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 500" fill="none">
          <defs>
            <linearGradient id="loginFormFilament" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d="M-20,80 Q150,40 300,120 Q350,100 420,180" stroke="url(#loginFormFilament)" strokeWidth="0.8" fill="none" className="animate-pulse" style={{animationDelay: '2s'}} />
          <path d="M-50,300 Q100,250 250,320 Q350,280 450,350" stroke="url(#loginFormFilament)" strokeWidth="0.6" fill="none" className="animate-pulse" style={{animationDelay: '3.2s'}} />
          <circle cx="120" cy="150" r="1" fill="#8B5CF6" fillOpacity="0.08" className="animate-bounce" style={{animationDelay: '2.5s'}} />
          <circle cx="280" cy="380" r="0.8" fill="#3B82F6" fillOpacity="0.06" className="animate-bounce" style={{animationDelay: '4.1s'}} />
        </svg>
      </div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <img src="/G logo.png" alt="TJ-Track Logo" className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-dark font-heading bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">Bon retour !</h1>
        <p className="text-neutral-600">Connectez-vous à votre compte TJ-Track</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-neutral-700">
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
            className="h-12 px-4 bg-white border-neutral-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400/20 transition-all rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-neutral-700">
              Mot de passe
            </Label>
            <Link 
              to="/auth/forgot-password" 
              className="text-xs text-primary-600 hover:text-primary-500 font-medium transition-colors"
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
              className="h-12 px-4 pr-12 bg-white border-neutral-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400/20 transition-all rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button 
          disabled={isLoading || !email || !password} 
          className="w-full h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-600">
          Pas encore de compte ?{' '}
          <Link 
            to="/auth/register" 
            className="text-primary-600 hover:text-primary-500 font-semibold transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="text-center">
          <p className="text-xs text-neutral-500 mb-2">Ou continuez avec</p>
          <div className="flex gap-3 justify-center">
            <button className="flex-1 h-10 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              Google
            </button>
            <button className="flex-1 h-10 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* SVG Filaments Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <linearGradient id="loginFilament1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="loginFilament2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          
          {/* Main elegant curved filaments */}
          <path d="M-150,150 Q350,50 700,250 T1350,200" stroke="url(#loginFilament1)" strokeWidth="2.5" fill="none" className="animate-pulse" />
          <path d="M-100,450 Q450,250 850,550 T1300,450" stroke="url(#loginFilament2)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1.2s'}} />
          <path d="M150,-50 Q550,250 950,100 T1250,650" stroke="url(#loginFilament1)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '2.5s'}} />
          <path d="M-250,650 Q150,450 650,750 T1450,550" stroke="url(#loginFilament2)" strokeWidth="1.8" fill="none" className="animate-pulse" style={{animationDelay: '0.7s'}} />
          
          {/* Additional intricate filaments */}
          <path d="M-200,300 Q200,100 600,400 Q900,200 1200,500 T1600,300" stroke="url(#loginFilament1)" strokeWidth="1.3" fill="none" className="animate-pulse" style={{animationDelay: '3.2s'}} />
          <path d="M500,-100 Q700,300 400,600 Q800,400 1100,150 T1500,750" stroke="url(#loginFilament2)" strokeWidth="0.9" fill="none" className="animate-pulse" style={{animationDelay: '2.1s'}} />
          <path d="M-300,100 Q100,400 500,250 Q800,600 1100,350" stroke="url(#loginFilament1)" strokeWidth="1.6" fill="none" className="animate-pulse" style={{animationDelay: '3.8s'}} />
          <path d="M900,-80 Q500,350 200,200 Q600,700 1000,450 T1400,150" stroke="url(#loginFilament2)" strokeWidth="1.1" fill="none" className="animate-pulse" style={{animationDelay: '0.4s'}} />
          
          {/* Enhanced floating elements */}
          <circle cx="200" cy="120" r="4" fill="#6366F1" fillOpacity="0.15" className="animate-bounce" style={{animationDelay: '0.3s'}} />
          <circle cx="1000" cy="80" r="3" fill="#A855F7" fillOpacity="0.2" className="animate-bounce" style={{animationDelay: '1.8s'}} />
          <circle cx="350" cy="650" r="3.5" fill="#EC4899" fillOpacity="0.18" className="animate-bounce" style={{animationDelay: '1.1s'}} />
          <circle cx="1150" cy="350" r="2.5" fill="#6366F1" fillOpacity="0.12" className="animate-bounce" style={{animationDelay: '2.7s'}} />
          <circle cx="600" cy="300" r="2" fill="#A855F7" fillOpacity="0.14" className="animate-bounce" style={{animationDelay: '3.5s'}} />
          <circle cx="850" cy="600" r="3.2" fill="#EC4899" fillOpacity="0.16" className="animate-bounce" style={{animationDelay: '2.3s'}} />
          <circle cx="120" cy="500" r="2.8" fill="#6366F1" fillOpacity="0.13" className="animate-bounce" style={{animationDelay: '3.9s'}} />
          <circle cx="1200" cy="200" r="2.2" fill="#A855F7" fillOpacity="0.19" className="animate-bounce" style={{animationDelay: '1.4s'}} />
        </svg>
      </div>
      
      <AnnouncementBanner variant="auth" />
      <Header variant="auth" showBackButton={true} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-0 relative z-10">
        <div className="flex flex-1 h-full gap-8 w-full items-center justify-center">
          <PromoSidebar />
          <div className='w-full flex items-center justify-center'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}