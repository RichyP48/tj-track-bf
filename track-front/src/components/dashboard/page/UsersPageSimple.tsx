import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, User, Mail, Phone, Building, Search, Filter, Download, RefreshCw, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '../layout/DashboardLayout';

interface UserData {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  isAccountVerified: boolean;
  isApproved: boolean | null;
  phoneNumber?: string;
  enterpriseName?: string;
}

function UsersPageContent() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'unverified'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // First try all users, fallback to pending users
      let response;
      try {
        response = await apiClient.get('/admin/all-users');
        console.log('All users response:', response.data);
      } catch (allUsersError) {
        console.log('All users failed, trying pending users:', allUsersError);
        response = await apiClient.get('/admin/pending-users');
        console.log('Pending users response:', response.data);
      }
      
      setUsers(response.data || []);
    } catch (error) {
      console.error('Both endpoints failed:', error);
      toast.error('Erreur de chargement des utilisateurs');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.post(`/admin/approve-user/${userId}`);
      toast.success('✅ Utilisateur approuvé avec succès');
      fetchUsers();
    } catch (error) {
      toast.error('❌ Erreur lors de l\'approbation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.post(`/admin/reject-user/${userId}`);
      toast.success('🚫 Utilisateur rejeté');
      fetchUsers();
    } catch (error) {
      toast.error('❌ Erreur lors du rejet');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.enterpriseName && user.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'pending' && user.isApproved === null && user.isAccountVerified) ||
                         (statusFilter === 'approved' && user.isApproved === true) ||
                         (statusFilter === 'rejected' && user.isApproved === false) ||
                         (statusFilter === 'unverified' && !user.isAccountVerified);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const total = users.length;
    const pending = users.filter(u => u.isApproved === null && u.isAccountVerified).length;
    const approved = users.filter(u => u.isApproved === true).length;
    const rejected = users.filter(u => u.isApproved === false).length;
    const unverified = users.filter(u => !u.isAccountVerified).length;
    return { total, pending, approved, rejected, unverified };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 animate-spin text-primary-500 mx-auto" />
          <p className="text-xl font-medium text-neutral-700">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-primary-50 to-secondary-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark font-heading bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Gestion des Utilisateurs
              </h1>
              <p className="text-neutral-600 mt-2 text-sm sm:text-base">Administrez et gérez tous les utilisateurs de la plateforme</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button onClick={fetchUsers} className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Actualiser</span>
              </Button>
              <Button className="bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exporter</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Total</p>
                  <p className="text-xl sm:text-3xl font-bold text-dark">{stats.total}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">En attente</p>
                  <p className="text-xl sm:text-3xl font-bold text-secondary-600">{stats.pending}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Approuvés</p>
                  <p className="text-xl sm:text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Rejetés</p>
                  <p className="text-xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <UserX className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Non vérifiés</p>
                  <p className="text-xl sm:text-3xl font-bold text-neutral-600">{stats.unverified}</p>
                </div>
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'Tous', count: stats.total },
                  { key: 'pending', label: 'Attente', count: stats.pending },
                  { key: 'approved', label: 'OK', count: stats.approved },
                  { key: 'rejected', label: 'KO', count: stats.rejected },
                  { key: 'unverified', label: 'Non vér.', count: stats.unverified }
                ].map(filter => (
                  <Button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key as any)}
                    variant={statusFilter === filter.key ? 'default' : 'outline'}
                    size="sm"
                    className={`transition-all text-xs sm:text-sm ${
                      statusFilter === filter.key 
                        ? 'bg-primary-500 text-white shadow-lg' 
                        : 'hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">{filter.label}</span>
                    <span className="ml-1">({filter.count})</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <CardTitle className="text-xl font-heading flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Utilisateurs ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left p-3 sm:p-6 font-semibold text-neutral-700 text-sm sm:text-base">Utilisateur</th>
                    <th className="text-left p-3 sm:p-6 font-semibold text-neutral-700 text-sm sm:text-base hidden md:table-cell">Contact</th>
                    <th className="text-left p-3 sm:p-6 font-semibold text-neutral-700 text-sm sm:text-base hidden lg:table-cell">Entreprise</th>
                    <th className="text-left p-3 sm:p-6 font-semibold text-neutral-700 text-sm sm:text-base hidden sm:table-cell">Rôles</th>
                    <th className="text-left p-3 sm:p-6 font-semibold text-neutral-700 text-sm sm:text-base">Statut</th>
                    <th className="text-left p-3 sm:p-6 font-semibold text-neutral-700 text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="border-b border-neutral-100 hover:bg-primary-50/50 transition-all duration-200">
                      <td className="p-3 sm:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-dark text-sm sm:text-base truncate">{user.name}</p>
                            <p className="text-xs sm:text-sm text-neutral-500 truncate">{user.email}</p>
                            <div className="md:hidden mt-1">
                              <div className="flex items-center text-xs text-neutral-600">
                                <Phone className="h-3 w-3 mr-1" />
                                <span className="truncate">{user.phoneNumber || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="truncate">{user.phoneNumber || 'Non renseigné'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 hidden lg:table-cell">
                        <div className="flex items-center text-sm text-neutral-600">
                          <Building className="h-4 w-4 mr-2" />
                          <span className="truncate">{user.enterpriseName || 'Non renseigné'}</span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <Badge key={role} className="bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border-0 font-medium text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 sm:p-6">
                        {user.isApproved === true && (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg text-xs">
                            <span className="hidden sm:inline">✓ Accepté</span>
                            <span className="sm:hidden">✓</span>
                          </Badge>
                        )}
                        {user.isApproved === false && (
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg text-xs">
                            <span className="hidden sm:inline">✗ Rejeté</span>
                            <span className="sm:hidden">✗</span>
                          </Badge>
                        )}
                        {user.isApproved === null && user.isAccountVerified && (
                          <Badge className="bg-gradient-to-r from-secondary-400 to-secondary-500 text-white border-0 shadow-lg animate-pulse text-xs">
                            <span className="hidden sm:inline">⏳ Attente</span>
                            <span className="sm:hidden">⏳</span>
                          </Badge>
                        )}
                        {!user.isAccountVerified && (
                          <Badge className="bg-gradient-to-r from-neutral-400 to-neutral-500 text-white border-0 text-xs">
                            <span className="hidden sm:inline">✉ Non confirmé</span>
                            <span className="sm:hidden">✉</span>
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 sm:p-6">
                        <div className="flex gap-1 sm:gap-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(user.userId)} 
                            disabled={user.isApproved === true || actionLoading === user.userId}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 p-2"
                          >
                            {actionLoading === user.userId ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleReject(user.userId)}
                            disabled={user.isApproved === false || actionLoading === user.userId}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 p-2"
                          >
                            {actionLoading === user.userId ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-xl font-medium text-neutral-500">Aucun utilisateur trouvé</p>
                  <p className="text-neutral-400 mt-2">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UsersPageSimple() {
  return (
    <DashboardLayout>
      <UsersPageContent />
    </DashboardLayout>
  );
}