import { useState, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker'
import { FontAwesome5, AntDesign, FontAwesome } from '@expo/vector-icons'

import { useLanguage } from '../context/LanguageContext'
import appLanguage from '../utils/languages'
import { useDarkMode } from '../context/DarkModeContext'
import { createStyles } from '../styles/index'
import { Safearea } from '../components/SafeArea.js'
import { useAuth } from '../context/AuthContext'
import { getAllNotes } from '../api/notes'
import { getAllSubjects } from '../api/subjects'
import { formatDateOnly } from '../utils/date'
import { LoadingIndicator } from '../components/LoadingIndicator'

export default function NoteScreen() {
    const navigation = useNavigation()
    const { userToken } = useAuth()
    const { language } = useLanguage()
    const { theme } = useDarkMode()

    const styles = createStyles(theme)
    const notesStyles = createNotesStyles(theme)

    const getTranslatedText = (key) => appLanguage[language][key]

    const [openSubjects, setOpenSubjects] = useState(false)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                if (!userToken) {
                    setLoading(false)
                    return
                }

                setLoading(true)

                try {
                    const notesData = await getAllNotes(userToken)
                    const subjectsData = await getAllSubjects(userToken)

                    setNotes(notesData || [])
                    setSubjects(subjectsData || [])
                } catch (error) {
                    console.log('Loading notes failed', error.message)
                } finally {
                    setLoading(false)
                }
            }

            loadData()
        }, [userToken])
    )

    const subjectOptions = subjects.map((subject) => ({
        label: subject.name,
        value: subject.id.toString()
    }))

    const filteredNotes = selectedSubjectId
        ? notes.filter((note) =>
            String(note.subject_id ?? note.subjectId) === String(selectedSubjectId)
        )
        : notes

    const handleResetSubjectFilter = () => {
        setSelectedSubjectId(null)
        setOpenSubjects(false)
    }

    const renderNote = (note) => {
        return (
            <TouchableOpacity
                key={note.note_id ?? note.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ReadNoteScreen', { noteId: note.note_id })}
                style={notesStyles.noteCard}
            >
                <View style={notesStyles.noteTopRow}>
                    <View style={notesStyles.noteIcon}>
                        <FontAwesome name="sticky-note" size={16} color="#fff" />
                    </View>

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={notesStyles.noteTitle}
                    >
                        {note.title}
                    </Text>
                </View>

                <View style={notesStyles.divider} />

                <View style={notesStyles.infoRow}>
                    <FontAwesome5 name="book" size={14} color={theme.textSecondary} />

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={notesStyles.infoText}
                    >
                        {note.subject_name} - {note.class_name}
                    </Text>
                </View>

                <View style={notesStyles.dateRow}>
                    <Text style={notesStyles.dateText}>
                        {getTranslatedText('created')} {formatDateOnly(note.create_day, language)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderEmptyState = () => {
        return (
            <View style={notesStyles.emptyContainer}>
                <FontAwesome
                    name="sticky-note"
                    size={48}
                    color={theme.textSecondary}
                    style={{ marginBottom: 18 }}
                />

                <Text style={notesStyles.emptyText}>
                    {selectedSubjectId
                        ? getTranslatedText('emptySubjectNotes')
                        : getTranslatedText('emptyNotesText')}
                </Text>

                {selectedSubjectId ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleResetSubjectFilter}
                        style={notesStyles.outlineButton}
                    >
                        <Text style={notesStyles.outlineButtonText}>
                            {getTranslatedText('showAllNotes')}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        )
    }

    return (
        <Safearea>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>
                    {getTranslatedText('notesScreentitle')}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.viewContainer}>
                    <View style={notesStyles.topPanel}>
                        <View>
                            <Text style={notesStyles.titleText}>
                                {getTranslatedText('yourNotesHeadline')}
                            </Text>

                            <Text style={notesStyles.subtitleText}>
                                {filteredNotes.length}/{notes.length} {getTranslatedText('notes')}
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('AddNoteScreen')}
                            style={notesStyles.addButton}
                        >
                            <AntDesign name="plus" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {notes.length > 0 ? (
                        <View style={notesStyles.filterWrapper}>
                            <Text style={{ ...styles.littleText, marginBottom: 12 }}>
                                {getTranslatedText('chooseSubjectDropdownPlaceholder')}
                            </Text>

                            <View style={notesStyles.filterRow}>
                                <View style={{ flex: 1 }}>
                                    <DropDownPicker
                                        listMode="SCROLLVIEW"
                                        placeholder={getTranslatedText('chooseSubjectDropdownPlaceholder')}
                                        open={openSubjects}
                                        value={selectedSubjectId}
                                        items={subjectOptions}
                                        setOpen={setOpenSubjects}
                                        setValue={setSelectedSubjectId}
                                        setItems={() => {}}
                                        style={notesStyles.dropdown}
                                        dropDownContainerStyle={notesStyles.dropdownContainer}
                                        textStyle={notesStyles.dropdownText}
                                        placeholderStyle={notesStyles.dropdownPlaceholder}
                                    />
                                </View>

                                {selectedSubjectId ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={handleResetSubjectFilter}
                                        style={notesStyles.clearButton}
                                    >
                                        <AntDesign name="close" size={20} color="#fff" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                    ) : null}

                    {loading ? (
                        <View style={{ alignItems: 'center', marginTop: 80 }}>
                            <LoadingIndicator />
                        </View>
                    ) : (
                        <View style={notesStyles.notesList}>
                            {filteredNotes.length > 0
                                ? filteredNotes.map(renderNote)
                                : renderEmptyState()}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={{ width: '100%', height: 40 }} />
        </Safearea>
    )
}

const createNotesStyles = (theme) => {
    return StyleSheet.create({
        topPanel: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 18,
            borderBottomColor: theme.textSecondary,
            borderBottomWidth: 1
        },
        titleText: {
            color: theme.textPrimary,
            fontSize: 24,
            marginBottom: 6
        },
        subtitleText: {
            color: theme.textSecondary,
            fontSize: 14,
            textTransform: 'uppercase'
        },
        addButton: {
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 14
        },
        filterWrapper: {
            width: '100%',
            marginBottom: 24,
            zIndex: 3000
        },
        filterRow: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center'
        },
        dropdown: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8
        },
        dropdownContainer: {
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8
        },
        dropdownText: {
            color: theme.textPrimary
        },
        dropdownPlaceholder: {
            color: theme.textSecondary
        },
        clearButton: {
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10
        },
        notesList: {
            width: '100%'
        },
        noteCard: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 14,
            marginBottom: 14
        },
        noteTopRow: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        noteIcon: {
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
        },
        noteTitle: {
            flex: 1,
            color: theme.textPrimary,
            fontSize: 18
        },
        divider: {
            height: 1,
            backgroundColor: theme.textSecondary,
            marginVertical: 12
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8
        },
        infoText: {
            flex: 1,
            color: theme.textSecondary,
            fontSize: 14,
            marginLeft: 10
        },
        dateRow: {
            alignItems: 'flex-end'
        },
        dateText: {
            color: theme.textSecondary,
            fontSize: 12
        },
        emptyContainer: {
            width: '100%',
            alignItems: 'center',
            marginTop: 70
        },
        emptyText: {
            color: theme.textSecondary,
            fontSize: 18,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginBottom: 20
        },
        outlineButton: {
            borderColor: theme.primary,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16
        },
        outlineButtonText: {
            color: theme.primary,
            fontSize: 16
        }
    })
}