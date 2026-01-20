import { View, TextInput } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useDarkMode } from '../context/DarkModeContext'
import {componentsStyles} from './styles.js';

export const TextField = ({ value, placeholder, secureTextEntry, onChangeText, icon, variant }) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).textField;

    const backgroundColor = variant === 'light' ? theme.background : theme.navigation;

    return (
        <View style={[styles.searchSection, { backgroundColor }]}>
            {icon && <FontAwesome6 style={styles.searchIcon} name={icon} size={20} color={theme.textPrimary} />}
            <TextInput
                value={value}
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

