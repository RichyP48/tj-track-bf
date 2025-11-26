import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Settings, ArrowLeft, LogOut } from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { toast } from 'sonner';

interface HeaderProps {
  variant?: 'landing' | 'auth';
  showSearch?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonLink?: string;
}

export function Header({ 
  variant = 'landing', 
  showSearch = false, 
  showBackButton = false,
  backButtonText = "Retour à l'accueil",
  backButtonLink = "/"
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  if (variant === 'auth') {
    return (
      <header className="bg-blue-600 text-white h-16 w-full shadow-md">
        <div className="mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link to={backButtonLink} className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors">
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium">{backButtonText}</span>
                </Link>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <img src="/G logo.png" alt="TJ-Track Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">TJ-Track</span>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-600 text-white fixed h-16 w-full z-10 shadow-md">
      <div className="mx-auto px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          <div className="flex-shrink-0">
            <img src="./G logo.png" alt="TJ-Track Logo" className="h-8 w-8" />
          </div>
          
          {showSearch && (
            <div className="flex-1 max-w-5xl relative min-w-0">
              <div className="relative border-slate-400 border-2 rounded top-4 flex items-center">
                <input
                  type="text"
                  placeholder="input search text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-12 px-2 lg:px-4 py-2 text-gray-700 bg-white rounded-none focus:outline-none text-xs lg:text-base"
                />
                <button className="bg-blue-700 h-12 hover:bg-blue-800 px-2 lg:px-4 py-2 text-white transition-colors flex-shrink-0">
                  <Search size={16} className="lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
            <div className="relative">
              <ShoppingCart size={20} className="lg:w-6 lg:h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-[10px] lg:text-xs">
                11
              </span>
            </div>
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <User size={20} className="lg:w-6 lg:h-6" />
                  <span className="text-sm font-medium hidden lg:block">{currentUser?.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 hover:text-blue-100 transition-colors">
                  <LogOut size={20} className="lg:w-6 lg:h-6" />
                  <span className="text-sm font-medium hidden lg:block">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="flex items-center gap-1 hover:text-blue-100 transition-colors">
                  <User size={20} className="lg:w-6 lg:h-6" />
                  <span className="text-sm font-medium hidden lg:block">Connexion</span>
                </Link>
                <Link to="/auth/register" className="bg-yellow-400 text-blue-900 px-3 py-1 rounded font-medium text-sm hover:bg-yellow-300 transition-colors">
                  Inscription
                </Link>
              </>
            )}
            
            <Settings size={20} className="lg:w-6 lg:h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}