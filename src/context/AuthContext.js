import { createContext, useState, useEffect, useContext, useMemo } from 'react'
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({ 
    userToken: null, 
    setUserToken: () => {},
    user: null,
    setUser: () => {}
})

export const AuthProvider = ({ children }) => {
    const [userToken, setUserTokenState] = useState(null)
    const [user, setUserState] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken')
                const storedUser = await SecureStore.getItemAsync('user')

                if (token !== null) {
                    setUserTokenState(token)
                }

                if (storedUser !== null) {
                    setUserState(JSON.parse(storedUser))
                }
            } catch (err) {
                console.log('Błąd odczytania tokenu: ', err)
            }
        }

        loadData()
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

    const setUser = async (user) => {
        try {
            if (user == null) {
                await SecureStore.deleteItemAsync('user')
                setUserState(null)
            } else {
                await SecureStore.setItemAsync('user', JSON.stringify(user))
                setUserState(user)
            }
        } catch (err) {
            console.log('Błąd zapisu użytkownika: ', err)
        }
    }

    const deleteUserToken = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken')
            await SecureStore.deleteItemAsync('user')

            setUserTokenState(null)
            setUserState(null)

            console.log('Token usunięty')
        } catch (err) {
            console.log('Błąd zapisu tokenu: ', err)
        }
    }

    const value = useMemo(() => ({ 
        userToken, 
        user,
        setUserToken, 
        deleteUserToken, 
        setUser 
    }), [userToken, user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext