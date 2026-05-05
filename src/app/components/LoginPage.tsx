import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tractor, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import logo from 'figma:asset/a7c8485a90b31eee24e29b1603b4a323d8c17b9c.png';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (token: string) => void;
}

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize admin account on component mount (silently)
  useEffect(() => {
    const initAdmin = async () => {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/init-admin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
      } catch (err) {
        // Silently fail - admin account may already exist
      }
    };

    initAdmin();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      console.log('Attempting login with email:', email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Login response:', { 
        hasData: !!data, 
        hasSession: !!data?.session, 
        hasError: !!signInError,
        error: signInError 
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!data.session) {
        throw new Error('Oturum oluşturulamadı');
      }

      console.log('Login successful, navigating to dashboard');
      onLogin(data.session.access_token);
      onNavigate('dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('E-posta veya şifre hatalı. Henüz kayıt olmadıysanız lütfen önce kayıt olun.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('E-posta adresiniz doğrulanmamış.');
      } else {
        setError(err.message || 'Giriş yapılamadı. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] space-y-8">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="text-[#337f34] hover:bg-[#337f34]/10 p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[#337f34]">Giriş Yap</h2>
        </div>

        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center">
              <img src={logo} alt="TarlaApp Logo" className="w-32 h-32 object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-[#337f34] mb-2">TarlaApp</h1>
            <p className="text-[#404040]">Hesabınıza giriş yapın</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[10px] text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <div className="font-medium mb-1">Giriş Başarısız</div>
                  <div>{error}</div>
                </div>
              </div>
            </div>
          )}

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
              placeholder="••••••••"
              className="rounded-[10px]"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1dbc60] hover:bg-[#54a43f] text-white rounded-[10px]"
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500">
                Henüz hesabınız yok mu?
              </p>
              <Button
                type="button"
                className="w-full bg-[#337f34] hover:bg-[#4d8c38] text-white rounded-[10px] shadow-md"
                onClick={() => onNavigate('signup')}
              >
                🌾 Ücretsiz Hesap Oluştur
              </Button>
              <p className="text-xs text-gray-400">
                Kayıt olmak ücretsizdir ve sadece 1 dakika sürer
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-full text-[#54a43f] text-sm hover:underline"
            onClick={() => alert('Şifre sıfırlama özelliği yakında eklenecek')}
          >
            Şifremi unuttum
          </button>
        </form>
      </div>
    </div>
  );
}