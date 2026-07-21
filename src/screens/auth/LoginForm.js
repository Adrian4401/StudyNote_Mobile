import { useState } from 'react'
import { View, Text } from 'react-native'
import { useDarkMode } from '../../context/DarkModeContext'
import { login } from '../../api/auth';
import { AuthButton } from '../../components/Buttons'
import appLanguage from '../../utils/languages'
import { useLanguage } from '../../context/LanguageContext'
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext'
import { Error } from '../../components/Errors';
import { LoadingIndicator } from '../../components/LoadingIndicator';

export const LoginForm = () => {
    const { theme } = useDarkMode()
    const { setUserToken, setUser } = useAuth()

    const [emailOrUsername, setEmailOrUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorCode, setErrorCode] = useState('')
    const [loading, setLoading] = useState(false)

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    const handleEmailOrUsername = (value) => {
        setEmailOrUsername(value)
    }

    const handlePasswordChange = (value) => {
        setPassword(value)
    }

    const onLogin = async () => {
        setLoading(true)
        setErrorCode('')

        try {
            const response = await login({ emailOrUsername, password });

            setUserToken(response.token);
            setUser(response.user);

            console.log('Token: ', response.token);
        } catch (error) {
            setErrorCode(error.message)
            console.error('Login failed:', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <View>
            <TextField
                placeholder={getTranslatedText('emailPlaceholder')}
                onChangeText={handleEmailOrUsername}
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
                text={
                    loading
                    ? <LoadingIndicator />
                    : getTranslatedText('loginButton')
                } 
                onPress={onLogin}
                disabled={loading}
            />

            {errorCode ? (
                <Error
                    message={errorCode}
                    getTranslatedText={getTranslatedText}
                />
            ): null}
        </View>
    )
}