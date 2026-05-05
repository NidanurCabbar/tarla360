import { ArrowLeft, Send, MoreVertical, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { ChatMessage, Chat } from "../types";

interface ChatPageProps {
  onNavigate: (page: string) => void;
  accessToken: string | null;
  currentUserId: string;
  chatId?: string;
  equipmentId?: string;
  equipmentName?: string;
  ownerId?: string;
  ownerName?: string;
}

export default function ChatPage({ 
  onNavigate, 
  accessToken, 
  currentUserId, 
  chatId: initialChatId,
  equipmentId,
  equipmentName,
  ownerId,
  ownerName
}: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatId, setChatId] = useState<string | undefined>(initialChatId);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('button')) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/chat/${chatId}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
        setChat(data.chat);
      } else {
        console.error('Error fetching messages:', data.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      let currentChatId = chatId;

      // If no chat exists yet, create it first
      if (!currentChatId && equipmentId && ownerId && equipmentName && ownerName) {
        const createResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/chat/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              equipmentId,
              equipmentName,
              ownerId,
              ownerName
            })
          }
        );

        const createData = await createResponse.json();

        if (!createResponse.ok || !createData.chat) {
          console.error('Error creating chat:', createData.error);
          alert('Sohbet oluşturulamadı: ' + createData.error);
          setSending(false);
          return;
        }

        currentChatId = createData.chat.id;
        setChatId(currentChatId);
        setChat(createData.chat);
      }

      // Send the message
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/chat/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            chatId: currentChatId,
            message: newMessage.trim()
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      } else {
        console.error('Error sending message:', data.error);
        alert('Mesaj gönderilemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilemedi');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatId) {
      onNavigate('chatlist');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/chat/${chatId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        onNavigate('chatlist');
      } else {
        console.error('Error deleting chat:', data.error);
        alert('Sohbet silinemedi: ' + data.error);
        setDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Sohbet silinemedi');
      setDeleting(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const otherUserName = chat 
    ? (chat.ownerId === currentUserId ? chat.farmerName : chat.ownerName) 
    : (ownerName || '');
  
  const displayEquipmentName = chat ? chat.equipmentName : equipmentName;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('chatlist')}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1dbc60] to-[#54a43f] flex items-center justify-center text-white">
                  {otherUserName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-[#337f34]">{otherUserName}</div>
                  {displayEquipmentName && (
                    <div className="text-xs text-gray-500">{displayEquipmentName}</div>
                  )}
                </div>
              </div>
            </div>
            {chatId && (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                >
                  <MoreVertical className="w-6 h-6" />
                </button>
                {showMenu && (
                  <div className="absolute right-4 top-12 bg-white border border-gray-200 shadow-md rounded-md z-20">
                    <button
                      onClick={() => {
                        setDeleting(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 mr-2 inline-block" />
                      Sohbeti Sil
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-[390px] mx-auto w-full px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dbc60] mx-auto mb-4"></div>
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Henüz mesaj yok</h3>
            <p className="text-sm text-gray-500">
              İlk mesajı göndererek konuşmayı başlatın
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showDate = index === 0 || 
                formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center text-xs text-gray-500 my-4">
                      {formatDate(message.timestamp)}
                    </div>
                  )}
                  
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-[#1dbc60] text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="break-words">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-green-100' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-[390px] mx-auto px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 rounded-[10px] border-gray-300"
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px] px-4"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] max-w-[350px] w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl mb-2 text-[#337f34]">Sohbeti Sil</h3>
              <p className="text-gray-600 text-sm">
                Bu sohbeti silmek istediğinizden emin misiniz? Tüm mesaj geçmişi silinecektir ve bu işlem geri alınamaz.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleting(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-[10px]"
              >
                İptal
              </Button>
              <Button
                onClick={handleDeleteChat}
                className="flex-1 bg-[#c4161c] hover:bg-red-700 text-white rounded-[10px]"
              >
                Sil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}