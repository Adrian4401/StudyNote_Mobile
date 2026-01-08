import { React } from 'react';

import { StackNavigation } from './navigation/StackNavigation';

import { Create } from './database/queries';

import { LanguageProvider } from './context/LanguageContext';
import { DarkModeProvider } from './context/DarkModeContext';

import { enableScreens } from 'react-native-screens';

import { loadEvents } from './database/queries';


export default function App() {

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