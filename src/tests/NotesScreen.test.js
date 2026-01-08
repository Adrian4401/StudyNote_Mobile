import React from 'react';
import { render } from '@testing-library/react-native';
import NotesScreen from '../screens/NotesScreen';

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

jest.mock('../context/DarkModeContext', () => ({
  useDarkMode: () => ({
    theme: {
      textPrimary: '#000',
      textSecondary: '#555',
      secondary: '#fff',
      primary: '#ccc',
    },
  }),
}));

jest.mock('../database/queries.js', () => ({
  selectAllNotesWithSubjects: jest.fn((setSubjects, setData) => {
    setSubjects([{ subject_id: 1, subject_name: 'Math' }]);
    setData([
      { note_id: 1, title: 'Note 1', subject_name: 'Math', class_name: 'Class A', create_day: '2023-01-01' },
    ]);
  }),
  selectChosenNotes: jest.fn(),
}));

describe('NotesScreen', () => {
  beforeEach(() => {
    mockNavigation.addListener.mockClear();
  });

  it('wypisywanie wszystkich notatek', async () => {
    const { findByText } = render(<NotesScreen />);

    const focusCallback = mockNavigation.addListener.mock.calls.find(
      (call) => call[0] === 'focus'
    )?.[1];
    if (focusCallback) focusCallback();

    const noteTitle = await findByText('Note 1');
    expect(noteTitle).toBeTruthy();
  });
});
