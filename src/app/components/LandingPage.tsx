import { Button } from "./ui/button";
import { Tractor, Shield, Clock, Users, ArrowRight, Truck, Cog, Construction, Sprout, Droplets, Wheat, Droplet } from "lucide-react";
import logo from '../../assets/a7c8485a90b31eee24e29b1603b4a323d8c17b9c.png';
import { useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  products: string[];
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Icon mapping based on backend icon names
  const iconMap: { [key: string]: any } = {
    'Sprout': Sprout,
    'Droplets': Droplets,
    'Wheat': Wheat,
    'Droplet': Droplet,
    'Truck': Truck,
    'Construction': Construction,
    'Tractor': Tractor,
    'Cog': Cog,
    'Shield': Shield
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

  const campaigns = [
    {
      id: 1,
      title: "İlk Kiralama %20 İndirim",
      description: "Yeni üyelere özel ilk kiralamada %20 indirim fırsatı!",
      image: "https://images.unsplash.com/photo-1584752992984-412cb7d0607a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZGlzY291bnQlMjBzYWxlfGVufDF8fHx8MTc2MzIxMTk1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      bgColor: "from-[#1dbc60] to-[#54a43f]"
    },
    {
      id: 2,
      title: "Bahar Kampanyası",
      description: "Tüm sulama sistemlerinde özel indirim!",
      image: "https://images.unsplash.com/photo-1708794666324-85ad91989d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwZXF1aXBtZW50JTIwcHJvbW90aW9ufGVufDF8fHx8MTc2MzIxMTk1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      bgColor: "from-[#337f34] to-[#4d8c38]"
    },
    {
      id: 3,
      title: "Akıllı Tarım",
      description: "Modern ekipmanlarla veriminizi artırın!",
      image: "https://images.unsplash.com/photo-1761839257144-297ce252742e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlY2hub2xvZ3klMjBtb2Rlcm58ZW58MXx8fHwxNzYzMjExOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      bgColor: "from-[#54a43f] to-[#1dbc60]"
    }
  ];

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % campaigns.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isDragging, campaigns.length]);

  // Scroll to current slide
  useEffect(() => {
    if (carouselRef.current && !isDragging) {
      const scrollWidth = carouselRef.current.scrollWidth / campaigns.length;
      carouselRef.current.scrollTo({
        left: scrollWidth * currentSlide,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, campaigns.length, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to nearest slide
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth / campaigns.length;
      const newSlide = Math.round(carouselRef.current.scrollLeft / scrollWidth);
      setCurrentSlide(newSlide);
    }
  };

  const features = [
    {
      icon: Tractor,
      title: "Geniş Ekipman Yelpazesi",
      description: "Traktörden biçerdövere, sulama sistemlerinden toprak işleme ekipmanlarına kadar her şey"
    },
    {
      icon: Clock,
      title: "Hızlı ve Kolay",
      description: "İhtiyacınız olan ekipmanı dakikalar içinde bulun ve kiralayın"
    },
    {
      icon: Shield,
      title: "Güvenli İşlemler",
      description: "Güvenli ödeme sistemi ve sigortalı ekipmanlarla huzurlu kiralama"
    },
    {
      icon: Users,
      title: "Güvenilir Topluluk",
      description: "Binlerce çiftçi ve ekipman sahibi ile güçlü bir ağ"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Page Background Image with Blur */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1747366722167-f73ca96cb89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmllbGQlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzYyMTc3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Tarlada ekipman"
          className="w-full h-full object-cover blur-sm"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Header with Logo */}
      <div className="relative">
        <div className="max-w-[390px] mx-auto px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-md flex items-center justify-center">
              <img src={logo} alt="Tarla360 Logo" className="w-12 h-12 object-contain" />
            </div>
            <div className="flex items-center" style={{ fontSize: '1.5em', fontWeight: '800' }}>
              <span className="bg-gradient-to-r from-[#1dbc60] to-[#337f34] bg-clip-text text-transparent tracking-tight">
                Tarla
              </span>
              <span className="text-[#337f34] tracking-tight">360</span>
              <span className="ml-1 text-[0.9em] text-[#1dbc60]">°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-[390px] mx-auto px-4 pt-8 pb-8 relative">
          {/* Main Heading */}
          <div className="text-center space-y-4 mb-8">
            <p className="text-xl text-[#337f34] leading-relaxed drop-shadow-sm">
              Tarımda dijital dönüşüm başlıyor
            </p>
            <p className="text-[#404040] px-4 drop-shadow-sm">
              İhtiyacınız olan tarım ekipmanlarını kolayca kiralayın, ekipmanlarınızı kiraya vererek gelir elde edin
            </p>
          </div>

          {/* Campaign Carousel */}
          <div className="mb-6">
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex-shrink-0 w-full snap-center"
                >
                  <div className={`relative bg-gradient-to-r ${campaign.bgColor} rounded-[10px] overflow-hidden shadow-lg h-40`}>
                    <div className="absolute inset-0 opacity-20">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative h-full flex flex-col justify-center px-6 text-white">
                      <h3 className="mb-2">{campaign.title}</h3>
                      <p className="text-sm opacity-90">{campaign.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {campaigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'w-6 bg-[#1dbc60]' 
                      : 'w-2 bg-[#1dbc60]/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-center text-[#337f34] mb-4 drop-shadow-sm">Popüler Kategoriler</h3>
            <div className="grid grid-cols-3 gap-3">
              {categories.slice(0, 6).map((category, index) => {
                const IconComponent = iconMap[category.icon] || Tractor;
                return (
                  <button
                    key={index}
                    onClick={() => onNavigate('browse', { category: category.name })}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow active:scale-100 flex flex-col items-center gap-2"
                  >
                    <div className="bg-[#f5fff5] p-3 rounded-xl">
                      <IconComponent className="w-6 h-6 text-[#1dbc60]" />
                    </div>
                    <span className="text-xs text-[#337f34] text-center leading-tight">{category.name}</span>
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-2 border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px] h-12 bg-white/95 backdrop-blur-sm shadow-lg"
              onClick={() => onNavigate('categories')}
            >
              Tüm Kategorileri Gör
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[390px] mx-auto px-4 py-8 relative">
        <h2 className="text-center text-[#337f34] mb-6 drop-shadow-sm">
          Neden Tarla360?
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-[#f5fff5] p-3 rounded-xl w-fit mb-3">
                <feature.icon className="w-6 h-6 text-[#1dbc60]" />
              </div>
              <h3 className="text-[#337f34] mb-2 text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-[#404040] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-8">
          <Button
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px] h-12 text-lg shadow-lg"
            onClick={() => onNavigate('signup')}
          >
            Hemen Başla
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px] h-12 bg-white/95 backdrop-blur-sm shadow-lg"
            onClick={() => onNavigate('login')}
          >
            Giriş Yap
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-2 pb-6">
          <p className="text-sm text-[#404040] drop-shadow-sm">
            Türkiye'nin ilk tarım ekipmanı kiralama platformu
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-500 drop-shadow-sm">
            <button className="hover:text-[#54a43f]">Hakkımızda</button>
            <span>•</span>
            <button className="hover:text-[#54a43f]">İletişim</button>
            <span>•</span>
            <button className="hover:text-[#54a43f]">Yardım</button>
          </div>
        </div>
      </div>
    </div>
  );
}