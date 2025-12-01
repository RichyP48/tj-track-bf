import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, TrendingUp, Users, Eye, Edit, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/StatsCard';
import { DataTable } from '@/components/ui/DataTable';
import { ecommerceService } from '@/lib/ecommerce-service';
import type { Order, EcommerceStats } from '@/lib/types';
import { toast } from 'sonner';

export function EcommerceDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<EcommerceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        ecommerceService.getOrders(),
        ecommerceService.getStats()
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, statut: Order['statut']) => {
    try {
      await ecommerceService.updateOrderStatus(id, statut);
      toast.success('Statut mis à jour');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (statut: Order['statut']) => {
    const colors = {
      'EN_ATTENTE': 'bg-yellow-500/20 text-yellow-300',
      'CONFIRMEE': 'bg-blue-500/20 text-blue-300',
      'EXPEDIEE': 'bg-purple-500/20 text-purple-300',
      'LIVREE': 'bg-green-500/20 text-green-300',
      'ANNULEE': 'bg-red-500/20 text-red-300'
    };
    return colors[statut] || colors['EN_ATTENTE'];
  };

  const columns = [
    {
      key: 'numeroCommande',
      label: 'N° Commande',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-blue-400">{value}</span>
      )
    },
    {
      key: 'dateCommande',
      label: 'Date',
      sortable: true,
      render: (value: string) => (
        <span>{new Date(value).toLocaleDateString('fr-FR')}</span>
      )
    },
    {
      key: 'totalTtc',
      label: 'Montant',
      sortable: true,
      render: (value: number) => (
        <span className="font-bold text-green-400">{value.toFixed(2)} €</span>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: Order['statut']) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'items',
      label: 'Articles',
      render: (value: any[]) => (
        <span className="text-gray-400">{value?.length || 0} article(s)</span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">E-commerce Dashboard</h1>
          <p className="text-gray-400">Gérez vos commandes et ventes en ligne</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Commandes"
            value={stats.totalCommandes}
            icon={ShoppingCart}
            color="blue"
          />
          <StatsCard
            title="Chiffre d'Affaires"
            value={`${stats.chiffreAffaires.toFixed(0)} €`}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="En Attente"
            value={stats.commandesEnAttente}
            icon={Package}
            color="yellow"
          />
          <StatsCard
            title="Produits Vendus"
            value={stats.produitsVendus}
            icon={Users}
            color="purple"
          />
        </div>
      )}

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Commandes Récentes</h2>
        <DataTable
          data={orders}
          columns={columns}
          searchable
          filterable
          actions={(item) => (
            <>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              {item.statut === 'CONFIRMEE' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleUpdateStatus(item.id!, 'EXPEDIEE')}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Truck className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Ventes du Jour</h3>
          <p className="text-2xl font-bold text-green-400 mb-2">1,250 €</p>
          <p className="text-sm text-gray-400">+12% vs hier</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Panier Moyen</h3>
          <p className="text-2xl font-bold text-blue-400 mb-2">85 €</p>
          <p className="text-sm text-gray-400">+5% vs semaine dernière</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Taux de Conversion</h3>
          <p className="text-2xl font-bold text-purple-400 mb-2">3.2%</p>
          <p className="text-sm text-gray-400">+0.5% vs mois dernier</p>
        </div>
      </div>
    </div>
  );
}