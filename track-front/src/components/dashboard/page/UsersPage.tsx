import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, User, Mail, Phone, Building } from 'lucide-react';
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
  town?: string;
  address?: string;
}

function UsersPageContent() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      setError(null);
      const response = await apiClient.get('/admin/all-users');
      console.log('Users response:', response.data);
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        console.log(`Loaded ${response.data.length} users`);
      } else {
        console.error('Response data is not an array:', response.data);
        setError('Format de données invalide');
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
      setError(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.post(`/admin/approve-user/${userId}`);
      toast.success('Utilisateur approuvé avec succès');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.post(`/admin/reject-user/${userId}`);
      toast.success('Utilisateur rejeté');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors du rejet');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (user: UserData) => {
    if (user.isApproved === true) {
      return <Badge className="bg-green-600">Accepté</Badge>;
    }
    if (user.isApproved === false) {
      return <Badge variant="destructive">Rejeté</Badge>;
    }
    if (user.isAccountVerified) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    return <Badge variant="outline">Non confirmé</Badge>;
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'pending') return user.isApproved === null && user.isAccountVerified;
    if (filter === 'approved') return user.isApproved === true;
    if (filter === 'rejected') return user.isApproved === false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32 space-y-4">
            <p className="text-red-500">Erreur: {error}</p>
            <Button onClick={fetchUsers}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
          >
            Tous ({users.length})
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('pending')}
          >
            En attente ({users.filter(u => u.isApproved === null && u.isAccountVerified).length})
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('approved')}
          >
            Acceptés ({users.filter(u => u.isApproved === true).length})
          </Button>
          <Button 
            variant={filter === 'rejected' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('rejected')}
          >
            Rejetés ({users.filter(u => u.isApproved === false).length})
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Nom</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Téléphone</th>
                    <th className="text-left p-3 font-semibold">Entreprise</th>
                    <th className="text-left p-3 font-semibold">Ville</th>
                    <th className="text-left p-3 font-semibold">Rôles</th>
                    <th className="text-left p-3 font-semibold">Statut</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{user.phoneNumber || '-'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{user.enterpriseName || '-'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{user.town || '-'}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(user)}
                      </td>
                      <td className="p-3">
                        {user.isApproved === null && user.isAccountVerified && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.userId)}
                              disabled={actionLoading === user.userId}
                              className="bg-green-600 hover:bg-green-700 h-8 px-2"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(user.userId)}
                              disabled={actionLoading === user.userId}
                              className="h-8 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {user.isApproved !== null && (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersPageContent />
    </DashboardLayout>
  );
}