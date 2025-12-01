import React, { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp, AlertTriangle, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/StatsCard';
import { DataTable } from '@/components/ui/DataTable';
import { stockService } from '@/lib/stock-service';
import type { Article, StockStats } from '@/lib/types';
import { toast } from 'sonner';

export function StockDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<StockStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [articlesData, statsData] = await Promise.all([
        stockService.getArticles(),
        stockService.getStats()
      ]);
      setArticles(articlesData);
      setStats(statsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      await stockService.deleteArticle(id);
      toast.success('Article supprimé avec succès');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddArticle = async (articleData: any) => {
    try {
      await stockService.createArticle(articleData);
      toast.success('Article créé avec succès');
      setShowAddModal(false);
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const columns = [
    {
      key: 'codeArticle',
      label: 'Code',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-blue-400">{value}</span>
      )
    },
    {
      key: 'designation',
      label: 'Désignation',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (value: any) => (
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
          {value?.nom || 'Non catégorisé'}
        </span>
      )
    },
    {
      key: 'quantiteStock',
      label: 'Stock',
      sortable: true,
      render: (value: number, item: Article) => (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${
            value <= item.seuilAlerte ? 'text-red-400' : 'text-green-400'
          }`}>
            {value}
          </span>
          {value <= item.seuilAlerte && (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
        </div>
      )
    },
    {
      key: 'prixUnitaireTtc',
      label: 'Prix TTC',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-green-400">
          {value?.toFixed(2)} €
        </span>
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
          <h1 className="text-3xl font-bold text-white mb-2">Gestion de Stock</h1>
          <p className="text-gray-400">Gérez votre inventaire en temps réel</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Article
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Articles"
            value={stats.totalArticles}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="Valeur Stock"
            value={`${stats.totalValeurStock.toFixed(0)} €`}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Articles en Rupture"
            value={stats.articlesEnRupture}
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Mouvements Aujourd'hui"
            value={stats.mouvementsAujourdhui}
            icon={BarChart3}
            color="purple"
          />
        </div>
      )}

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Articles en Stock</h2>
        <DataTable
          data={articles}
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDeleteArticle(item.id!)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        />
      </div>

      {/* Add Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Nouvel Article</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const articleData = {
                codeArticle: formData.get('codeArticle'),
                designation: formData.get('designation'),
                description: formData.get('description'),
                prixUnitaireHt: parseFloat(formData.get('prixUnitaireHt') as string),
                prixUnitaireTtc: parseFloat(formData.get('prixUnitaireTtc') as string),
                quantiteStock: parseInt(formData.get('quantiteStock') as string),
                seuilAlerte: parseInt(formData.get('seuilAlerte') as string)
              };
              handleAddArticle(articleData);
            }} className="space-y-4">
              <input
                name="codeArticle"
                placeholder="Code article"
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <input
                name="designation"
                placeholder="Désignation"
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full p-2 bg-gray-700 text-white rounded"
                rows={3}
              />
              <input
                name="prixUnitaireHt"
                type="number"
                step="0.01"
                placeholder="Prix HT"
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <input
                name="prixUnitaireTtc"
                type="number"
                step="0.01"
                placeholder="Prix TTC"
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <input
                name="quantiteStock"
                type="number"
                placeholder="Quantité en stock"
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <input
                name="seuilAlerte"
                type="number"
                placeholder="Seuil d'alerte"
                className="w-full p-2 bg-gray-700 text-white rounded"
                defaultValue={5}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Créer
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}