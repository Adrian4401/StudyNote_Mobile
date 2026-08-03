import { useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import DropDownPicker from 'react-native-dropdown-picker'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLanguage } from '../../context/LanguageContext'
import appLanguage from '../../utils/languages'
import { createStyles } from '../../styles'
import { SafeareaNoNav } from '../../components/SafeArea'
import { GoBackButton, MakeButton } from '../../components/Buttons'
import { getAllSubjects } from '../../api/subjects'
import { getAllNotes } from '../../api/notes'
import { generateSubjectTest } from '../../api/tests'
import { QuestionTypeSwitch } from '../../components/QuestionTypeSwitch'
import { Error } from '../../components/Errors'

export default function SubjectTestScreen() {
    const navigation = useNavigation()
    const { userToken } = useAuth()

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage()
    const getTranslatedText = (key) => appLanguage[language][key]

    const [subjects, setSubjects] = useState([])
    const [notes, setNotes] = useState([])

    const [openSubjects, setOpenSubjects] = useState(false)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [selectedNoteIds, setSelectedNoteIds] = useState([])

    const [questionsCount, setQuestionsCount] = useState(5)
    const [questionTypes, setQuestionTypes] = useState([
        'single_choice',
        'true_false'
    ])

    const [loadingData, setLoadingData] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [errorCode, setErrorCode] = useState('')

    const questionTypeOptions = [
        {
            label: 'Prawda / fałsz',
            value: 'true_false',
            icon: 'toggle-switch-outline'
        },
        {
            label: 'Jednokrotny wybór',
            value: 'single_choice',
            icon: 'checkbox-marked-circle-outline'
        },
        {
            label: 'Wielokrotny wybór',
            value: 'multiple_choice',
            icon: 'checkbox-multiple-marked-outline'
        },
        {
            label: 'Otwarte',
            value: 'open',
            icon: 'file-document-edit-outline'
        }
    ]

    useEffect(() => {
        const loadData = async () => {
            if (!userToken) return

            setLoadingData(true)
            setErrorCode('')

            try {
                const subjectsData = await getAllSubjects(userToken)
                const notesData = await getAllNotes(userToken)

                setSubjects(subjectsData || [])
                setNotes(notesData || [])
            } catch (error) {
                setErrorCode(error.message)
                console.log('Loading test data failed:', error.message)
            } finally {
                setLoadingData(false)
            }
        }

        loadData()
    }, [userToken])

    useEffect(() => {
        setSelectedNoteIds([])
    }, [selectedSubjectId])

    const subjectItems = subjects.map((subject) => ({
        label: subject.name,
        value: String(subject.id)
    }))

    const filteredNotes = useMemo(() => {
        if (!selectedSubjectId) return []

        return notes.filter((note) =>
            String(note.subject_id ?? note.subjectId) === String(selectedSubjectId)
        )
    }, [notes, selectedSubjectId])

    const toggleNote = (noteId) => {
        setSelectedNoteIds((prevNoteIds) => {
            if (prevNoteIds.includes(noteId)) {
                return prevNoteIds.filter((id) => id !== noteId)
            }

            return [...prevNoteIds, noteId]
        })
    }

    const toggleQuestionType = (type) => {
        setQuestionTypes((prevTypes) => {
            if (prevTypes.includes(type)) {
                return prevTypes.filter((item) => item !== type)
            }

            return [...prevTypes, type]
        })
    }

    const handleGenerateTest = async () => {
        if (!selectedSubjectId || selectedNoteIds.length === 0 || questionTypes.length === 0) {
            setErrorCode('TEST_MISSING_FIELDS')
            return
        }

        setGenerating(true)
        setErrorCode('')

        try {
            const data = await generateSubjectTest({
                subjectId: selectedSubjectId,
                noteIds: selectedNoteIds,
                questionsCount,
                questionTypes,
                token: userToken
            })

            navigation.navigate('GeneratedTestScreen', {
                test: data
            })
        } catch (error) {
            setErrorCode(error.message)
            console.log('Generating test failed:', error.message)
        } finally {
            setGenerating(false)
        }
    }

    const renderNotes = () => {
        if (!selectedSubjectId) {
            return (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <MaterialCommunityIcons
                        name="book-open-page-variant-outline"
                        size={42}
                        color={theme.textSecondary}
                    />
                    <Text style={{ ...styles.littleText, textAlign: 'center', marginTop: 12 }}>
                        Najpierw wybierz przedmiot
                    </Text>
                </View>
            )
        }

        if (filteredNotes.length === 0) {
            return (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <MaterialCommunityIcons
                        name="note-off-outline"
                        size={42}
                        color={theme.textSecondary}
                    />
                    <Text style={{ ...styles.littleText, textAlign: 'center', marginTop: 12 }}>
                        Brak notatek dla tego przedmiotu
                    </Text>
                </View>
            )
        }

        return filteredNotes.map((note) => {
            const noteId = note.note_id ?? note.id
            const selected = selectedNoteIds.includes(noteId)

            return (
                <TouchableOpacity
                    key={noteId}
                    onPress={() => toggleNote(noteId)}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: selected ? theme.primary : theme.secondary,
                        borderColor: selected ? theme.primary : theme.textSecondary,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 14,
                        marginBottom: 10
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons
                            name={selected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                            size={22}
                            color={selected ? '#fff' : theme.textSecondary}
                            style={{ marginRight: 10 }}
                        />

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                flex: 1,
                                color: selected ? '#fff' : theme.textPrimary,
                                fontSize: 16
                            }}
                        >
                            {note.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>Generator testu</Text>
            </View>

            <ScrollView>
                <View style={styles.viewContainer}>
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <GoBackButton />
                    </View>

                    {loadingData ? (
                        <View style={{ alignItems: 'center', marginTop: 80 }}>
                            <ActivityIndicator size="large" color={theme.primary} />
                            <Text style={{ color: theme.textSecondary, marginTop: 16 }}>
                                Ładowanie danych...
                            </Text>
                        </View>
                    ) : (
                        <View style={{ width: '100%' }}>
                            {errorCode ? (
                                <Error
                                    message={errorCode}
                                    getTranslatedText={getTranslatedText}
                                />
                            ) : null}

                            <Text style={{ ...styles.littleText, marginBottom: 12 }}>
                                Wybierz przedmiot
                            </Text>

                            <DropDownPicker
                                listMode='SCROLLVIEW'
                                open={openSubjects}
                                value={selectedSubjectId}
                                items={subjectItems}
                                setOpen={setOpenSubjects}
                                setValue={setSelectedSubjectId}
                                setItems={() => {}}
                                placeholder="Przedmiot"
                                zIndex={3000}
                                style={{
                                    backgroundColor: theme.secondary,
                                    borderColor: theme.textSecondary,
                                    borderRadius: 8
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: theme.secondary,
                                    borderColor: theme.textSecondary
                                }}
                                textStyle={{
                                    color: theme.textPrimary
                                }}
                                placeholderStyle={{
                                    color: theme.textSecondary
                                }}
                            />

                            <View style={{ width: '100%', marginTop: 30 }}>
                                <Text style={{ ...styles.littleText, marginBottom: 12 }}>
                                    Wybierz notatki
                                </Text>

                                {renderNotes()}
                            </View>

                            <View style={{ width: '100%', marginTop: 30 }}>
                                <Text style={{ ...styles.littleText, marginBottom: 12 }}>
                                    Liczba pytań: {questionsCount}
                                </Text>

                                <Slider
                                    minimumValue={5}
                                    maximumValue={20}
                                    step={1}
                                    value={questionsCount}
                                    onValueChange={setQuestionsCount}
                                    minimumTrackTintColor={theme.primary}
                                    maximumTrackTintColor={theme.textSecondary}
                                    thumbTintColor={theme.primary}
                                />
                            </View>

                            <View style={{ width: '100%', marginTop: 30 }}>
                                <Text style={{ ...styles.littleText, marginBottom: 12 }}>
                                    Rodzaje pytań
                                </Text>

                                {questionTypeOptions.map((type) => (
                                    <QuestionTypeSwitch
                                        key={type.value}
                                        icon={type.icon}
                                        label={type.label}
                                        value={type.value}
                                        active={questionTypes.includes(type.value)}
                                        onToggle={toggleQuestionType}
                                        theme={theme}
                                        styles={styles}
                                    />
                                ))}
                            </View>

                            {generating ? (
                                <View style={{ alignItems: 'center', marginTop: 30 }}>
                                    <ActivityIndicator size="large" color={theme.primary} />
                                    <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
                                        Generuję test...
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <MakeButton onPress={handleGenerateTest} />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}