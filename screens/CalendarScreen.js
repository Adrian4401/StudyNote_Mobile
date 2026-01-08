import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

import { loadEvents } from '../database/queries';

import { CustomStatusBar } from '../components/StatusBar';

import { showEvents } from '../components/ShowEvents';

import { createDate } from '../utils/date';

import { useLanguage } from '../context/LanguageContext';
import appLanguage from "../utils/languages";

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../assets/styles/index';

import { Safearea } from '../components/SafeArea';




export default function CalendarScreen() {
  const { language } = useLanguage();
  const { theme } = useDarkMode();

  const navigation = useNavigation();

  const [weeklyData, setWeeklyData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [olderData, setOlderData] = useState([]);

  const todayDate = createDate()
  
  const styles = createStyles(theme)
  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }


  
  useEffect(() => {
    const loadData = navigation.addListener('focus', () => {
      loadEvents(setWeeklyData, setFutureData, setOlderData)
    });

    return () => {
      loadData()
    } 
  }, [navigation, loadEvents, setWeeklyData, setFutureData, setOlderData])



  const showThisWeekEvents = () => {
    return (
      <>
        <View style={{width: '100%'}}>
          <Text style={{...styles.headlineText, marginBottom: 0, marginTop: 10}}>{getTranslatedText('thisWeekEventsText')}</Text>
          <Text style={styles.littleText}>{getTranslatedText('thisWeekEventsLittleText')}</Text>
        </View>

        {showEvents(weeklyData, navigation)}
      </>
    )
  }


  const showFutureEvents = () => {
    return (
      <>
        <View style={styles.headlineView}>
          <Text style={{...styles.headlineText, marginBottom: 0, marginTop: 10}}>{getTranslatedText('futureEventsText')}</Text>
        </View>

        {showEvents(futureData, navigation)}
      </>
    )
  }


  const showOlderEvents = () => {
    return (
      <>
        <View style={styles.headlineView}>
          <Text style={{...styles.headlineText, marginBottom: 0, marginTop: 10}}>{getTranslatedText('olderEventsText')}</Text>
        </View>

        {showEvents(olderData, navigation)}
      </>
    )
  }




  const ShowAllEvents = () => {
    if(weeklyData.length <= 0 && futureData.length <= 0 && olderData.length <= 0) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text style={{color: theme.textSecondary, fontSize: 20, marginTop: '30%', marginBottom: '5%', textTransform: 'uppercase'}}>{getTranslatedText('emptyEventsText')}</Text>
          <FontAwesome name="folder-open" size={50} color={theme.textSecondary} />
        </View>
      )
    }
    else {
      return (
        <>
          {weeklyData.length > 0 && showThisWeekEvents()}
          {futureData.length > 0 && showFutureEvents()}
          {olderData.length > 0 && showOlderEvents()}
        </>
      );
    }
  }



  const calendarStyles = StyleSheet.create({
    headlineUserView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: theme.inputBackground,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20
    },
    headlineUserText: {
      fontSize: 25, 
      textTransform: 'uppercase', 
      color: theme.textPrimary,
      flex: 2
    },
    eventNameView: {
      width: '100%',
      padding: 5,
      backgroundColor: theme.eventBackground,
      borderRadius: 15,
      alignItems: 'center'
    },
    eventNameText: {
      fontSize: 25,
      textTransform: 'uppercase',
      color: '#fff'
    }
  });



  return (
    <Safearea>
      <CustomStatusBar />
      
      {/* HEADER */}
      <View style={styles.headerBackground}>
          <Text style={styles.headerText}>{getTranslatedText('calendarScreenTitle')}</Text>
      </View>

      {/* CONTAINER */}
      <ScrollView>
        <View style={styles.viewContainer}>
          
          {/* USER HEADLINE */}
          <View style={styles.headlineView}>
            <View style={calendarStyles.headlineUserView}>
              <FontAwesome5 name="calendar-day" size={22} color={theme.textPrimary} />
              <Text style={{...calendarStyles.headlineUserText, fontSize: 20, textAlign: 'center'}}>{todayDate}</Text>
            </View>
          </View>

          <ShowAllEvents />

        </View>
      </ScrollView>

      <View style={{width: '100%',height: 40}} />

    </Safearea>
  );
}