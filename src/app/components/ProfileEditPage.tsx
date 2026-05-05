import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { User as UserType } from "../types";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface ProfileEditPageProps {
  onNavigate: (page: string) => void;
  currentUser: UserType | null;
  onUpdateProfile: (userData: Partial<UserType> & { 
    tcNo?: string; 
    birthDate?: string; 
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => void;
}

export default function ProfileEditPage({ onNavigate, currentUser, onUpdateProfile }: ProfileEditPageProps) {
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [tcNo, setTcNo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    // Zorunlu alan kontrolleri
    if (!firstName.trim()) {
      toast.error('Ad alanı zorunludur');
      return;
    }

    if (!lastName.trim()) {
      toast.error('Soyad alanı zorunludur');
      return;
    }

    if (!email.trim()) {
      toast.error('E-posta alanı zorunludur');
      return;
    }

    if (!tcNo.trim()) {
      toast.error('TC Kimlik No alanı zorunludur');
      return;
    }

    if (!birthDate) {
      toast.error('Doğum tarihi alanı zorunludur');
      return;
    }

    if (!phone.trim()) {
      toast.error('Cep telefonu alanı zorunludur');
      return;
    }

    // TC Kimlik No kontrolü (11 haneli olmalı)
    if (tcNo.length !== 11) {
      toast.error('TC Kimlik No 11 haneli olmalıdır');
      return;
    }

    // Doğum tarihi kontrolü
    const selectedDate = new Date(birthDate);
    const today = new Date();
    if (selectedDate > today) {
      toast.error('Doğum tarihi gelecekte olamaz');
      return;
    }

    // Yaş kontrolü (18 yaşından küçük olamaz)
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      toast.error('18 yaşından küçükler kayıt olamaz');
      return;
    }

    // Telefon kontrolü (10 haneli olmalı)
    if (phone.length !== 10) {
      toast.error('Cep telefonu 10 haneli olmalıdır');
      return;
    }

    // Şifre değiştirme kontrolü
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error('Şifre değiştirmek için mevcut şifrenizi girmelisiniz');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Yeni şifre ve onay şifresi eşleşmiyor');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('Yeni şifre en az 6 karakter olmalıdır');
        return;
      }
    }

    const updateData: Partial<UserType> & {
      tcNo?: string;
      birthDate?: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      firstName,
      lastName,
      email,
      tcNo,
      birthDate,
      phone,
    };

    if (currentPassword && newPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    onUpdateProfile(updateData);
    toast.success('Profil bilgileriniz güncellendi');
    setTimeout(() => onNavigate('profile'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[#337f34]">Profil Bilgilerini Düzenle</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto px-4 py-6 space-y-6">
        {/* Kişisel Bilgiler */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-[#337f34] mb-4">Kişisel Bilgiler</h3>
          
          <div>
            <label className="text-sm text-[#404040] mb-2 block">Ad *</label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Adınızı girin"
              className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60]"
            />
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">Soyad *</label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Soyadınızı girin"
              className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60]"
            />
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">TC Kimlik No *</label>
            <Input
              type="text"
              value={tcNo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                setTcNo(value);
              }}
              placeholder="11 haneli TC Kimlik No"
              maxLength={11}
              className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60]"
            />
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">Doğum Tarihi *</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60]"
            />
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">Cep Telefonu *</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(value);
              }}
              placeholder="5XXXXXXXXX (10 haneli)"
              maxLength={10}
              className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60]"
            />
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">E-Posta Adresi *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60]"
            />
          </div>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-[#337f34] mb-4">Şifre Değiştirme</h3>
          
          <div>
            <label className="text-sm text-[#404040] mb-2 block">Mevcut Şifre</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mevcut şifrenizi girin"
                className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#337f34]"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">Yeni Şifre</label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifrenizi girin (min. 6 karakter)"
                className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#337f34]"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#404040] mb-2 block">Yeni Şifre (Tekrar)</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Yeni şifrenizi tekrar girin"
                className="rounded-[10px] border-gray-300 focus:border-[#1dbc60] focus:ring-[#1dbc60] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#337f34]"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            * Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakabilirsiniz
          </p>
        </div>

        {/* Kaydet Butonu */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
          >
            Değişiklikleri Kaydet
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('profile')}
            className="w-full border-gray-300 text-[#404040] hover:bg-gray-50 rounded-[10px]"
          >
            İptal
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          * işaretli alanlar zorunludur
        </p>
      </div>
    </div>
  );
}