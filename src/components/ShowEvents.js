import { TouchableOpacity, View, Text } from "react-native"
import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import appLanguage from "../utils/languages";
import valueLanguages from "../screens/SettingsScreen";
import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../styles/index';
import { componentsStyles } from "./styles";


export const getTranslatedText = (key) => {
  return appLanguage[valueLanguages][key];
}


export const showEvents = (dataType, navigation) => {
  const { theme } = useDarkMode()
  const globalStyles = createStyles(theme)
  const styles = componentsStyles(theme).events

  return dataType.map((element) => {
    const deadline = new Date(element.deadline)

    const eventDate = deadline.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const eventTime = deadline.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <TouchableOpacity
        key={element.id}
        onPress={() => navigation.navigate('ReadEventScreen', { eventID: element.id })}
        style={styles.container}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{element.title}</Text> 
        </View>

        <View style={styles.subjectContainer}>
          <FontAwesome5 name="book" size={18} color={theme.textPrimary}/>
          <Text style={styles.subjectText}>{element.subject.name}</Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={styles.dateAndTimeContainer}>
            <Ionicons name="calendar-clear" size={14} color={theme.textSecondary} style={{marginRight: 10}} />
            <Text style={globalStyles.littleText}>{eventDate}</Text>
          </View>

          <View style={styles.dateAndTimeContainer}>
            <AntDesign name="clockcircle" size={14} color={theme.textSecondary} style={{marginRight: 10}} />
            <Text style={globalStyles.littleText}>{eventTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  })
}