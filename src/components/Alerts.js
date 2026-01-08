import { Alert } from "react-native";

import { deleteAllData, deleteSubject, deleteClass, deleteEvent, deleteNote } from '../database/queries.js'





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


export const alertDeleteSubject = (subjectID, setSubjects, navigation, getTranslatedText) => {

    Alert.alert(getTranslatedText('deletingSubject'), getTranslatedText('deleteSubjectQuestion'), [
        {
            text: getTranslatedText('cancel'),
            onPress: () => console.log('Anuluj'),
            style: 'cancel'
        },
        {
            text: getTranslatedText('delete'),
            onPress: () => deleteSubject(subjectID, setSubjects, navigation)
        }
    ])
}


export const alertDeleteClass = (classID, setClasses, navigation, getTranslatedText) => {
    Alert.alert(getTranslatedText('deletingClass'), getTranslatedText('deleteClassQuestion'), [
        {
            text: getTranslatedText('cancel'),
            onPress: () => console.log('Anuluj'),
            style: 'cancel'
        },
        {
            text: getTranslatedText('delete'),
            onPress: () => deleteClass(classID, setClasses, navigation)
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


export const alertDeleteNote = (noteID, navigation, getTranslatedText) => {
    Alert.alert(getTranslatedText('deletingNote'), getTranslatedText('deleteNoteQuestion'), [
        {
            text: getTranslatedText('cancel'),
            onPress: () => console.log('Anuluj'),
            style: 'cancel'
        },
        {
            text: getTranslatedText('delete'),
            onPress: () => deleteNote(noteID, navigation)
        }
    ])
}