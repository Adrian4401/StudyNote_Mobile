import { useState } from 'react';
import { StyleSheet, Text, View, Image, Switch, Platform, FlatList } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import { createStyles } from '../assets/styles/index';

import { SettingsScreenButton } from '../components/Buttons';

import { alertDeleteAllData } from '../components/Alerts';

import appLanguage from "../utils/languages";
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Safearea } from '../components/SafeArea';



export default function SettingsScreen() {
  const [openLanguages, setOpenLanguages] = useState(false);
  // const [valueLanguages, setValueLanguages] = useState('pl');
  const { language, changeLanguage } = useLanguage();
  const [languages, setLanguages] = useState([
    {label: 'Polski', value: 'pl', icon: () => <Image source={require('../assets/pl_flag.png')} style={{borderRadius: 20, marginHorizontal: 5}}/>},
    {label: 'English', value: 'en', icon: () => <Image source={require('../assets/uk_flag.png')} style={{borderRadius: 20, marginHorizontal: 5}}/>}
  ]);
  const { darkMode, changeDarkMode, theme } = useDarkMode()
  const styles = createStyles(theme)


  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }

  const handleLanguageChange = (value) => {
    console.log('Wybrany jezyk: ', value)
    changeLanguage(value)
  }

  const handleDarkModeChange = (value) => {
    console.log('Wybrany darkmode: ', value)
    changeDarkMode(value)
  }

  const handleDeleteAllData = () => {
    alertDeleteAllData(getTranslatedText)
  }

  const renderItem = ({ item }) => {
    if (item.type === 'language') {
      return (
        <>
          <View style={styles.headlineView}>
            <Text style={styles.sectionText}>{getTranslatedText('languageText')}</Text>
          </View>
          <DropDownPicker
            placeholder='Wybierz język'
            open={openLanguages}
            value={language}
            items={languages}
            setOpen={setOpenLanguages}
            setValue={(callback) => {
              const value = typeof callback === 'function' ? callback(language) : callback;
              handleLanguageChange(value);
            }}
            setItems={setLanguages}
            ScrollView={false}
            style={settingsStyles.dropDownStyle}
            dropDownContainerStyle={settingsStyles.dropDownContainerStyle}
            textStyle={settingsStyles.dropDownTextStyle}
            arrowIconContainerStyle={settingsStyles.arrowIconContainerStyle}
          />
        </>
      )
    }
    if (item.type === 'rest') {
      return (
        <>
          {/* DARK THEME section */}
          <View style={styles.headlineView}>
            <Text style={styles.sectionText}>{getTranslatedText('themeText')}</Text>
          </View>

          <View style={{...styles.eventView, flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center'}}>
            <MaterialCommunityIcons name="invert-colors" size={24} color={theme.primary} style={{paddingHorizontal: 5}}/>
            <Text style={styles.subjectText}>{darkMode ? getTranslatedText('dark') : getTranslatedText('light')}</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeChange}
                trackColor={{false: theme.textSecondary, true: theme.primary}}
                thumbColor={darkMode ? '#0066CD' : '#BDBBBB'}
                style={{height: Platform.OS === 'android' ? 20 : 30}}
              />
            </View>
          </View>

          {/* DATA section */}
          
          {/* <View style={styles.headlineView}>
            <Text style={styles.sectionText}>{getTranslatedText('dataText')}</Text>
          </View> */}
          {/* <SettingsScreenButton onPress={() => console.log("To do")} icon={"file-export"} text={getTranslatedText('dataExportButton')}/> */}
          {/* <SettingsScreenButton onPress={() => console.log("To do")} icon={"file-import"} text={getTranslatedText('dataImportButton')}/> */}

          <View style={styles.headlineView}>
            <Text style={styles.sectionText}>{getTranslatedText('deleteDataText')}</Text>
          </View>
          <SettingsScreenButton onPress={handleDeleteAllData} icon={"delete"} text={getTranslatedText('deleteDataButton')}/>
        </>
      )
    }
  }

  const settingsStyles = StyleSheet.create({
    dropDownStyle: {
      backgroundColor: theme.secondary,
      flex: 1,
      borderRadius: 20,
      borderWidth: 0
    },
    dropDownContainerStyle: {
      backgroundColor: theme.secondary,
      paddingVertical: 5,
      borderWidth: 1
    },
    dropDownTextStyle: {
      color: theme.textPrimary,
      fontSize: 20
    },
    arrowIconContainerStyle: {
      backgroundColor: theme.primary,
      borderRadius: 5,
      marginEnd: 5
    }
  });


  return (
    <Safearea>

      <View style={styles.headerBackground}>
          <Text style={styles.headerText}>{getTranslatedText('settingsScreenTitle')}</Text>
      </View>

      <View style={styles.flatlistContainer}>
        <FlatList
          data={[
            { type: 'rest' },
            { type: 'language' }
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