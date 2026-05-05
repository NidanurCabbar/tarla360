import { ArrowLeft, Tractor, Truck, Cog, Construction, Sprout, Droplets, Wheat, Droplet } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CategoryBrowsePageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  products: string[];
}

export default function CategoryBrowsePage({ onNavigate }: CategoryBrowsePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping based on backend icon names
  const iconMap: { [key: string]: any } = {
    'Sprout': Sprout,
    'Droplets': Droplets,
    'Wheat': Wheat,
    'Droplet': Droplet,
    'Truck': Truck,
    'Construction': Construction,
    'Tractor': Tractor,
    'Cog': Cog
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/categories`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-[#337f34]">Kategoriler</h2>
              <p className="text-sm text-[#404040]">Tüm kategorileri keşfedin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-[390px] mx-auto px-4 py-6">
        <h3 className="text-[#337f34] mb-4">Tüm Kategoriler</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-[#337f34]">Yükleniyor...</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || Tractor;
              return (
                <button
                  key={category.id}
                  onClick={() => onNavigate('browse', { category: category.name })}
                  className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow active:scale-100 flex flex-col items-center gap-2"
                >
                  <div className="bg-[#f5fff5] p-3 rounded-xl">
                    <IconComponent className="w-6 h-6 text-[#1dbc60]" />
                  </div>
                  <span className="text-xs text-[#337f34] text-center leading-tight">{category.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-md">
          <h4 className="text-[#337f34] mb-2">Kategoriler Hakkında</h4>
          <p className="text-sm text-[#404040] leading-relaxed">
            TarlaApp'ta {categories.length} farklı kategori ve {categories.reduce((acc, cat) => acc + cat.products.length, 0)} farklı ekipman türü bulunmaktadır. 
            İhtiyacınız olan ekipmanı kolayca bulabilir, güvenli bir şekilde kiralayabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}