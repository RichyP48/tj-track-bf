import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth-service';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  isAccountVerified: boolean;
  isApproved: boolean | null;
  phoneNumber?: string;
  merchantName?: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('MANAGER');

  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/all-users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  const handleApprove = async (userId: string) => {
    try {
      await apiClient.post(`/admin/approve-user/${userId}`);
      toast.success('✅ Utilisateur approuvé');
      fetchUsers();
    } catch (error) {
      toast.error('❌ Erreur approbation');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await apiClient.post(`/admin/reject-user/${userId}`);
      toast.success('🚫 Utilisateur rejeté');
      fetchUsers();
    } catch (error) {
      toast.error('❌ Erreur rejet');
    }
  };

  const pendingUsers = users.filter(u => u.isApproved === null && u.isAccountVerified);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-light via-primary-50 to-secondary-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark font-heading bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                Bienvenue sur TJ-Track
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                Votre plateforme de gestion e-commerce nouvelle génération
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Commandes</p>
                    <p className="text-3xl font-bold text-primary-600">0</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">📦</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Produits</p>
                    <p className="text-3xl font-bold text-secondary-600">0</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🛍️</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Livraisons</p>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🚚</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Revenus</p>
                    <p className="text-3xl font-bold text-purple-600">0€</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin User Management */}
          {isAdmin && pendingUsers.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-heading flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Utilisateurs en attente ({pendingUsers.length})
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/users'}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    Voir tout
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {pendingUsers.slice(0, 3).map((user) => (
                    <div key={user.userId} className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-dark">{user.name}</p>
                          <p className="text-sm text-neutral-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(user.userId)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleReject(user.userId)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Welcome Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-t-lg">
              <CardTitle className="text-xl font-heading flex items-center">
                <span className="text-2xl mr-3">👋</span>
                Bienvenue {currentUser?.name || 'Utilisateur'} !
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">Informations du compte</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-neutral-600 w-20">Email:</span>
                      <span className="font-medium text-dark">{currentUser?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-neutral-600 w-20">Rôles:</span>
                      <div className="flex gap-2">
                        {currentUser?.roles?.map(role => (
                          <Badge key={role} className="bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border-0">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-neutral-600 w-20">Statut:</span>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                        ✅ Actif
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">Actions rapides</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 shadow-lg">
                      📊 Voir Analytics
                    </Button>
                    <Button className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white border-0 shadow-lg">
                      ⚙️ Paramètres
                    </Button>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg">
                      📦 Nouvelle commande
                    </Button>
                    {isAdmin && (
                      <Button 
                        onClick={() => window.location.href = '/users'}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg"
                      >
                        👥 Gérer Utilisateurs
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}