import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Chat } from "../types";

interface ChatListPageProps {
  onNavigate: (page: string, data?: any) => void;
  accessToken: string | null;
  currentUserId: string;
}

export default function ChatListPage({ onNavigate, accessToken, currentUserId }: ChatListPageProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/chat/list`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setChats(data.chats || []);
      } else {
        console.error('Error fetching chats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
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
            <div>
              <h1 className="text-[#337f34]">Mesajlar</h1>
              <p className="text-sm text-gray-500">{chats.length} konuşma</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-[390px] mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dbc60] mx-auto mb-4"></div>
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Henüz mesajınız yok</h3>
            <p className="text-sm text-gray-500">
              Ekipman detay sayfalarından ilan sahipleriyle iletişime geçebilirsiniz
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => {
              const otherUserName = chat.ownerId === currentUserId ? chat.farmerName : chat.ownerName;
              
              return (
                <button
                  key={chat.id}
                  onClick={() => onNavigate('chat', { chatId: chat.id })}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1dbc60] to-[#54a43f] flex items-center justify-center text-white flex-shrink-0">
                      {otherUserName.charAt(0).toUpperCase()}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-medium text-[#337f34] truncate">
                          {otherUserName}
                        </div>
                        {chat.lastMessageTime && (
                          <div className="text-xs text-gray-400 flex-shrink-0">
                            {formatTime(chat.lastMessageTime)}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-1 truncate">
                        {chat.equipmentName}
                      </div>

                      {chat.lastMessage && (
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-600 truncate flex-1">
                            {chat.lastMessage}
                          </div>
                          {chat.unreadCount && chat.unreadCount > 0 && (
                            <div className="bg-[#c4161c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
