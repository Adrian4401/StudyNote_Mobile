import { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loadSubjects, addSubject } from '../../database/queries.js';
import { GoBackButton, MakeButton } from '../../components/Buttons.js';
import appLanguage from '../../utils/languages';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';


export default function AddSubjectScreen() {
    const [subjects, setSubjects] = useState([]);
    const [currentSubject, setCurrentSubject] = useState(undefined);

    const { language } = useLanguage();

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const getTranslatedText = (key) => {
        return appLanguage[language][key];
    }

    const handleSubjectChange = (value) => {
        setCurrentSubject(value)
    }


    useEffect(() => {
        console.log('DATA -- Subjects loaded')
        loadSubjects(setSubjects);
    }, []);


    const showBottomSubjectsInfo = () => {
        if(subjects && subjects.length > 0){
            return(
                <View style={{width: '100%', justifyContent: 'flex-start', marginBottom: 10, marginTop: 40}}>
                    <Text style={styles.littleText}>{getTranslatedText('yourSubjects')}</Text>
                </View>
            )
        } else {
            return(
                <View style={{width: '100%', alignItems: 'center', marginTop: 100}}>
                    <Text style={styles.littleText}>{getTranslatedText('emptySubjectsInfo')}.</Text>
                    <MaterialCommunityIcons name="emoticon-sad" size={100} color={theme.textSecondary} style={{marginTop: 20}}/>
                </View>
            )
        }
    }

    const showSubjects = () => {
        return subjects.map((subject, index) => {
            return(
                <View key={index} style={styles.eventView}>
                    <Text style={styles.subjectText}>{subject.subject_name}</Text>
                </View>
            )
        })
    }


    return (
        <SafeareaNoNav>

            {/* HEADER */}
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('add')} {getTranslatedText('subjects')}</Text>
            </View>

            {/* CONTAINER */}
            <ScrollView>
                <View style={styles.viewContainer}>

                    <View style={{alignItems: 'flex-start', width: '100%'}}>
                        <GoBackButton />
                    </View>
                    
                    <TextField
                        placeholder={getTranslatedText('addSubjectsPlaceholder')}
                        onChangeText={handleSubjectChange}
                        secureTextEntry={false}
                    />
                    
                    <MakeButton onPress={() => addSubject(currentSubject, setCurrentSubject, subjects, setSubjects)}/>

                    {showBottomSubjectsInfo()}

                    {showSubjects()}

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}
