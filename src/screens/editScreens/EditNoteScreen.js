import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { EditButton, GoBackButton } from '../../components/Buttons.js';
import { selectEditedNote, editNote } from '../../database/queries.js';
import 'moment/locale/pl'
import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';
import { useAuth } from '../../context/AuthContext';
import { getAllSubjects } from '../../api/subjects';
import { getAllClasses } from '../../api/classes';
import { getNote, updateNote } from '../../api/notes';


export default function EditNoteScreen() {
    const { userToken } = useAuth()
    const navigation = useNavigation();

    const route = useRoute();

    const [note, setNote] = useState([])
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentBody, setCurrentBody] = useState('');

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
        const { noteId } = route.params;
        
        const loadNote = async () => {
            if (!userToken) return

            try {
                const data = await getNote(noteId, userToken)
                console.log('Note loaded successfully')
                setNote(data)
                setCurrentClass(data.classId)
                setCurrentSubject(data.subjectId)
                setCurrentBody(data.body)
                setCurrentTitle(data.title)
            } catch (error) {
                console.log('Loading notes failed', error.message)
            }
        }

        const loadSubjects = async () => {
            if (!userToken) return

            try {
                const data = await getAllSubjects(userToken)
                console.log('Subjects loaded successfully')
                setSubjects(data)
            } catch (error) {
                console.log('Loading subjects failed', error.message)
            }
        }

        const loadClasses = async () => {
            if (!userToken) return

            try {
                const data = await getAllClasses(userToken)
                console.log('Classes loaded successfully')
                setClasses(data)
            } catch (error) {
                console.log('Loading classes failed', error.message)
            }
        }

        loadSubjects()
        loadClasses()
        loadNote()
    }, [userToken])



    const subjectItems = subjects.map(subject => ({
        label: subject.name,
        value: subject.id,
    }));

    const classesItems = classes.map(myclass => ({
        label: myclass.name,
        value: myclass.id,
    }));

    const handleChangeTitle = (value) => {
        setCurrentTitle(value)
    }

    const handleEditNote = async () => {
        if (!currentTitle || !currentBody || !currentSubject || !currentClass) {
            console.log('Cannot edit empty note')
            return
        }

        try {
            await updateNote(note.note_id, currentTitle, currentBody, currentSubject, currentClass, userToken)
            console.log('Note updated successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Editing note failed', error.message)
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
                    value={currentTitle}
                    onChangeText={handleChangeTitle}
                    secureTextEntry={false}
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
                    value={currentBody}
                    onChangeText={setCurrentBody}
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
                <EditButton onPress={handleEditNote} />
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

