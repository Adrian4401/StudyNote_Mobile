import { Text, View, Image, KeyboardAvoidingView, Keyboard, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { SafeareaAuth } from '../../components/SafeArea'
import { createStyles } from '../../styles'
import { useDarkMode } from '../../context/DarkModeContext'
import { AuthButton } from '../../components/Buttons'
import { FontAwesome6 } from '@expo/vector-icons'
import { fontSizes } from '../../styles/typography'
import { Error } from '../../components/Errors'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useState } from 'react'
import appLanguage from '../../utils/languages'
import { useLanguage } from '../../context/LanguageContext'
import { login } from '../../api/auth';
import { KeyboardAvoidingWrapper } from '../../components/KeyboardAvoidingWrapper'


export default function AuthScreen() {
  const { setUserToken } = useAuth()
  const { theme } = useDarkMode()
  const styles = createStyles(theme)
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const { language } = useLanguage();
  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  }

  const onLogin = async () => {
    // await setUserToken('dummy-token')

    try {
      const response = await login({ email, password });
      setUserToken(response.token);
      console.log('Token: ', response.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  onRegister = () => {
    console.log('Register pressed')
  }

  const changeForm = () => {
    setIsRegistering(!isRegistering)
  }

  return (
  <SafeareaAuth>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Logo />
          <View style={{ flex: 3, justifyContent: 'space-between', backgroundColor: theme.newBackground, width: '100%', padding: 20, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <Header title={isRegistering ? getTranslatedText('registerTitle') : getTranslatedText('loginTitle')} />
            </View>

            <View style={{ flex: 3, justifyContent: 'center' }}>
              {isRegistering 
                ? <RegisterForm 
                    usernamePlaceholder={getTranslatedText('usernamePlaceholder')} 
                    passwordPlaceholder={getTranslatedText('passwordPlaceholder')} 
                    repeatPasswordPlaceholder={getTranslatedText('repeatPasswordPlaceholder')} 
                  /> 
                : <LoginForm 
                    usernamePlaceholder={getTranslatedText('usernamePlaceholder')} 
                    passwordPlaceholder={getTranslatedText('passwordPlaceholder')} 
                    onChangeEmail={setEmail} 
                    onChangePassword={setPassword} 
                  />
              }
              <AuthButton 
                text={isRegistering ? getTranslatedText('registerButton') : getTranslatedText('loginButton')} 
                onPress={isRegistering ? onRegister : onLogin} 
              />
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 20 }}>
                <Text style={{ color: theme.textSecondary }}>
                  {isRegistering ? getTranslatedText('haveAccountText') : getTranslatedText('noAccountText')}
                </Text>
              </View>
              <AuthButton 
                text={isRegistering ? getTranslatedText('loginButton') : getTranslatedText('registerButton')} 
                onPress={changeForm} 
                outlined 
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </SafeareaAuth>
)

}

const Logo = () => {
  return (
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingTop: 20}}>
      <Image
        source={require('../../../assets/icons/new_logo.png')}
        style={{ width: 40, height: 50 }}
        resizeMode='contain'
      />
      <Image
        source={require('../../../assets/icons/new_title.png')}
        style={{ width: 220, height: 36 }}
        resizeMode="contain"
      />
    </View>
  )
}

const Header = ({title}) => {
  const { theme } = useDarkMode()

  return(
    <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 20}}>
      <Text style={{fontSize: fontSizes.large + 6, color: theme.textPrimary}}>{title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginBottom: 6}}>
        <FontAwesome6 name="discord" size={fontSizes.medium} color={theme.textSecondary} style={{marginRight: 20}} />
        <FontAwesome6 name="square-instagram" size={fontSizes.medium} color={theme.textSecondary} style={{marginRight: 20}} />
        <FontAwesome6 name="facebook" size={fontSizes.medium} color={theme.textSecondary} />
      </View>
    </View>
  )
}