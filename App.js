import { StackNavigation } from './src/navigation/StackNavigation';
import { Create } from './src/database/queries';
import { LanguageProvider } from './src/context/LanguageContext';
import { DarkModeProvider } from './src/context/DarkModeContext';
import { AuthProvider } from './src/context/AuthContext';
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
// import { loadEvents } from './database/queries';


export default function App() {
  
  console.log(DarkModeProvider);

  Create();
  enableScreens();
  // loadEvents()

  return (
    <AuthProvider>
      <LanguageProvider>
        <DarkModeProvider>
          <StackNavigation />
        </DarkModeProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}