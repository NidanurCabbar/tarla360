import { Search, SlidersHorizontal, X, MapPin, Star, Menu, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { Equipment } from '../types';
import BottomNav from './BottomNav';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { ChevronDown } from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import logo from 'figma:asset/a7c8485a90b31eee24e29b1603b4a323d8c17b9c.png';

interface DashboardPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategory?: string | null;
  guestMode?: boolean;
  onLoginRequest?: () => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  products: string[];
}

export default function DashboardPage({ 
  onNavigate, 
  initialCategory = null,
  guestMode = false,
  onLoginRequest
}: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
    fetchEquipment();
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
      setBackendCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/equipment`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEquipment(data.equipment || []);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build categories array from backend data
  const categories = ['Tümü', ...backendCategories.map(cat => cat.name)];

  // Build category structure from backend data
  const categoryStructure: { [key: string]: string[] } = {};
  backendCategories.forEach(cat => {
    categoryStructure[cat.name] = cat.products;
  });

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'Tümü' || item.category === selectedCategory;
    const matchesPrice = item.pricePerDay >= priceRange[0] && item.pricePerDay <= priceRange[1];
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
    const matchesSubCategory = selectedSubCategories.length === 0 || selectedSubCategories.includes(item.name);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStatus && matchesSubCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === 'Tümü' ? null : category);
    setMenuOpen(false);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategories(prev => 
      prev.includes(subCategory) 
        ? prev.filter(item => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  const handleStatusToggle = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setStatusFilter([]);
    setSelectedSubCategories([]);
    setSelectedCategory(null);
  };

  const EquipmentCard = ({ equipment }: { equipment: Equipment }) => (
    <div
      onClick={() => onNavigate('equipment-detail', equipment)}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all w-full cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-3 right-3 ${
            equipment.status === 'Müsait'
              ? 'bg-[#1dbc60] hover:bg-[#1dbc60]'
              : 'bg-[#404040] hover:bg-[#404040]'
          }`}
        >
          {equipment.status}
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-[#337f34] line-clamp-1">{equipment.name}</h3>
        <div className="flex items-start gap-1 text-sm text-[#404040]">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <span>{equipment.location}</span>
            {equipment.neighborhood && (
              <span className="text-xs text-[#737373]">{equipment.neighborhood}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-[#404040]">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{equipment.rating}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#1dbc60]">₺{equipment.pricePerDay}/gün</div>
            <div className="text-sm text-[#404040]">₺{equipment.pricePerHour}/saat</div>
          </div>
          <Button
            size="sm"
            className="bg-[#1dbc60] hover:bg-[#54a43f] rounded-[10px]"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('equipment-detail', equipment);
            }}
          >
            Kirala
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu */}
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="bg-[#337f34] text-white p-6">
                    <SheetTitle className="text-white text-left">Kategoriler</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">
                    <button
                      onClick={() => handleCategoryClick('Tümü')}
                      className={`w-full text-left px-4 py-3 rounded-[10px] transition-colors ${
                        !selectedCategory ? 'bg-[#1dbc60] text-white' : 'hover:bg-[#f5fff5] text-[#404040]'
                      }`}
                    >
                      Tüm Ekipmanlar
                    </button>
                    
                    {Object.entries(categoryStructure).map(([category, subCategories]) => (
                      <Collapsible key={category}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCategoryClick(category)}
                              className={`flex-1 text-left px-4 py-3 rounded-[10px] transition-colors ${
                                selectedCategory === category ? 'bg-[#1dbc60] text-white' : 'hover:bg-[#f5fff5] text-[#404040]'
                              }`}
                            >
                              {category}
                            </button>
                            <CollapsibleTrigger asChild>
                              <button className="p-2 hover:bg-[#f5fff5] rounded-full text-[#404040]">
                                <ChevronDown className="w-5 h-5" />
                              </button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="pl-4 space-y-1">
                            {subCategories.map((subCat) => (
                              <button
                                key={subCat}
                                onClick={() => {
                                  handleSubCategoryClick(subCat);
                                  setMenuOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-[8px] text-sm transition-colors ${
                                  selectedSubCategories.includes(subCat)
                                    ? 'bg-[#54a43f] text-white'
                                    : 'hover:bg-[#f5fff5] text-[#404040]'
                                }`}
                              >
                                {subCat}
                              </button>
                            ))}
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {guestMode && (
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={() => onNavigate('landing')}
                className="bg-white p-1 rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <img src={logo} alt="TarlaApp Logo" className="w-16 h-16 object-contain" />
              </button>
              <div>
                <h2 className="text-[#337f34]">TarlaApp</h2>
                <p className="text-sm text-[#404040]">
                  {guestMode ? 'Ürünleri Keşfedin' : 'Ekipman keşfedin'}
                </p>
              </div>
            </div>
            {guestMode && onLoginRequest && (
              <Button
                size="sm"
                variant="outline"
                className="border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px]"
                onClick={onLoginRequest}
              >
                Giriş Yap
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Ekipman ara..."
              className="pl-10 rounded-[10px] bg-[#f9faf9]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category || (!selectedCategory && category === 'Tümü') ? 'default' : 'outline'}
                className={`rounded-[10px] whitespace-nowrap ${
                  selectedCategory === category || (!selectedCategory && category === 'Tümü')
                    ? 'bg-[#1dbc60] hover:bg-[#54a43f]'
                    : 'border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5]'
                }`}
                onClick={() => setSelectedCategory(category === 'Tümü' ? null : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="max-w-[390px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#337f34]">
            {selectedCategory || 'Önerilen Ekipmanlar'}
          </h3>
          
          {/* Filter Button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <button className="text-[#54a43f] hover:underline text-sm flex items-center gap-1">
                <SlidersHorizontal className="w-4 h-4" />
                Filtrele
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-[#337f34]">Filtrele</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm text-[#404040]">
                    Günlük Fiyat Aralığı: ₺{priceRange[0]} - ₺{priceRange[1]}
                  </label>
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-3">
                  <label className="text-sm text-[#404040]">Durum</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="musait"
                        checked={statusFilter.includes('Müsait')}
                        onCheckedChange={() => handleStatusToggle('Müsait')}
                      />
                      <label htmlFor="musait" className="text-sm cursor-pointer">
                        Müsait
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="kiralikta"
                        checked={statusFilter.includes('Kiralıkta')}
                        onCheckedChange={() => handleStatusToggle('Kiralıkta')}
                      />
                      <label htmlFor="kiralikta" className="text-sm cursor-pointer">
                        Kiralıkta
                      </label>
                    </div>
                  </div>
                </div>

                {/* Selected Filters Summary */}
                {(selectedSubCategories.length > 0 || statusFilter.length > 0) && (
                  <div className="space-y-2">
                    <label className="text-sm text-[#404040]">Seçili Filtreler</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubCategories.map(subCat => (
                        <Badge 
                          key={subCat}
                          className="bg-[#54a43f] hover:bg-[#54a43f] cursor-pointer"
                          onClick={() => handleSubCategoryClick(subCat)}
                        >
                          {subCat}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px]"
                    onClick={resetFilters}
                  >
                    Sıfırla
                  </Button>
                  <Button
                    className="flex-1 bg-[#1dbc60] hover:bg-[#54a43f] rounded-[10px]"
                    onClick={() => setFilterOpen(false)}
                  >
                    Uygula
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#404040]">
            <p>Yükleniyor...</p>
          </div>
        ) : filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredEquipment.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#404040]">
            <p>Aradığınız kriterlere uygun ekipman bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {!guestMode && (
        <BottomNav onNavigate={onNavigate} />
      )}
    </div>
  );
}