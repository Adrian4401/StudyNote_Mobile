import { useState } from 'react'
import { Text, View, Image } from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { SafeareaAuth } from '../../components/SafeArea'
import { createStyles } from '../../styles'
import { useDarkMode } from '../../context/DarkModeContext'
import { AuthButton } from '../../components/Buttons'
import { FontAwesome6 } from '@expo/vector-icons'
import { Fumi } from 'react-native-textinput-effects';
import { fontSizes } from '../../styles/typography'
import { Error } from '../../components/Errors'

export default function LoginScreen() {
  const { setUserToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { theme } = useDarkMode()
  const styles = createStyles(theme)

  const onLogin = async () => {
    await setUserToken('dummy-token')
  }

  return (
    <SafeareaAuth>
      <View style={{flex: 1}}>
          <View style={{flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 30}}>
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
          <View style={{flex: 4, justifyContent: 'space-between', backgroundColor: theme.navigation, width: '100%', padding: 20, borderTopLeftRadius: 40, borderTopRightRadius: 40}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: fontSizes.large, color: theme.textPrimary, paddingVertical: 30}}>Logowanie</Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1}}>
                <FontAwesome6 name="discord" size={24} color={theme.textSecondary} style={{marginRight: 20}} />
                <FontAwesome6 name="square-instagram" size={24} color={theme.textSecondary} style={{marginRight: 20}} />
                <FontAwesome6 name="facebook" size={24} color={theme.textSecondary} />
              </View>
            </View>
            <View>
              <Fumi
                label={'Nazwa użytkownika'}
                iconClass={FontAwesome6}
                iconName={'envelope-circle-check'}
                iconColor={theme.primary}
                iconSize={20}
                iconWidth={46}
                inputPadding={16}
                inputStyle={{ color: theme.textPrimary, paddingLeft: 8 }}
                onChangeText={setUsername}
                style={{ backgroundColor: theme.background, marginBottom: 20, borderRadius: 10 }}
                labelStyle={{ color: theme.textSecondary, paddingLeft: 8 }}
              />
              <Fumi
                label={'Hasło'}
                iconClass={FontAwesome6}
                iconName={'user-large'}
                iconColor={theme.primary}
                iconSize={20}
                iconWidth={46}
                inputPadding={16}
                secureTextEntry={true}
                inputStyle={{ color: theme.textPrimary, paddingLeft: 8 }}
                onChangeText={setPassword}
                style={{ backgroundColor: theme.background, marginBottom: 30, borderRadius: 10 }}
                labelStyle={{ color: theme.textSecondary, paddingLeft: 8 }}
              />
              <AuthButton text="Zaloguj" onPress={onLogin} />
              {/* <Error /> */}
            </View>
            <View>
              <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 20}}>
                <Text style={{color: theme.textSecondary}}>Nie masz konta?</Text>
              </View>
              <AuthButton text="Zarejestruj się" onPress={onLogin} outlined />
            </View>
          </View>
      </View>
    </SafeareaAuth>
  )
}
