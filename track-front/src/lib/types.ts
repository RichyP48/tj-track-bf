export interface Article {
  id?: number;
  codeArticle: string;
  designation: string;
  description?: string;
  prixUnitaireHt: number;
  tauxTva?: number;
  prixUnitaireTtc?: number;
  photo?: string;
  categorie?: {
    id?: number;
    nom: string;
    description?: string;
  };
  quantiteStock: number;
  seuilAlerte: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Categorie {
  id?: number;
  nom: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockStats {
  totalArticles: number;
  totalValeurStock: number;
  articlesEnRupture: number;
  mouvementsAujourdhui: number;
}

export interface CartItem {
  id?: number;
  article: Article;
  quantite: number;
  prixUnitaire: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  totalHt: number;
  totalTtc: number;
  createdAt?: string;
}

export interface Order {
  id?: number;
  numeroCommande: string;
  items: CartItem[];
  totalHt: number;
  totalTtc: number;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE';
  dateCommande?: string;
  dateExpedition?: string;
  dateLivraison?: string;
}

export interface EcommerceStats {
  totalCommandes: number;
  chiffreAffaires: number;
  commandesEnAttente: number;
  produitsVendus: number;
}