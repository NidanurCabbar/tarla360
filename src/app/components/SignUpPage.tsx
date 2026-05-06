import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import logo from '../../assets/logo.svg';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
  onLogin?: (token: string) => void;
}

export default function SignUpPage({ onNavigate, onLogin }: SignUpPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tcNo, setTcNo] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const birthDate = formData.get('birthDate') as string;

    // TC Kimlik No kontrolü
    if (tcNo.length !== 11) {
      setError('TC Kimlik No 11 haneli olmalıdır');
      setLoading(false);
      return;
    }

    // Doğum tarihi kontrolü - 18 yaş sınırı
    const selectedDate = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      setError('18 yaşından küçükler kayıt olamaz');
      setLoading(false);
      return;
    }

    // Telefon kontrolü
    if (phone.length !== 10) {
      setError('Cep telefonu 10 haneli olmalıdır');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting signup for:', email);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            role,
            tcNo,
            birthDate,
            phone
          })
        }
      );

      const data = await response.json();
      console.log('Signup response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt işlemi başarısız oldu');
      }
      
      console.log('Signup successful, user created:', data.user?.id);

      // Show success message
      setSuccess('Hesabınız başarıyla oluşturuldu! Giriş yapılıyor...');
      
      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Auto-login after successful signup
      try {
        const { supabase } = await import("../utils/supabase/client");
        
        // Add a small delay to ensure Supabase auth is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('Auto-login error:', signInError);
          setSuccess('Hesabınız oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          onNavigate('login');
        } else if (!signInData.session) {
          console.error('No session returned after login');
          setSuccess('Hesabınız oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          onNavigate('login');
        } else {
          // Successfully logged in
          console.log('Auto-login successful');
          if (onLogin) {
            onLogin(signInData.session.access_token);
          }
          setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
          await new Promise(resolve => setTimeout(resolve, 500));
          onNavigate('dashboard');
        }
      } catch (loginErr) {
        console.error('Auto-login exception:', loginErr);
        setSuccess('Hesabınız oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        onNavigate('login');
      }

    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (err.message.includes('already registered')) {
        errorMessage = 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.';
      } else if (err.message.includes('invalid email')) {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] p-4">
      <div className="w-full max-w-[390px] mx-auto space-y-6 pt-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center">
              <img src={logo} alt="Tarla360 Logo" className="w-32 h-32 object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-[#337f34] mb-2">Tarla360</h1>
            <p className="text-[#404040]">Hesap oluşturun</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[#337f34]">Kayıt Formu</h2>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="bg-white rounded-2xl p-6 shadow-lg space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[10px] text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-[10px] text-sm">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="firstName">Ad</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Adınız"
              className="rounded-[10px]"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Soyadınız"
              className="rounded-[10px]"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              className="rounded-[10px]"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="En az 6 karakter"
              className="rounded-[10px]"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Rol Seçimi</Label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-[10px] cursor-pointer hover:bg-[#f5fff5] transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  defaultChecked
                  className="w-5 h-5 accent-[#1dbc60]"
                />
                <div>
                  <div className="text-[#337f34]">Çiftçi</div>
                  <div className="text-sm text-gray-500">Ekipman kiralamak istiyorum</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-[10px] cursor-pointer hover:bg-[#f5fff5] transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  className="w-5 h-5 accent-[#1dbc60]"
                />
                <div>
                  <div className="text-[#337f34]">Ekipman Sahibi</div>
                  <div className="text-sm text-gray-500">Ekipmanımı kiraya vermek istiyorum</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-[10px] cursor-pointer hover:bg-[#f5fff5] transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  className="w-5 h-5 accent-[#337f34]"
                />
                <div>
                  <div className="text-[#337f34]">Yönetici</div>
                  <div className="text-sm text-gray-500">Platform yönetim yetkisi</div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tcNo">TC Kimlik No</Label>
            <Input
              id="tcNo"
              name="tcNo"
              type="text"
              placeholder="11 haneli TC Kimlik No"
              className="rounded-[10px]"
              required
              disabled={loading}
              value={tcNo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                setTcNo(value);
              }}
              maxLength={11}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Doğum Tarihi</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              className="rounded-[10px]"
              required
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Cep Telefonu</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="5XXXXXXXXX (10 haneli)"
              className="rounded-[10px]"
              required
              disabled={loading}
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(value);
              }}
              maxLength={10}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydol'}
          </Button>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Zaten hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-[#1dbc60] hover:underline"
                disabled={loading}
              >
                Giriş Yapın
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}