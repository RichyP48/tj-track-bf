import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '../layout/DashboardLayout';

export default function ComingSoonPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-light via-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <div className="mb-8">
                <div className="text-6xl sm:text-8xl mb-6 animate-bounce">🚀</div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark font-heading bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                  Fonctionnalité en développement
                </h1>
                <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
                  Cette section est actuellement en cours de développement. 
                  Notre équipe travaille dur pour vous apporter les meilleures fonctionnalités !
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                  <div className="text-3xl mb-2">✨</div>
                  <h3 className="font-semibold text-primary-800">Innovation</h3>
                  <p className="text-sm text-primary-600">Nouvelles fonctionnalités</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl">
                  <div className="text-3xl mb-2">🛠️</div>
                  <h3 className="font-semibold text-secondary-800">Développement</h3>
                  <p className="text-sm text-secondary-600">En cours de création</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl mb-2">🎆</div>
                  <h3 className="font-semibold text-green-800">Bientôt</h3>
                  <p className="text-sm text-green-600">Disponible prochainement</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.history.back()}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 shadow-lg px-8 py-3"
                >
                  ← Retour
                </Button>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white border-0 shadow-lg px-8 py-3"
                >
                  🏠 Accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}