import { Text, View, ScrollView, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GoBackButton, MakeButton } from '../../components/Buttons.js';

import { addClass, loadClasses } from '../../database/queries.js';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';



export default function AddClassScreen() {

    const [classes, setClasses] = useState([]);
    const [currentClass, setCurrentClass] = useState(undefined);

    const { language } = useLanguage();

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }


    useEffect(() => {
        loadClasses(setClasses);
        console.log(classes)
    }, []);


    const showBottomClassesInfo = () => {
        if(classes && classes.length > 0){
            return(
                <View style={{width: '100%', justifyContent: 'flex-start', marginBottom: 10, marginTop: 40}}>
                    <Text style={styles.littleText}>{getTranslatedText('yourClasses')}</Text>
                </View>
            )
        } else {
            return(
                <View style={{width: '100%', alignItems: 'center', marginTop: 100}}>
                    <Text style={styles.littleText}>{getTranslatedText('emptyClassesInfo')}.</Text>
                    <MaterialCommunityIcons name="emoticon-sad" size={100} color={theme.textSecondary} style={{marginTop: 20}}/>
                </View>
            )
        }
    }
    
    const showClasses = () => {
        return classes.map((myclass, index) => {
            return(
                <View key={index} style={styles.eventView}>
                    <Text style={styles.subjectText}>{myclass.class_name}</Text>
                </View>
            )
        })
    }

    const handleAddClass = () => {
        addClass(currentClass, setCurrentClass, classes, setClasses)
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
                    

                    <TextInput 
                        value={currentClass}
                        onChangeText={setCurrentClass}
                        placeholder={getTranslatedText('addClassesPlaceholder')}
                        placeholderTextColor={theme.textSecondary}
                        maxLength={50}
                        style={{
                            color: theme.textPrimary,
                            width: '100%',
                            fontSize: 25,
                            borderWidth: 2,
                            borderColor: theme.primary,
                            borderRadius: 10,
                            padding: 10,
                            marginVertical: 10,
                            marginTop: 30,
                            backgroundColor: theme.secondary
                        }}
                    />
                    
                    <MakeButton onPress={handleAddClass}/>

                    {showBottomClassesInfo()}
                    

                    {showClasses()}

                </View>
            </ScrollView>

            {/* <View style={globalStyles.bottomButtonsView}>
                <Button title='Usun tabele' onPress={deleteSubjects} />
            </View> */}

        </SafeareaNoNav>
    )
}
