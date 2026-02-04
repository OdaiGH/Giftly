import React, { useState } from 'react';
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
import { CourierHomeScreen } from './screens/CourierHomeScreen';
import { CourierLoginScreen } from './screens/CourierLoginScreen';

type Screen = 'welcome' | 'login' | 'profile' | 'home' | 'budget' | 'citySelection' | 'userProfile' | 'courierChat' | 'courierLogin' | 'courierHome';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
        return <LoginScreen onNext={(phone) => {
          if (phone === '123') {
            setCurrentScreen('courierLogin');
          } else {
            setCurrentScreen('profile');
          }
        }} />;
      case 'profile':
        return <CompleteProfileScreen onNext={() => setCurrentScreen('home')} />;
      case 'home':
        return (
          <HomeScreen
            onNavigateProfile={() => setCurrentScreen('userProfile')}
            onNavigateCourier={() => setCurrentScreen('courierChat')}
            onStartOrder={() => setCurrentScreen('budget')}
            onShowInvoice={() => {}}
          />
        );
      case 'budget':
        return <BudgetScreen onNext={() => setCurrentScreen('citySelection')} onBack={() => setCurrentScreen('home')} />;
      case 'citySelection':
        return <CitySelectionScreen onNext={() => setCurrentScreen('courierChat')} onBack={() => setCurrentScreen('budget')} />;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
    direction: 'rtl',
  },
});

export default App;
