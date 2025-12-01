import { apiClient } from './api-client';
import type { Article, Categorie, StockStats } from './types';

export interface MouvementStock {
  id?: number;
  article: Article;
  typeMouvement: 'ENTREE' | 'SORTIE';
  quantite: number;
  motif: string;
  dateHeure?: string;
}



class StockService {
  // Articles
  async getArticles(): Promise<Article[]> {
    const response = await apiClient.get('/stock/articles');
    return response.data;
  }

  async getArticle(id: number): Promise<Article> {
    const response = await apiClient.get(`/stock/articles/${id}`);
    return response.data;
  }

  async createArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const response = await apiClient.post('/stock/articles', article);
    return response.data;
  }

  async updateArticle(id: number, article: Partial<Article>): Promise<Article> {
    const response = await apiClient.put(`/stock/articles/${id}`, article);
    return response.data;
  }

  async deleteArticle(id: number): Promise<void> {
    await apiClient.delete(`/stock/articles/${id}`);
  }

  // Catégories
  async getCategories(): Promise<Categorie[]> {
    const response = await apiClient.get('/stock/categories');
    return response.data;
  }

  async createCategorie(categorie: Omit<Categorie, 'id'>): Promise<Categorie> {
    const response = await apiClient.post('/stock/categories', categorie);
    return response.data;
  }

  // Mouvements
  async getMouvements(): Promise<MouvementStock[]> {
    const response = await apiClient.get('/stock/mouvements');
    return response.data;
  }

  async createMouvement(mouvement: Omit<MouvementStock, 'id'>): Promise<MouvementStock> {
    const response = await apiClient.post('/stock/mouvements', mouvement);
    return response.data;
  }

  // Stats
  async getStats(): Promise<StockStats> {
    const response = await apiClient.get('/stock/stats');
    return response.data;
  }

  async getArticlesEnRupture(): Promise<Article[]> {
    const response = await apiClient.get('/stock/articles/stock-faible');
    return response.data;
  }
}

export const stockService = new StockService();