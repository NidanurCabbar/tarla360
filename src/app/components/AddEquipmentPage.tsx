import { ArrowLeft, Upload, MapPin, DollarSign, FileText, Calendar, Wrench } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AddEquipmentPageProps {
  onNavigate: (page: string) => void;
  accessToken?: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  products: string[];
}

export default function AddEquipmentPage({ onNavigate, accessToken }: AddEquipmentPageProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    location: "",
    model: "",
    year: new Date().getFullYear().toString(),
    condition: "Mükemmel"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Icon mapping for categories
  const iconEmojiMap: { [key: string]: string } = {
    'Sprout': '🌱',
    'Droplets': '💧',
    'Wheat': '🌾',
    'Droplet': '💧',
    'Truck': '🚛',
    'Construction': '🏗️',
    'Tractor': '🚜',
    'Cog': '⚙️',
    'Shield': '🛡️'
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
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ekipman adı zorunludur";
    }
    if (!formData.category) {
      newErrors.category = "Kategori seçimi zorunludur";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Açıklama zorunludur";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Açıklama en az 20 karakter olmalıdır";
    }
    if (!formData.pricePerDay) {
      newErrors.pricePerDay = "Günlük fiyat zorunludur";
    } else if (Number(formData.pricePerDay) <= 0) {
      newErrors.pricePerDay = "Fiyat 0'dan büyük olmalıdır";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Konum zorunludur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Get appropriate image from Unsplash based on category
      const categoryImages: Record<string, string> = {
        tractor: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        harvester: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
        irrigation: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
        planter: "https://images.unsplash.com/photo-1595429229159-213154041368?w=800",
        sprayer: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800",
        other: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/equipment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          },
          body: JSON.stringify({
            ...formData,
            pricePerDay: Number(formData.pricePerDay),
            year: Number(formData.year),
            imageUrl: categoryImages[formData.category] || categoryImages.other
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert('✅ İlan başarıyla oluşturuldu!');
        onNavigate('dashboard');
      } else {
        alert(`❌ Hata: ${data.error || 'İlan oluşturulamadı'}`);
      }
    } catch (error) {
      console.error('Error creating equipment:', error);
      alert('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[#337f34]">İlan Ekle</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-4">
        {/* Info Card */}
        <div className="bg-[#f5fff5] border border-[#1dbc60] rounded-xl p-4">
          <p className="text-sm text-[#337f34]">
            🌾 Ekipmanınızı kiraya verin ve kazanç elde edin! Tüm alanlar dikkatli şekilde doldurulmalıdır.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          {/* Equipment Name */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2">
              Ekipman Adı *
            </label>
            <Input
              placeholder="Örn: John Deere 6155M Traktör"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-[#c4161c]' : ''}
            />
            {errors.name && (
              <p className="text-xs text-[#c4161c] mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2">
              Kategori *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleChange('category', cat.name)}
                  className={`flex items-center gap-2 p-3 rounded-[10px] border-2 transition-all ${
                    formData.category === cat.name
                      ? 'border-[#1dbc60] bg-[#f5fff5]'
                      : 'border-gray-200 bg-white hover:border-[#1dbc60]/50'
                  }`}
                >
                  <span className="text-2xl">{iconEmojiMap[cat.icon] || cat.icon}</span>
                  <span className="text-sm text-[#404040]">{cat.name}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-[#c4161c] mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2">
              Açıklama * <span className="text-xs text-gray-400">(Min. 20 karakter)</span>
            </label>
            <textarea
              placeholder="Ekipmanınızın özelliklerini, durumunu ve kullanım koşullarını detaylı olarak açıklayın..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full min-h-[120px] px-3 py-2 rounded-[10px] border ${
                errors.description ? 'border-[#c4161c]' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-[#1dbc60] resize-none`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-xs text-[#c4161c]">{errors.description}</p>
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {formData.description.length} karakter
              </p>
            </div>
          </div>

          {/* Price Per Day */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Günlük Fiyat (₺) *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.pricePerDay}
              onChange={(e) => handleChange('pricePerDay', e.target.value)}
              className={errors.pricePerDay ? 'border-[#c4161c]' : ''}
            />
            {errors.pricePerDay && (
              <p className="text-xs text-[#c4161c] mt-1">{errors.pricePerDay}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Konum *
            </label>
            <Input
              placeholder="İl, İlçe"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={errors.location ? 'border-[#c4161c]' : ''}
            />
            {errors.location && (
              <p className="text-xs text-[#c4161c] mt-1">{errors.location}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Model <span className="text-xs text-gray-400">(Opsiyonel)</span>
            </label>
            <Input
              placeholder="Örn: John Deere 6155M"
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Yıl <span className="text-xs text-gray-400">(Opsiyonel)</span>
            </label>
            <Input
              type="number"
              placeholder="2024"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm text-[#337f34] mb-2">
              Durum
            </label>
            <select
              value={formData.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1dbc60]"
            >
              <option value="Sıfır">Sıfır</option>
              <option value="Mükemmel">Mükemmel</option>
              <option value="Çok İyi">Çok İyi</option>
              <option value="İyi">İyi</option>
              <option value="Orta">Orta</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px] py-6"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              İlan Oluşturuluyor...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              İlanı Yayınla
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}