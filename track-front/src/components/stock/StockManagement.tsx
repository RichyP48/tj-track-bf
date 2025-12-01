import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  RotateCcw,
  Package2,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import inventoryService, { type Article } from '../../lib/inventory-service';

const StockManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LOW' | 'OUT' | 'NORMAL'>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, filterStatus]);

  const loadArticles = async () => {
    try {
      const data = await inventoryService.getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.codeArticle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    switch (filterStatus) {
      case 'LOW':
        filtered = filtered.filter(article => article.stockFaible && !article.ruptureStock);
        break;
      case 'OUT':
        filtered = filtered.filter(article => article.ruptureStock);
        break;
      case 'NORMAL':
        filtered = filtered.filter(article => !article.stockFaible && !article.ruptureStock);
        break;
    }

    setFilteredArticles(filtered);
  };

  const handleStockAdjustment = async (articleId: number, newQuantity: number, reason: string) => {
    try {
      await inventoryService.adjustStock(articleId, newQuantity, reason, 1); // userId = 1 for demo
      await loadArticles(); // Reload data
      setShowAdjustModal(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajustement:', error);
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
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestion des Stocks
            </h1>
            <p className="text-gray-600 mt-2">Contrôle intelligent et ajustements temps réel</p>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nouvel Article
            </motion.button>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {[
                { key: 'ALL', label: 'Tous', color: 'gray' },
                { key: 'NORMAL', label: 'Normal', color: 'green' },
                { key: 'LOW', label: 'Stock Faible', color: 'orange' },
                { key: 'OUT', label: 'Rupture', color: 'red' }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterStatus(filter.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === filter.key
                      ? `bg-${filter.color}-500 text-white shadow-lg`
                      : `bg-${filter.color}-100 text-${filter.color}-700 hover:bg-${filter.color}-200`
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onAdjust={(article) => {
                  setSelectedArticle(article);
                  setShowAdjustModal(true);
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Stock Adjustment Modal */}
        <AnimatePresence>
          {showAdjustModal && selectedArticle && (
            <StockAdjustModal
              article={selectedArticle}
              onClose={() => {
                setShowAdjustModal(false);
                setSelectedArticle(null);
              }}
              onAdjust={handleStockAdjustment}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{
  article: Article;
  onAdjust: (article: Article) => void;
}> = ({ article, onAdjust }) => {
  const getStatusColor = () => {
    if (article.ruptureStock) return 'border-red-300 bg-red-50';
    if (article.stockFaible) return 'border-orange-300 bg-orange-50';
    return 'border-green-300 bg-green-50';
  };

  const getStatusIcon = () => {
    if (article.ruptureStock) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (article.stockFaible) return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 ${getStatusColor()} transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg mb-1">{article.designation}</h3>
          <p className="text-gray-600 text-sm">{article.codeArticle}</p>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Stock Actuel</span>
          <span className="font-bold text-xl text-gray-800">{article.quantiteStock}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Disponible</span>
          <span className="font-semibold text-blue-600">{article.stockDisponible}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Seuil</span>
          <span className="text-gray-700">{article.seuilAlerte}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              article.ruptureStock ? 'bg-red-500' : 
              article.stockFaible ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ 
              width: `${Math.min(100, (article.quantiteStock / article.stockMax) * 100)}%` 
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAdjust(article)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Ajuster Stock
        </motion.button>
      </div>
    </motion.div>
  );
};

const StockAdjustModal: React.FC<{
  article: Article;
  onClose: () => void;
  onAdjust: (articleId: number, quantity: number, reason: string) => void;
}> = ({ article, onClose, onAdjust }) => {
  const [newQuantity, setNewQuantity] = useState(article.quantiteStock);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onAdjust(article.id, newQuantity, reason);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajuster le Stock</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">{article.designation}</h3>
          <p className="text-gray-600 text-sm">{article.codeArticle}</p>
          <p className="text-gray-600 text-sm">Stock actuel: {article.quantiteStock}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nouvelle Quantité</label>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Motif</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison de l'ajustement..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-24 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StockManagement;