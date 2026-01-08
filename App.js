import { StackNavigation } from './src/navigation/StackNavigation';

import { Create } from './src/database/queries';

import { LanguageProvider } from './src/context/LanguageContext';
import { DarkModeProvider } from './src/context/DarkModeContext';

import { enableScreens } from 'react-native-screens';

import { loadEvents } from './database/queries';


export default function App() {
  console.log(DarkModeProvider);

  Create();
  enableScreens();
  // loadEvents()

  return (
    <LanguageProvider>
      <DarkModeProvider>

        <StackNavigation />
        
      </DarkModeProvider>
    </LanguageProvider>
  )
}