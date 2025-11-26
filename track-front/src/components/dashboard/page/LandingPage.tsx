import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Filter } from 'lucide-react';
import { Header, AnnouncementBanner } from '@/components/ui';
import '../../../index.css'


const products = [
  {
    id: 1,
    name: "Comptoir de magasin de dessert cafe",
    description: "Boutique de thé Boulangerie ...",
    price: 10000,
    minOrder: "set",
    rating: 3.5,
    reviews: "3/5 (20 ans)",
    vendor: "ETS Jean Calvin",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 2,
    name: "Comptoir de magasin de dessert cafe",
    description: "Boutique de thé Boulangerie ...",
    price: 10000,
    minOrder: "set",
    rating: 3.5,
    reviews: "3/5 (20 ans)",
    vendor: "ETS Jean Calvin",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 3,
    name: "Glacier artisanal",
    description: "Boutique de glace gourmande ...",
    price: 8500,
    minOrder: "2 coupes",
    rating: 4,
    reviews: "4/5 (15 ans)",
    vendor: "La Glace Dorée",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 4,
    name: "Salon de thé et pâtisserie",
    description: "Atelier de douceurs sucrées ...",
    price: 12000,
    minOrder: "1 plateau",
    rating: 3.5,
    reviews: "5/5 (18 ans)",
    vendor: "Delices & Thé",
    image: "/blue-sports-shoe.jpg"
  },
    {
    id: 5,
    name: "Comptoir de magasin de dessert cafe",
    description: "Boutique de thé Boulangerie ...",
    price: 10000,
    minOrder: "set",
    rating: 3.5,
    reviews: "3/5 (20 ans)",
    vendor: "ETS Jean Calvin",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 6,
    name: "Comptoir de magasin de dessert cafe",
    description: "Boutique de thé Boulangerie ...",
    price: 10000,
    minOrder: "set",
    rating: 3.5,
    reviews: "3/5 (20 ans)",
    vendor: "ETS Jean Calvin",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 7,
    name: "Glacier artisanal",
    description: "Boutique de glace gourmande ...",
    price: 8500,
    minOrder: "2 coupes",
    rating: 4,
    reviews: "4/5 (15 ans)",
    vendor: "La Glace Dorée",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 8,
    name: "Salon de thé et pâtisserie",
    description: "Atelier de douceurs sucrées ...",
    price: 12000,
    minOrder: "1 plateau",
    rating: 3.5,
    reviews: "5/5 (18 ans)",
    vendor: "Delices & Thé",
    image: "/blue-sports-shoe.jpg"
  },
    {
    id: 9,
    name: "Comptoir de magasin de dessert cafe",
    description: "Boutique de thé Boulangerie ...",
    price: 10000,
    minOrder: "set",
    rating: 3.5,
    reviews: "3/5 (20 ans)",
    vendor: "ETS Jean Calvin",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 10,
    name: "Comptoir de magasin de dessert cafe",
    description: "Boutique de thé Boulangerie ...",
    price: 10000,
    minOrder: "set",
    rating: 3.5,
    reviews: "3/5 (20 ans)",
    vendor: "ETS Jean Calvin",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 11,
    name: "Glacier artisanal",
    description: "Boutique de glace gourmande ...",
    price: 8500,
    minOrder: "2 coupes",
    rating: 4,
    reviews: "4/5 (15 ans)",
    vendor: "La Glace Dorée",
    image: "/blue-sports-shoe.jpg"
  },
  {
    id: 12,
    name: "Salon de thé et pâtisserie",
    description: "Atelier de douceurs sucrées ...",
    price: 12000,
    minOrder: "1 plateau",
    rating: 3.5,
    reviews: "5/5 (18 ans)",
    vendor: "Delices & Thé",
    image: "/blue-sports-shoe.jpg"
  }
];

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

function ProductGrid() {
  return (
    <div className="space-y-4  ">
      <div className="bg-blue-600 text-white p-3 lg:p-4 rounded flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
        <span className="font-semibold text-sm lg:text-base">100 produits</span>
        <button className="border border-white px-3 lg:px-4 py-2 rounded text-xs lg:text-sm font-semibold hover:bg-blue-700 transition-colors">
          Trier les résultats ▼
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-4 overflow-hidden">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow-sm hover:shadow-md transition-shadow">
            <div className="relative p-2 lg:p-3">
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={18} />
              </button>
            </div>

            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 lg:p-4 space-y-2">
              <h3 className="text-xs lg:text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
              <p className="text-xs text-gray-600">{product.description}</p>

              <div className="text-base lg:text-lg font-bold text-gray-900">
                {product.price.toLocaleString()} <span className="text-xs">FCFA</span>
              </div>

              <p className="text-xs text-gray-600">Commande minimum: {product.minOrder}</p>

              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-xs text-gray-600">{product.reviews}</span>
              </div>

              <p className="text-xs text-gray-500">
                Vendeur : <span className="font-semibold text-blue-600">{product.vendor}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
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
  return (
    <div className="min-h-screen bg-gray-50 ">
      <AnnouncementBanner variant="landing" />
      <Header variant="landing" showSearch={true} />

      <div className="layout grid grid-cols-[300px_1fr_250px] gap-6 mt-20 px-4 w-full">
        <div className="hidden lg:block w-56 shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0 ">
          
          <ProductGrid />
        </main>

        <div className="hidden lg:block w-64 shrink-0 h-full">
          <PromoSidebar />
        </div>
      </div>
    </div>
  );
}