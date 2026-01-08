import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DropDownPicker from 'react-native-dropdown-picker';

import { EditButton, GoBackButton } from '../../components/Buttons.js';

import { selectEditedNote, editNote } from '../../database/queries.js';

import Moment from 'moment';
import 'moment/locale/pl'

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';





export default function EditNoteScreen() {

    const navigation = useNavigation();

    const route = useRoute();

    const [currentTitle, setCurrentTitle] = useState('');
    const [currentNote, setCurrentNote] = useState('');

    const [openSubjects, setOpenSubjects] = useState(false);
    const [openClasses, setOpenClasses] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
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
            selectEditedNote(setSubjects, setClasses, noteID, setCurrentTitle, setCurrentNote, setCurrentSubject, setCurrentClass)
        })

        console.log('ID przedmiotu: ' + currentSubject);

        return loadData;
    }, [navigation, currentSubject])



    const subjectItems = subjects.map(subject => ({
        label: subject.subject_name,
        value: subject.subject_id,
    }));

    const classesItems = classes.map(myclass => ({
        label: myclass.class_name,
        value: myclass.class_id,
    }));



    Moment.locale('pl');
    var noteDate = new Date().toLocaleString();
    var formattedNoteDate = Moment(formattedNoteDate).format('DD.MM.yyyy');



    const renderItem = ({item}) => {
        if(item.type === 'goBackButton') {
            return(
                <View style={{width: '100%', marginTop: 20}}>
                    <GoBackButton />
                </View>
            )
        } else if(item.type === 'titleTextInput') {
            return(
                <TextInput
                    value={currentTitle.toString()}
                    onChangeText={setCurrentTitle}
                    placeholderTextColor={theme.textSecondary}
                    maxLength={100}
                    multiline
                    style={{
                        color: theme.textPrimary,
                        fontSize: 25,
                        borderWidth: 1,
                        borderColor: theme.primary,
                        borderRadius: 10,
                        padding: 10,
                        marginVertical: 10,
                        marginTop: 30,
                        backgroundColor: theme.secondary
                    }}
                />
            )
        } else if(item.type === 'subjectsDropDownPicker') {
            return(
                <DropDownPicker
                    open={openSubjects}
                    value={currentSubject}
                    items={subjectItems}
                    setOpen={setOpenSubjects}
                    setValue={setCurrentSubject}
                    setItems={setSubjects}
                    ScrollView={false}
                    style={{...noteStyles.style, marginBottom: 10}}
                    dropDownContainerStyle={noteStyles.dropDownContainerStyle}
                    textStyle={noteStyles.textStyle}
                    arrowIconContainerStyle={noteStyles.arrowIconContainerStyle}
                />
            )
        } else if(item.type === 'classesDropDownPicker') {
            return(
                <DropDownPicker
                    open={openClasses}
                    value={currentClass}
                    items={classesItems}
                    setOpen={setOpenClasses}
                    setValue={setCurrentClass}
                    setItems={setClasses}
                    ScrollView={false}
                    style={noteStyles.style}
                    dropDownContainerStyle={noteStyles.dropDownContainerStyle}
                    textStyle={noteStyles.textStyle}
                    arrowIconContainerStyle={noteStyles.arrowIconContainerStyle}
                />
            )
        } else if(item.type === 'noteTextInput') {
            return(
                <TextInput 
                    value={currentNote.toString()}
                    onChangeText={setCurrentNote}
                    placeholderTextColor={theme.textSecondary}
                    multiline={true}
                    style={{
                        color: theme.textPrimary,
                        flex: 1,
                        fontSize: 18,
                        borderWidth: 1,
                        borderColor: theme.primary,
                        borderRadius: 10,
                        padding: 10,
                        marginTop: 30,
                        marginBottom: 20,
                        height: 400,
                        backgroundColor: theme.secondary,
                        flexWrap: 'wrap',
                        textAlignVertical: 'top'
                    }}
                />
            )
        } else if(item.type === 'editButton') {
            return(
                <EditButton onPress={() => editNote(currentTitle, currentNote, currentSubject, currentClass, noteID, navigation)} />
            )
        }
    }


    const noteStyles = StyleSheet.create({
        style: {
            backgroundColor: theme.secondary,
            borderWidth: 1,
            borderColor: theme.secondary
        },
        dropDownContainerStyle: {
            backgroundColor: theme.secondary,
            borderWidth: 1,
            // borderColor: theme.primary
        },
        textStyle: {
            color: theme.textSecondary
        },
        arrowIconContainerStyle: {
            backgroundColor: theme.primary,
            borderRadius: 5
        }
    });


    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('edit')} {getTranslatedText('note_2')}</Text>
            </View>

            <View style={styles.flatlistContainer}>
                <FlatList 
                    data={[
                        { type: 'editButton' },
                        { type: 'noteTextInput' },
                        { type: 'classesDropDownPicker' },
                        { type: 'subjectsDropDownPicker' },
                        { type: 'titleTextInput' },
                        { type: 'goBackButton' }
                    ]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexDirection: 'column-reverse', paddingBottom: 50}}
                />
            </View>

        </SafeareaNoNav>
    )
}

