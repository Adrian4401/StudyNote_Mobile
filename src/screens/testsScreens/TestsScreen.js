import { useCallback, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLanguage } from '../../context/LanguageContext'
import appLanguage from '../../utils/languages'
import { createStyles } from '../../styles'
import { SafeareaNoNav } from '../../components/SafeArea'
import { getTestHistory } from '../../api/tests'

const fallbackTexts = {
    pl: {
        testsScreenTitle: 'Testy',
        createTest: 'Stwórz test',
        testHistory: 'Historia testów',
        emptyTestHistory: 'Nie masz jeszcze rozwiązanych testów',
        loadingData: 'Ładowanie danych...',
        pointsShort: 'pkt'
    },
    en: {
        testsScreenTitle: 'Tests',
        createTest: 'Create test',
        testHistory: 'Test history',
        emptyTestHistory: 'No completed tests yet',
        loadingData: 'Loading data...',
        pointsShort: 'pts'
    }
}

export default function TestsScreen() {
    const navigation = useNavigation()
    const { userToken } = useAuth()
    const { theme } = useDarkMode()
    const styles = createStyles(theme)
    const { language } = useLanguage()

    const getTranslatedText = (key) => {
        return appLanguage[language][key] || fallbackTexts[language]?.[key] || key
    }

    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(true)

    useFocusEffect(
        useCallback(() => {
            const loadTests = async () => {
                if (!userToken) return

                try {
                    setLoading(true)
                    const data = await getTestHistory(userToken)
                    setTests(data || [])
                } catch (error) {
                    console.log('Loading test history failed:', error.message)
                } finally {
                    setLoading(false)
                }
            }

            loadTests()
        }, [userToken])
    )

    const formatDate = (dateValue) => {
        const date = new Date(dateValue)

        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    const renderHistory = () => {
        if (loading) {
            return (
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
                        {getTranslatedText('loadingData')}
                    </Text>
                </View>
            )
        }

        if (!tests || tests.length === 0) {
            return (
                <View style={{ alignItems: 'center', marginTop: 70 }}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={54} color={theme.textSecondary} />
                    <Text style={{ ...styles.littleText, textAlign: 'center', marginTop: 14 }}>
                        {getTranslatedText('emptyTestHistory')}
                    </Text>
                </View>
            )
        }

        return tests.map((test) => (
            <TouchableOpacity
                key={test.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('SavedTestSummaryScreen', { testResultId: test.id })}
                style={{
                    ...styles.eventView,
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 12
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 18 }}>
                            {test.subject_name || test.title}
                        </Text>

                        <Text style={{ color: theme.textSecondary, marginTop: 5 }}>
                            {formatDate(test.createdAt)}
                        </Text>
                    </View>

                    <View
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 8,
                            backgroundColor: theme.primary,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 18 }}>
                            {test.percentage}%
                        </Text>

                        <Text style={{ color: '#fff', fontSize: 11, marginTop: 2 }}>
                            {test.score}/{test.maxScore} {getTranslatedText('pointsShort')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        ))
    }

    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('testsScreenTitle')}</Text>
            </View>

            <ScrollView>
                <View style={styles.viewContainer}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('SubjectTestScreen')}
                        style={{
                            width: '100%',
                            backgroundColor: theme.primary,
                            borderRadius: 8,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 30
                        }}
                    >
                        <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#fff" style={{ marginRight: 10 }} />

                        <Text style={{ color: '#fff', fontSize: 18 }}>
                            {getTranslatedText('createTest')}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ width: '100%' }}>
                        <Text style={{ ...styles.headlineText, marginBottom: 14 }}>
                            {getTranslatedText('testHistory')}
                        </Text>

                        {renderHistory()}
                    </View>
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}