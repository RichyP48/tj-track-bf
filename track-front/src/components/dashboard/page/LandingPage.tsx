import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Filter, ShoppingCart } from 'lucide-react';
import { Header, AnnouncementBanner } from '@/components/ui';
import { ecommerceService } from '@/lib/ecommerce-service';
import { authService } from '@/lib/auth-service';
import type { Article } from '@/lib/types';
import { toast } from 'sonner';
import '../../../index.css'




function renderStars(rating: number) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}





function Sidebar() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <aside className="asidel w-full  lg:w-48 bg-white p-4 lg:p-6 border-r border-gray-200">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-6 h-6 text-gray-700" />
          </button>
          <h3 className="text-lg font-bold text-gray-800">Filtres</h3>
          <div className="ml-auto bg-gray-300 rounded-full w-8 h-5 relative">
            <div className="absolute right-1 top-1 bg-white rounded-full w-3 h-3"></div>
          </div>
        </div>

        {['Prix minimum', 'Prix maximum', 'Vendeur', 'Localisation'].map((filter) => (
          <div key={filter} className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{filter}</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="min"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-100 border border-blue-500 text-blue-600 px-3 py-2 rounded text-sm font-semibold hover:bg-blue-200 transition-colors">
                Go
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ProductGrid({ products, loading }: { products: Article[], loading: boolean }) {
  const handleAddToCart = async (productId: number) => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter au panier', {
        action: {
          label: 'Se connecter',
          onClick: () => window.location.href = '/auth/login'
        }
      });
      return;
    }
    
    try {
      await ecommerceService.addToCart(productId, 1);
      toast.success('Produit ajouté au panier');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris', {
        action: {
          label: 'Se connecter',
          onClick: () => window.location.href = '/auth/login'
        }
      });
      return;
    }
    
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
    <div className="space-y-4">
      <div className="bg-blue-600 text-white p-3 lg:p-4 rounded flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
        <span className="font-semibold text-sm lg:text-base">{products.length} produits</span>
        <button className="border border-white px-3 lg:px-4 py-2 rounded text-xs lg:text-sm font-semibold hover:bg-blue-700 transition-colors">
          Trier les résultats ▼
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 overflow-hidden">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow-sm hover:shadow-md transition-shadow">
            <div className="relative p-2 lg:p-3 flex justify-between">
              <button 
                onClick={() => handleAddToWishlist(product.id!)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart size={18} />
              </button>
              <button 
                onClick={() => handleAddToCart(product.id!)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                disabled={product.quantiteStock === 0}
              >
                <ShoppingCart size={18} />
              </button>
            </div>

            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
              {product.photo ? (
                <img
                  src={product.photo}
                  alt={product.designation}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl text-gray-400">📦</div>
              )}
            </div>

            <div className="p-3 lg:p-4 space-y-2">
              <h3 className="text-xs lg:text-sm font-semibold text-gray-800 line-clamp-2">{product.designation}</h3>
              <p className="text-xs text-gray-600">{product.description || 'Aucune description'}</p>

              <div className="text-base lg:text-lg font-bold text-gray-900">
                {product.prixUnitaireTtc?.toFixed(2)} <span className="text-xs">€</span>
              </div>

              <p className="text-xs text-gray-600">Stock: {product.quantiteStock}</p>

              <div className="flex items-center gap-1">
                {renderStars(4.2)}
                <span className="text-xs text-gray-600">(4.2/5)</span>
              </div>

              <p className="text-xs text-gray-500">
                Catégorie : <span className="font-semibold text-blue-600">{product.categorie?.nom || 'Non catégorisé'}</span>
              </p>

              {product.quantiteStock === 0 && (
                <div className="text-xs text-red-500 font-semibold">Rupture de stock</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-400 mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun produit disponible</h3>
          <p className="text-gray-600">Les produits seront bientôt disponibles</p>
        </div>
      )}
    </div>
  );
}

function PromoSidebar() {
  return (
  <aside className="promoside lg:w-48 h-fit w-full bg-blue-600 rounded p-4 text-white space-y-6">
      <div className="space-y-3 lg:space-y-4">
        <div className="bg-blue-700 rounded h-32 lg:h-40 flex items-center justify-center overflow-hidden">
          <img src="/popcorn-movie.jpg" alt="Prime promo" className="w-full h-full object-cover" />
        </div>

        <div>
          <h2 className="text-xl lg:text-2xl font-bold leading-tight">30 days of</h2>
          <h2 className="text-xl lg:text-2xl font-bold">Prime free</h2>
        </div>

        <p className="text-xs lg:text-sm">Try it, you'll love it</p>

        <Link to="/auth/register">
          <button className="w-full bg-yellow-400 text-blue-900 font-bold py-2 px-3 lg:px-4 rounded hover:bg-yellow-300 transition-colors text-xs lg:text-sm">
            Try Prime for FREE
          </button>
        </Link>

        <p className="text-xs text-blue-100">New customers only, terms apply</p>

        <div className="bg-blue-700 rounded h-28 lg:h-32 flex items-center justify-center overflow-hidden">
          <img src="/diverse-clothing-rack.png" alt="Clothing" className="w-full h-full object-cover" />
        </div>
      </div>
    </aside>
  );
}

export default function LandingPage() {
  const [products, setProducts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Article[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const data = await ecommerceService.getCatalogue();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product =>
      product.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categorie?.nom?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBanner variant="landing" />
      <Header 
        variant="landing" 
        showSearch={true} 
        onSearch={setSearchQuery}
      />

      <div className="layout grid grid-cols-[300px_1fr_250px] gap-6 mt-20 px-4 w-full">
        <div className="hidden lg:block w-56 shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0">
          <ProductGrid products={filteredProducts} loading={loading} />
        </main>

        <div className="hidden lg:block w-64 shrink-0 h-full">
          <PromoSidebar />
        </div>
      </div>
    </div>
  );
}