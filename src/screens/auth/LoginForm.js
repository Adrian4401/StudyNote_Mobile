import { useState } from 'react'
import { View } from 'react-native'
import { Fumi } from 'react-native-textinput-effects';
import { FontAwesome6 } from '@expo/vector-icons'
import { useDarkMode } from '../../context/DarkModeContext'

export const LoginForm = ({ emailPlaceholder, passwordPlaceholder, onChangeEmail, onChangePassword }) => {
    const { theme } = useDarkMode()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (value) => {
        setEmail(value)
        onChangeEmail(value)
    }

    const handlePasswordChange = (value) => {
        setPassword(value)
        onChangePassword(value)
    }

    return (
        <View>
            <Fumi
                label={emailPlaceholder}
                iconClass={FontAwesome6}
                iconName={'envelope-circle-check'}
                iconColor={theme.primary}
                iconSize={20}
                iconWidth={46}
                inputPadding={16}
                inputStyle={{ color: theme.textPrimary, paddingLeft: 8 }}
                onChangeText={handleEmailChange}
                style={{ backgroundColor: theme.background, marginBottom: 20, borderRadius: 10 }}
                labelStyle={{ color: theme.textSecondary, paddingLeft: 8 }}
            />
            <Fumi
                label={passwordPlaceholder}
                iconClass={FontAwesome6}
                iconName={'lock'}
                iconColor={theme.primary}
                iconSize={20}
                iconWidth={46}
                inputPadding={16}
                secureTextEntry={true}
                inputStyle={{ color: theme.textPrimary, paddingLeft: 8 }}
                onChangeText={handlePasswordChange}
                style={{ backgroundColor: theme.background, marginBottom: 30, borderRadius: 10 }}
                labelStyle={{ color: theme.textSecondary, paddingLeft: 8 }}
            />
        </View>
    )
}