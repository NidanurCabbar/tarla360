import { ArrowLeft, Star, MapPin, Phone, ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { categoryData } from "../data/categoryData";

interface CategoryProductsPageProps {
  onNavigate: (page: string, data?: any) => void;
  categoryId: string;
}

export default function CategoryProductsPage({ onNavigate, categoryId }: CategoryProductsPageProps) {
  const category = categoryData.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Kategori bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5f2]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => onNavigate('categories')}
            className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-[#337f34] text-lg font-bold leading-tight">{category.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{category.products.length} ürün listelendi</p>
          </div>
        </div>
      </div>

      {/* Category Hero */}
      <div className="relative w-full h-48 max-w-[430px] mx-auto">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="text-white font-bold text-2xl drop-shadow">{category.name}</span>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[430px] mx-auto px-4 py-5 space-y-6">
        {category.products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative w-full h-52">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Availability badge */}
              <div className="absolute top-3 right-3">
                {product.available ? (
                  <span className="flex items-center gap-1 bg-[#1dbc60] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    <CheckCircle className="w-3 h-3" /> Müsait
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-gray-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    <XCircle className="w-3 h-3" /> Müsait Değil
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="px-4 pt-4 pb-2">
              {/* Name & Rating */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-gray-800 font-bold text-base leading-tight flex-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0 bg-[#fff8e1] px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-700 text-xs font-bold">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.reviewCount})</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1dbc60]" />
                <span className="text-gray-400 text-xs">{product.location}</span>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Özellikler</p>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-1 rounded-lg font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <span className="text-2xl font-bold text-[#337f34]">
                    ₺{product.dailyPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm"> / gün</span>
                </div>
                <div className="text-gray-400 text-sm">
                  ₺{product.weeklyPrice.toLocaleString()}
                  <span className="text-xs"> / hafta</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 my-3 h-px bg-gray-100" />

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex gap-3">
              <button
                disabled={!product.available}
                onClick={() => onNavigate('rental-date', {
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  dailyPrice: product.dailyPrice,
                  location: product.location,
                })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all
                  ${product.available
                    ? 'bg-[#1dbc60] hover:bg-[#189e52] active:scale-95 text-white shadow-md shadow-[#1dbc60]/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Kirala
              </button>

              <button
                onClick={() => onNavigate('chatlist')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 border-[#337f34] text-[#337f34] hover:bg-[#337f34]/5 active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                İletişime Geç
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-24" />
    </div>
  );
}
