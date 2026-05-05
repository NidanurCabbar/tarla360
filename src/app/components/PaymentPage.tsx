import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PaymentPageProps {
  rentalData: {
    equipment: any;
    startDate: string;
    endDate: string;
    rentalType: string;
    totalPrice: number;
    duration?: string;
  };
  onNavigate: (page: string, data?: any) => void;
}

export default function PaymentPage({ rentalData, onNavigate }: PaymentPageProps) {
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('rental-confirmation', rentalData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('rental-date', rentalData.equipment)}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[#337f34]">Ödeme Bilgileri</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-[#404040] bg-[#f5fff5] p-3 rounded-xl">
          <Lock className="w-4 h-4 text-[#54a43f]" />
          <span>Güvenli ödeme ile korunuyorsunuz</span>
        </div>

        {/* Order Summary */}
        <div className="bg-[#f9faf9] rounded-2xl p-6 space-y-3">
          <h3 className="text-[#337f34]">Sipariş Özeti</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#404040]">Ekipman</span>
              <span className="text-[#337f34]">{rentalData.equipment.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404040]">Başlangıç</span>
              <span className="text-[#337f34]">
                {new Date(rentalData.startDate).toLocaleString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404040]">Bitiş</span>
              <span className="text-[#337f34]">
                {new Date(rentalData.endDate).toLocaleString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {rentalData.duration && (
              <div className="flex justify-between">
                <span className="text-[#404040]">Süre</span>
                <span className="text-[#337f34]">{rentalData.duration}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-[#337f34]">Toplam Tutar</span>
                <span className="text-xl text-[#1dbc60]">₺{rentalData.totalPrice.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[#337f34]">Kart Bilgileri</h3>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="AD SOYAD"
                className="rounded-[10px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Kart Numarası</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="rounded-[10px] pl-10"
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Son Kullanma</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="AA/YY"
                  className="rounded-[10px]"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  className="rounded-[10px]"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 accent-[#1dbc60]"
              required
            />
            <label htmlFor="terms" className="text-[#404040]">
              <span className="text-[#54a43f] underline cursor-pointer">Kiralama sözleşmesini</span> ve{' '}
              <span className="text-[#54a43f] underline cursor-pointer">iptal koşullarını</span> okudum, kabul ediyorum.
            </label>
          </div>
        </form>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <Button
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
            onClick={handlePayment}
          >
            Ödemeyi Tamamla - ₺{rentalData.totalPrice}
          </Button>
        </div>
      </div>
    </div>
  );
}