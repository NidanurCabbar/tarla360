import { ArrowLeft, Bell, Home, MessageCircle, User, Plus, Star } from "lucide-react";
import { mockNotifications } from "../data/mockData";
import { Button } from "./ui/button";

interface NotificationsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  // Demo rental data for testing review feature
  const demoRental = {
    id: 'rental_demo_123',
    equipmentName: 'John Deere 6155R Traktör',
    ownerId: 'owner_demo_456',
    ownerName: 'Ahmet Yılmaz',
    renterId: 'renter_demo_789',
    renterName: 'Mehmet Kaya'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] pb-20">
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
            <h2 className="text-[#337f34]">Bildirimler</h2>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-[390px] mx-auto px-4 py-6">
        <div className="space-y-3">
          {/* Demo Review Request Notification */}
          <div className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-[#1dbc60]">
            <div className="flex gap-3">
              <div className="p-2 rounded-full h-fit bg-yellow-400">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#337f34]">
                  Kiralama işleminiz tamamlandı. Ekipman sahibini değerlendirin!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date().toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <Button
                  size="sm"
                  className="mt-3 bg-[#1dbc60] hover:bg-[#54a43f] rounded-[10px]"
                  onClick={() => onNavigate('review-user', { 
                    rental: demoRental, 
                    reviewType: 'owner' 
                  })}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Değerlendir
                </Button>
              </div>
            </div>
          </div>

          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl p-4 shadow-md ${
                !notification.read ? 'border-l-4 border-[#1dbc60]' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-full h-fit ${
                  !notification.read ? 'bg-[#1dbc60]' : 'bg-gray-200'
                }`}>
                  <Bell className={`w-5 h-5 ${
                    !notification.read ? 'text-white' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`text-[#337f34] ${
                    !notification.read ? '' : 'text-[#404040]'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockNotifications.length === 0 && (
          <div className="text-center py-12 text-[#404040]">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Henüz bildiriminiz yok</p>
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
              onClick={() => alert('İlan ekleme özelliği yakında eklenecek!')}
              className="flex flex-col items-center gap-1 -mt-6"
            >
              <div className="bg-[#1dbc60] hover:bg-[#54a43f] p-4 rounded-full shadow-lg transition-colors">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs text-[#1dbc60] mt-1">İlan Ekle</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1dbc60]">
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