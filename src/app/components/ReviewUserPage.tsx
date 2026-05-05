import { ArrowLeft, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface ReviewUserPageProps {
  onNavigate: (page: string, data?: any) => void;
  reviewData: {
    rental: {
      id: string;
      equipmentName: string;
      ownerId?: string;
      ownerName?: string;
      renterId?: string;
      renterName?: string;
    };
    reviewType: 'owner' | 'renter';
  } | null;
  currentUserId: string | null;
  accessToken: string | null;
}

export default function ReviewUserPage({
  onNavigate,
  reviewData,
  currentUserId,
  accessToken
}: ReviewUserPageProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!reviewData || !currentUserId) {
    return null;
  }

  const { rental, reviewType } = reviewData;
  const targetUserId = reviewType === 'owner' ? rental.ownerId : rental.renterId;
  const targetUserName = reviewType === 'owner' ? rental.ownerName : rental.renterName;

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Lütfen yıldız puanı verin');
      return;
    }

    if (!comment.trim()) {
      alert('Lütfen değerlendirme yorumu yazın');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/review-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          },
          body: JSON.stringify({
            reviewerId: currentUserId,
            targetUserId: targetUserId,
            rating: rating,
            comment: comment,
            rentalId: rental.id,
            equipmentName: rental.equipmentName
          })
        }
      );

      if (!response.ok) {
        throw new Error('Değerlendirme gönderilemedi');
      }

      // Update rental review status
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/update-rental-review-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || publicAnonKey}`
          },
          body: JSON.stringify({
            rentalId: rental.id,
            reviewType: reviewType
          })
        }
      );

      alert('Değerlendirme başarıyla gönderildi!');
      onNavigate('dashboard');
    } catch (error) {
      console.error('Review error:', error);
      alert('Değerlendirme gönderilirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-[#337f34]">Kullanıcı Değerlendirme</h2>
              <p className="text-sm text-[#404040]">
                {reviewType === 'owner' ? 'Ekipman Sahibini' : 'Kiralayan Kişiyi'} Değerlendirin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          {/* Rental Info */}
          <div className="space-y-2">
            <h3 className="text-[#337f34]">Kiralama Bilgileri</h3>
            <div className="bg-[#f5fff5] rounded-xl p-4">
              <p className="text-sm text-[#404040]">Ekipman</p>
              <p className="text-[#337f34]">{rental.equipmentName}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h3 className="text-[#337f34]">Değerlendirilecek Kişi</h3>
            <div className="bg-[#f5fff5] rounded-xl p-4">
              <p className="text-[#337f34]">{targetUserName}</p>
              <p className="text-sm text-[#404040]">
                {reviewType === 'owner' ? 'Ekipman Sahibi' : 'Kiralayan'}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <h3 className="text-[#337f34]">Puan Verin</h3>
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-[#404040]">
              {rating > 0 ? `${rating} Yıldız` : 'Yıldız seçin'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <h3 className="text-[#337f34]">Yorumunuz</h3>
            <Textarea
              placeholder="Deneyiminizi paylaşın..."
              className="min-h-[120px] rounded-[10px] bg-[#f9faf9]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] rounded-[10px]"
            onClick={handleSubmitReview}
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
          </Button>
        </div>
      </div>
    </div>
  );
}