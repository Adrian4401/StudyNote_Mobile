import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DropDownPicker from 'react-native-dropdown-picker';

import { FontAwesome5 } from '@expo/vector-icons';

import { GoBackButton, MakeButton } from '../../components/Buttons.js';

import { loadClasses, loadSubjects, selectChosenNotes, addEvent } from '../../database/queries.js';

import DateTimePicker from '@react-native-community/datetimepicker';

import Checkbox from 'expo-checkbox';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';

import { formatDate } from '../../utils/date.js'





export default function AddEventScreen() {

    const navigation = useNavigation();

    const [openSubjects, setOpenSubjects] = useState(false);
    const [openClasses, setOpenClasses] = useState(false);

    const [currentTitle, setCurrentTitle] = useState('');
    const [currentDescription, setCurrentDescription] = useState('');
    const [currentClass, setCurrentClass] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [valueSubjects, setValueSubjects] = useState(null);
    
    const [data, setData] = useState([]);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('');
    const [show, setShow] = useState(false);

    const [checkedNotes, setCheckedNotes] = useState([]);

    const [checkedNoteIDs, setCheckedNoteIDs] = useState([]);

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

        selectChosenNotes(valueSubjects, setData);

        setCheckedNotes(new Array(data.length).fill(false))
        
        return loadData;
    }, [navigation, valueSubjects, setData, data.length])

    const subjectItems = subjects.map(subject => {
        return { label: subject.subject_name, value: subject.subject_id.toString() };
    });

    const classesItems = classes.map(myclass => {
        return { label: myclass.class_name, value: myclass.class_id.toString() };
    })

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);

        let tempDate = new Date(currentDate);

        setDate(tempDate);

        console.log(tempDate.toLocaleString());
    }

    const handleNoteCheckboxChange = (index) => {
        const newCheckedNotes = [...checkedNotes];
        newCheckedNotes[index] = !newCheckedNotes[index];
        setCheckedNotes(newCheckedNotes);

        const newCheckedNoteIDs = [...checkedNoteIDs];
        if (newCheckedNotes[index]) {
            newCheckedNoteIDs.push(data[index].note_id);
        } else {
            const noteIDIndex = newCheckedNoteIDs.indexOf(data[index].note_id);
            if (noteIDIndex !== -1) {
                newCheckedNoteIDs.splice(noteIDIndex, 1);
            }
        }
        setCheckedNoteIDs(newCheckedNoteIDs);
    }
    
    const selectedDate = formatDate(date);

    const handleAddEvent = () => {
        if(currentTitle.length > 0 && currentDescription.length > 0 && date !== null && currentClass !== null && valueSubjects !== null) {
            addEvent(navigation, currentTitle, currentDescription, date, valueSubjects, currentClass, checkedNoteIDs)
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
                    placeholder={getTranslatedText('eventTitlePlaceholder')}
                    placeholderTextColor={theme.textSecondary}
                    maxLength={100}
                    multiline
                    style={{
                        color: theme.textPrimary,
                        fontSize: 25,
                        borderWidth: 1,
                        borderColor: theme.primary,
                        borderRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        marginTop: 30,
                        backgroundColor: theme.secondary
                    }}
                />
            )
        } else if(item.type === 'subjectsPicker') {
            return(
                <DropDownPicker
                    placeholder={getTranslatedText('chooseSubject')}
                    open={openSubjects}
                    value={valueSubjects}
                    items={subjectItems}
                    setOpen={setOpenSubjects}
                    setValue={setValueSubjects}
                    setItems={setSubjects}
                    ScrollView={false}
                    style={{...eventStyles.style, marginBottom: 10, marginTop: 10}}
                    dropDownContainerStyle={eventStyles.dropDownContainerStyle}
                    textStyle={eventStyles.textStyle}
                    arrowIconContainerStyle={eventStyles.arrowIconContainerStyle}
                />
            )
        } else if(item.type === 'classesPicker') {
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
                    style={{...eventStyles.style, marginTop: 10}}
                    dropDownContainerStyle={eventStyles.dropDownContainerStyle}
                    textStyle={eventStyles.textStyle}
                    arrowIconContainerStyle={eventStyles.arrowIconContainerStyle}
                />
            )
        } else if(item.type === 'descriptionTextInput') {
            return(
                <TextInput 
                    value={currentDescription}
                    onChangeText={setCurrentDescription}
                    placeholder={getTranslatedText('addDescriptionPlaceholder')}
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
                        marginVertical: 20,
                        height: 100,
                        backgroundColor: theme.secondary,
                        flexWrap: 'wrap',
                        textAlignVertical: 'top'
                    }}
                />
            )
        } else if(item.type === 'dateTimePickers') {
            if(Platform.OS === 'android') {
                return(
                    <View style={{marginBottom: 20, alignItems: 'center'}}>

                        <Text style={{...styles.littleText, marginBottom: 5}}>{getTranslatedText('chooseDeadline')}</Text>

                        <TouchableOpacity onPress={() => showMode('date')} style={eventStyles.dateTimeButtons}>
                            <Text style={{fontSize: 20, color: 'white'}}>{getTranslatedText('day')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showMode('time')} style={eventStyles.dateTimeButtons}>
                            <Text style={{fontSize: 20, color: 'white'}}>{getTranslatedText('hour')}</Text>
                        </TouchableOpacity>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
                            <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 20, color: 'white'}}>{getTranslatedText('choosenDeadline')}:</Text>
                            <Text style={{fontSize: 20, color: 'white'}}>{selectedDate}</Text>
                        </View>
    
                        {show && (
                            <DateTimePicker
                                mode={mode}
                                value={date}
                                is24Hour={true}
                                onChange={onChange}
                                minuteInterval={5}
                                locale='pl-PL'
                                themeVariant='dark'
                            />
                        )}
                    </View>
                )
            } else if(Platform.OS === 'ios') {
                return (
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 20, color: theme.textSecondary, textTransform: 'uppercase',marginVertical: 10}}>{getTranslatedText('chooseDeadline')}</Text>
                        <DateTimePicker
                            mode='datetime'
                            value={date}
                            is24Hour={true}
                            onChange={onChange}
                            minuteInterval={5}
                            locale='pl-PL'
                            themeVariant='dark'
                            display='spinner'
                            timeZoneName={'Europe/Warsaw'}
                            style={{marginBottom: 40, borderRadius: 20,  borderColor: theme.primary}}
                            textColor={theme.textPrimary}
                        />
                    </View>
                )
            }
        } else if(item.type === 'notes') {
            return data.map((element, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('ReadNoteScreen', { noteID: element.note_id })} style={eventStyles.noteStyle}>
        
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Checkbox
                            value={checkedNotes[index]}
                            onValueChange={() => handleNoteCheckboxChange(index)}
                            color={checkedNotes[index] ? theme.primary : undefined }
                        />
                    </View>

                    <View style={{flex: 8}}>
                        <View>
                        <Text style={styles.headlineText}>{element.title}</Text>
                        </View>
            
                        <View style={{flex: 1, backgroundColor: theme.textSecondary, height: 1, marginBottom: 7}} />
            
                        <View style={eventStyles.infoView}>
                        <FontAwesome5 name="book" size={18} color={theme.textSecondary} style={{flex: 1}}/>
                        <Text style={eventStyles.infoText}>{element.subject_name}</Text>
                        </View>
            
                        <View style={eventStyles.infoView}>
                        <FontAwesome5 name="info-circle" size={18} color={theme.textSecondary} style={{flex: 1}} />
                        <Text style={eventStyles.infoText}>{element.class_name}</Text>
                        </View>
            
                        <View style={eventStyles.noteDataView}>
                            <Text style={eventStyles.noteDataText}>{element.create_day}</Text>
                        </View>
                    </View>

                  </TouchableOpacity>
                )
              })
        } else if(item.type === 'addButton') {
            return(
                <>
                    {completeFieldsInfo && (
                        <Text style={{color: 'red', textAlign: 'center'}}>Wszystkie pola muszą być uzupełnione!</Text>
                    )}
                    <MakeButton onPress={handleAddEvent}/>
                </>
            )
        }
    }


    
    const eventStyles = StyleSheet.create({
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
        dateTimeButtons: {
            height: 50,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 5,
            borderRadius: 20,
            width: '100%'
        },
        arrowIconContainerStyle: {
            backgroundColor: theme.primary,
            borderRadius: 5
        },
        noteStyle: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderRadius: 20,
            padding: 12,
            marginBottom: 20, 
            borderColor: theme.textSecondary, 
            borderWidth: 1,
            flexDirection: 'row'
        },
        infoView: {
            flexDirection: 'row',
            marginTop: 5,
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
            textTransform: 'uppercase',
            flex: 15
        },
    });



    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('add')} {getTranslatedText('events')}</Text>
            </View>

            <View style={styles.flatlistContainer}>
                <FlatList 
                    data={[
                        { type: 'addButton' },
                        { type: 'notes' },
                        { type: 'dateTimePickers' },
                        { type: 'descriptionTextInput' },
                        { type: 'subjectsPicker' },
                        { type: 'classesPicker' },
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
