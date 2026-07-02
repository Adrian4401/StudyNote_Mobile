import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import { FontAwesome5, AntDesign, FontAwesome } from '@expo/vector-icons';

import { useLanguage } from '../context/LanguageContext';
import appLanguage from "../utils/languages";

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../styles/index';

import { Safearea } from '../components/SafeArea.js';
import { useAuth } from '../context/AuthContext';
import { getAllNotes } from '../api/notes';
import { getAllSubjects } from '../api/subjects';

import { textDate } from '../utils/date';




export default function NoteScreen() {
  const { userToken } = useAuth()
  const navigation = useNavigation();

  const [openSubjects, setOpenSubjects] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const { language } = useLanguage();

  const [subjects, setSubjects] = useState([]);

  const [data, setData] = useState([]);

  const { theme } = useDarkMode()
  const styles = createStyles(theme)



  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }

  useFocusEffect(
    useCallback(() => {
        const loadNotes = async () => {
            if (!userToken) return

            try {
                const data = await getAllNotes(userToken)
                setData(data)
            } catch (error) {
                console.log('Loading notes failed', error.message)
            }
        }

        const loadSubjects = async () => {
          if (!userToken) return

          try {
            const data = await getAllSubjects(userToken)
            setSubjects(data)
          } catch (error) {
            console.log('loading subjects failed: ', error.errorCode)
          }
        }

        loadNotes()
        loadSubjects()
    }, [userToken])
  )

  

  const subjectOptions = subjects.map(subject => {
    return { label: subject.name, value: subject.id.toString() };
  });


  const filteredNotes = selectedSubjectId
    ? data.filter(note => String(note.subjectId) === String(selectedSubjectId))
    : data


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
    } else if (item.type === 'subjectsDropdown' && data.length > 0) {
      return (
        <View style={{...styles.headlineViewWithIcon, marginBottom: 40}}>
            <DropDownPicker
              placeholder={getTranslatedText('chooseSubjectDropdownPlaceholder')}
              open={openSubjects}
              value={selectedSubjectId}
              items={subjectOptions}
              setOpen={setOpenSubjects}
              setValue={setSelectedSubjectId}
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
      return filteredNotes.map((element, index) => {
        return (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('ReadNoteScreen', { noteId: element.note_id })} style={notesStyles.noteStyle}>

            <View>
              <Text style={styles.headlineText}>{element.title}</Text>
            </View>

            <View style={{flex: 1, backgroundColor: theme.textSecondary, height: 1, marginVertical: 10}} />

            <View style={{flexDirection: 'row', alignItems: 'center',  marginBottom: 6}}>
              {/* <View style={notesStyles.infoView}> */}
                <FontAwesome5 name="book" size={14} color={theme.textSecondary} />
                <Text style={{...notesStyles.infoText, marginLeft: 10}}>{element.subject_name} - </Text>
              {/* </View> */}

              {/* <View style={notesStyles.infoView}> */}
                {/* <FontAwesome5 name="info-circle" size={14} color={theme.textSecondary} /> */}
                <Text style={notesStyles.infoText}>{element.class_name}</Text>
              {/* </View> */}
            </View>

            

            <View style={notesStyles.noteDataView}>
                <Text style={notesStyles.noteDataText}>{getTranslatedText('noteCreated')} {textDate(language)}</Text>
            </View>

          </TouchableOpacity>
        )
      })
    } else if (item.type === 'emptyNotes' && data.length <= 0) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text style={{color: theme.textSecondary, fontSize: 20, marginTop: '50%', marginBottom: '5%', textTransform: 'uppercase'}}>{getTranslatedText('emptyNotesText')}</Text>
          <FontAwesome name="sticky-note" size={50} color={theme.textSecondary} />
        </View>
      )
    }
  };


  const notesStyles = StyleSheet.create({
    noteStyle: {
      width: '100%',
      backgroundColor: theme.secondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 15, 
      borderColor: theme.textSecondary, 
      borderWidth: 1
    },
    infoView: {
      flexDirection: 'row',
      marginTop: 5,
      alignItems: 'center',
    },
    infoText: {
      fontSize: 14,
      color: theme.textSecondary,
      // marginLeft: 10
    },
    noteDataView: {
      alignItems: 'flex-end',
      marginTop: 2,
      paddingHorizontal: 5
    },
    noteDataText: {
      fontSize: 12,
      color: theme.textSecondary,
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