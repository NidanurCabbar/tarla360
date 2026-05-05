import { ArrowLeft, MapPin, Star, Phone, Calendar, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Equipment } from "../types";
import { useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface EquipmentDetailPageProps {
  equipment: Equipment;
  onNavigate: (page: string, data?: any) => void;
  guestMode?: boolean;
  onLoginRequest?: () => void;
  accessToken?: string | null;
  currentUserId?: string;
}

export default function EquipmentDetailPage({ 
  equipment, 
  onNavigate,
  guestMode = false,
  onLoginRequest,
  accessToken,
  currentUserId
}: EquipmentDetailPageProps) {
  const [creatingChat, setCreatingChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews'>('description');

  const handleStartChat = async () => {
    if (guestMode) {
      onLoginRequest?.();
      return;
    }

    // Don't create chat yet, just navigate to chat page with equipment info
    const ownerName = equipment.owner;
    const ownerId = `owner_${ownerName.replace(/\s/g, '_').toLowerCase()}`;

    onNavigate('chat', {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      ownerId: ownerId,
      ownerName: ownerName
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9]">
      {/* Header Image */}
      <div className="relative h-64 bg-gray-100">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onNavigate(guestMode ? 'browse' : 'dashboard')}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white"
        >
          <ArrowLeft className="w-6 h-6 text-[#337f34]" />
        </button>
        <Badge
          className={`absolute top-4 right-4 ${
            equipment.status === 'Müsait'
              ? 'bg-[#1dbc60] hover:bg-[#1dbc60]'
              : 'bg-[#404040] hover:bg-[#404040]'
          }`}
        >
          {equipment.status}
        </Badge>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 -mt-6 pb-24">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Title and Rating */}
          <div>
            <h2 className="text-[#337f34] mb-2">{equipment.name}</h2>
            <div className="flex items-center gap-4 text-sm text-[#404040]">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{equipment.rating}</span>
                <span className="text-gray-400">({equipment.reviews.length} değerlendirme)</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-[#404040]">Kategori</p>
              <p className="text-[#337f34]">{equipment.category}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#404040]">Konum</p>
              <div className="flex items-start gap-1 text-[#337f34]">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm">{equipment.location}</span>
                  {equipment.neighborhood && (
                    <span className="text-xs text-[#737373]">{equipment.neighborhood}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#f5fff5] rounded-xl p-4">
            <p className="text-sm text-[#404040] mb-2">Kiralama Ücretleri</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#1dbc60]">₺{equipment.pricePerDay}</p>
                <p className="text-sm text-[#404040]">Günlük</p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <p className="text-[#1dbc60]">₺{equipment.pricePerHour}</p>
                <p className="text-sm text-[#404040]">Saatlik</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'description'
                  ? 'text-[#1dbc60] border-b-2 border-[#1dbc60]'
                  : 'text-[#404040] hover:text-[#337f34]'
              }`}
            >
              Açıklama
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'features'
                  ? 'text-[#1dbc60] border-b-2 border-[#1dbc60]'
                  : 'text-[#404040] hover:text-[#337f34]'
              }`}
            >
              Özellikler
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'reviews'
                  ? 'text-[#1dbc60] border-b-2 border-[#1dbc60]'
                  : 'text-[#404040] hover:text-[#337f34]'
              }`}
            >
              Değerlendirmeler
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'description' && (
              <div className="space-y-2">
                <p className="text-[#404040] text-sm leading-relaxed">
                  {equipment.description}
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5fff5] rounded-xl p-4">
                    <p className="text-sm text-[#404040] mb-1">Kategori</p>
                    <p className="text-[#337f34]">{equipment.category}</p>
                  </div>
                  <div className="bg-[#f5fff5] rounded-xl p-4">
                    <p className="text-sm text-[#404040] mb-1">Durum</p>
                    <p className="text-[#337f34]">{equipment.status}</p>
                  </div>
                  <div className="bg-[#f5fff5] rounded-xl p-4">
                    <p className="text-sm text-[#404040] mb-1">Günlük Ücret</p>
                    <p className="text-[#337f34]">₺{equipment.pricePerDay}</p>
                  </div>
                  <div className="bg-[#f5fff5] rounded-xl p-4">
                    <p className="text-sm text-[#404040] mb-1">Saatlik Ücret</p>
                    <p className="text-[#337f34]">₺{equipment.pricePerHour}</p>
                  </div>
                  {equipment.lastMaintenance && (
                    <div className="bg-[#f5fff5] rounded-xl p-4 col-span-2">
                      <p className="text-sm text-[#404040] mb-1">Son Bakım</p>
                      <p className="text-[#337f34]">
                        {new Date(equipment.lastMaintenance).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Unavailable Periods */}
                {equipment.unavailablePeriods && equipment.unavailablePeriods.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#c4161c]" />
                      <h4 className="text-[#337f34]">Dolu Zaman Dilimleri</h4>
                    </div>
                    <p className="text-xs text-[#404040]">
                      Aşağıdaki tarih ve saatler başka kullanıcılar tarafından kiralanmıştır. 
                      Farklı bir tarih aralığı seçerek kiralama yapabilirsiniz.
                    </p>
                    <div className="space-y-2">
                      {equipment.unavailablePeriods.map((period, index) => (
                        <div key={index} className="bg-red-50 border border-[#c4161c] rounded-xl p-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-[#c4161c] mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-[#c4161c] text-sm mb-1">
                                {new Date(period.startDate).toLocaleDateString('tr-TR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                                {period.endDate !== period.startDate && (
                                  <>
                                    {' - '}
                                    {new Date(period.endDate).toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </>
                                )}
                              </p>
                              {period.startTime && period.endTime ? (
                                <p className="text-xs text-[#c4161c]">
                                  Dolu saat aralığı: {period.startTime} - {period.endTime}
                                </p>
                              ) : (
                                <p className="text-xs text-[#c4161c]">
                                  Tüm gün dolu
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#f5fff5] border border-[#1dbc60] rounded-xl p-3">
                      <p className="text-xs text-[#337f34] flex items-start gap-2">
                        <span className="text-base">💡</span>
                        <span>
                          Kirala butonuna tıkladığınızda dolu zaman dilimleri seçilemez olarak görünecektir. 
                          Başka bir uygun zaman dilimini seçerek kiralama yapabilirsiniz.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {equipment.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {equipment.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[#337f34]">{review.author}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-[#404040]">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#404040]">
                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Henüz değerlendirme yapılmamış</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className="space-y-2">
            <h3 className="text-[#337f34]">Ekipman Sahibi</h3>
            <div className="flex items-center justify-between">
              <p className="text-[#404040]">{equipment.owner}</p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px]"
                onClick={handleStartChat}
                disabled={creatingChat}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {creatingChat ? 'Yükleniyor...' : 'Mesaj Gönder'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-[390px] mx-auto px-4 py-4 flex gap-3">
          {guestMode ? (
            <>
              <Button
                variant="outline"
                className="flex-1 border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px]"
                onClick={onLoginRequest}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Mesaj Gönder
              </Button>
              <Button
                className="flex-1 bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
                onClick={onLoginRequest}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Kirala
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1 border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px]"
                onClick={handleStartChat}
                disabled={creatingChat}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {creatingChat ? 'Yükleniyor...' : 'Mesaj Gönder'}
              </Button>
              <Button
                className="flex-1 bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
                onClick={() => onNavigate('rental-date', equipment)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Kirala
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}