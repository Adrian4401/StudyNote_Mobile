import { Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import appLanguage from '../utils/languages'
import { useLanguage } from '../context/LanguageContext'
import { useDarkMode } from '../context/DarkModeContext';
import { componentsStyles } from './styles'
import { LinearGradient } from 'expo-linear-gradient';


export const GoBackButton = () => {
    const navigation = useNavigation();
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).buttons

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
    const styles = componentsStyles(theme).buttons

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    return (
        <TouchableOpacity style={styles.makeButton} onPress={onPress} >
            <Text style={{fontSize: 22, paddingVertical: 2, color: theme.textPrimary, textTransform: 'uppercase', fontWeight: '500'}}>{getTranslatedText('add')}</Text>
        </TouchableOpacity>
    )
}

export const EditButton = ({onPress}) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).buttons

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    return (
        <TouchableOpacity style={styles.makeButton} onPress={onPress} >
            <Text style={{fontSize: 22, paddingVertical: 2, color: theme.textPrimary, textTransform: 'uppercase', fontWeight: '500'}}>{getTranslatedText('edit')}</Text>
        </TouchableOpacity>
    )
}

export const SettingsScreenButton = ({onPress, icon, text}) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).buttons

    return (
        <TouchableOpacity onPress={onPress} style={styles.settingsScreenButton}>
            <MaterialCommunityIcons name={icon} size={24} color={theme.primary} style={{paddingHorizontal: 5}}/>
            <Text style={styles.settingsScreenButtonText}>{text}</Text>
        </TouchableOpacity>
    )
}

export const AuthButton = ({onPress, text, outlined}) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).buttons

    return (
        outlined ? 
            <TouchableOpacity style={styles.authButtonOutlined.container} onPress={onPress} >
                <Text style={styles.authButtonOutlined.text}>{text}</Text>
            </TouchableOpacity> 
            : 
            <LinearGradient
                colors={theme.gradientMain}
                style={styles.authButton.gradient}
                start={{x: 0, y: 0.75}}
                end={{x: 1, y: 0.25}}
            >
                <TouchableOpacity style={styles.authButton.container} onPress={onPress} >
                    <Text style={styles.authButton.text}>{text}</Text>
                </TouchableOpacity> 
            </LinearGradient>
    )
}