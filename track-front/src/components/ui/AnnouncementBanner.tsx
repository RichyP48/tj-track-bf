import React from 'react';

interface AnnouncementBannerProps {
  message?: string;
  variant?: 'landing' | 'auth';
}

export function AnnouncementBanner({ 
  message, 
  variant = 'landing' 
}: AnnouncementBannerProps) {
  const defaultMessages = {
    landing: "Annonce faites pas le site pour les clients | Annonce faites pas le site pour les clients | Annonce faites pas le site pour les clients",
    auth: "Connectez-vous pour accéder à votre espace TJ-Track | Nouvelle interface disponible"
  };

  const displayMessage = message || defaultMessages[variant];

  return (
    <div className="text-gray-600 px-4 py-0 text-sm bg-gray-50">
      <div className="text-center">
        <span>{displayMessage}</span>
      </div>
    </div>
  );
}