import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import RoleSelectionPage from './components/RoleSelectionPage';
import DashboardPage from './components/DashboardPage';
import CategoryBrowsePage from './components/CategoryBrowsePage';
import EquipmentDetailPage from './components/EquipmentDetailPage';
import RentalDatePage from './components/RentalDatePage';
import PaymentPage from './components/PaymentPage';
import RentalConfirmationPage from './components/RentalConfirmationPage';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import ProfileEditPage from './components/ProfileEditPage';
import ChatListPage from './components/ChatListPage';
import ChatPage from './components/ChatPage';
import ReviewUserPage from './components/ReviewUserPage';
import AddEquipmentPage from './components/AddEquipmentPage';
import MyListingsPage from './components/MyListingsPage';
import RentalsPage from './components/RentalsPage';
import CategoryProductsPage from './components/CategoryProductsPage';
import { Equipment, User } from './types';
import { supabase } from './utils/supabase/client';
import { Toaster } from 'sonner';
import { projectId, publicAnonKey } from './utils/supabase/info';

type Page = 
  | 'landing'
  | 'login' 
  | 'signup' 
  | 'role-selection' 
  | 'dashboard' 
  | 'categories'
  | 'browse'
  | 'equipment-detail' 
  | 'rental-date' 
  | 'payment' 
  | 'rental-confirmation'
  | 'notifications'
  | 'profile'
  | 'profile-edit'
  | 'chatlist'
  | 'chat'
  | 'review-user'
  | 'add-equipment'
  | 'my-listings'
  | 'rentals'
  | 'category-products';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [rentalData, setRentalData] = useState<any>(null);
  const [userRole, setUserRole] = useState<'farmer' | 'owner' | 'admin'>('farmer');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [browseCategory, setBrowseCategory] = useState<string | null>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
      }
    };
    checkSession();
  }, []);

  // Initialize categories on mount
  useEffect(() => {
    const initCategories = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/init-categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Categories initialization:', result.message);
      } catch (error) {
        console.error('Error initializing categories:', error);
      }
    };
    initCategories();
  }, []);

  // Initialize equipment on mount
  useEffect(() => {
    const initEquipment = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/init-equipment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Equipment initialization:', result.message);
      } catch (error) {
        console.error('Error initializing equipment:', error);
      }
    };
    initEquipment();
  }, []);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogin = async (token: string) => {
    setAccessToken(token);
    await fetchUserProfile(token);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: Page, data?: any) => {
    if (page === 'equipment-detail' && data) {
      setSelectedEquipment(data);
    } else if (page === 'rental-date' && data) {
      setSelectedEquipment(data);
    } else if (page === 'payment' && data) {
      setRentalData(data);
    } else if (page === 'rental-confirmation' && data) {
      setRentalData(data);
    } else if (page === 'browse') {
      setBrowseCategory(data?.category || null);
    } else if (page === 'chat' && data) {
      setChatData(data);
    } else if (page === 'review-user' && data) {
      setReviewData(data);
    } else if (page === 'category-products' && data) {
      setSelectedCategoryId(data.categoryId);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleRoleSelect = (role: 'farmer' | 'owner' | 'admin') => {
    setUserRole(role);
  };

  const handleUpdateProfile = async (userData: Partial<User> & { 
    tcNo?: string; 
    birthDate?: string; 
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7a7385c4/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        const error = await response.text();
        console.error('Error updating profile:', error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentPage === 'signup' && <SignUpPage onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentPage === 'role-selection' && (
            <RoleSelectionPage onNavigate={handleNavigate} onRoleSelect={handleRoleSelect} />
          )}
          {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {currentPage === 'categories' && <CategoryBrowsePage onNavigate={handleNavigate} />}
          {currentPage === 'browse' && (
            <DashboardPage 
              onNavigate={handleNavigate} 
              initialCategory={browseCategory}
              guestMode={true}
              onLoginRequest={() => handleNavigate('login')}
            />
          )}
          {currentPage === 'equipment-detail' && selectedEquipment && (
            <EquipmentDetailPage 
              equipment={selectedEquipment} 
              onNavigate={handleNavigate}
              guestMode={!accessToken}
              onLoginRequest={() => handleNavigate('login')}
              accessToken={accessToken}
              currentUserId={currentUser?.id}
            />
          )}
          {currentPage === 'rental-date' && selectedEquipment && (
            <RentalDatePage equipment={selectedEquipment} onNavigate={handleNavigate} />
          )}
          {currentPage === 'payment' && rentalData && (
            <PaymentPage rentalData={rentalData} onNavigate={handleNavigate} />
          )}
          {currentPage === 'rental-confirmation' && rentalData && (
            <RentalConfirmationPage rentalData={rentalData} onNavigate={handleNavigate} />
          )}
          {currentPage === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
          {currentPage === 'profile' && (
            <ProfilePage 
              onNavigate={handleNavigate} 
              userRole={userRole}
              currentUser={currentUser}
              onLogout={handleLogout}
              accessToken={accessToken}
            />
          )}
          {currentPage === 'profile-edit' && (
            <ProfileEditPage 
              onNavigate={handleNavigate} 
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
          {currentPage === 'chatlist' && currentUser && (
            <ChatListPage 
              onNavigate={handleNavigate}
              accessToken={accessToken}
              currentUserId={currentUser.id}
            />
          )}
          {currentPage === 'chat' && currentUser && chatData && (
            <ChatPage 
              onNavigate={handleNavigate}
              accessToken={accessToken}
              currentUserId={currentUser.id}
              chatId={chatData.chatId}
              equipmentId={chatData.equipmentId}
              equipmentName={chatData.equipmentName}
              ownerId={chatData.ownerId}
              ownerName={chatData.ownerName}
            />
          )}
          {currentPage === 'review-user' && (
            <ReviewUserPage 
              onNavigate={handleNavigate}
              currentUserId={currentUser?.id || null}
              accessToken={accessToken}
              reviewData={reviewData}
            />
          )}
          {currentPage === 'add-equipment' && (
            <AddEquipmentPage 
              onNavigate={handleNavigate}
              accessToken={accessToken}
            />
          )}
          {currentPage === 'my-listings' && (
            <MyListingsPage 
              onNavigate={handleNavigate}
              accessToken={accessToken}
            />
          )}
          {currentPage === 'rentals' && (
            <RentalsPage
              onNavigate={handleNavigate}
              accessToken={accessToken}
              currentUserId={currentUser?.id}
            />
          )}
          {currentPage === 'category-products' && selectedCategoryId && (
            <CategoryProductsPage
              onNavigate={handleNavigate}
              categoryId={selectedCategoryId}
            />
          )}
        </>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}