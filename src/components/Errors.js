import { View, Text } from "react-native"
import { componentsStyles } from "./styles"

export const Error = ({ message, getTranslatedText }) => {
    const styles = componentsStyles()
    
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{getTranslatedText(message)}</Text>
        </View>
    )
}