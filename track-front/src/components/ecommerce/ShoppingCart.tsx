import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ecommerceService } from '@/lib/ecommerce-service';
import type { Cart } from '@/lib/types';
import { toast } from 'sonner';

export function ShoppingCartComponent() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await ecommerceService.getCart();
      setCart(cartData);
    } catch (error) {
      toast.error('Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const updatedCart = await ecommerceService.updateCartItem(itemId, newQuantity);
      setCart(updatedCart);
      toast.success('Quantité mise à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await ecommerceService.removeFromCart(itemId);
      setCart(updatedCart);
      toast.success('Article retiré du panier');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const clearCart = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider le panier ?')) return;
    
    try {
      await ecommerceService.clearCart();
      setCart({ items: [], totalHt: 0, totalTtc: 0 });
      toast.success('Panier vidé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const checkout = async () => {
    try {
      const order = await ecommerceService.createOrder();
      toast.success(`Commande ${order.numeroCommande} créée avec succès`);
      setCart({ items: [], totalHt: 0, totalTtc: 0 });
    } catch (error) {
      toast.error('Erreur lors de la commande');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Votre panier est vide</h3>
        <p className="text-gray-400">Ajoutez des produits pour commencer vos achats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mon Panier</h1>
        <Button variant="outline" onClick={clearCart} className="text-red-400 border-red-400 hover:bg-red-400/10">
          <Trash2 className="w-4 h-4 mr-2" />
          Vider le panier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.article.photo ? (
                    <img src={item.article.photo} alt={item.article.designation} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-2xl">📦</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{item.article.designation}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.article.description}</p>
                  <p className="text-green-400 font-bold">{item.prixUnitaire.toFixed(2)} € / unité</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id!, item.quantite - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center text-white font-medium">{item.quantite}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id!, item.quantite + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id!)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-gray-400">Sous-total</span>
                <span className="text-xl font-bold text-white">
                  {(item.prixUnitaire * item.quantite).toFixed(2)} €
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-white mb-4">Résumé de la commande</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total HT</span>
                <span>{cart.totalHt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>TVA</span>
                <span>{(cart.totalTtc - cart.totalHt).toFixed(2)} €</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total TTC</span>
                  <span>{cart.totalTtc.toFixed(2)} €</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={checkout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Passer la commande
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Paiement sécurisé • Livraison gratuite dès 50€
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}