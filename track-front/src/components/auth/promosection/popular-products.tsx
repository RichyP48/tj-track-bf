import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string
  name: string
  image: string
  price: number
  rating: number
  reviews: number
  sales: number
}

const POPULAR_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "/premium-wireless-headphones-product.jpg",
    price: 12999,
    rating: 4.8,
    reviews: 245,
    sales: 3420,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    image: "/smart-watch-technology-product.jpg",
    price: 19999,
    rating: 4.7,
    reviews: 189,
    sales: 2890,
  },
  {
    id: "3",
    name: "USB-C Fast Charger",
    image: "/usb-c-charger-tech.jpg",
    price: 34345,
    rating: 4.9,
    reviews: 512,
    sales: 5670,
  },
  {
    id: "4",
    name: "Portable Power Bank",
    image: "/portable-power-bank.png",
    price: 4999,
    rating: 4.6,
    reviews: 398,
    sales: 4120,
  },
]

export function PopularProducts() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white drop-shadow-lg">Les plus demandés</h3>
        <p className="text-xs text-blue-100 drop-shadow-md mt-1">Produits tendance cette semaine</p>
      </div>

      <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {POPULAR_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-blue-500/30 transition-colors duration-200 cursor-pointer border border-blue-400/20"
          >
            <div className="flex gap-3">
              {/* Product Image */}
              <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-blue-600">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate drop-shadow-md">{product.name}</p>

                {/* Rating and Sales */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-blue-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-blue-100">({product.reviews})</span>
                </div>

                {/* Price and Sales */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-bold text-yellow-300 drop-shadow-md">{product.price} fcfa</p>
                  <div className="flex items-center gap-1 text-xs text-green-300">
                    <ShoppingCart size={12} />
                    <span>{product.sales}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-shadow duration-200 text-sm">
        Voir tous les produits
      </button>
    </div>
  )
}
