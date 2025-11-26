import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, User, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '../layout/DashboardLayout';

interface PendingUser {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  isAccountVerified: boolean;
  isApproved: boolean;
}

function UsersPageContent() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await apiClient.get('/admin/pending-users');
      setPendingUsers(response.data);
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
      toast.success('Utilisateur approuvé avec succès');
      fetchPendingUsers();
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
      fetchPendingUsers();
    } catch (error) {
      toast.error('Erreur lors du rejet');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {pendingUsers.length} en attente
        </Badge>
      </div>

      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-gray-500">Aucune demande en attente</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <Card key={user.userId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  {user.name}
                  <Badge variant="outline">
                    {user.roles.join(', ')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={user.isAccountVerified ? "default" : "destructive"}>
                      {user.isAccountVerified ? "Email vérifié" : "Email non vérifié"}
                    </Badge>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <Button
                      onClick={() => handleApprove(user.userId)}
                      disabled={actionLoading === user.userId}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                    <Button
                      onClick={() => handleReject(user.userId)}
                      disabled={actionLoading === user.userId}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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