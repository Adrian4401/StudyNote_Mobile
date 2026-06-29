import { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoBackButton, MakeButton } from '../../components/Buttons.js';
import appLanguage from '../../utils/languages';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { createStyles } from '../../styles/index.js';
import { SafeareaNoNav } from '../../components/SafeArea.js';
import { TextField } from '../../components/TextField.js';
import { addSubject, getAllSubjects } from '../../api/subjects';
import { useAuth } from '../../context/AuthContext.js';


export default function AddSubjectScreen() {
    const { userToken } = useAuth()
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
        const loadUserSubjects = async () => {
            if (!userToken) return

            try {
                console.log('DATA -- Subjects loaded')
                const data = await getAllSubjects(userToken)
                console.log('SUBJECTS FROM API:', data)
                setSubjects(data)
            } catch (error) {
                console.log('Loading subjects failed', error.message)
            }
        }

        loadUserSubjects()
    }, [userToken]);


    const showBottomSubjectsInfo = () => {
        if(subjects && subjects.length > 0){
            return(
                <View style={{width: '100%', justifyContent: 'flex-start', marginBottom: 10, marginTop: 60}}>
                    <Text style={styles.littleText}>{getTranslatedText('yourSubjects')}</Text>
                </View>
            )
        } else {
            return(
                <View style={{width: '100%', alignItems: 'center', marginTop: 100}}>
                    <Text style={styles.littleText}>{getTranslatedText('emptySubjectsInfo')}.</Text>
                    <MaterialCommunityIcons name="notebook-plus" size={50} color={theme.textSecondary} style={{marginTop: 20}}/>
                </View>
            )
        }
    }

    const showSubjects = () => {
        return subjects.map((subject, index) => {
            return(
                <View key={index} style={styles.eventView}>
                    <Text style={styles.subjectText}>{subject.name}</Text>
                </View>
            )
        })
    }

    const handleAddSubject = async () => {
        if (!currentSubject || currentSubject.trim() === '') {
            console.log('Cannot add empty subject')
            return
        }

        try {
            const newSubject = await addSubject({
                subject: currentSubject.trim(), 
                token: userToken
            })

            setSubjects((prevSubjects) => [
                ...prevSubjects,
                newSubject
            ])

            setCurrentSubject('')
            console.log(`Subject added successfully`)
        } catch (error) {
            console.log(`Adding subject failed`, error.message)
        }
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
                        value={currentSubject}
                    />
                    
                    <MakeButton onPress={handleAddSubject}/>

                    {showBottomSubjectsInfo()}

                    {showSubjects()}

                </View>
            </ScrollView>

        </SafeareaNoNav>
    )
}
