import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import { GoBackButton } from '../../components/Buttons.js';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { selectEventToRead, selectNotesToEvent } from '../../database/queries.js';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteEvent } from '../../components/Alerts.js';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';
import { deleteEvent, getEvent } from '../../api/events';
import { useAuth } from '../../context/AuthContext.js';
import { formatDateOnly, formatTimeOnly } from '../../utils/date.js';




export default function ReadEventScreen() {
    const { userToken } = useAuth()
    const navigation = useNavigation();

    const route = useRoute();

    const [event, setEvent] = useState([])
    const [eventID, setEventID] = useState(null);

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }


    useFocusEffect(
        useCallback(() => {
            const { eventID } = route.params

            const loadEvent = async () => {
                if (!userToken) return
                console.log('Event id: ', eventID)
    
                try {
                    const data = await getEvent(eventID, userToken)
                    console.log('Event loaded successfully')
                    setEvent(data)
                } catch (error) {
                    console.log('Loading event failed', error.message)
                }
            }
    
            loadEvent()
        }, [userToken])
    )


    const confirmDeleteEvent = async () => {
        try {
            await deleteEvent(event.id, userToken)
            console.log('Note deleted successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Deleting note failed', error.message)
        }
    }

    const handleDeleteEvent = () => {
        alertDeleteEvent(getTranslatedText, confirmDeleteEvent)
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
                        <TouchableOpacity onPress={() => navigation.navigate('EditEventScreen', { eventId: event.id })}>
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
                                <FontAwesome5 name="calendar-day" size={18} color={theme.textSecondary} style={{flex: 1, textAlign: 'left'}}/>
                                <Text style={eventStyles.infoText}>
                                    {event?.deadline? formatDateOnly(event.deadline, language) : ''}, {event?.deadline? formatTimeOnly(event.deadline, language) : ''}
                                </Text>
                            </View>
                            {/* <View style={eventStyles.infoView}>
                                <FontAwesome5 name="clock" size={18} color={theme.textPrimary} style={{flex: 1, textAlign: 'left'}}/>
                                <Text style={eventStyles.infoText}>
                                    {note?.deadline? formatTimeOnly(note.deadline, language) : ''}
                                </Text>
                            </View> */}
                            <View style={eventStyles.infoView}>
                                <FontAwesome5 name="book" size={18} color={theme.textSecondary} style={{flex: 1, textAlign: 'left'}}/>
                                <Text style={eventStyles.infoText}>{event.subject?.name}, {event.class?.name}</Text>
                            </View>
                            {/* <View style={eventStyles.infoView}>
                                <FontAwesome5 name="info-circle" size={18} color={theme.textPrimary} style={{flex: 1, textAlign: 'left'}} />
                                <Text style={eventStyles.infoText}>{note.class?.name}</Text>
                            </View> */}
                        </View>
                        
                        <View style={{marginVertical: 5}}>
                            <Text style={{fontSize: 30, color: theme.textPrimary}}>{event.title}</Text>
                        </View>

                    </View>


                    <View style={eventStyles.line} />


                    <View style={{width: '100%', marginBottom: 50}}>
                        <Text style={{color: theme.textPrimary, fontSize: 17}}>{event.description}</Text>
                    </View>
                </>
            )
        } else if(item.type === 'notes') {
            if (!event?.notes || event.notes.length === 0) {
                return null
            }

            return (
                <View style={{ width: '100%' }}>
                    <Text style={{ ...styles.headlineText, marginBottom: 24, color: theme.textSecondary }}>
                        {getTranslatedText('attachedNotes')}
                    </Text>

                    {event.notes.map((element) => (
                        <TouchableOpacity
                            key={element.id}
                            onPress={() => navigation.navigate('ReadNoteScreen', { noteId: element.id })}
                            style={eventStyles.noteStyle}
                        >
                            <View>
                                <Text style={styles.headlineText}>{element.title}</Text>
                            </View>

                            <View style={{ flex: 1, backgroundColor: theme.textSecondary, height: 1, marginVertical: 12 }} />

                            <View style={eventStyles.infoView}>
                                <FontAwesome5 name="sticky-note" size={18} color={theme.textSecondary} style={{ flex: 1 }} />
                                <Text 
                                    style={eventStyles.infoText}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                >
                                    {element.body}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )
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
            paddingHorizontal: 10,
            
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
            borderRadius: 10,
            padding: 8,
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
            marginTop: 10,
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 5
        },
        infoText: {
            fontSize: 16,
            color: theme.textSecondary,
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
