import { useEffect, useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { updateSubject, deleteSubject } from '../../api/subjects';
import { useAuth } from '../../context/AuthContext.js';
import { EditButton, GoBackButton } from '../../components/Buttons.js';
import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteSubject } from '../../components/Alerts.js';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';


export default function EditSubjectScreen() {
    const { userToken } = useAuth()
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



    const handleEditSubject = async () => {
        if (!currentSubject || currentSubject.trim() === '') {
            console.log('Cannot edit empty subject')
            return
        }

        try {
            await updateSubject(subjectID, currentSubject.trim(), userToken)
            console.log('Subject updated successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Editing subject failed', error.message)
        }
    }

    const confirmDeleteSubject = async () => {
        try {
            await deleteSubject(subjectID, userToken)
            console.log('Subject deleted successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Deleting subject failed', error.message)
        }
    }

    const handleDeleteSubject = () => {
        alertDeleteSubject(getTranslatedText, confirmDeleteSubject)
    }

    const handleChangeSubject = (value) => {
        setCurrentSubject(value)
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

                    <TextField
                        value={currentSubject}
                        onChangeText={handleChangeSubject}
                        secureTextEntry={false}
                    />
                    
                    <EditButton onPress={handleEditSubject}/>

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}
