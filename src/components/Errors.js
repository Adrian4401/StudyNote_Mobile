import { View, Text, StyleSheet } from "react-native"

export const Error = ({ message, getTranslatedText }) => {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{getTranslatedText(message)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        padding: 10,
        backgroundColor: '#F59099',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
})