import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
interface CarouselProduct {
  id: string
  name: string
  image: string
  price: number
  promotion: string
  discount?: number
}

const FEATURED_PRODUCTS: CarouselProduct[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "/premium-wireless-headphones-product.jpg",
    price: 12999,
    promotion: "Jusqu'à 30% de réduction • Stock limité",
    discount: 30,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    image: "/smart-watch-technology-product.jpg",
    price: 19999,
    promotion: "Nouvelle collection • Livraison gratuite",
  },
  {
    id: "3",
    name: "USB-C Fast Charger",
    image: "/usb-c-charger-tech.jpg",
    price: 3499,
    promotion: "Le plus vendu • 5670+ achats cette semaine",
    discount: 15,
  },
  {
    id: "4",
    name: "Portable Power Bank",
    image: "/portable-power-bank.png",
    price: 4999,
    promotion: "Flash sale • Offre limitée 48h",
    discount: 25,
  },
]

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_PRODUCTS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + FEATURED_PRODUCTS.length) % FEATURED_PRODUCTS.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % FEATURED_PRODUCTS.length)
  }

  const currentProduct = FEATURED_PRODUCTS[currentIndex]

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg h-48">
      {/* Carousel Container */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-800">
        {/* Product Image */}
        <img
          src={currentProduct.image || "/placeholder.svg"}
          alt={currentProduct.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-sm font-bold drop-shadow-lg">{currentProduct.name}</h3>

          {/* Scrolling Promotion Text */}
          <div className="mt-2 h-5 overflow-hidden bg-black/30 rounded px-2">
            <p className="text-xs font-semibold text-yellow-300 animate-scroll drop-shadow-md whitespace-nowrap">
              {currentProduct.promotion}
            </p>
          </div>

          {/* Price and Discount */}
          <div className="mt-2 flex items-center gap-2">
            {currentProduct.discount && (
              <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold drop-shadow-md">
                -{currentProduct.discount}%
              </span>
            )}
            <span className="text-lg font-bold drop-shadow-lg">{currentProduct.price} fcfa</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-1.5 transition-all duration-200 z-20 backdrop-blur-sm"
          aria-label="Produit précédent"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-1.5 transition-all duration-200 z-20 backdrop-blur-sm"
          aria-label="Produit suivant"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {FEATURED_PRODUCTS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoPlay(false)
                setCurrentIndex(index)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-yellow-400 w-6" : "bg-white/50 w-1.5 hover:bg-white/70"
              }`}
              aria-label={`Aller au produit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
