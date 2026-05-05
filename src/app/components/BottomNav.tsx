import { Home, MessageCircle, Plus, Bell, User } from "lucide-react";

interface BottomNavProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export default function BottomNav({ onNavigate, currentPage = 'dashboard' }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-[390px] mx-auto px-4 py-3">
        <div className="flex justify-around items-end">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'dashboard' ? 'text-[#1dbc60]' : 'text-[#404040] hover:text-[#1dbc60]'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Ana Sayfa</span>
          </button>
          <button
            onClick={() => onNavigate('chatlist')}
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'chatlist' ? 'text-[#1dbc60]' : 'text-[#404040] hover:text-[#1dbc60]'
            }`}
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
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'notifications' ? 'text-[#1dbc60]' : 'text-[#404040] hover:text-[#1dbc60]'
            }`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs">Bildirimler</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'profile' ? 'text-[#1dbc60]' : 'text-[#404040] hover:text-[#1dbc60]'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
