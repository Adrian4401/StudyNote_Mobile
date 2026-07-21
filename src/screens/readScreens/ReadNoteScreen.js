import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import { GoBackButton } from '../../components/Buttons.js';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteNote } from '../../components/Alerts.js';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';
import { useAuth } from '../../context/AuthContext.js';
import { getNote, deleteNote } from '../../api/notes';
import { textDate } from '../../utils/date.js';




export default function ReadNoteScreen() {
    const { userToken } = useAuth()
    const navigation = useNavigation();

    const route = useRoute();

    const [note, setNote] = useState('');

    const { theme } = useDarkMode()
    const styles = createStyles(theme)
    
    const { language } = useLanguage();

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }
    

    useFocusEffect(
        useCallback(() => {
            const { noteId } = route.params

            const loadNote = async () => {
                if (!userToken) return
    
                try {
                    const data = await getNote(noteId, userToken)
                    console.log('Note loaded successfully')
                    setNote(data)
                } catch (error) {
                    console.log('Loading notes failed', error.message)
                }
            }
    
            loadNote()
        }, [userToken])
    )


    // const handleDeleteNote = () => {
    //     alertDeleteNote(note.note_id, navigation, getTranslatedText)
    // }

    const confirmDeleteNote = async () => {
        try {
            await deleteNote(note.note_id, userToken)
            console.log('Note deleted successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Deleting note failed', error.message)
        }
    }

    const handleDeleteNote = () => {
        alertDeleteNote(getTranslatedText, confirmDeleteNote)
    }
    


    const noteStyles = StyleSheet.create({
        topPanel: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.eventBackground,
            marginBottom: 20,
            borderRadius: 20,
            paddingHorizontal: 10
        },
        topPanelIcons: {
            flex: 0.35,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        line: {
            width: '100%',
            height: 1,
            backgroundColor: theme.primary,
            marginVertical: 20
        },
        infoView: {
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 5
        },
        infoText: {
            fontSize: 16,
            color: theme.textPrimary,
            // flex: 12
        },
        noteDataView: {
            marginTop: 5,
            paddingHorizontal: 5
        },
        noteDataText: {
            fontSize: 12,
            color: theme.textSecondary,
            // textTransform: 'uppercase'
        },
    })


    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('note')}</Text>
            </View>

            {/* CONTAINER */}
            <ScrollView>
                <View style={styles.viewContainer}>

                    <View style={noteStyles.topPanel}>
                        <GoBackButton />
                        <View style={noteStyles.topPanelIcons}>
                            <TouchableOpacity onPress={handleDeleteNote}>
                                <MaterialIcons name="delete" size={30} color={theme.textPrimary}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('EditNoteScreen', { noteId: note.note_id })}>
                                <MaterialIcons name="edit" size={30} color={theme.textPrimary}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={noteStyles.line} /> */}
                    
                    <View style={{width: '100%', alignItems: 'flex-start'}}>
                        <View style={{marginVertical: 25}}>
                            <View style={noteStyles.noteDataView}>
                                <Text style={noteStyles.noteDataText}>{getTranslatedText('created')} {textDate(note.created_day)}</Text>
                            </View>
                            <View style={noteStyles.infoView}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <FontAwesome5 name="book" size={16} color={theme.textPrimary} style={{marginRight: 12}}/>
                                    <Text style={noteStyles.infoText}>{note.subject_name}</Text>
                                    <Text style={{...noteStyles.infoText, marginLeft: 12}}>({note.class_name})</Text>
                                </View>
                                
                            </View>
                            {/* <View style={noteStyles.infoView}>
                                <FontAwesome5 name="info-circle" size={16} color={theme.textPrimary} style={{flex: 1}} />
                                <Text style={noteStyles.infoText}>{note.class_name}</Text>
                            </View> */}
                        </View>
                        
                        <View style={{marginVertical: 5}}>
                            <Text style={{fontSize: 30, color: theme.textPrimary}}>{note.title}</Text>
                        </View>        
                    </View>

                    <View style={noteStyles.line} />

                    <View style={{width: '100%'}}>
                        <Text style={{color: theme.textPrimary, fontSize: 17}}>{note.body}</Text>
                    </View>
                    

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}


