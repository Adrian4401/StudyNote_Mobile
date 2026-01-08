import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';

const mockChangeLanguage = jest.fn();
const mockChangeDarkMode = jest.fn();
const mockAlertDeleteAllData = jest.fn();

jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'pl',
    changeLanguage: mockChangeLanguage,
  }),
}));

jest.mock('../context/DarkModeContext', () => ({
  useDarkMode: () => ({
    darkMode: false,
    changeDarkMode: mockChangeDarkMode,
    theme: {
      textPrimary: '#000',
      textSecondary: '#555',
      secondary: '#fff',
      primary: '#ccc',
    },
  }),
}));

jest.mock('../components/Alerts', () => ({
  alertDeleteAllData: jest.fn(() => mockAlertDeleteAllData()),
}));

describe('SettingsScreen', () => {
  it('powinno wywołać alert o usunięciu wszystkich danych po naciśnięciu przycisku usuwania danych', () => {
    const { getByText } = render(<SettingsScreen />);

    const deleteDataButton = getByText('Usuń wszystkie dane');

    fireEvent.press(deleteDataButton);

    expect(mockAlertDeleteAllData).toHaveBeenCalledTimes(1);
  });
});
