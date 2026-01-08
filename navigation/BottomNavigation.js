import { Platform, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons, FontAwesome } from '@expo/vector-icons'

import { MyColors } from '../assets/styles/colors'
import { useDarkMode } from '../context/DarkModeContext'
import { 
    CalendarScreen, 
    NotesScreen, 
    ManageScreen, 
    SettingsScreen, 
    AddEventScreen, 
} from '../screens';


const Tab = createBottomTabNavigator();


export function MainTabNavigator() {
  
    const navigation = useNavigation();
    const { theme } = useDarkMode()

    const CustomTabBarButton = ({children, onPress}) => (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={onPress}
      >
        <View
          style={{
            width: 60,
            height: 60,
            top: Platform.OS === 'ios' ? 15 : 0,
            borderRadius: 30,
            backgroundColor: theme.primary
          }}
        >
          {children}
        </View>
      </TouchableOpacity>
    );
    
    const screenOptions = {
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          right: 10,
          left: 10,
          height: 60,
          backgroundColor: theme.navigation,
          borderRadius: 20,
          borderTopColor: 'transparent'
        }
    }

  
    return (
      <Tab.Navigator screenOptions={screenOptions} initialRouteName='Calendar'>
        <Tab.Screen 
          name='Calendar' 
          component={CalendarScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return(
                <View style={{alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0}}>
                  <Ionicons name="calendar-clear" size={24} color={focused ? '#fff' : '#736D6D'} />
                </View>
              )
            }
          }}
        />
        <Tab.Screen 
          name='Note' 
          component={NotesScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return(
                <View style={{alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0}}>
                  <FontAwesome name="sticky-note" size={24} color={focused ? '#fff' : '#736D6D'} />
                </View>
              )
            }
          }}
        />
        <Tab.Screen 
          name='Add' 
          component={AddEventScreen}
          options={{
            tabBarIcon: () => {
              return(
                <Ionicons name="add-outline" size={45} color="#fff" />
              )
            },
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} navigation={navigation} onPress={() => navigation.navigate('AddEventScreen')}/>
            )
          }}
        />
        <Tab.Screen 
          name='Manage' 
          component={ManageScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return(
                <View style={{alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0}}>
                  <Ionicons name="options" size={24} color={focused ? '#fff' : '#736D6D'} />
                </View>
              )
            }
          }}
        />
        <Tab.Screen 
          name='Settings' 
          component={SettingsScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return(
                <View style={{alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0}}>
                  <Ionicons name="settings" size={24} color={focused ? '#fff' : '#736D6D'} />
                </View>
              )
            }
          }}
        />
      </Tab.Navigator>
    );
}