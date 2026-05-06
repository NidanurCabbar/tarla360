import { ArrowLeft, ChevronDown, ChevronUp, Tractor, Droplets, Wheat, Truck, Syringe, Leaf, Cog, MilkIcon } from "lucide-react";
import { useState } from "react";

interface CategoryBrowsePageProps {
  onNavigate: (page: string, data?: any) => void;
}

const categories = [
  {
    id: 1,
    name: "Toprak Hazırlama",
    emoji: "🌱",
    icon: Leaf,
    color: "#4caf50",
    bgLight: "#e8f5e9",
    products: [
      "Pulluk",
      "Diskaro (Diskli Tırmık)",
      "Rotovatör",
      "Kültivatör",
      "Tırmık",
    ],
  },
  {
    id: 2,
    name: "Ekim ve Dikim",
    emoji: "🌾",
    icon: Wheat,
    color: "#8bc34a",
    bgLight: "#f1f8e9",
    products: [
      "Ekim Makinesi (Mısır, Buğday, Ayçiçeği vb.)",
      "Fide Dikim Makinesi",
      "Patates Ekim Makinesi",
      "Çeltik Ekim Makinesi",
    ],
  },
  {
    id: 3,
    name: "Sulama",
    emoji: "💧",
    icon: Droplets,
    color: "#29b6f6",
    bgLight: "#e1f5fe",
    products: [
      "Damla Sulama Sistemi",
      "Yağmurlama Sulama Sistemi",
      "Sulama Pompaları",
      "Su Tankerleri",
    ],
  },
  {
    id: 4,
    name: "Gübreleme ve İlaçlama",
    emoji: "🧪",
    icon: Syringe,
    color: "#ff7043",
    bgLight: "#fbe9e7",
    products: [
      "Gübre Serpme Makinesi",
      "Pülverizatör (İlaçlama Makinesi)",
      "Sıvı Gübre Tankeri",
      "Drone ile İlaçlama Ekipmanı",
    ],
  },
  {
    id: 5,
    name: "Hasat",
    emoji: "🚜",
    icon: Tractor,
    color: "#ff8f00",
    bgLight: "#fff8e1",
    products: [
      "Biçerdöver (Buğday, Arpa, Çeltik vb.)",
      "Mısır Hasat Makinesi",
      "Patates Hasat Makinesi",
      "Yonca Biçme Makinesi",
      "Silaj Makinesi",
    ],
  },
  {
    id: 6,
    name: "Taşıma ve Yükleme",
    emoji: "🚛",
    icon: Truck,
    color: "#5c6bc0",
    bgLight: "#e8eaf6",
    products: [
      "Traktör",
      "Römork",
      "Kepçe",
      "Balya Makinesi",
      "Forklift",
    ],
  },
  {
    id: 7,
    name: "Hayvancılık Destek",
    emoji: "🐄",
    icon: MilkIcon,
    color: "#26a69a",
    bgLight: "#e0f2f1",
    products: [
      "Yem Karma Makinesi",
      "Süt Sağım Makinesi",
      "Hayvan Taşıma Römorku",
    ],
  },
];

export default function CategoryBrowsePage({ onNavigate }: CategoryBrowsePageProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
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
            <p className="text-xs text-gray-500">{categories.length} kategori · Kirala, büyü</p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="max-w-[430px] mx-auto px-4 py-5 space-y-4">
        {categories.map((cat) => {
          const isOpen = openId === cat.id;
          const IconComp = cat.icon;
          return (
            <div
              key={cat.id}
              className="rounded-2xl overflow-hidden shadow-md bg-white"
              style={{ border: `1.5px solid ${cat.color}22` }}
            >
              {/* Category Header Button */}
              <button
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center gap-4 px-5 py-5 active:opacity-80 transition-opacity"
                style={{ background: isOpen ? cat.bgLight : "#fff" }}
              >
                {/* Icon box */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: cat.bgLight }}
                >
                  <span className="text-3xl">{cat.emoji}</span>
                </div>

                {/* Title */}
                <div className="flex-1 text-left">
                  <p
                    className="text-base font-bold leading-tight"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {cat.products.length} ürün
                  </p>
                </div>

                {/* Chevron */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: cat.bgLight }}
                >
                  {isOpen
                    ? <ChevronUp className="w-4 h-4" style={{ color: cat.color }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: cat.color }} />
                  }
                </div>
              </button>

              {/* Product List */}
              {isOpen && (
                <div
                  className="px-5 pb-4 pt-1 space-y-2"
                  style={{ background: cat.bgLight }}
                >
                  <div
                    className="h-[1.5px] mb-3 rounded-full"
                    style={{ background: `${cat.color}33` }}
                  />
                  {cat.products.map((product, i) => (
                    <button
                      key={i}
                      onClick={() => onNavigate('browse', { category: cat.name, product })}
                      className="w-full flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm active:opacity-70 transition-opacity"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: cat.color }}
                      />
                      <span className="text-sm text-gray-700 text-left flex-1">{product}</span>
                      <span className="text-xs font-medium" style={{ color: cat.color }}>
                        Kirala →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom padding for nav */}
      <div className="h-24" />
    </div>
  );
}
