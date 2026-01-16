import { useState } from 'react'
import { View } from 'react-native'
import { useDarkMode } from '../../context/DarkModeContext'
import { login } from '../../api/auth';
import { AuthButton } from '../../components/Buttons'
import appLanguage from '../../utils/languages'
import { useLanguage } from '../../context/LanguageContext'
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext'

export const LoginForm = () => {
    const { theme } = useDarkMode()
    const { setUserToken } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    const handleEmailChange = (value) => {
        setEmail(value)
    }

    const handlePasswordChange = (value) => {
        setPassword(value)
    }

    const onLogin = async () => {
        try {
            const response = await login({ email, password });
            setUserToken(response.token);
            console.log('Token: ', response.token);
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <View>
            <TextField
                placeholder={getTranslatedText('emailPlaceholder')}
                onChangeText={handleEmailChange}
                secureTextEntry={false}
                icon={'envelope-circle-check'}
                variant={'light'}
            />
            <TextField
                placeholder={getTranslatedText('passwordPlaceholder')}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
                icon={'lock'}
                variant={'light'}
            />
            <AuthButton 
                text={getTranslatedText('loginButton')} 
                onPress={onLogin} 
            />
        </View>
    )
}