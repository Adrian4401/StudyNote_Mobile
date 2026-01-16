import { useState } from 'react'
import { View } from 'react-native'
import { useDarkMode } from '../../context/DarkModeContext'
import { register } from '../../api/auth';
import { AuthButton } from '../../components/Buttons'
import appLanguage from '../../utils/languages'
import { useLanguage } from '../../context/LanguageContext'
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext'

export const RegisterForm = ({ usernamePlaceholder, emailPlaceholder, passwordPlaceholder, repeatPasswordPlaceholder, onChangeUsername, onChangeEmail, onChangePassword, onChangeRepeatedPassword }) => {
    const { theme } = useDarkMode()
    const { setUserToken } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')

    const { language } = useLanguage();
    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    const handleUsernameChange = (value) => {
        setUsername(value)
    }

    const handleEmailChange = (value) => {
        setEmail(value)
    }

    const handlePasswordChange = (value) => {
        setPassword(value)
    }

    const handleRepeatedPasswordChange = (value) => {
        setRepeatedPassword(value)
    }

    const onRegister = async () => {
        if (password !== repeatedPassword) {
            console.error('Passwords do not match');
            return;
        }

        try {
            const response = await register({ username, email, password });
            console.log('Registration successful:', response);
            setUserToken(response.token);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    return (
        <View>
            <TextField
                placeholder={getTranslatedText('usernamePlaceholder')}
                onChangeText={handleUsernameChange}
                secureTextEntry={false}
                icon={'user-large'}
                variant={'light'}
            />
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
            <TextField
                placeholder={getTranslatedText('repeatPasswordPlaceholder')}
                onChangeText={handleRepeatedPasswordChange}
                secureTextEntry={true}
                icon={'lock'}
                variant={'light'}
            />
            <AuthButton 
                text={getTranslatedText('registerButton')} 
                onPress={onRegister} 
            />
        </View>
    )
}