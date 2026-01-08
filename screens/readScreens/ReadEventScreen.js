import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { GoBackButton } from '../../components/Buttons.js';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { selectEventToRead, selectNotesToEvent } from '../../database/queries.js';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteEvent } from '../../components/Alerts.js';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';




export default function ReadEventScreen() {

    const navigation = useNavigation();

    const route = useRoute();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [myclass, setMyclass] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('');
    const [eventID, setEventID] = useState(null);

    const [notesData, setNotesData] = useState([]);

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }



    useEffect(() => {
        const { eventID } = route.params;
        setEventID(eventID)

        const loadData = navigation.addListener('focus', () => {
            selectEventToRead(eventID, setTitle, setDescription, setSubject, setMyclass, setDeadlineDate, setDeadlineTime)
            selectNotesToEvent(eventID, setNotesData)

            // selectAllNotesEvent();
        })

        return loadData;
    }, [navigation])



    const handleDeleteEvent = () => {
        alertDeleteEvent(eventID, navigation, getTranslatedText)
    }



    const renderItem = ({item}) => {
        if(item.type === 'topPanel') {
            return (
                <View style={eventStyles.topPanel}>
                    <GoBackButton />
                    <View style={eventStyles.topPanelIcons}>
                        <TouchableOpacity onPress={handleDeleteEvent}>
                            <MaterialIcons name="delete" size={30} color={theme.textPrimary}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('EditEventScreen', { eventID: eventID })}>
                            <MaterialIcons name="edit" size={30} color={theme.textPrimary}/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if(item.type === 'eventInfo') {
            return (
                <>
                    <View style={{
                        width: '100%',
                        alignItems: 'flex-start'
                    }}>

                        <View style={{marginVertical: 25}}>
                            <View style={eventStyles.infoView}>
                                <FontAwesome5 name="calendar" size={18} color={theme.textPrimary} style={{flex: 1}}/>
                                <Text style={eventStyles.infoText}>{deadlineDate}</Text>
                            </View>
                            <View style={eventStyles.infoView}>
                                <FontAwesome5 name="clock" size={18} color={theme.textPrimary} style={{flex: 1}}/>
                                <Text style={eventStyles.infoText}>{deadlineTime}</Text>
                            </View>
                            <View style={eventStyles.infoView}>
                                <FontAwesome5 name="book" size={18} color={theme.textPrimary} style={{flex: 1}}/>
                                <Text style={eventStyles.infoText}>{subject}</Text>
                            </View>
                            <View style={eventStyles.infoView}>
                                <FontAwesome5 name="info-circle" size={18} color={theme.textPrimary} style={{flex: 1}} />
                                <Text style={eventStyles.infoText}>{myclass}</Text>
                            </View>
                        </View>
                        
                        <View style={{marginVertical: 5}}>
                            <Text style={{fontSize: 30, color: theme.textPrimary}}>{title}</Text>
                        </View>

                    </View>


                    <View style={eventStyles.line} />


                    <View style={{width: '100%', marginBottom: 50}}>
                        <Text style={{color: theme.textPrimary, fontSize: 17}}>{description}</Text>
                    </View>
                </>
            )
        } else if(item.type === 'notes') {
            return notesData.map((element, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('ReadNoteScreen', { noteID: element.note_id })} style={eventStyles.noteStyle}>
     
                    <View>
                        <Text style={styles.headlineText}>{element.title}</Text>
                    </View>
        
                    <View style={{flex: 1, backgroundColor: theme.textSecondary, height: 1, marginBottom: 7}} />
        
                    <View style={eventStyles.infoView}>
                        <FontAwesome5 name="book" size={18} color={theme.textPrimary} style={{flex: 1}}/>
                        <Text style={eventStyles.infoText}>{element.subject_name}</Text>
                    </View>
        
                    <View style={eventStyles.infoView}>
                        <FontAwesome5 name="info-circle" size={18} color={theme.textPrimary} style={{flex: 1}} />
                        <Text style={eventStyles.infoText}>{element.class_name}</Text>
                    </View>
        
                    <View style={eventStyles.noteDataView}>
                        <Text style={eventStyles.noteDataText}>{element.create_day}</Text>
                    </View>

                  </TouchableOpacity>
                )
            })
        }
    }


    const eventStyles = StyleSheet.create({
        topPanel: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.eventBackground,
            marginVertical: 20,
            borderRadius: 20,
            paddingHorizontal: 10
        },
        topPanelIcons: {
            flex: 0.35,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        noteStyle: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderRadius: 20,
            padding: 12,
            marginBottom: 15, 
            borderColor: theme.textSecondary, 
            borderWidth: 1
        },
        line: {
            width: '100%',
            height: 1,
            backgroundColor: theme.primary,
            marginVertical: 20
        },
        infoView: {
            flexDirection: 'row',
            marginTop: 2,
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
            alignItems: 'flex-end',
            marginTop: 2,
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
                <Text style={styles.headerText}>{getTranslatedText('event')}</Text>
            </View>

            {/* CONTAINER */}
            <View style={styles.flatlistContainer}>
                <FlatList 
                    data={[
                        { type: 'topPanel' },
                        { type: 'eventInfo' },
                        { type: 'notes' }
                    ]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: 50}}
                />
            </View>

        </SafeareaNoNav>
    )
}
