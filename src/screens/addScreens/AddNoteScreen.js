import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { GoBackButton, MakeButton } from '../../components/Buttons.js';
import { addNote } from '../../api/notes';
import { createDate } from '../../utils/date.js';
import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';
import { getAllSubjects } from '../../api/subjects';
import { useAuth } from '../../context/AuthContext.js';
import { getAllClasses } from '../../api/classes';


export default function AddNoteScreen() {
    const { userToken } = useAuth()
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
        if(!userToken) {
            return
        }

        const loadSubjects = async () => {
            try {
                const data = await getAllSubjects(userToken)
                console.log('Subjects loaded successfully')
                setSubjects(data)
            } catch (error) {
                console.log('Failed to load subjects: ', error.errorCode)
            }
        }
        const loadClasses = async () => {
            try {
                const data = await getAllClasses(userToken)
                console.log('Classes loaded successfully')
                setClasses(data)
            } catch (error) {
                console.log('Failed to load classes: ', error.errorCode)
            }
        }

        loadSubjects()
        loadClasses()
    }, [userToken])



    const subjectItems = subjects.map(subject => {
        return { label: subject.name, value: subject.id.toString() };
    });

    const classesItems = classes.map(myclass => {
        return { label: myclass.name, value: myclass.id.toString() };
    })

    handleChangeTitle = (value) => {
        setCurrentTitle(value)
    }

    const handleAddNote = async () => {
        if(!currentTitle.length > 0 || !currentNote.length > 0 || currentSubject === null || currentClass === null) {
            console.log('MISSING FIELDS')
            return
        } 

        try {
            const newNote = await addNote({
                title: currentTitle,
                body: currentNote,
                subjectId: currentSubject,
                classId: currentClass,
                token: userToken
            })

            console.log('Note added successfully: ', newNote)
            navigation.goBack()
        } catch (error) {
            console.log('Adding note failed: ', error.errorCode)
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
                <TextField
                    placeholder={getTranslatedText('noteTitlePlaceholder')}
                    onChangeText={handleChangeTitle}
                    secureTextEntry={false}
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
