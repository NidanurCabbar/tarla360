import { ArrowLeft, ChevronRight, Package } from "lucide-react";
import { categoryData } from "../data/categoryData";

interface CategoryBrowsePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function CategoryBrowsePage({ onNavigate }: CategoryBrowsePageProps) {
  return (
    <div className="min-h-screen bg-[#f2f5f2]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-[#337f34] text-lg font-bold leading-tight">Kategoriler</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {categoryData.length} kategori · {categoryData.reduce((a, c) => a + c.products.length, 0)} ürün
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-[430px] mx-auto px-4 py-5 space-y-4">
        {categoryData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onNavigate('category-products', { categoryId: cat.id })}
            className="w-full rounded-2xl overflow-hidden shadow-md bg-white active:scale-[0.98] transition-transform"
          >
            {/* Image */}
            <div className="relative w-full h-44">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Bottom text on image */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
                <div className="text-left">
                  <p className="text-white font-bold text-lg leading-tight drop-shadow">
                    {cat.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Package className="w-3.5 h-3.5 text-white/80" />
                    <p className="text-white/80 text-xs">{cat.products.length} ürün mevcut</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="px-4 py-3 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1dbc60]" />
                <span className="text-xs text-gray-500">
                  {cat.products.filter(p => p.available).length} ürün müsait
                </span>
              </div>
              <span className="text-xs text-[#337f34] font-semibold">
                İncele →
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="h-20" />
    </div>
  );
}
