import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

import { GoBackButton, MakeButton } from '../../components/Buttons.js';

import { loadClasses, loadSubjects, addNote } from '../../database/queries.js';

import { createDate } from '../../utils/date.js';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';




export default function AddNoteScreen() {

    const navigation = useNavigation();

    const [openSubjects, setOpenSubjects] = useState(false);
    const [openClasses, setOpenClasses] = useState(false);

    const [currentTitle, setCurrentTitle] = useState('');
    const [currentNote, setCurrentNote] = useState('');
    const [currentClass, setCurrentClass] = useState(null);
    const [currentSubject, setCurrentSubject] = useState(null);

    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);

    const todayDate = createDate()

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();

    const getTranslatedText = (key) => {
      return appLanguage[language][key];
    }

    const [completeFieldsInfo, setCompleteFieldsInfo] = useState(false)


    
    useEffect(() => {
        const loadData = navigation.addListener('focus', () => {
            loadSubjects(setSubjects),
            loadClasses(setClasses)
        })
        
        return loadData;
    }, [navigation])



    const subjectItems = subjects.map(subject => {
        return { label: subject.subject_name, value: subject.subject_id.toString() };
    });

    const classesItems = classes.map(myclass => {
        return { label: myclass.class_name, value: myclass.class_id.toString() };
    })

    const handleAddNote = () => {
        if(currentTitle.length > 0 && currentNote.length > 0 && currentSubject !== null && currentClass !== null) {
            addNote(currentTitle, currentNote, currentSubject, currentClass, todayDate, navigation)
        } else {
            setCompleteFieldsInfo(true)
        }
    }



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
                    value={currentTitle}
                    onChangeText={setCurrentTitle}
                    placeholder={getTranslatedText('noteTitlePlaceholder')}
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
                    placeholder={getTranslatedText('chooseSubject')}
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
                    placeholder={getTranslatedText('chooseClasses')}
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
                    value={currentNote}
                    onChangeText={setCurrentNote}
                    placeholder={getTranslatedText('addNotePlaceholder')}
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
        } else if(item.type === 'addButton') {
            return(
                <>
                    {completeFieldsInfo && (
                        <Text style={{color: 'red', textAlign: 'center'}}>Wszystkie pola muszą być uzupełnione!</Text>
                    )}
                    <MakeButton onPress={handleAddNote}/>
                </>
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
                <Text style={styles.headerText}>{getTranslatedText('add')} {getTranslatedText('notes')}</Text>
            </View>

            <View style={styles.flatlistContainer}>
                <FlatList 
                    data={[
                        { type: 'addButton' },
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
