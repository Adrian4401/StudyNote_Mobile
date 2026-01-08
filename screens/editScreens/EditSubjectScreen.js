import { useEffect, useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';
import { editSubject } from '../../database/queries.js';

import { EditButton, GoBackButton } from '../../components/Buttons.js';

import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteSubject } from '../../components/Alerts.js';

import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../assets/styles/index.js';

import { SafeareaNoNav } from '../../components/SafeArea.js';





export default function EditSubjectScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const [subjects, setSubjects] = useState([]);
    const [currentSubject, setCurrentSubject] = useState('');
    const [subjectID, setSubjectID] = useState('');

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    

    useEffect(() => {
        const { subjectID, subjectName } = route.params;
        
        setCurrentSubject(subjectName);
        setSubjectID(subjectID);
    }, []);



    const handleEditSubject = () => {
        editSubject(subjectID, currentSubject, setSubjects, navigation)
    }

    const handleDeleteSubject = () => {
        alertDeleteSubject(subjectID, setSubjects, navigation, getTranslatedText)
    }


    


    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('edit')} {getTranslatedText('subject')}</Text>
            </View>

            {/* CONTAINER */}
            <ScrollView>
                <View style={styles.viewContainer}>

                    <View style={{alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <GoBackButton />
                        <TouchableOpacity onPress={handleDeleteSubject}>
                            <MaterialIcons name="delete" size={30} color={theme.textPrimary}/>
                        </TouchableOpacity>
                    </View>
                    

                    <TextInput 
                        value={currentSubject}
                        onChangeText={setCurrentSubject}
                        placeholder='Dodaj przedmiot...'
                        placeholderTextColor={theme.textSecondary}
                        maxLength={50}
                        style={{
                            color: theme.textSecondary,
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
                    
                    <EditButton onPress={handleEditSubject}/>

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}
