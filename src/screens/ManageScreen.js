import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import { useLanguage } from '../context/LanguageContext';
import appLanguage from "../utils/languages";

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../styles/index';

import { Safearea } from '../components/SafeArea.js';

import { getAllSubjects } from '../api/subjects';
import { getAllClasses } from '../api/classes';

import { useAuth } from '../context/AuthContext.js';




export default function ManageScreen() {
  const { userToken } = useAuth()
  const navigation = useNavigation();

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  const { language } = useLanguage();

  const { theme } = useDarkMode()
  const styles = createStyles(theme)

  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }


  useFocusEffect(
    useCallback(() => {
        const loadSubjects = async () => {
            if (!userToken) return

            try {
                const data = await getAllSubjects(userToken)
                setSubjects(data)
            } catch (error) {
                console.log('Loading subjects failed', error.message)
            }
        }
        const loadClasses = async () => {
            if (!userToken) return

            try {
                const data = await getAllClasses(userToken)
                setClasses(data)
            } catch (error) {
                console.log('Loading classes failed', error.message)
            }
        }

        loadSubjects()
        loadClasses()
    }, [userToken])
  )


  const showSubjects = () => {
    return subjects.map((subject, index) => {
        return(
            <View key={index} style={manageStyles.itemsView}>
                <Text style={manageStyles.itemsText}>{subject.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditSubjectScreen', { subjectID: subject.id, subjectName: subject.name })} style={{flex: 1, alignItems: 'flex-end'}}>
                  <MaterialIcons name="edit" size={24} color={theme.textPrimary}/>
                </TouchableOpacity>
            </View>
        )
    })
  }

  const showClasses = () => {
    return classes.map((myclass, index) => {
        return(
            <View key={index} style={manageStyles.itemsView}>
                <Text style={manageStyles.itemsText}>{myclass.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditClassScreen', { classID: myclass.id, className: myclass.name })} style={{flex: 1, alignItems: 'flex-end'}}>
                  <MaterialIcons name="edit" size={24} color={theme.textPrimary}/>
                </TouchableOpacity>
            </View>
        )
    })
  }


  const manageStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      padding: 20
    },
    itemsView: {
      width: '100%',
      backgroundColor: theme.secondary,
      borderRadius: 12,
      padding: 10,
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    itemsText: {
      fontSize: 20,
      color: theme.textPrimary,
      flex: 8
    }
  });


  return (
    <Safearea>

      {/* HEADER */}
      <View style={styles.headerBackground}>
        <Text style={styles.headerText}>{getTranslatedText('manageScreenTitle')}</Text>
      </View>


      {/* CONTAINER */}
      <View style={manageStyles.container}>
        
        {/* HEADLINE */}
        <View style={{flex: 1, width: '100%'}}>
          <View style={{...styles.headlineViewWithIcon, marginBottom: 10}}>
            <Text style={styles.headlineText}>{getTranslatedText('subjectSectionHeadline')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddSubjectScreen')}>
              <AntDesign name="plus" size={26} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{backgroundColor: theme.eventBackground, padding: 10, borderRadius: 20, flex: 0.8}}>
            <ScrollView>  
                {showSubjects()}
            </ScrollView>
          </View>
          
          
        </View>
        <View style={{flex: 1, width: '100%', marginTop: 20}}>
          <View style={{...styles.headlineViewWithIcon, marginBottom: 10}}>
            <Text style={styles.headlineText}>{getTranslatedText('classesSectionHeadline')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddClassScreen')}>
              <AntDesign name="plus" size={26} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{backgroundColor: theme.eventBackground, padding: 10, borderRadius: 20, flex: 0.8}}>
            <ScrollView>  
                {showClasses()}
            </ScrollView>
          </View>
        </View>
        
        
      </View>

      <View style={{width: '100%',height: 40}} />

    </Safearea>
  );
}
