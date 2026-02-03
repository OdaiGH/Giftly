import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CompleteProfileScreen } from './screens/CompleteProfileScreen';
import { HomeScreen } from './screens/HomeScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { CitySelectionScreen } from './screens/CitySelectionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CourierChatScreen } from './screens/CourierChatScreen';

type Screen = 'welcome' | 'login' | 'profile' | 'home' | 'budget' | 'citySelection' | 'userProfile' | 'courierChat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onNext={(phone) => setCurrentScreen('profile')} />;
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
        return <ProfileScreen onBack={() => setCurrentScreen('home')} isDarkMode={false} toggleDarkMode={() => {}} />;
      case 'courierChat':
        return <CourierChatScreen userRole="customer" onBack={() => setCurrentScreen('home')} onFinishOrder={() => {}} onShowInvoice={() => {}} />;
      default:
        return <WelcomeScreen onStart={() => setCurrentScreen('login')} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
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
