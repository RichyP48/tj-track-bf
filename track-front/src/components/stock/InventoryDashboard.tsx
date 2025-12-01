import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Eye,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';
import inventoryService, { type InventoryStats, type StockAlert, type Article } from '../../lib/inventory-service';

const InventoryDashboard: React.FC = () => {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [lowStockArticles, setLowStockArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, alertsData, lowStockData] = await Promise.all([
        inventoryService.getDashboardStats(),
        inventoryService.getUnreadAlerts(),
        inventoryService.getLowStockArticles()
      ]);
      
      setStats(statsData);
      setAlerts(alertsData);
      setLowStockArticles(lowStockData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de Bord Inventaire
          </h1>
          <p className="text-gray-600 mt-2">Gestion intelligente et temps réel</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Articles"
            value={stats?.totalArticles || 0}
            icon={Package}
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Stock Faible"
            value={stats?.articlesStockFaible || 0}
            icon={AlertTriangle}
            color="orange"
            trend="-5%"
          />
          <StatsCard
            title="Rupture Stock"
            value={stats?.articlesRuptureStock || 0}
            icon={Activity}
            color="red"
            trend="0%"
          />
          <StatsCard
            title="Valeur Stock"
            value={`${(stats?.valeurTotaleStock || 0).toLocaleString()}€`}
            icon={TrendingUp}
            color="green"
            trend="+8%"
          />
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Alerts Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Alertes Temps Réel
              </h2>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {alerts.length} alertes
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Settings className="text-blue-500" />
              Actions Rapides
            </h2>
            
            <div className="space-y-4">
              <ActionButton
                icon={Eye}
                label="Voir Tous les Articles"
                color="blue"
                onClick={() => {}}
              />
              <ActionButton
                icon={BarChart3}
                label="Rapport Détaillé"
                color="purple"
                onClick={() => {}}
              />
              <ActionButton
                icon={Package}
                label="Ajuster Stock"
                color="green"
                onClick={() => {}}
              />
            </div>
          </motion.div>
        </div>

        {/* Low Stock Articles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Articles en Stock Faible</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Article</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock Actuel</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Seuil</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockArticles.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend: string;
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    orange: 'from-orange-500 to-orange-600 text-orange-600',
    red: 'from-red-500 to-red-600 text-red-600',
    green: 'from-green-500 to-green-600 text-green-600'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-green-600' : trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
            {trend} ce mois
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const AlertCard: React.FC<{ alert: StockAlert }> = ({ alert }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'RUPTURE_STOCK': return 'border-red-200 bg-red-50 text-red-700';
      case 'STOCK_FAIBLE': return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'SURSTOCK': return 'border-blue-200 bg-blue-50 text-blue-700';
      default: return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${getAlertColor(alert.type)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{alert.message}</p>
          <p className="text-sm opacity-75">Stock: {alert.stockActuel} / Seuil: {alert.seuil}</p>
        </div>
        <AlertTriangle className="w-5 h-5" />
      </div>
    </div>
  );
};

const ActionButton: React.FC<{
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
}> = ({ icon: Icon, label, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    green: 'bg-green-500 hover:bg-green-600'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-white font-medium flex items-center gap-3 ${colorClasses[color as keyof typeof colorClasses]} transition-colors`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </motion.button>
  );
};

const ArticleRow: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div>
          <p className="font-semibold text-gray-800">{article.designation}</p>
          <p className="text-sm text-gray-600">{article.codeArticle}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`font-semibold ${article.ruptureStock ? 'text-red-600' : article.stockFaible ? 'text-orange-600' : 'text-green-600'}`}>
          {article.quantiteStock}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">{article.seuilAlerte}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          article.ruptureStock ? 'bg-red-100 text-red-700' : 
          article.stockFaible ? 'bg-orange-100 text-orange-700' : 
          'bg-green-100 text-green-700'
        }`}>
          {article.ruptureStock ? 'Rupture' : article.stockFaible ? 'Faible' : 'Normal'}
        </span>
      </td>
      <td className="py-3 px-4">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          Ajuster
        </button>
      </td>
    </tr>
  );
};

export default InventoryDashboard;