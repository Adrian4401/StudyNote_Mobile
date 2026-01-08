import { TouchableOpacity, View, Text } from "react-native"

import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';

import appLanguage from "../utils/languages";
import valueLanguages from "../screens/SettingsScreen";

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../assets/styles/index';




export const getTranslatedText = (key) => {
  return appLanguage[valueLanguages][key];
}


export const showEvents = (dataType, navigation) => {
    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    return dataType.map((element) => {
      return (
        <TouchableOpacity key={element.event_id} onPress={() => navigation.navigate('ReadEventScreen', { eventID: element.event_id })} style={styles.eventView}>
          <View style={styles.eventNameView}>
            <Text style={styles.eventNameText}>{element.title}</Text> 
          </View>

          <View style={styles.eventSubjectView}>
            <FontAwesome5 name="book" size={20} color={theme.textPrimary}/>
            <Text style={styles.subjectText}>{element.subject_name}</Text>
          </View>

          <View>
            <View style={styles.eventDatetimeView}>
              <Ionicons name="calendar-clear" size={18} color={theme.textSecondary} style={{marginRight: 10}} />
              <Text style={styles.littleText}>{element.deadlineDate}</Text>
            </View>
            <View style={{...styles.eventDatetimeView, marginTop: 5}}>
              <AntDesign name="clockcircle" size={18} color={theme.textSecondary} style={{marginRight: 10}} />
              <Text style={styles.littleText}>{element.deadlineTime}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })
  }