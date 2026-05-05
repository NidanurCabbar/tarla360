import { CheckCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface RentalConfirmationPageProps {
  rentalData: {
    equipment: any;
    startDate: string;
    endDate: string;
    totalPrice: number;
    duration?: string;
  };
  onNavigate: (page: string) => void;
}

export default function RentalConfirmationPage({ rentalData, onNavigate }: RentalConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] space-y-6">
        {/* Success Icon */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-[#1dbc60] p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-[#337f34]">Tebrikler!</h2>
          <p className="text-[#404040]">
            Ekipmanı başarıyla kiraladınız
          </p>
        </div>

        {/* Rental Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-[#337f34]">Kiralama Detayları</h3>
          
          <div className="flex gap-4 pb-4 border-b border-gray-100">
            <img
              src={rentalData.equipment.image}
              alt={rentalData.equipment.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h4 className="text-[#337f34] mb-1">{rentalData.equipment.name}</h4>
              <p className="text-sm text-[#404040]">{rentalData.equipment.category}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#54a43f] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#404040]">Kiralama Tarihleri</p>
                <p className="text-[#337f34] text-sm">
                  {new Date(rentalData.startDate).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-[#337f34] text-sm">
                  {new Date(rentalData.endDate).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {rentalData.duration && (
                  <p className="text-xs text-gray-500 mt-1">Süre: {rentalData.duration}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#54a43f] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#404040]">Teslim Noktası</p>
                <p className="text-[#337f34]">{rentalData.equipment.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5fff5] rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-[#404040]">Toplam Ödenen</span>
              <span className="text-xl text-[#1dbc60]">₺{rentalData.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#fff9e6] border border-[#ffd966] rounded-xl p-4">
          <p className="text-sm text-[#404040]">
            <span className="text-[#337f34]">Bilgi:</span> Ekipman sahibi en kısa sürede sizinle iletişime geçecektir. Kiralama detaylarını profil bölümünüzden takip edebilirsiniz.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
            onClick={() => onNavigate('dashboard')}
          >
            Ana Sayfaya Dön
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#54a43f] text-[#54a43f] hover:bg-[#f5fff5] rounded-[10px]"
            onClick={() => onNavigate('notifications')}
          >
            Kiralama Detayını Gör
          </Button>
        </div>
      </div>
    </div>
  );
}