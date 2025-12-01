import { useState, useEffect, useCallback } from 'react';
import { ecommerceService } from '@/lib/ecommerce-service';
import type { Article } from '@/lib/types';
import { toast } from 'sonner';

interface UseProductsReturn {
  products: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
}

// Cache simple avec TTL
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedProducts: Article[] = [];
let cacheTimestamp = 0;

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    // Vérifier le cache
    const now = Date.now();
    if (cachedProducts.length > 0 && (now - cacheTimestamp) < CACHE_TTL) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await ecommerceService.getCatalogue();
      
      // Mettre à jour le cache
      cachedProducts = data;
      cacheTimestamp = now;
      
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      console.error('Erreur chargement produits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    try {
      await ecommerceService.addToCart(productId, quantity);
      toast.success('Produit ajouté au panier');
    } catch (err) {
      toast.error('Erreur lors de l\'ajout au panier');
      throw err;
    }
  }, []);

  const addToWishlist = useCallback(async (productId: number) => {
    try {
      await ecommerceService.addToWishlist(productId);
      toast.success('Produit ajouté aux favoris');
    } catch (err) {
      toast.error('Erreur lors de l\'ajout aux favoris');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addToCart,
    addToWishlist,
  };
}