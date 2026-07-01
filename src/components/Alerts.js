import { Alert } from "react-native";
import { deleteAllData, deleteClass, deleteEvent, deleteNote } from '../database/queries.js'
// import { deleteSubject } from "../api/subjects.js";


export const alertDeleteAllData = (getTranslatedText) => {
    return (
        Alert.alert(getTranslatedText('deletingData'), getTranslatedText('deleteDataQuestion'), [
            {
                text: getTranslatedText('cancel'),
                onPress: () => console.log('Anuluj'),
                style: 'cancel'
            },
            {
                text: getTranslatedText('delete'),
                onPress: () => deleteAllData()
            }
        ])
    )
}

export const alertDeleteSubject = (getTranslatedText, onConfirm) => {
    Alert.alert(
        getTranslatedText('deletingSubject'),
        getTranslatedText('deleteSubjectQuestion'),
        [
            {
                text: getTranslatedText('cancel'),
                onPress: () => console.log('Anuluj'),
                style: 'cancel',
            },
            {
                text: getTranslatedText('delete'),
                onPress: onConfirm,
                style: 'destructive',
            },
        ]
    )
}

export const alertDeleteClass = (getTranslatedText, onConfirm) => {
    Alert.alert(
        getTranslatedText('deletingClass'), 
        getTranslatedText('deleteClassQuestion'), [
        {
            text: getTranslatedText('cancel'),
            onPress: () => console.log('Anuluj'),
            style: 'cancel'
        },
        {
            text: getTranslatedText('delete'),
            onPress: onConfirm,
            style: 'destructive'
        }
    ])
}

export const alertDeleteNote = (getTranslatedText, onConfirm) => {
    Alert.alert(
        getTranslatedText('deletingNote'), 
        getTranslatedText('deleteNoteQuestion'), [
        {
            text: getTranslatedText('cancel'),
            onPress: () => console.log('Anuluj'),
            style: 'cancel'
        },
        {
            text: getTranslatedText('delete'),
            onPress: onConfirm,
            style: 'destructive'
        }
    ])
}

export const alertDeleteEvent = (eventID, navigation, getTranslatedText) => {
    Alert.alert(getTranslatedText('deletingEvent'), getTranslatedText('deleteEventQuestion'), [
        {
            text: getTranslatedText('cancel'),
            onPress: () => console.log('Anuluj'),
            style: 'cancel'
        },
        {
            text: getTranslatedText('delete'),
            onPress: () => deleteEvent(eventID, navigation)
        }
    ])
}

