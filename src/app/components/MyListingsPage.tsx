import { ArrowLeft, Home, MessageCircle, Bell, User, Plus, MapPin, DollarSign, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  model?: string;
  year?: number;
  condition?: string;
  status: string;
  createdAt: string;
}

interface MyListingsPageProps {
  onNavigate: (page: string, data?: any) => void;
  accessToken?: string | null;
}

export default function MyListingsPage({ onNavigate, accessToken }: MyListingsPageProps) {
  const [listings, setListings] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/my-equipment`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setListings(data.equipment || []);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      tractor: "🚜",
      harvester: "🌾",
      irrigation: "💧",
      planter: "🌱",
      sprayer: "💨",
      other: "⚙️"
    };
    return icons[category] || "⚙️";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      tractor: "Traktör",
      harvester: "Biçerdöver",
      irrigation: "Sulama Sistemi",
      planter: "Ekim Makinesi",
      sprayer: "İlaçlama Makinesi",
      other: "Diğer"
    };
    return labels[category] || "Diğer";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[#337f34]">İlanlarım</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-4">
        {/* Info Card */}
        <div className="bg-[#f5fff5] border border-[#1dbc60] rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-sm text-[#337f34]">
              <strong>Toplam {listings.length} ilan</strong> bulunuyor. İlanlarınızı düzenleyebilir veya silebilirsiniz.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#1dbc60] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center space-y-4">
            <div className="text-6xl">📭</div>
            <div>
              <h3 className="text-[#337f34] mb-2">Henüz İlan Yok</h3>
              <p className="text-sm text-[#404040] mb-4">
                Ekipmanlarınızı kiraya vererek gelir elde edebilirsiniz.
              </p>
              <button
                onClick={() => onNavigate('add-equipment')}
                className="bg-[#1dbc60] hover:bg-[#54a43f] text-white px-6 py-3 rounded-[10px] inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                İlk İlanı Oluştur
              </button>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Equipment Image */}
                <div className="relative h-48">
                  <img
                    src={listing.imageUrl}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      listing.status === 'available' 
                        ? 'bg-[#1dbc60] text-white' 
                        : 'bg-[#404040] text-white'
                    }`}>
                      {listing.status === 'available' ? 'Müsait' : 'Kirada'}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {getCategoryIcon(listing.category)} {getCategoryLabel(listing.category)}
                    </span>
                  </div>
                </div>

                {/* Equipment Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-[#337f34] mb-1">{listing.name}</h3>
                    <p className="text-sm text-[#404040] line-clamp-2">
                      {listing.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-[#54a43f]">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#1dbc60]">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{listing.pricePerDay}₺/gün</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {listing.model && <span>Model: {listing.model}</span>}
                    {listing.year && <span>Yıl: {listing.year}</span>}
                    {listing.condition && <span>Durum: {listing.condition}</span>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onNavigate('equipment-detail', listing)}
                      className="flex-1 bg-[#f5fff5] hover:bg-[#1dbc60]/20 text-[#1dbc60] py-2 rounded-[10px] text-sm transition-colors"
                    >
                      Görüntüle
                    </button>
                    <button
                      onClick={() => alert('Düzenleme özelliği yakında eklenecek')}
                      className="flex items-center justify-center gap-1 bg-[#f5fff5] hover:bg-[#54a43f]/20 text-[#54a43f] px-4 py-2 rounded-[10px] text-sm transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
                          alert('Silme özelliği yakında eklenecek');
                        }
                      }}
                      className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-[#c4161c] px-4 py-2 rounded-[10px] text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-gray-400 pt-2">
                    Oluşturulma: {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-[390px] mx-auto px-4 py-3">
          <div className="flex justify-around items-end">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex flex-col items-center gap-1 text-[#404040] hover:text-[#1dbc60]"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Ana Sayfa</span>
            </button>
            <button
              onClick={() => onNavigate('chatlist')}
              className="flex flex-col items-center gap-1 text-[#404040] hover:text-[#1dbc60]"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">Mesajlar</span>
            </button>
            <button
              onClick={() => onNavigate('add-equipment')}
              className="flex flex-col items-center gap-1 -mt-6"
            >
              <div className="bg-[#1dbc60] hover:bg-[#54a43f] p-4 rounded-full shadow-lg transition-colors">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs text-[#1dbc60] mt-1">İlan Ekle</span>
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              className="flex flex-col items-center gap-1 text-[#404040] hover:text-[#1dbc60]"
            >
              <Bell className="w-6 h-6" />
              <span className="text-xs">Bildirimler</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex flex-col items-center gap-1 text-[#1dbc60]"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
