import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons'

import appLanguage from '../utils/languages'
import { useLanguage } from '../context/LanguageContext'

import { useDarkMode } from '../context/DarkModeContext';
import { createStyles } from '../assets/styles/index';



export const GoBackButton = () => {
    const navigation = useNavigation();

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    return (
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()} >
            <AntDesign name="left" size={25} color={theme.textPrimary} style={{marginRight: 5}} />
            <Text style={styles.goBackText}>{getTranslatedText('goBack')}</Text>
        </TouchableOpacity>
    )
}

export const MakeButton = ({onPress}) => {
    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    return (
        <TouchableOpacity style={styles.makeButton} onPress={onPress} >
            {/* <FontAwesome5 name="plus" size={40} color="#fff" /> */}
            <Text style={{fontSize: 22, paddingVertical: 2, color: theme.textPrimary, textTransform: 'uppercase', fontWeight: '500'}}>{getTranslatedText('add')}</Text>
        </TouchableOpacity>
    )
}

export const EditButton = ({onPress}) => {
    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    return (
        <TouchableOpacity style={styles.makeButton} onPress={onPress} >
            {/* <MaterialIcons name="edit" size={40} color='white'/> */}
            <Text style={{fontSize: 22, paddingVertical: 2, color: theme.textPrimary, textTransform: 'uppercase', fontWeight: '500'}}>{getTranslatedText('edit')}</Text>
        </TouchableOpacity>
    )
}

export const SettingsScreenButton = ({onPress, icon, text}) => {
    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    return (
        <TouchableOpacity onPress={onPress} style={{...styles.eventView, flexDirection: 'row', paddingHorizontal: 20}}>
            <MaterialCommunityIcons name={icon} size={24} color={theme.primary} style={{paddingHorizontal: 5}}/>
            <Text style={styles.subjectText}>{text}</Text>
        </TouchableOpacity>
    )
}

// const styles = StyleSheet.create ({
//     goBackButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10
//     },
//     goBackText: {
//         color: '#fff',
//         fontSize: 25,
//         paddingRight: 5
//     },
//     makeButton: {
//         width: '100%',
//         flexDirection: 'row',
//         backgroundColor: MyColors.appBlue,
//         paddingVertical: 5,
//         borderRadius: 20,
//         justifyContent: 'center',
//         marginTop: 20
//     },
//     makeText: {
//         color: '#fff',
//         fontSize: 25,
//         paddingRight: 5
//     }
// });