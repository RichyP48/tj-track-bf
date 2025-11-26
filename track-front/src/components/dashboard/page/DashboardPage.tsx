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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('MANAGER');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/admin/pending-users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.post(`/admin/approve-user/${userId}`);
      toast.success('Utilisateur approuvé');
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

  const getStatus = (user: User) => {
    if (user.isApproved === true) return { label: 'Approuvé', variant: 'default' as const };
    if (user.isApproved === false) return { label: 'Rejeté', variant: 'destructive' as const };
    if (user.isAccountVerified) return { label: 'En attente', variant: 'secondary' as const };
    return { label: 'Non confirmé', variant: 'outline' as const };
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome to your TJ-Track dashboard</p>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>Liste des utilisateurs et leurs statuts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Téléphone</th>
                      <th className="text-left p-3">Nom Marchand</th>
                      <th className="text-left p-3">Statut</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const status = getStatus(user);
                      return (
                        <tr key={user.userId} className="border-b hover:bg-gray-50">
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.phoneNumber || '-'}</td>
                          <td className="p-3">{user.merchantName || user.name}</td>
                          <td className="p-3">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </td>
                          <td className="p-3">
                            {user.isApproved === null && user.isAccountVerified && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(user.userId)}
                                  disabled={actionLoading === user.userId}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(user.userId)}
                                  disabled={actionLoading === user.userId}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to TJ-Track!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your account has been successfully created and verified. You can now access all the features of the TJ-Track platform.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {currentUser?.email}</p>
              <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}