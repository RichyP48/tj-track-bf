import React, { useState, useEffect } from 'react';

interface AnnouncementBannerProps {
  message?: string;
  variant?: 'landing' | 'auth';
}

export function AnnouncementBanner({ 
  message, 
  variant = 'landing' 
}: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const messages = {
    landing: [
      "🎉 Nouvelle plateforme TJ-Track disponible - Découvrez nos fonctionnalités",
      "📦 Livraison gratuite pour toute commande supérieure à 50€",
      "⚡ Interface ultra-rapide et moderne pour une meilleure expérience",
      "🔒 Sécurité renforcée avec authentification à deux facteurs"
    ],
    auth: [
      "🚀 Connectez-vous pour accéder à votre espace TJ-Track personnalisé",
      "✨ Nouvelle interface disponible avec design ultra-moderne",
      "📊 Tableau de bord amélioré avec analytics en temps réel",
      "🎯 Gestion simplifiée de vos commandes et livraisons"
    ]
  };

  const currentMessages = message ? [message] : messages[variant];

  useEffect(() => {
    if (currentMessages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentMessages.length]);

  return (
    <div className="text-gray-600 px-4 py-0 text-sm bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100 overflow-hidden">
      <div className="text-center relative">
        <div className="animate-pulse">
          <span className="inline-block transition-all duration-1000 ease-in-out">
            {currentMessages[currentIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}