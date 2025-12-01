import apiClient from './api-client';

export interface InventoryStats {
  totalArticles: number;
  articlesStockFaible: number;
  articlesRuptureStock: number;
  valeurTotaleStock: number;
  alertesNonLues: number;
}

export interface StockAlert {
  id: number;
  article: any;
  type: 'STOCK_FAIBLE' | 'RUPTURE_STOCK' | 'SURSTOCK';
  seuil: number;
  stockActuel: number;
  message: string;
  lu: boolean;
  createdAt: string;
}

export interface Article {
  id: number;
  codeArticle: string;
  designation: string;
  quantiteStock: number;
  stockReserve: number;
  seuilAlerte: number;
  stockMax: number;
  prixUnitaireHt: number;
  statut: 'ACTIF' | 'INACTIF' | 'DISCONTINUE';
  stockDisponible: number;
  stockFaible: boolean;
  ruptureStock: boolean;
}

class InventoryService {
  async getDashboardStats(): Promise<InventoryStats> {
    const response = await apiClient.get('/inventory/dashboard');
    return response.data;
  }

  async getUnreadAlerts(): Promise<StockAlert[]> {
    const response = await apiClient.get('/inventory/alerts/unread');
    return response.data;
  }

  async getLowStockArticles(): Promise<Article[]> {
    const response = await apiClient.get('/inventory/alerts/low-stock');
    return response.data;
  }

  async getOutOfStockArticles(): Promise<Article[]> {
    const response = await apiClient.get('/inventory/alerts/out-of-stock');
    return response.data;
  }

  async adjustStock(articleId: number, quantity: number, reason: string, userId: number): Promise<string> {
    const response = await apiClient.post('/inventory/adjust-stock', null, {
      params: { articleId, quantity, reason, userId }
    });
    return response.data;
  }

  async reserveStock(articleId: number, quantity: number): Promise<string> {
    const response = await apiClient.post('/inventory/reserve-stock', null, {
      params: { articleId, quantity }
    });
    return response.data;
  }

  async releaseStock(articleId: number, quantity: number): Promise<string> {
    const response = await apiClient.post('/inventory/release-stock', null, {
      params: { articleId, quantity }
    });
    return response.data;
  }

  async getAllArticles(): Promise<Article[]> {
    const response = await apiClient.get('/stock/articles');
    return response.data;
  }

  async getStockMovements(): Promise<any[]> {
    const response = await apiClient.get('/stock/mouvements');
    return response.data;
  }
}

export default new InventoryService();