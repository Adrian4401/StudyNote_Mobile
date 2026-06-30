import { useEffect, useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { editClass } from '../../database/queries.js';
import { EditButton, GoBackButton } from '../../components/Buttons.js';
import appLanguage from "../../utils/languages";
import { useLanguage } from '../../context/LanguageContext';
import { alertDeleteClass } from '../../components/Alerts.js';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';
import { useAuth } from '../../context/AuthContext.js';
import { deleteClass, updateClass } from '../../api/classes';


export default function EditClassScreen() {
    const { userToken } = useAuth()
    const navigation = useNavigation();
    const route = useRoute();

    const [classes, setClasses] = useState([]);
    const [currentClass, setCurrentClass] = useState('');
    const [classID, setClassID] = useState('');

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage();

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    const handleChangeClass = (value) => {
        setCurrentClass(value)
    }



    useEffect(() => {
        const { classID, className } = route.params;

        setCurrentClass(className);
        setClassID(classID);
    }, []);

    

    const handleEditClass = async () => {
        if (!currentClass || currentClass.trim() === '') {
            console.log('Cannot edit empty class')
            return
        }

        try {
            await updateClass(classID, currentClass.trim(), userToken)
            console.log('Class updated successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Editing class failed: ', error.errorCode)
        }
    }
    
    const confirmDeleteClass = async () => {
        try {
            await deleteClass(classID, userToken)
            console.log('Class deleted successfully')
            navigation.goBack()
        } catch (error) {
            console.log('Deleting class failed: ', error.errorCode)
        }
    }

    const handleDeleteClass = (value) => {
        alertDeleteClass(getTranslatedText, confirmDeleteClass)
    }





    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('edit')} {getTranslatedText('classes')}</Text>
            </View>

            {/* CONTAINER */}
            <ScrollView>
                <View style={styles.viewContainer}>

                    <View style={{alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <GoBackButton />
                        <TouchableOpacity onPress={handleDeleteClass}>
                            <MaterialIcons name="delete" size={30} color={theme.textPrimary}/>
                        </TouchableOpacity>
                    </View>

                    <TextField
                        value={currentClass}
                        onChangeText={handleChangeClass}
                        secureTextEntry={false}
                    />
                    
                    <EditButton onPress={handleEditClass}/>

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}
