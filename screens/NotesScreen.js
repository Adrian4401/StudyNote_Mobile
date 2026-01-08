import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import { FontAwesome5, AntDesign, FontAwesome } from '@expo/vector-icons';

import { selectAllNotesWithSubjects, selectChosenNotes } from '../database/queries.js';

import { useLanguage } from '../context/LanguageContext';
import appLanguage from "../utils/languages";

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../assets/styles/index';

import { Safearea } from '../components/SafeArea.js';



export default function NoteScreen() {

  const navigation = useNavigation();

  const [openSubjects, setOpenSubjects] = useState(false);
  const [valueSubjects, setValueSubjects] = useState(null);
  const { language } = useLanguage();

  const [subjects, setSubjects] = useState([]);

  const [data, setData] = useState([]);

  const { theme } = useDarkMode()
  const styles = createStyles(theme)



  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }

  useEffect(() => {

    // const getTranslatedText = (key) => {
    //   return appLanguage[language][key];
    // }

    const loadData = navigation.addListener('focus', () => {
      selectAllNotesWithSubjects(setSubjects, setData);
      setValueSubjects(null);
    });

    selectChosenNotes(valueSubjects, setData);

    return loadData;

  }, [navigation, valueSubjects, setData])

  

  const subjectOptions = subjects.map(subject => {
    return { label: subject.subject_name, value: subject.subject_id.toString() };
  });




  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={{...styles.headlineViewWithIcon, marginTop: 30}}>
          <Text style={{...styles.headlineText, marginBottom: 0}}>{getTranslatedText('yourNotesHeadline')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddNoteScreen')}>
            <AntDesign name="plus" size={26} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      );
    } else if (item.type === 'subjectsDropdown') {
      return (
        <View style={{...styles.headlineViewWithIcon, marginBottom: 40}}>
            <DropDownPicker
              placeholder={getTranslatedText('chooseSubjectDropdownPlaceholder')}
              open={openSubjects}
              value={valueSubjects}
              items={subjectOptions}
              setOpen={setOpenSubjects}
              setValue={setValueSubjects}
              setItems={setSubjects}
              ScrollView={false}
              style={notesStyles.style}
              dropDownContainerStyle={notesStyles.dropDownContainerStyle}
              textStyle={notesStyles.textStyle}
              arrowIconContainerStyle={notesStyles.arrowIconContainerStyle}
            />
        </View>
      );
    } else if (item.type === 'note' && data) {
      return data.map((element, index) => {
        return (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('ReadNoteScreen', { noteID: element.note_id })} style={notesStyles.noteStyle}>

            <View>
              <Text style={styles.headlineText}>{element.title}</Text>
            </View>

            <View style={{flex: 1, backgroundColor: theme.textSecondary, height: 1, marginBottom: 7}} />

            <View style={notesStyles.infoView}>
              <FontAwesome5 name="book" size={18} color={theme.textSecondary} style={{flex: 1}}/>
              <Text style={notesStyles.infoText}>{element.subject_name}</Text>
            </View>

            <View style={notesStyles.infoView}>
              <FontAwesome5 name="info-circle" size={18} color={theme.textSecondary} style={{flex: 1}} />
              <Text style={notesStyles.infoText}>{element.class_name}</Text>
            </View>

            <View style={notesStyles.noteDataView}>
                <Text style={notesStyles.noteDataText}>{element.create_day}</Text>
            </View>

          </TouchableOpacity>
        )
      })
    } else if (item.type === 'emptyNotes' && data.length <= 0) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text style={{color: theme.textSecondary, fontSize: 20, marginTop: '30%', marginBottom: '5%', textTransform: 'uppercase'}}>{getTranslatedText('emptyNotesText')}</Text>
          <FontAwesome name="sticky-note" size={50} color={theme.textSecondary} />
        </View>
      )
    }
  };


  const notesStyles = StyleSheet.create({
    noteStyle: {
      width: '100%',
      backgroundColor: theme.secondary,
      borderRadius: 20,
      padding: 12,
      marginBottom: 15, 
      borderColor: theme.textSecondary, 
      borderWidth: 1
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
    style: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.primary,
      flex: 1
    },
    dropDownContainerStyle: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.primary
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
    <Safearea>

      {/* HEADER */}
      <View style={styles.headerBackground}>
          <Text style={styles.headerText}>{getTranslatedText('notesScreentitle')}</Text>
      </View>
      

      {/* CONTAINER */}
      <View style={styles.flatlistContainer}>
        <FlatList
          data={[
            { type: 'emptyNotes' },
            { type: 'note' },
            { type: 'subjectsDropdown' },
            { type: 'header' }
          ]}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexDirection: 'column-reverse', paddingBottom: 100, width: '100%'}}
        />
      </View>
        
    </Safearea>
  );
}