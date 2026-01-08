import React, { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "../assets/styles/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';


const DarkModeContext = createContext()


export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        const loadDarkMode = async () => {
            try {
                const storageDarkMode = await AsyncStorage.getItem('chosenDarkMode')
                if(storageDarkMode !== null) {
                    setDarkMode(JSON.parse(storageDarkMode))
                    console.log('Dark mode z local storage: ', storageDarkMode)
                }
            } catch (err) {
                console.log('Błąd odczytania dark mode: ', err)
            }
        }

        loadDarkMode()
    }, [])

    const changeDarkMode = async (mode) => {
        console.log('Wartość darkMode: ', mode)
        setDarkMode(mode)
        try {
            const jsonValue = JSON.stringify(mode)
            await AsyncStorage.setItem('chosenDarkMode', jsonValue)
            console.log('DarkMode zapisany w local storage: ', jsonValue);
        } catch (err) {
            console.log('Błąd zapisywania darkMode: ', err)
        }
    }

    const theme = darkMode ? darkTheme : lightTheme

    return (
        <DarkModeContext.Provider value={{ darkMode, changeDarkMode, theme }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export const useDarkMode = () => {
    return useContext(DarkModeContext)
}