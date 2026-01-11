import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabNavigator } from './BottomNavigation';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/auth/AuthScreen';
import { 
    AddEventScreen, 
    AddNoteScreen, 
    AddSubjectScreen, 
    AddClassScreen,

    EditSubjectScreen, 
    EditClassScreen,
    EditNoteScreen,
    EditEventScreen,

    ReadNoteScreen,
    ReadEventScreen
} from '../screens';



const Stack = createNativeStackNavigator();



export function StackNavigation() {
    const { userToken } = useAuth()

    return (
        <NavigationContainer>
            <Stack.Navigator>

                {userToken == null ? (
                    <Stack.Screen
                        name='Auth'
                        component={AuthScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name='Main'
                            component={MainTabNavigator}
                            options={{ headerShown: false }}
                        />

                        <Stack.Screen
                            name='AddEventScreen'
                            component={AddEventScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='AddNoteScreen'
                            component={AddNoteScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='AddSubjectScreen'
                            component={AddSubjectScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='AddClassScreen'
                            component={AddClassScreen}
                            options={{ headerShown: false }}
                        />

                        <Stack.Screen
                            name='EditSubjectScreen'
                            component={EditSubjectScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='EditClassScreen'
                            component={EditClassScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='EditNoteScreen'
                            component={EditNoteScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='EditEventScreen'
                            component={EditEventScreen}
                            options={{ headerShown: false }}
                        />

                        <Stack.Screen
                            name='ReadNoteScreen'
                            component={ReadNoteScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='ReadEventScreen'
                            component={ReadEventScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
                
            </Stack.Navigator>
        </NavigationContainer>
    )
} 