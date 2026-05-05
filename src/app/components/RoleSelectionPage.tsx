import { Tractor, Warehouse } from "lucide-react";
import { useState } from "react";

interface RoleSelectionPageProps {
  onNavigate: (page: string) => void;
  onRoleSelect: (role: 'farmer' | 'owner') => void;
}

export default function RoleSelectionPage({ onNavigate, onRoleSelect }: RoleSelectionPageProps) {
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'owner' | null>(null);

  const handleRoleSelection = (role: 'farmer' | 'owner') => {
    setSelectedRole(role);
    onRoleSelect(role);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff5] to-[#f9faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-[#337f34]">Hoş Geldiniz!</h2>
          <p className="text-[#404040]">Lütfen rolünüzü seçin</p>
        </div>

        <div className="space-y-4">
          {/* Farmer Card */}
          <button
            onClick={() => handleRoleSelection('farmer')}
            className={`w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
              selectedRole === 'farmer' ? 'ring-2 ring-[#1dbc60]' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#1dbc60] p-3 rounded-xl">
                <Tractor className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-[#337f34] mb-2">Çiftçi</h3>
                <p className="text-[#404040] text-sm">
                  Tarla işleriniz için ihtiyacınız olan traktör, biçerdöver ve diğer ekipmanları kolayca kiralayın.
                </p>
              </div>
            </div>
          </button>

          {/* Equipment Owner Card */}
          <button
            onClick={() => handleRoleSelection('owner')}
            className={`w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
              selectedRole === 'owner' ? 'ring-2 ring-[#1dbc60]' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#54a43f] p-3 rounded-xl">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-[#337f34] mb-2">Ekipman Sahibi</h3>
                <p className="text-[#404040] text-sm">
                  Kullanmadığınız tarım ekipmanlarınızı kiraya vererek gelir elde edin ve diğer çiftçilere yardımcı olun.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
