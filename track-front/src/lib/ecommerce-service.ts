import { apiClient } from './api-client';
import { publicApiClient } from './public-api-client';
import type { Article, CartItem, Cart, Order, EcommerceStats } from './types';

export interface WishlistItem {
  id?: number;
  article: Article;
  dateAjout?: string;
}

class EcommerceService {
  // Catalogue (public endpoints)
  async getCatalogue(): Promise<Article[]> {
    const response = await publicApiClient.get('/catalogue/articles');
    return response.data;
  }

  async searchCatalogue(query: string): Promise<Article[]> {
    const response = await publicApiClient.get(`/catalogue/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getCatalogueByCategory(categoryId: number): Promise<Article[]> {
    const response = await publicApiClient.get(`/catalogue/category/${categoryId}`);
    return response.data;
  }

  // Panier
  async getCart(): Promise<Cart> {
    const response = await apiClient.get('/panier');
    return response.data;
  }

  async addToCart(articleId: number, quantite: number): Promise<Cart> {
    const response = await apiClient.post('/panier/add', { articleId, quantite });
    return response.data;
  }

  async updateCartItem(itemId: number, quantite: number): Promise<Cart> {
    const response = await apiClient.put(`/panier/items/${itemId}`, { quantite });
    return response.data;
  }

  async removeFromCart(itemId: number): Promise<Cart> {
    const response = await apiClient.delete(`/panier/items/${itemId}`);
    return response.data;
  }

  async clearCart(): Promise<void> {
    await apiClient.delete('/panier/clear');
  }

  // Commandes
  async createOrder(): Promise<Order> {
    const response = await apiClient.post('/commandes');
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get('/commandes');
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await apiClient.get(`/commandes/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: number, statut: Order['statut']): Promise<Order> {
    const response = await apiClient.put(`/commandes/${id}/status`, { statut });
    return response.data;
  }

  // Wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get('/wishlist');
    return response.data;
  }

  async addToWishlist(articleId: number): Promise<WishlistItem> {
    const response = await apiClient.post('/wishlist/add', { articleId });
    return response.data;
  }

  async removeFromWishlist(itemId: number): Promise<void> {
    await apiClient.delete(`/wishlist/items/${itemId}`);
  }

  // Stats
  async getStats(): Promise<EcommerceStats> {
    const response = await apiClient.get('/ecommerce/stats');
    return response.data;
  }
}

export const ecommerceService = new EcommerceService();