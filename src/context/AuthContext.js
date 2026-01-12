import { createContext, useState, useEffect, useContext, useMemo } from 'react'
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({ userToken: null, setUserToken: () => {} })

export const AuthProvider = ({ children }) => {
    const [userToken, setUserTokenState] = useState(null)

    useEffect(() => {
        const loadUserToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken')
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
                await SecureStore.deleteItemAsync('userToken')
            } else {
                await SecureStore.setItemAsync('userToken', token)
            }
            setUserTokenState(token)
        } catch (err) {
            console.log('Błąd zapisu tokenu: ', err)
        }
    }

    const deleteUserToken = async (token) => {
        try {
            if (token !== null) {
                await SecureStore.deleteItemAsync('userToken')
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