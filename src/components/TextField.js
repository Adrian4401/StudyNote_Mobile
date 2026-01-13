import { View, TextInput, StyleSheet } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useDarkMode } from '../context/DarkModeContext'

export const TextField = ({ placeholder, secureTextEntry, onChangeText, icon }) => {
    const { theme } = useDarkMode()

    const styles = StyleSheet.create({
        searchSection: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.textPrimary,
            marginBottom: 20,
        },
        searchIcon: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            flex: 1,
            textAlign: 'center',
        },
        input: {
            flex: 1,
            paddingTop: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 0,
            backgroundColor: theme.background,
            color: theme.textPrimary,
            borderRadius: 10,
            flex: 9
        },
    })

    return (
        <View style={styles.searchSection}>
            <FontAwesome6 style={styles.searchIcon} name={icon} size={20} color={theme.textPrimary} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                onChangeText={onChangeText}
                underlineColorAndroid="transparent"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )

    
}

