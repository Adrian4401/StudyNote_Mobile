import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons';

import { CustomStatusBar } from '../components/StatusBar';

import { showEvents } from '../components/ShowEvents';

import { textDate } from '../utils/date';

import { useLanguage } from '../context/LanguageContext';
import appLanguage from "../utils/languages";

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../styles/index';

import { Safearea } from '../components/SafeArea';

import { useAuth } from '../context/AuthContext';

import { getAllEvents } from '../api/events';

import { LoadingIndicator } from '../components/LoadingIndicator';




export default function CalendarScreen() {
  const { userToken } = useAuth()
  const { language } = useLanguage();
  const { theme } = useDarkMode();
  const { user } = useAuth();

  const navigation = useNavigation();

  const [weeklyData, setWeeklyData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [olderData, setOlderData] = useState([]);
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  const styles = createStyles(theme)
  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }


  useFocusEffect(
    useCallback(() => {
      const loadEvents = async () => {
        if (!userToken) {
          setLoading(false)
          return
        }

        setLoading(true)

        try {
          const data = await getAllEvents(userToken)
          const { weekly, future, older } = splitEventsByDate(data)

          setEvents(data)
          setWeeklyData(weekly)
          setFutureData(future)
          setOlderData(older)

          console.log('Events loaded successfully')
        } catch (error) {
          console.log('Loading events failed: ', error.errorCode)
        } finally {
          setLoading(false)
        }
      }

      loadEvents()
    }, [userToken])
  )



  const splitEventsByDate = (events) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)

      const weekly = []
      const future = []
      const older = []

      events.forEach((event) => {
          const eventDate = new Date(event.deadline)
          const eventDay = new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate()
          )

          if (eventDay < today) {
              older.push(event)
          } else if (eventDay <= nextWeek) {
              weekly.push(event)
          } else {
              future.push(event)
          }
      })

      return { weekly, future, older }
  }



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
          <Text style={{color: theme.textSecondary, fontSize: 20, marginTop: '50%', marginBottom: '5%', textTransform: 'uppercase'}}>{getTranslatedText('emptyEventsText')}</Text>
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
      flexDirection: 'column',
      gap: 10,
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingVertical: 10,
      borderRadius: 20
    },
    headlineUserText: {
      fontSize: 24, 
      color: theme.textPrimary,
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
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={calendarStyles.headlineUserText}>
                    Witaj <Text style={{color: theme.primary}}>{user?.username}</Text>!
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AddEventScreen')}>
                    <AntDesign name="plus" size={26} color={theme.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome5 name="calendar-day" size={14} color={theme.textSecondary} style={{marginRight: 14}} />
                <Text style={{...calendarStyles.headlineUserText, textAlign: 'center', fontSize: 16, color: theme.textSecondary}}>{getTranslatedText('todayDate')} {textDate(language)}</Text>
              </View>
            </View>
          </View>

          {loading ? (
            <View style={{alignItems: 'center'}}>
              <LoadingIndicator />
            </View>
          ) : (
            <ShowAllEvents />
          )}

        </View>
      </ScrollView>

      <View style={{width: '100%', height: 40}} />

    </Safearea>
  );
}