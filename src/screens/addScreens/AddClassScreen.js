import { Text, View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoBackButton, MakeButton } from '../../components/Buttons.js';
import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';
import { useAuth } from '../../context/AuthContext.js';
import { getAllClasses, addClass } from '../../api/classes';


export default function AddClassScreen() {
    const { userToken } = useAuth()
    const [classes, setClasses] = useState([]);
    const [currentClass, setCurrentClass] = useState(undefined);

    const { language } = useLanguage();

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    const handleClassChange = (value) => {
        setCurrentClass(value)
    }

    useEffect(() => {
        const loadUserClasses = async () => {
            if(!userToken) return

            try {
                console.log('DATA -- Classes loaded')
                const data = await getAllClasses(userToken)
                console.log('CLASSES FROM API: ', data)
                setClasses(data)
            } catch (error) {
                console.log('Loading classes failed', error.message)
            }
        }

        loadUserClasses()
    }, [userToken]);


    const showBottomClassesInfo = () => {
        if(classes && classes.length > 0){
            return(
                <View style={{width: '100%', justifyContent: 'flex-start', marginBottom: 10, marginTop: 60}}>
                    <Text style={styles.littleText}>{getTranslatedText('yourClasses')}</Text>
                </View>
            )
        } else {
            return(
                <View style={{width: '100%', alignItems: 'center', marginTop: 100}}>
                    <Text style={styles.littleText}>{getTranslatedText('emptyClassesInfo')}.</Text>
                    <MaterialCommunityIcons name="notebook-plus" size={50} color={theme.textSecondary} style={{marginTop: 20}}/>
                </View>
            )
        }
    }
    
    const showClasses = () => {
        return classes.map((myclass, index) => {
            return(
                <View key={index} style={styles.eventView}>
                    <Text style={styles.subjectText}>{myclass.name}</Text>
                </View>
            )
        })
    }

    const handleAddClass = async () => {
        if (!currentClass || currentClass.trim() === '') {
            console.log('Cannot add empty class')
            return
        }

        try {
            const newClass = await addClass({
                name: currentClass.trim(),
                token: userToken
            })

            setClasses((prevClasses) => [
                ...prevClasses,
                newClass
            ])

            setCurrentClass('')
            console.log('Class added successfully')
        } catch (error) {
            console.log('Adding class failed: ', error.message)
        }
    }
 

    

    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('add')} {getTranslatedText('classes')}</Text>
            </View>

            {/* CONTAINER */}
            <ScrollView>
                <View style={styles.viewContainer}>

                    <View style={{alignItems: 'flex-start', width: '100%'}}>
                        <GoBackButton />
                    </View>
                    
                    <TextField
                        placeholder={getTranslatedText('addClassesPlaceholder')}
                        onChangeText={handleClassChange}
                        secureTextEntry={false}
                        value={currentClass}
                    />
                    
                    <MakeButton onPress={handleAddClass}/>

                    {showBottomClassesInfo()}
                    
                    {showClasses()}

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}
