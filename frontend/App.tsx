import React, { useState, createContext, useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CompleteProfileScreen } from './screens/CompleteProfileScreen';
import { HomeScreen } from './screens/HomeScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { CitySelectionScreen } from './screens/CitySelectionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CourierChatScreen } from './screens/CourierChatScreen';
import { CustomerChatScreen } from './screens/CustomerChatScreen';
import { SearchingExpertScreen } from './screens/SearchingExpertScreen';
import { CourierHomeScreen } from './screens/CourierHomeScreen';
import { CourierLoginScreen } from './screens/CourierLoginScreen';
import { InvoiceScreen } from './screens/InvoiceScreen';

type Screen = 'welcome' | 'login' | 'profile' | 'home' | 'budget' | 'citySelection' | 'userProfile' | 'courierChat' | 'customerChat' | 'searchingExpert' | 'courierLogin' | 'courierHome' | 'invoice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Auth Context
interface UserData {
  id: number;
  phone_number: string;
  email: string;
  name: string;
  date_of_birth: string | null;
  is_verified: boolean;
}

interface AuthContextType {
  token: string | null;
  phone: string | null;
  userData: UserData | null;
  login: (token: string, phone: string) => void;
  logout: () => void;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = (newToken: string, newPhone: string) => {
    setToken(newToken);
    setPhone(newPhone);
    // Fetch user data when logging in
    fetchUserData(newToken);
  };

  const logout = () => {
    setToken(null);
    setPhone(null);
    setUserData(null);
  };

  const fetchUserData = async (authToken?: string) => {
    const currentToken = authToken || token;
    if (!currentToken) return;

    try {
      const { getUserDetails } = await import('./api');
      const data = await getUserDetails(currentToken);
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, phone, userData, login, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authData, setAuthData] = useState<{ phone: string; otp?: string; token?: string } | null>(null);
  const [orderData, setOrderData] = useState<{ description?: string; cityId?: number; deliveryDate?: Date } | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [initialHomeTab, setInitialHomeTab] = useState<'home' | 'orders'>('home');
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const { login } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme colors based on dark mode
  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFC',
    textColor: isDarkMode ? '#FFFFFF' : '#1F2937',
    secondaryTextColor: isDarkMode ? '#9CA3AF' : '#6B7280',
    cardBackground: isDarkMode ? '#1F2937' : 'white',
    borderColor: isDarkMode ? '#374151' : '#F3F4F6',
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onNext={(result) => {
          if (result.phone === '123') {
            setCurrentScreen('courierLogin');
          } else if (result.needsProfile) {
            setAuthData({ phone: result.phone, otp: result.otp });
            setCurrentScreen('profile');
          } else if (result.token) {
            login(result.token, result.phone);
            setCurrentScreen('home');
          }
        }} />;
      case 'profile':
        return <CompleteProfileScreen
          phone={authData?.phone || ''}
          otp={authData?.otp || ''}
          onNext={(token) => {
            login(token, authData?.phone || '');
            setCurrentScreen('home');
          }}
        />;
      case 'home':
        return (
          <HomeScreen
            onNavigateProfile={() => setCurrentScreen('userProfile')}
            onNavigateCourier={() => setCurrentScreen('courierChat')}
            onStartOrder={() => setCurrentScreen('budget')}
            onShowInvoice={(orderId) => {
              setPreviousScreen('home');
              setSelectedOrderId(orderId.toString());
              setCurrentScreen('invoice');
            }}
            onNavigateToOrderChat={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentScreen('customerChat');
            }}
            initialTab={initialHomeTab}
          />
        );
      case 'budget':
        return <BudgetScreen
          onNext={(description, deliveryDate) => {
            setOrderData({ description, deliveryDate });
            setCurrentScreen('citySelection');
          }}
          onBack={() => setCurrentScreen('home')}
        />;
      case 'citySelection':
        return <CitySelectionScreen
          onNext={(orderId) => {
            setSelectedOrderId(orderId);
            setCurrentScreen('searchingExpert');
          }}
          onBack={() => setCurrentScreen('budget')}
          orderData={orderData || undefined}
        />;
      case 'userProfile':
        return <ProfileScreen
          onBack={() => setCurrentScreen('home')}
          onLogout={() => setCurrentScreen('welcome')}
          onNavigateHome={() => setCurrentScreen('home')}
          onNavigateOrders={() => setCurrentScreen('home')} // Navigate to home with orders tab
          onNavigateCourier={() => setCurrentScreen('courierChat')}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          theme={theme}
        />;
      case 'courierChat':
        return <CourierChatScreen userRole="customer" onBack={() => setCurrentScreen('home')} onFinishOrder={() => {}} onShowInvoice={() => {}} />;
      case 'customerChat':
        return <CustomerChatScreen
          orderId={selectedOrderId}
          onShowInvoice={(orderId) => {
            setPreviousScreen('customerChat');
            setSelectedOrderId(orderId.toString());
            setCurrentScreen('invoice');
          }}
          onBack={() => {
            setInitialHomeTab('orders');
            setCurrentScreen('home');
          }}
        />;
      case 'searchingExpert':
        console.log('App.tsx: Rendering SearchingExpertScreen with orderId =', selectedOrderId);
        return <SearchingExpertScreen
          orderId={selectedOrderId || ''}
          onNavigateToChat={(orderId) => {
            console.log('App.tsx: SearchingExpertScreen onNavigateToChat called with orderId =', orderId);
            setSelectedOrderId(orderId);
            setCurrentScreen('customerChat');
          }}
        />;
      case 'courierLogin':
        return <CourierLoginScreen onNext={() => setCurrentScreen('courierHome')} onBack={() => setCurrentScreen('login')} />;
      case 'courierHome':
        return <CourierHomeScreen
          onLogout={() => setCurrentScreen('welcome')}
          onAcceptOrder={() => {}}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          theme={theme}
        />;
      case 'invoice':
        return <InvoiceScreen
          orderId={parseInt(selectedOrderId || '0')}
          onBack={() => {
            if (previousScreen === 'customerChat') {
              setCurrentScreen('customerChat');
            } else if (previousScreen === 'home') {
              setInitialHomeTab('orders');
              setCurrentScreen('home');
            } else {
              setCurrentScreen(previousScreen);
            }
          }}
        />;
      default:
        return <WelcomeScreen onStart={() => setCurrentScreen('login')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
    direction: 'rtl',
  },
});

export default App;
