// tests/AddSubjectScreen.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'


jest.mock('../context/DarkModeContext.js', () => ({
  useDarkMode: () => ({
    theme: {
      textPrimary: '#000',
      textSecondary: '#666',
      primary: '#aaa',
      secondary: '#bbb',
    },
  }),
}));

jest.mock('../context/LanguageContext.js', () => ({
  useLanguage: () => ({
    language: 'pl',  // UŻYWAMY POLSKIEGO
  }),
}));

jest.mock('../components/Buttons.js', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    GoBackButton: () => null,
    MakeButton: ({ onPress }) => {
      return (
        <Text onPress={onPress} testID="makeButtonTest">
          ADD
        </Text>
      );
    },
  };
});

jest.mock('../database/queries.js', () => ({
  loadSubjects: jest.fn(setSubjects => setSubjects([])),
  addSubject: jest.fn(),
}));

import AddSubjectScreen from '../screens/addScreens/AddSubjectScreen'
import { addSubject } from '../database/queries'

describe('AddSubjectScreen - test interfejsu (PL)', () => {
  it('powinien wyświetlać nagłówek i placeholder w polu tekstowym', () => {
    const { getByText, getByPlaceholderText } = render(<AddSubjectScreen />);
    expect(getByText('Dodaj Przedmioty')).toBeTruthy();
    expect(getByPlaceholderText('Dodaj przedmioty...')).toBeTruthy();
  });

  it('powinien wyświetlać informację, że lista przedmiotów jest pusta', () => {
    const { getByText } = render(<AddSubjectScreen />);
    expect(getByText('Nie masz jeszcze żadnych przedmiotów.')).toBeTruthy();
  });

  it('powinien wyświetlać przycisk MakeButton (zamockowany)', () => {
    const { getByText } = render(<AddSubjectScreen />);
    expect(getByText('ADD')).toBeTruthy();
  });

  it('powinien wywołać addSubject po wciśnięciu przycisku, gdy wpisano tekst', () => {
    const { getByPlaceholderText, getByText } = render(<AddSubjectScreen />);
    fireEvent.changeText(getByPlaceholderText('Dodaj przedmioty...'), 'Matematyka');
    fireEvent.press(getByText('ADD'));
    expect(addSubject).toHaveBeenCalledTimes(1);
  });
});
