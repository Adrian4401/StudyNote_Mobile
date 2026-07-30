import { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLanguage } from '../../context/LanguageContext'
import appLanguage from '../../utils/languages'
import { createStyles } from '../../styles'
import { SafeareaNoNav } from '../../components/SafeArea'
import { GoBackButton, MakeButton } from '../../components/Buttons'
import { analyzeNote, updateNote } from '../../api/notes'
import { Error } from '../../components/Errors'

export default function AiNoteReviewScreen() {
    const { userToken } = useAuth()
    const navigation = useNavigation()
    const route = useRoute()
    const { noteId, subjectId, classId } = route.params

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage()
    const getTranslatedText = (key) => appLanguage[language][key]

    const [loading, setLoading] = useState(true)
    const [aiResult, setAiResult] = useState(null)
    const [errorCode, setErrorCode] = useState('')
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

    const loadingMessages = [
        getTranslatedText('reviewInfo1'),
        getTranslatedText('reviewInfo2'),
        getTranslatedText('reviewInfo3')
    ]

    useEffect(() => {
        if (!loading) return

        const interval = setInterval(() => {
            setLoadingMessageIndex((prev) => {
                if (prev >= loadingMessages.length - 1) {
                    clearInterval(interval);
                    return prev;
                }

                return prev + 1;
            });
        }, 6000);

        return () => clearInterval(interval)
    }, [loading])

    useEffect(() => {
        const loadAiAnalysis = async () => {
            setLoading(true)
            setErrorCode('')

            try {
                const data = await analyzeNote(noteId, userToken)
                setAiResult(data.result)
            } catch (error) {
                setErrorCode(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadAiAnalysis()
    }, [noteId, userToken])

    const handleApplyImprovedNote = async () => {
        if (!aiResult?.improvedNote) return

        try {
            await updateNote(
                noteId,
                aiResult.improvedNote.title,
                aiResult.improvedNote.body,
                subjectId,
                classId,
                userToken
            )

            navigation.pop(2)
        } catch (error) {
            setErrorCode(error.message)
        }
    }

    const renderList = (items) => {
        if (!items || items.length === 0) return null

        return items.map((item, index) => (
            <Text key={index} style={{ color: theme.textSecondary, fontSize: 16, marginBottom: 8 }}>
                • {item}
            </Text>
        ))
    }





    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('reviewScreenTitle')}</Text>
            </View>

            <ScrollView>
                <View style={styles.viewContainer}>
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <GoBackButton />
                    </View>

                    {loading ? (
                        <View style={{ alignItems: 'center', marginTop: 80 }}>
                            <ActivityIndicator size="large" color={theme.primary} />
                            <Text style={{ color: theme.textPrimary, marginTop: 20, textAlign: 'center', fontSize: 18 }}>
                                {getTranslatedText('reviewDesc')}
                            </Text>
                            <Text style={{ color: theme.textSecondary, marginTop: 12, textAlign: 'center' }}>
                                {loadingMessages[loadingMessageIndex]}
                            </Text>
                        </View>
                    ) : null}

                    {errorCode ? (
                        <Error
                            message={errorCode}
                            getTranslatedText={getTranslatedText}
                        />
                    ) : null}

                    {!loading && aiResult ? (
                        <View style={{ width: '100%' }}>
                            <Text style={styles.headlineText}>{getTranslatedText('reviewSummary')}</Text>
                            <View style={styles.divider} />
                            <Text style={{ color: theme.textSecondary, fontSize: 16, marginBottom: 24 }}>
                                {aiResult.summary}
                            </Text>

                            <Text style={styles.headlineText}>{getTranslatedText('reviewWorthAdd')}</Text>
                            <View style={styles.divider} />
                            <View style={{ marginBottom: 24 }}>
                                {renderList(aiResult.suggestedAdditions)}
                            </View>

                            <Text style={styles.headlineText}>{getTranslatedText('reviewUnclear')}</Text>
                            <View style={styles.divider} />
                            <View style={{ marginBottom: 24 }}>
                                {renderList(aiResult.unclearParts)}
                            </View>

                            <Text style={{...styles.headlineText, marginBottom: 12}}>{getTranslatedText('reviewRevisedNote')}</Text>
                            <View style={{
                                backgroundColor: theme.secondary,
                                borderColor: theme.textSecondary,
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 12,
                                marginBottom: 24
                            }}>
                                <Text style={{ color: theme.textPrimary, fontSize: 20, marginBottom: 12 }}>
                                    {aiResult.improvedNote?.title}
                                </Text>

                                <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
                                    {aiResult.improvedNote?.body}
                                </Text>
                            </View>

                            <MakeButton onPress={handleApplyImprovedNote} />
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}

