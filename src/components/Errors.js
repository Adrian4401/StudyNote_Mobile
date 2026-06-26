import { View, Text } from "react-native"
import { componentsStyles } from "./styles"
import { useDarkMode } from '../context/DarkModeContext'
// import { useLanguage } from '../../context/LanguageContext'

export const Error = ({ message, getTranslatedText }) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme)

    // const { language } = useLanguage();
    // const getTranslatedText = (key) => {
    //     return appLanguage[language][key];
    // }
    
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{getTranslatedText(message)}</Text>
        </View>
    )
}