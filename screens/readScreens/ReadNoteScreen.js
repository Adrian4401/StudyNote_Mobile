import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { GoBackButton } from '../../components/Buttons.js';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { selectNoteToRead } from '../../database/queries.js';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteNote } from '../../components/Alerts.js';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';




export default function ReadNoteScreen() {

    const navigation = useNavigation();

    const route = useRoute();

    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [myclass, setMyclass] = useState('');
    const [createDay, setCreateDay] = useState('');
    const [note, setNote] = useState('');
    const [noteID, setNoteID] = useState(null);

    const { theme } = useDarkMode()
    const styles = createStyles(theme)
    
    const { language } = useLanguage();

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }
    


    useEffect(() => {
        const { noteID } = route.params;
        setNoteID(noteID)

        const loadData = navigation.addListener('focus', () => {
            selectNoteToRead(noteID, setTitle, setNote, setSubject, setMyclass, setCreateDay)
        })

        return loadData;
    }, [navigation])



    const handleDeleteNote = () => {
        alertDeleteNote(noteID, navigation, getTranslatedText)
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
            fontSize: 18,
            color: theme.textPrimary,
            flex: 10
        },
        noteDataView: {
            marginTop: 5,
            paddingHorizontal: 5
        },
        noteDataText: {
            fontSize: 12,
            color: theme.textSecondary,
            textTransform: 'uppercase'
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
                            <TouchableOpacity onPress={() => navigation.navigate('EditNoteScreen', { noteID: noteID })}>
                                <MaterialIcons name="edit" size={30} color={theme.textPrimary}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={noteStyles.line} /> */}
                    
                    <View style={{width: '100%', alignItems: 'flex-start'}}>
                        <View style={{marginVertical: 25}}>
                            <View style={noteStyles.noteDataView}>
                                <Text style={noteStyles.noteDataText}>{createDay}</Text>
                            </View>
                            <View style={noteStyles.infoView}>
                                <FontAwesome5 name="book" size={18} color={theme.textPrimary} style={{flex: 1}}/>
                                <Text style={noteStyles.infoText}>{subject}</Text>
                            </View>
                            <View style={noteStyles.infoView}>
                                <FontAwesome5 name="info-circle" size={18} color={theme.textPrimary} style={{flex: 1}} />
                                <Text style={noteStyles.infoText}>{myclass}</Text>
                            </View>
                        </View>
                        
                        <View style={{marginVertical: 5}}>
                            <Text style={{fontSize: 30, color: theme.textPrimary}}>{title}</Text>
                        </View>        
                    </View>

                    <View style={noteStyles.line} />

                    <View style={{width: '100%'}}>
                        <Text style={{color: theme.textPrimary, fontSize: 17}}>{note}</Text>
                    </View>
                    

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}


