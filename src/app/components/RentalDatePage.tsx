import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Equipment } from "../types";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface RentalDatePageProps {
  equipment: Equipment;
  onNavigate: (page: string, data?: any) => void;
}

export default function RentalDatePage({ equipment, onNavigate }: RentalDatePageProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('09:00');
  const [rentalType, setRentalType] = useState<'daily' | 'hourly'>('daily');

  // Farklı kaynaklardan gelen fiyat alanlarını normalize et
  const dailyPrice: number =
    Number(equipment.pricePerDay ?? (equipment as any).dailyPrice ?? 0);
  const hourlyPrice: number =
    Number(equipment.pricePerHour ?? (equipment as any).hourlyPrice ?? (dailyPrice > 0 ? Math.round(dailyPrice / 8) : 0));

  // Check if a date is disabled
  const isDateDisabled = (date: Date) => {
    if (!equipment.unavailablePeriods) return false;
    
    return equipment.unavailablePeriods.some(period => {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);
      
      // Reset time to compare only dates
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      return checkDate >= periodStart && checkDate <= periodEnd;
    });
  };

  // Check if a time is disabled for a specific date
  const isTimeDisabled = (date: Date, time: string) => {
    if (!equipment.unavailablePeriods) return false;
    
    const [hour, minute] = time.split(':').map(Number);
    const checkDateTime = new Date(date);
    checkDateTime.setHours(hour, minute, 0, 0);
    
    return equipment.unavailablePeriods.some(period => {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);
      
      // If period has specific times, check them
      if (period.startTime && period.endTime) {
        const [startHour, startMinute] = period.startTime.split(':').map(Number);
        const [endHour, endMinute] = period.endTime.split(':').map(Number);
        
        periodStart.setHours(startHour, startMinute, 0, 0);
        periodEnd.setHours(endHour, endMinute, 0, 0);
        
        return checkDateTime >= periodStart && checkDateTime <= periodEnd;
      }
      
      // If no specific time, entire day is blocked
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= periodStart && checkDate <= periodEnd;
    });
  };

  // Generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeStr);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const calculateDurationAndPrice = () => {
    if (!startDate || !endDate) return { hours: 0, days: 0, total: 0 };
    
    // Tarih ve saatleri birleştir
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const start = new Date(startDate);
    start.setHours(startHour, startMinute, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(endHour, endMinute, 0, 0);
    
    // Süreyi milisaniye cinsinden hesapla
    const diffMs = end.getTime() - start.getTime();
    
    if (diffMs <= 0) return { hours: 0, days: 0, total: 0 };
    
    // Saat cinsinden süre
    const totalHours = diffMs / (1000 * 60 * 60);
    
    let total = 0;
    let calculatedDays = 0;
    
    if (rentalType === 'daily') {
      calculatedDays = Math.ceil(totalHours / 24);
      total = calculatedDays * dailyPrice;
    } else {
      const calculatedHours = Math.ceil(totalHours);
      total = calculatedHours * hourlyPrice;
    }
    
    return { 
      hours: Math.ceil(totalHours), 
      days: calculatedDays,
      total 
    };
  };

  const { hours, days, total } = calculateDurationAndPrice();

  const handleContinue = () => {
    if (!startDate || !endDate) {
      alert('Lütfen tarih aralığı seçin');
      return;
    }
    
    if (total <= 0) {
      alert('Bitiş tarihi başlangıç tarihinden sonra olmalıdır');
      return;
    }
    
    // Tarih ve saat bilgilerini birleştir
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const start = new Date(startDate);
    start.setHours(startHour, startMinute, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(endHour, endMinute, 0, 0);
    
    onNavigate('payment', {
      equipment,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      rentalType,
      totalPrice: total,
      duration: rentalType === 'daily' ? `${days} gün` : `${hours} saat`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if ((equipment as any)._backPage === 'category-products') {
                  onNavigate('category-products', { categoryId: (equipment as any)._backCategoryId });
                } else {
                  onNavigate('equipment-detail', equipment);
                }
              }}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[#337f34]">Kiralama Tarihi</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Equipment Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex gap-4">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="text-[#337f34] line-clamp-1">{equipment.name}</h3>
            <p className="text-sm text-[#404040]">{equipment.category}</p>
          </div>
        </div>

        {/* Rental Type Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-[#337f34]">Kiralama Türü</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-[10px] cursor-pointer hover:bg-[#f5fff5]">
              <div>
                <div className="text-[#337f34]">Günlük</div>
                <div className="text-sm text-gray-500">₺{dailyPrice}/gün</div>
                <div className="text-xs text-gray-400 mt-1">Her 24 saatlik periyot için</div>
              </div>
              <input
                type="radio"
                name="rentalType"
                value="daily"
                checked={rentalType === 'daily'}
                onChange={() => setRentalType('daily')}
                className="w-5 h-5 accent-[#1dbc60]"
              />
            </label>
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-[10px] cursor-pointer hover:bg-[#f5fff5]">
              <div>
                <div className="text-[#337f34]">Saatlik</div>
                <div className="text-sm text-gray-500">₺{hourlyPrice}/saat</div>
                <div className="text-xs text-gray-400 mt-1">Her saat için</div>
              </div>
              <input
                type="radio"
                name="rentalType"
                value="hourly"
                checked={rentalType === 'hourly'}
                onChange={() => setRentalType('hourly')}
                className="w-5 h-5 accent-[#1dbc60]"
              />
            </label>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-[#337f34]">Başlangıç Tarihi ve Saati</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#404040] block mb-2">Başlangıç Tarihi</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full border border-gray-200 rounded-[10px] p-3 flex items-center gap-2 hover:bg-[#f5fff5] transition-colors">
                    <CalendarIcon className="w-5 h-5 text-[#54a43f]" />
                    <span className="flex-1 text-left text-[#404040]">
                      {startDate ? format(startDate, 'dd MMMM yyyy', { locale: tr }) : 'Tarih seçin'}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-0 shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || (endDate && date > endDate) || isDateDisabled(date)
                    }
                    locale={tr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm text-[#404040] block mb-2">Başlangıç Saati</label>
              <div className="border border-gray-200 rounded-[10px] p-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#54a43f]" />
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 outline-none text-[#404040]"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time} disabled={isTimeDisabled(startDate || new Date(), time)}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-[#337f34]">Bitiş Tarihi ve Saati</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-[#404040] block mb-2">Bitiş Tarihi</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="w-full border border-gray-200 rounded-[10px] p-3 flex items-center gap-2 hover:bg-[#f5fff5] transition-colors"
                    disabled={!startDate}
                  >
                    <CalendarIcon className="w-5 h-5 text-[#54a43f]" />
                    <span className="flex-1 text-left text-[#404040]">
                      {endDate ? format(endDate, 'dd MMMM yyyy', { locale: tr }) : 'Tarih seçin'}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-0 shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      !startDate || date < startDate || isDateDisabled(date)
                    }
                    locale={tr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm text-[#404040] block mb-2">Bitiş Saati</label>
              <div className="border border-gray-200 rounded-[10px] p-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#54a43f]" />
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 outline-none text-[#404040]"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time} disabled={isTimeDisabled(endDate || new Date(), time)}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Duration and Price Summary */}
        {startDate && endDate && total > 0 && (
          <div className="bg-[#f5fff5] rounded-2xl p-6 border-2 border-[#1dbc60] space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#1dbc60]/30">
              <div>
                <p className="text-sm text-[#404040]">Kiralama Süresi</p>
                <p className="text-[#337f34]">
                  {rentalType === 'daily' 
                    ? `${days} gün (${hours} saat)` 
                    : `${hours} saat`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#404040]">Toplam Tutar</p>
                {rentalType === 'daily' && (
                  <p className="text-xs text-gray-500">
                    {days} gün × ₺{dailyPrice}
                  </p>
                )}
                {rentalType === 'hourly' && (
                  <p className="text-xs text-gray-500">
                    {hours} saat × ₺{hourlyPrice}
                  </p>
                )}
              </div>
              <p className="text-2xl text-[#1dbc60]">₺{total.toLocaleString('tr-TR')}</p>
            </div>
            
            {rentalType === 'daily' && (
              <div className="bg-white/50 rounded-[10px] p-3 mt-2">
                <p className="text-xs text-[#404040]">
                  💡 Günlük kiralamada her 24 saatlik periyot 1 gün olarak hesaplanır. 
                  {hours % 24 > 0 && ` ${hours % 24} saatlik ek süre için bir günlük ücret daha eklenmiştir.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <Button
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
            onClick={handleContinue}
          >
            Devam Et
          </Button>
        </div>
      </div>
    </div>
  );
}