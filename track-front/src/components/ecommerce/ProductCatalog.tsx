import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ecommerceService } from '@/lib/ecommerce-service';
import type { Article } from '@/lib/types';
import { toast } from 'sonner';

export function ProductCatalog() {
  const [products, setProducts] = useState<Article[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, products]);

  const loadProducts = async () => {
    try {
      const data = await ecommerceService.getCatalogue();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du catalogue');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product =>
      product.designation.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await ecommerceService.addToCart(productId, 1);
      toast.success('Produit ajouté au panier');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await ecommerceService.addToWishlist(productId);
      toast.success('Produit ajouté aux favoris');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout aux favoris');
    }
  };

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
          <h1 className="text-3xl font-bold text-white mb-2">Catalogue Produits</h1>
          <p className="text-gray-400">Découvrez notre sélection de produits</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher des produits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:scale-105 transition-transform duration-200">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                {product.photo ? (
                  <img src={product.photo} alt={product.designation} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl text-gray-400">📦</div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">{product.designation}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddToWishlist(product.id!)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">(4.5)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-400">
                      {product.prixUnitaireTtc?.toFixed(2)} €
                    </span>
                    <div className="text-xs text-gray-400">
                      Stock: {product.quantiteStock}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product.id!)}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={product.quantiteStock === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-gray-900/70 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {product.photo ? (
                    <img src={product.photo} alt={product.designation} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-2xl text-gray-400">📦</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{product.designation}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-green-400">
                      {product.prixUnitaireTtc?.toFixed(2)} €
                    </span>
                    <span className="text-sm text-gray-400">
                      Stock: {product.quantiteStock}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddToWishlist(product.id!)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product.id!)}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={product.quantiteStock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-400 mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
}