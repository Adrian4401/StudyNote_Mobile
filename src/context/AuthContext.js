import { createContext, useState, useEffect, useContext, useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext({ userToken: null, setUserToken: () => {} })

export const AuthProvider = ({ children }) => {
    const [userToken, setUserTokenState] = useState(null)

    useEffect(() => {
        const loadUserToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken')
                if (token !== null) {
                    setUserTokenState(token)
                    console.log('User token z local storage: ', token)
                }
            } catch (err) {
                console.log('Błąd odczytania tokenu: ', err)
            }
        }

        loadUserToken()
    }, [])

    const setUserToken = async (token) => {
        try {
            if (token == null) {
                await AsyncStorage.removeItem('userToken')
            } else {
                await AsyncStorage.setItem('userToken', token)
            }
            setUserTokenState(token)
        } catch (err) {
            console.log('Błąd zapisu tokenu: ', err)
        }
    }

    const deleteUserToken = async (token) => {
        try {
            if (token !== null) {
                await AsyncStorage.removeItem('userToken')
            }
            console.log('Token usunięty')
        } catch (err) {
            console.log('Błąd zapisu tokenu: ', err)
        }
    }

    const value = useMemo(() => ({ userToken, setUserToken, deleteUserToken }), [userToken])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext