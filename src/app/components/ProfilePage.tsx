import { ArrowLeft, User, Bell, Home, MessageCircle, LogOut, Edit, MapPin, Mail, Phone, IdCard, Calendar, Star, Plus, ChevronRight, Shield, Package } from "lucide-react";
import { Button } from "./ui/button";
import { User as UserType, UserReview } from "../types";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  userRole: 'farmer' | 'owner';
  currentUser: UserType | null;
  onLogout: () => void;
  accessToken?: string | null;
}

export default function ProfilePage({ onNavigate, userRole, currentUser, onLogout, accessToken }: ProfilePageProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserReviews();
    }
  }, [currentUser?.id]);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/user-reviews/${currentUser?.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = currentUser?.rating || 0;
  const reviewCount = currentUser?.reviewCount || reviews.length;

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
            <h2 className="text-[#337f34]">Profil</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-[#1dbc60] p-6 rounded-full">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-[#337f34]">
              {currentUser ? `${currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`}` : 'Kullanıcı'}
            </h3>
            <p className="text-sm text-[#404040]">{currentUser?.email || 'email@example.com'}</p>
          </div>
          
          {/* Rating Display */}
          {averageRating > 0 && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg text-[#337f34]">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-[#404040]">({reviewCount} değerlendirme)</span>
            </div>
          )}
          
          <div className="inline-block bg-[#f5fff5] px-4 py-2 rounded-full">
            <span className="text-sm text-[#54a43f]">
              {userRole === 'farmer' ? '🌾 Çiftçi' : '🚜 Ekipman Sahibi'}
            </span>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-[#337f34]">Değerlendirmeler</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#337f34]">{review.reviewerName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#404040] mb-1">{review.comment}</p>
                  {review.equipmentName && (
                    <p className="text-xs text-gray-400">Ekipman: {review.equipmentName}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
          <button 
            onClick={() => onNavigate('profile-edit')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#f5fff5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Edit className="w-5 h-5 text-[#54a43f]" />
              <span className="text-[#337f34]">Profil Bilgilerini Düzenle</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('my-listings')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#f5fff5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#54a43f]" />
              <span className="text-[#337f34]">İlanlarım</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('rentals')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#f5fff5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#54a43f]" />
              <span className="text-[#337f34]">Kiralamaları Görüntüle</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {userRole === 'owner' && (
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#f5fff5] transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#54a43f]" />
                <span className="text-[#337f34]">Ekipmanlarımı Yönet</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          )}

          <button className="w-full flex items-center justify-between p-4 hover:bg-[#f5fff5] transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#54a43f]" />
              <span className="text-[#337f34]">Güvenlik ve Gizlilik</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-[#c4161c] text-[#c4161c] hover:bg-[#c4161c]/10 rounded-[10px]"
          onClick={() => {
            if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
              onLogout();
            }
          }}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Çıkış Yap
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-gray-400">
          <p>Tarla360 v1.0.0</p>
          <p className="mt-1">© 2025 Tüm hakları saklıdır</p>
        </div>
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
            <button className="flex flex-col items-center gap-1 text-[#1dbc60]">
              <User className="w-6 h-6" />
              <span className="text-xs">Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}