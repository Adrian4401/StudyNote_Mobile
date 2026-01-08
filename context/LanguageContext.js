import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


const LanguageContext = createContext()


export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('pl')

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storageLanguage = await AsyncStorage.getItem('chosenLanguage')
                if(storageLanguage !== null) {
                    setLanguage(JSON.parse(storageLanguage))
                    console.log('Język z local storage: ', storageLanguage)
                }
            } catch (err) {
                console.log('Błąd odczytania języka: ', err)
            }
        }

        loadLanguage()
    }, [])

    const changeLanguage = async (lang) => {
        console.log('Wartość lang: ', lang)
        setLanguage(lang)
        try {
            const jsonValue = JSON.stringify(lang)
            await AsyncStorage.setItem('chosenLanguage', jsonValue)
            console.log('Język zapisany w local storage: ', jsonValue);
        } catch (err) {
            console.log('Błąd zapisywania języka: ', err)
        }
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    return useContext(LanguageContext)
}