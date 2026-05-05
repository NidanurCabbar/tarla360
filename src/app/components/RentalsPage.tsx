import { ArrowLeft, Home, MessageCircle, Bell, User, Plus, MapPin, Calendar, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";

interface Rental {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  ownerId: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  location: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryImage?: string;
}

interface RentalsPageProps {
  onNavigate: (page: string, data?: any) => void;
  accessToken?: string | null;
  currentUserId?: string;
}

export default function RentalsPage({ onNavigate, accessToken, currentUserId }: RentalsPageProps) {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [deliveringRental, setDeliveringRental] = useState<string | null>(null);
  const [deliveryData, setDeliveryData] = useState({
    date: '',
    time: '',
    image: ''
  });
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [completedRentalData, setCompletedRentalData] = useState<any>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/rentals`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRentals(data.rentals || []);
      } else {
        console.error('Failed to fetch rentals');
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverySubmit = async (rentalId: string) => {
    if (!deliveryData.date || !deliveryData.time) {
      alert('Lütfen teslim tarihi ve saati girin');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/rentals/${rentalId}/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          },
          body: JSON.stringify({
            deliveryDate: deliveryData.date,
            deliveryTime: deliveryData.time,
            deliveryImage: deliveryData.image
          })
        }
      );

      if (response.ok) {
        const rental = rentals.find(r => r.id === rentalId);
        setCompletedRentalData(rental);
        setDeliveringRental(null);
        setDeliveryData({ date: '', time: '', image: '' });
        setShowReviewPopup(true);
        fetchRentals();
      } else {
        alert('Teslim işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error completing rental:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDeliveryData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const activeRentals = rentals.filter(r => r.status === 'active');
  const completedRentals = rentals.filter(r => r.status === 'completed');

  const isRentalEnded = (endDate: string) => {
    return new Date(endDate) <= new Date();
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
            <h2 className="text-[#337f34]">Kiralamaları Görüntüle</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[390px] mx-auto px-4 py-4">
        <div className="bg-white rounded-[10px] p-1 flex gap-1">
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-2 rounded-[8px] transition-colors ${
              selectedTab === 'active'
                ? 'bg-[#1dbc60] text-white'
                : 'text-[#404040] hover:bg-gray-100'
            }`}
          >
            Aktif Kiralamalar ({activeRentals.length})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-2 rounded-[8px] transition-colors ${
              selectedTab === 'completed'
                ? 'bg-[#1dbc60] text-white'
                : 'text-[#404040] hover:bg-gray-100'
            }`}
          >
            Geçmiş ({completedRentals.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 pb-6 space-y-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#1dbc60] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && (selectedTab === 'active' ? activeRentals : completedRentals).length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center space-y-4">
            <div className="text-6xl">
              {selectedTab === 'active' ? '📦' : '✅'}
            </div>
            <div>
              <h3 className="text-[#337f34] mb-2">
                {selectedTab === 'active' ? 'Aktif Kiralama Yok' : 'Geçmiş Kiralama Yok'}
              </h3>
              <p className="text-sm text-[#404040]">
                {selectedTab === 'active' 
                  ? 'Henüz aktif bir kiralamanız bulunmuyor.'
                  : 'Henüz tamamlanmış bir kiralamanız bulunmuyor.'}
              </p>
            </div>
          </div>
        )}

        {/* Rentals List */}
        {!loading && (selectedTab === 'active' ? activeRentals : completedRentals).map((rental) => (
          <div
            key={rental.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Equipment Image */}
            <div className="relative h-48">
              <img
                src={rental.equipmentImage}
                alt={rental.equipmentName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  rental.status === 'active' 
                    ? 'bg-[#1dbc60] text-white' 
                    : 'bg-[#404040] text-white'
                }`}>
                  {rental.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                </span>
              </div>
            </div>

            {/* Rental Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-[#337f34] mb-1">{rental.equipmentName}</h3>
                <p className="text-sm text-[#404040]">
                  {rental.ownerId === currentUserId ? `Kiralayan: ${rental.renterName}` : `Sahibi: ${rental.ownerName}`}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-[#54a43f]">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(rental.startDate).toLocaleDateString('tr-TR')}</span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="flex items-center gap-1 text-[#54a43f]">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(rental.endDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-[#54a43f]">
                  <MapPin className="w-4 h-4" />
                  <span>{rental.location}</span>
                </div>
                <div className="text-[#1dbc60] font-semibold">
                  {rental.totalPrice}₺
                </div>
              </div>

              {/* Delivery Section for Active Rentals */}
              {rental.status === 'active' && isRentalEnded(rental.endDate) && (
                <div className="pt-3 border-t border-gray-100">
                  {deliveringRental === rental.id ? (
                    <div className="space-y-3">
                      <p className="text-sm text-[#337f34] font-semibold">Teslim Bilgileri</p>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-[#404040]">Teslim Tarihi</label>
                        <input
                          type="date"
                          value={deliveryData.date}
                          onChange={(e) => setDeliveryData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-[#404040]">Teslim Saati</label>
                        <input
                          type="time"
                          value={deliveryData.time}
                          onChange={(e) => setDeliveryData(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-[#404040]">Teslim Görseli (Opsiyonel)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-sm"
                        />
                        {deliveryData.image && (
                          <img
                            src={deliveryData.image}
                            alt="Teslim görseli"
                            className="w-full h-32 object-cover rounded-[10px] mt-2"
                          />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeliverySubmit(rental.id)}
                          className="flex-1 bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Teslim Edildi
                        </Button>
                        <Button
                          onClick={() => {
                            setDeliveringRental(null);
                            setDeliveryData({ date: '', time: '', image: '' });
                          }}
                          variant="outline"
                          className="border-gray-300 text-[#404040] rounded-[10px]"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          İptal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setDeliveringRental(rental.id)}
                      className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Teslim Et
                    </Button>
                  )}
                </div>
              )}

              {/* Delivery Info for Completed Rentals */}
              {rental.status === 'completed' && rental.deliveryDate && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Teslim Bilgileri:</p>
                  <div className="flex items-center gap-2 text-sm text-[#54a43f]">
                    <Clock className="w-4 h-4" />
                    <span>{rental.deliveryDate} - {rental.deliveryTime}</span>
                  </div>
                  {rental.deliveryImage && (
                    <img
                      src={rental.deliveryImage}
                      alt="Teslim görseli"
                      className="w-full h-32 object-cover rounded-[10px] mt-2"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Popup */}
      {showReviewPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[350px] w-full space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-[#337f34] mb-2">Teslim Tamamlandı!</h3>
              <p className="text-sm text-[#404040]">
                Kiralama başarıyla tamamlandı. Deneyiminizi değerlendirmek ister misiniz?
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => {
                  setShowReviewPopup(false);
                  onNavigate('review-user', completedRentalData);
                }}
                className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
              >
                ⭐ Şimdi Değerlendir
              </Button>
              <Button
                onClick={() => {
                  setShowReviewPopup(false);
                  onNavigate('profile');
                }}
                variant="outline"
                className="w-full border-gray-300 text-[#404040] rounded-[10px]"
              >
                Daha Sonra Değerlendir
              </Button>
            </div>
          </div>
        </div>
      )}

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
              className="flex flex-col items-center gap-1 text-[#404040] hover:text-[#1dbc60]"
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
