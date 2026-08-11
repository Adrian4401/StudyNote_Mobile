const appLanguage = {
    pl: {
        // GENERAL
        add: 'Dodaj',
        edit: 'Edytuj',
        cancel: 'Anuluj',
        delete: 'Usuń',
        subject: 'Przedmiot',
        subjects: 'Przedmioty',
        classes: 'Zajęcia',
        note: 'Notatka',
        note_2: 'Notatkę',
        notes: 'Notatki',
        event: 'Wydarzenie',
        events: 'Wydarzenia',
        goBack: 'Wróć',
        chooseSubject: 'Wybierz przedmiot',
        chooseClasses: 'Wybierz zajęcia',
        day: 'Dzień',
        hour: 'Godzina',
        welcome: 'Witaj',

        // AUTH SCREEN
        loginTitle: 'Logowanie',
        registerTitle: 'Rejestracja',
        usernamePlaceholder: 'Nazwa użytkownika',
        emailPlaceholder: 'Adres e-mail',
        passwordPlaceholder: 'Hasło',
        repeatPasswordPlaceholder: 'Powtórz hasło',
        loginButton: 'Zaloguj się',
        registerButton: 'Zarejestruj się',
        haveAccountText: 'Masz już konto?',
        noAccountText: 'Nie masz konta?',

        // CALENDAR SCREEN
        calendarScreenTitle: 'Terminarz',
        emptyEventsText: 'Nie ma jeszcze żadnych wydarzeń',
        thisWeekEventsText: 'Zbliżające się terminy',
        thisWeekEventsLittleText: 'najbliższe 7 dni',
        futureEventsText: 'Dalsze terminy',
        olderEventsText: 'Archiwalne',
        todayDate: 'Dziś jest',

        // NOTES SCREEN
        notesScreentitle: 'Notatnik',
        yourNotesHeadline: 'Twoje notatki', 
        emptyNotesText: 'Nie ma jeszcze żadnych notatek',
        chooseSubjectDropdownPlaceholder: 'Wybierz przedmiot',
        created: 'Utworzono',
        fixWithAI: 'Ulepsz z AI',
        showAllNotes: 'Pokaż wszystkie notatki',

        // MANAGE SCREEN
        manageScreenTitle: 'Zarządzanie',
        subjectSectionHeadline: 'Przedmioty',
        classesSectionHeadline: 'Rodzaj zajęć',

        // SETTINGS SCREEN
        settingsScreenTitle: 'Ustawienia',
        languageText: 'Język',
        themeText: 'Motyw aplikacji',
        dark: 'Ciemny',
        light: 'Jasny',
        dataText: 'Dane',
        dataExportButton: 'Eksport danych',
        dataImportButton: 'Import danych',
        deleteDataText: 'Usuwanie danych aplikacji',
        deleteDataButton: 'Usuń wszystkie dane',
        userSection: 'Użytkownik',
        logoutButton: 'Wyloguj się',


        // ADD SUBJECT SCREEN
        emptySubjectsInfo: 'Nie masz jeszcze żadnych przedmiotów',
        addSubjectsPlaceholder: 'Dodaj przedmioty...',
        yourSubjects: 'Twoje przedmioty',

        // ADD CLASS SCREEN
        emptyClassesInfo: 'Nie masz jeszcze żadnych zajęć',
        addClassesPlaceholder: 'Dodaj zajęcia...',
        yourClasses: 'Twoje zajęcia',

        // ADD NOTE SCREEN
        noteTitlePlaceholder: 'Dodaj tytuł notatki...',
        addNotePlaceholder: 'Dodaj notatkę...',
        writeOrDictateNote: 'Napisz lub podyktuj notatkę',
        speechListening: 'Słucham...',
        savingNote: 'Zapisuję notatkę...',
        SPEECH_TO_TEXT_ERROR: 'Nie udało się rozpoznać mowy',
        MISSING_FIELDS: 'Wszystkie pola muszą być uzupełnione',

        // ADD EVENT SCREEN
        eventTitlePlaceholder: 'Dodaj tytuł wydarzenia...',
        addDescriptionPlaceholder: 'Dodaj krótki opis...',
        chooseDeadline: 'Wybierz termin',
        choosenDeadline: 'Wybrany termin',

        // READ EVENT SCREEN
        attachedNotes: 'Dołączone notatki',

        // REVIEW SCREEN
        reviewScreenTitle: 'Analiza AI',
        reviewDesc: 'Twój agent właśnie pracuje nad ulepszeniem Twojej notatki',
        reviewInfo1: 'Analizuję treść notatki...',
        reviewInfo2: 'Szukam niejasnych fragmentów...',
        reviewInfo3: 'Przygotowuję poprawioną wersję...',
        reviewSummary: 'Podsumowanie',
        reviewWorthAdd: 'Co warto dopisać',
        reviewUnclear: 'Co jest niejasne',
        reviewRevisedNote: 'Poprawiona wersja',

        // TESTS SCREEN
        testGeneratorTitle: 'Generator testu',
        chooseNotes: 'Wybierz notatki',
        chooseSubjectFirst: 'Najpierw wybierz przedmiot',
        emptySubjectNotes: 'Brak notatek dla tego przedmiotu',
        loadingData: 'Ładowanie danych...',
        questionsCount: 'Liczba pytań',
        questionTypesText: 'Rodzaje pytań',
        generatingTest: 'Generuję test...',
        trueFalseQuestionType: 'Prawda / fałsz',
        singleChoiceQuestionType: 'Jednokrotny wybór',
        multipleChoiceQuestionType: 'Wielokrotny wybór',
        openQuestionType: 'Otwarte',

        // GENERATED TEST SCREEN
        testTitle: 'Test',
        solveTest: 'Rozwiąż test',
        openQuestionTypeLong: 'Pytanie otwarte',
        enterAnswerPlaceholder: 'Wpisz odpowiedź...',
        checkingOpenAnswers: 'Sprawdzam odpowiedzi otwarte...',
        trueAnswer: 'Prawda',
        falseAnswer: 'Fałsz',

        // TEST SUMMARY SCREEN
        testResultTitle: 'Wynik testu',
        resultText: 'Wynik',
        answersText: 'Odpowiedzi',
        questionText: 'Pytanie',
        yourAnswer: 'Twoja odpowiedź',
        correctAnswer: 'Poprawna odpowiedź',
        expectedAnswer: 'Oczekiwana odpowiedź',
        aiScore: 'Ocena AI',
        noAnswer: 'Brak odpowiedzi',
        noScore: 'Brak oceny',
        explanation: 'Wyjaśnienie',
        correct: 'Poprawna',
        incorrect: 'Błędna',
        pointsShort: 'pkt',
        openQuestionsCheckedByAI: 'Pytania otwarte zostały ocenione przez AI.',
        generateNextTest: 'Wygeneruj kolejny test',
        TEST_MISSING_FIELDS: 'Wybierz przedmiot, notatki oraz przynajmniej jeden typ pytania',



        // ALERTS

        // DELETE SUBJECT
        deletingSubject: 'Usuwanie przedmiotu',
        deleteSubjectQuestion: 'Czy na pewno chcesz usunąć wybrany przedmiot?',

        // DELETE CLASS
        deletingClass: 'Usuwanie zajęcia',
        deleteClassQuestion: 'Czy na pewno chcesz usunąć wybrane zajęcie?',

        // DELETE NOTE
        deletingNote: 'Usuwanie notatki',
        deleteNoteQuestion: 'Czy na pewno chcesz usunąć wybraną notatkę?',

        // DELETE EVENT
        deletingEvent: 'Usuwanie wydarzenia',
        deleteEventQuestion: 'Czy na pewno chcesz usunąć wybrane wydarzenie?',

        // DELETE ALL DATA
        deletingData: 'Usuwanie danych',
        deleteDataQuestion: 'Czy na pewno chcesz usunąć wszystkie dane?',



        // ERRORS

        // AUTH
        USER_NOT_FOUND: 'Nie znaleziono użytkownika',
        INVALID_PASSWORD: 'Nieprawidłowe hasło',
        MISSING_LOGIN_FIELDS: 'Podaj email lub nazwę użytkownika oraz hasło',
        UNKNOWN_ERROR: 'Wystąpił nieznany błąd'

    },
    en: {
        // GENERAL
        add: 'Add',
        edit: 'Edit',
        cancel: 'Cancel',
        delete: 'Delete',
        subject: 'Subject',
        subjects: 'Subjects',
        classes: 'Classes',
        note: 'Note',
        note_2: 'Note',
        notes: 'Notes',
        event: 'Event',
        events: 'Events',
        goBack: 'Go Back',
        chooseSubject: 'Choose subject',
        chooseClasses: 'Choose classes',
        day: 'Day',
        hour: 'Hour',
        welcome: 'Hello',

        // AUTH SCREEN
        loginTitle: 'Login',
        registerTitle: 'Register',
        usernamePlaceholder: 'Username',
        emailPlaceholder: 'Email address',
        passwordPlaceholder: 'Password',
        repeatPasswordPlaceholder: 'Repeat password',
        loginButton: 'Login',
        registerButton: 'Register',
        haveAccountText: 'Already have an account?',
        noAccountText: "Don't have an account?",

        // CALENDAR SCREEN
        calendarScreenTitle: 'Calendar',
        emptyEventsText: 'No events yet',
        thisWeekEventsText: 'Upcoming deadlines',
        thisWeekEventsLittleText: 'next 7 days',
        futureEventsText: 'Future deadlines',
        olderEventsText: 'Archived',
        todayDate: 'Today is',

        // NOTES SCREEN
        notesScreentitle: 'Notebook',
        yourNotesHeadline: 'Your notes', 
        emptyNotesText: 'No notes yet',
        chooseSubjectDropdownPlaceholder: 'Choose subject',
        created: 'Created',
        fixWithAI: 'Enhance with AI',
        showAllNotes: 'Show all notes',

        // MANAGE SCREEN
        manageScreenTitle: 'Management',
        subjectSectionHeadline: 'Subjects',
        classesSectionHeadline: 'Class types',

        // SETTINGS SCREEN
        settingsScreenTitle: 'Settings',
        languageText: 'Language',
        themeText: 'App theme',
        dark: 'Dark',
        light: 'Light',
        dataText: 'Data',
        dataExportButton: 'Data export',
        dataImportButton: 'Data import',
        deleteDataText: 'Delete app data',
        deleteDataButton: 'Delete all data',
        userSection: 'User',
        logoutButton: 'Log out',



        // ADD SUBJECT SCREEN
        emptySubjectsInfo: 'You have no subjects yet',
        addSubjectsPlaceholder: 'Add subjects...',
        yourSubjects: 'Your subjects',

        // ADD CLASS SCREEN
        emptyClassesInfo: 'You have no classes yet',
        addClassesPlaceholder: 'Add classes...',
        yourClasses: 'Your classes',

        // ADD NOTE SCREEN
        noteTitlePlaceholder: 'Add note title...',
        addNotePlaceholder: 'Add note...',
        writeOrDictateNote: 'Write or dictate a note',
        speechListening: 'Listening...',
        savingNote: 'Saving note...',
        SPEECH_TO_TEXT_ERROR: 'Could not recognize speech',
        MISSING_FIELDS: 'All fields are required',

        // ADD EVENT SCREEN
        eventTitlePlaceholder: 'Add event title...',
        addDescriptionPlaceholder: 'Add brief description...',
        chooseDeadline: 'Choose deadline',
        choosenDeadline: 'Chosen deadline',

        // READ EVENT SCREEN
        attachedNotes: 'Attached notes',

        // REVIEW SCREEN
        reviewScreenTitle: 'AI Analysis',
        reviewDesc: 'Your agent is currently working on improving your note.',
        reviewInfo1: 'Analyzing the note content...',
        reviewInfo2: 'Looking for unclear passages...',
        reviewInfo3: 'Preparing an improved version...',
        reviewSummary: 'Summary',
        reviewWorthAdd: 'What to add',
        reviewUnclear: 'What is unclear',
        reviewRevisedNote: 'Revised version',

        // TESTS SCREEN
        testGeneratorTitle: 'Test generator',
        chooseNotes: 'Choose notes',
        chooseSubjectFirst: 'Choose a subject first',
        emptySubjectNotes: 'No notes for this subject',
        loadingData: 'Loading data...',
        questionsCount: 'Number of questions',
        questionTypesText: 'Question types',
        generatingTest: 'Generating test...',
        trueFalseQuestionType: 'True / false',
        singleChoiceQuestionType: 'Single choice',
        multipleChoiceQuestionType: 'Multiple choice',
        openQuestionType: 'Open',
        
        // GENERATED TEST SCREEN
        testTitle: 'Test',
        solveTest: 'Solve the test',
        openQuestionTypeLong: 'Open question',
        enterAnswerPlaceholder: 'Enter your answer...',
        checkingOpenAnswers: 'Checking open answers...',
        trueAnswer: 'True',
        falseAnswer: 'False',

        // TEST SUMMARY SCREEN
        testResultTitle: 'Test result',
        resultText: 'Result',
        answersText: 'Answers',
        questionText: 'Question',
        yourAnswer: 'Your answer',
        correctAnswer: 'Correct answer',
        expectedAnswer: 'Expected answer',
        aiScore: 'AI score',
        noAnswer: 'No answer',
        noScore: 'No score',
        explanation: 'Explanation',
        correct: 'Correct',
        incorrect: 'Incorrect',
        pointsShort: 'pts',
        openQuestionsCheckedByAI: 'Open questions were evaluated by AI.',
        generateNextTest: 'Generate another test',
        TEST_MISSING_FIELDS: 'Choose a subject, notes and at least one question type',



        // ALERTS

        // DELETE SUBJECT
        deletingSubject: 'Deleting subject',
        deleteSubjectQuestion: 'Are you sure you want to delete the selected subject?',

        // DELETE CLASS
        deletingClass: 'Deleting class',
        deleteClassQuestion: 'Are you sure you want to delete the selected class?',

        // DELETE NOTE
        deletingNote: 'Deleting note',
        deleteNoteQuestion: 'Are you sure you want to delete the selected note?',

        // DELETE EVENT
        deletingEvent: 'Deleting event',
        deleteEventQuestion: 'Are you sure you want to delete the selected event?',

        // DELETE ALL DATA
        deletingData: 'Deleting data',
        deleteDataQuestion: 'Are you sure you want to delete all data?',

        

        // ERRORS

        // AUTH
        USER_NOT_FOUND: 'User not found',
        INVALID_PASSWORD: 'Invalid password',
        MISSING_LOGIN_FIELDS: 'Enter email or username and password',
        UNKNOWN_ERROR: 'Unknown error occurred'
    }
}

export default appLanguage;