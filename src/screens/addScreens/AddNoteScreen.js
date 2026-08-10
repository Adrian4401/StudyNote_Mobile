import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Voice from '@react-native-voice/voice'
import { GoBackButton, MakeButton } from '../../components/Buttons.js'
import { addNote } from '../../api/notes'
import appLanguage from '../../utils/languages'
import { useLanguage } from '../../context/LanguageContext'
import { useDarkMode } from '../../context/DarkModeContext.js'
import { createStyles } from '../../styles/index.js'
import { SafeareaNoNav } from '../../components/SafeArea.js'
import { TextField } from '../../components/TextField.js'
import { getAllSubjects } from '../../api/subjects'
import { useAuth } from '../../context/AuthContext.js'
import { getAllClasses } from '../../api/classes'
import { Error } from '../../components/Errors'

export default function AddNoteScreen() {
    const { userToken } = useAuth()
    const navigation = useNavigation()

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage()
    const getTranslatedText = (key) => appLanguage[language][key]

    const [openSubjects, setOpenSubjects] = useState(false)
    const [openClasses, setOpenClasses] = useState(false)

    const [currentTitle, setCurrentTitle] = useState('')
    const [currentNote, setCurrentNote] = useState('')
    const [currentClass, setCurrentClass] = useState(null)
    const [currentSubject, setCurrentSubject] = useState(null)

    const [subjects, setSubjects] = useState([])
    const [classes, setClasses] = useState([])

    const [loadingData, setLoadingData] = useState(true)
    const [addingNote, setAddingNote] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [errorCode, setErrorCode] = useState('')

    const noteBeforeSpeechRef = useRef('')

    useEffect(() => {
        Voice.onSpeechStart = () => {
            setIsRecording(true)
        }

        Voice.onSpeechEnd = () => {
            setIsRecording(false)
        }

        Voice.onSpeechResults = (event) => {
            const speechText = event.value?.[0]

            if (!speechText) return

            setCurrentNote(
                noteBeforeSpeechRef.current
                    ? `${noteBeforeSpeechRef.current} ${speechText}`
                    : speechText
            )
        }

        Voice.onSpeechError = (event) => {
            console.log('Speech recognition error:', event.error)
            setIsRecording(false)
            setErrorCode('SPEECH_TO_TEXT_ERROR')
        }

        return () => {
            Voice.destroy().then(Voice.removeAllListeners)
        }
    }, [])

    useEffect(() => {
        const loadData = async () => {
            if (!userToken) return

            setLoadingData(true)
            setErrorCode('')

            try {
                const subjectsData = await getAllSubjects(userToken)
                const classesData = await getAllClasses(userToken)

                setSubjects(subjectsData || [])
                setClasses(classesData || [])
            } catch (error) {
                setErrorCode(error.message)
                console.log('Failed to load note data:', error.message)
            } finally {
                setLoadingData(false)
            }
        }

        loadData()
    }, [userToken])

    const subjectItems = subjects.map((subject) => ({
        label: subject.name,
        value: subject.id.toString()
    }))

    const classesItems = classes.map((myclass) => ({
        label: myclass.name,
        value: myclass.id.toString()
    }))

    const getSpeechLocale = () => {
        if (language === 'en') return 'en-US'
        return 'pl-PL'
    }

    const handleStartSpeechToText = async () => {
        try {
            setErrorCode('')
            noteBeforeSpeechRef.current = currentNote.trim()

            await Voice.start(getSpeechLocale())
        } catch (error) {
            console.log('Start speech failed:', error)
            setErrorCode('SPEECH_TO_TEXT_ERROR')
            setIsRecording(false)
        }
    }

    const handleStopSpeechToText = async () => {
        try {
            await Voice.stop()
            setIsRecording(false)
        } catch (error) {
            console.log('Stop speech failed:', error)
            setErrorCode('SPEECH_TO_TEXT_ERROR')
            setIsRecording(false)
        }
    }

    const handleToggleSpeechToText = () => {
        if (isRecording) {
            handleStopSpeechToText()
        } else {
            handleStartSpeechToText()
        }
    }

    const handleAddNote = async () => {
        if (
            currentTitle.trim().length === 0 ||
            currentNote.trim().length === 0 ||
            currentSubject === null ||
            currentClass === null
        ) {
            setErrorCode('MISSING_FIELDS')
            return
        }

        setAddingNote(true)
        setErrorCode('')

        try {
            const newNote = await addNote({
                title: currentTitle.trim(),
                body: currentNote.trim(),
                subjectId: currentSubject,
                classId: currentClass,
                token: userToken
            })

            console.log('Note added successfully: ', newNote)
            navigation.goBack()
        } catch (error) {
            setErrorCode(error.message)
            console.log('Adding note failed: ', error.message)
        } finally {
            setAddingNote(false)
        }
    }

    const noteStyles = StyleSheet.create({
        dropdown: {
            backgroundColor: theme.secondary,
            borderWidth: 1,
            borderColor: theme.textSecondary,
            borderRadius: 8
        },
        dropdownContainer: {
            backgroundColor: theme.secondary,
            borderWidth: 1,
            borderColor: theme.textSecondary,
            borderRadius: 8
        },
        dropdownText: {
            color: theme.textPrimary
        },
        placeholder: {
            color: theme.textSecondary
        },
        sectionLabel: {
            ...styles.littleText,
            marginBottom: 12
        },
        noteInputContainer: {
            backgroundColor: theme.secondary,
            borderColor: isRecording ? theme.primary : theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            marginTop: 12,
            marginBottom: 20
        },
        noteInputHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: theme.textSecondary,
            borderBottomWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 10
        },
        micButton: {
            width: 42,
            height: 42,
            borderRadius: 8,
            backgroundColor: isRecording ? '#D94A4A' : theme.primary,
            alignItems: 'center',
            justifyContent: 'center'
        },
        noteInput: {
            color: theme.textPrimary,
            fontSize: 18,
            minHeight: 360,
            padding: 14,
            textAlignVertical: 'top'
        }
    })

    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>
                    {getTranslatedText('add')} {getTranslatedText('note_2')}
                </Text>
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
                                {getTranslatedText('loadingData')}
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

                            <TextField
                                placeholder={getTranslatedText('noteTitlePlaceholder')}
                                onChangeText={setCurrentTitle}
                                value={currentTitle}
                                secureTextEntry={false}
                            />

                            <View style={{ width: '100%', marginTop: 20, zIndex: 3000 }}>
                                <Text style={noteStyles.sectionLabel}>
                                    {getTranslatedText('chooseSubject')}
                                </Text>

                                <DropDownPicker
                                    listMode="SCROLLVIEW"
                                    placeholder={getTranslatedText('chooseSubject')}
                                    open={openSubjects}
                                    value={currentSubject}
                                    items={subjectItems}
                                    setOpen={setOpenSubjects}
                                    setValue={setCurrentSubject}
                                    setItems={() => {}}
                                    zIndex={3000}
                                    style={noteStyles.dropdown}
                                    dropDownContainerStyle={noteStyles.dropdownContainer}
                                    textStyle={noteStyles.dropdownText}
                                    placeholderStyle={noteStyles.placeholder}
                                />
                            </View>

                            <View style={{ width: '100%', marginTop: 20, zIndex: 2000 }}>
                                <Text style={noteStyles.sectionLabel}>
                                    {getTranslatedText('chooseClasses')}
                                </Text>

                                <DropDownPicker
                                    listMode="SCROLLVIEW"
                                    placeholder={getTranslatedText('chooseClasses')}
                                    open={openClasses}
                                    value={currentClass}
                                    items={classesItems}
                                    setOpen={setOpenClasses}
                                    setValue={setCurrentClass}
                                    setItems={() => {}}
                                    zIndex={2000}
                                    style={noteStyles.dropdown}
                                    dropDownContainerStyle={noteStyles.dropdownContainer}
                                    textStyle={noteStyles.dropdownText}
                                    placeholderStyle={noteStyles.placeholder}
                                />
                            </View>

                            <View style={{ width: '100%', marginTop: 30 }}>
                                <Text style={noteStyles.sectionLabel}>
                                    {getTranslatedText('note')}
                                </Text>

                                <View style={noteStyles.noteInputContainer}>
                                    <View style={noteStyles.noteInputHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <MaterialCommunityIcons
                                                name="text-box-outline"
                                                size={22}
                                                color={theme.primary}
                                                style={{ marginRight: 10 }}
                                            />

                                            <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                                                {isRecording
                                                    ? getTranslatedText('speechListening')
                                                    : getTranslatedText('writeOrDictateNote')}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={handleToggleSpeechToText}
                                            style={noteStyles.micButton}
                                        >
                                            <MaterialCommunityIcons
                                                name={isRecording ? 'microphone-off' : 'microphone'}
                                                size={24}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        value={currentNote}
                                        onChangeText={setCurrentNote}
                                        placeholder={getTranslatedText('addNotePlaceholder')}
                                        placeholderTextColor={theme.textSecondary}
                                        multiline
                                        style={noteStyles.noteInput}
                                    />
                                </View>
                            </View>

                            {addingNote ? (
                                <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 30 }}>
                                    <ActivityIndicator size="large" color={theme.primary} />
                                    <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
                                        {getTranslatedText('savingNote')}
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ width: '100%', marginBottom: 30 }}>
                                    <MakeButton onPress={handleAddNote} />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}