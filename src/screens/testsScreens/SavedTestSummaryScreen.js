import { useEffect, useState } from 'react'
import { Alert, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLanguage } from '../../context/LanguageContext'
import appLanguage from '../../utils/languages'
import { createStyles } from '../../styles'
import { SafeareaNoNav } from '../../components/SafeArea'
import { GoBackButton } from '../../components/Buttons'
import { deleteTestResult, getTestResult } from '../../api/tests'

const fallbackTexts = {
    pl: {
        loadingData: 'Ładowanie danych...',
        deleteTest: 'Usuń test',
        deletingTest: 'Usuwanie testu',
        deleteTestQuestion: 'Czy na pewno chcesz usunąć ten test?',
        pointsShort: 'pkt',
        noAnswer: 'Brak odpowiedzi',
        trueAnswer: 'Prawda',
        falseAnswer: 'Fałsz',
        correct: 'Poprawna',
        incorrect: 'Błędna'
    },
    en: {
        loadingData: 'Loading data...',
        deleteTest: 'Delete test',
        deletingTest: 'Deleting test',
        deleteTestQuestion: 'Are you sure you want to delete this test?',
        pointsShort: 'pts',
        noAnswer: 'No answer',
        trueAnswer: 'True',
        falseAnswer: 'False',
        correct: 'Correct',
        incorrect: 'Incorrect'
    }
}

export default function SavedTestSummaryScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { testResultId } = route.params || {}

    const { userToken } = useAuth()
    const { theme } = useDarkMode()
    const styles = createStyles(theme)
    const { language } = useLanguage()

    const getTranslatedText = (key) => {
        return appLanguage[language][key] || fallbackTexts[language]?.[key] || key
    }

    const [testResult, setTestResult] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadTestResult = async () => {
            if (!userToken || !testResultId) return

            try {
                setLoading(true)
                const data = await getTestResult(testResultId, userToken)
                setTestResult(data)
            } catch (error) {
                console.log('Loading test result failed:', error.message)
            } finally {
                setLoading(false)
            }
        }

        loadTestResult()
    }, [testResultId, userToken])

    const questions = testResult?.questions || []
    const userAnswers = testResult?.userAnswers || {}
    const openAnswersResults = testResult?.openAnswersResults || []

    const getOpenAnswerResult = (questionId) => {
        return openAnswersResults.find((result) => result.questionId === questionId)
    }

    const getOpenScore = (result) => {
        return (result?.score ?? result?.points) || 0
    }

    const getCorrectAnswerIds = (question) => {
        return question.answers
            ?.filter((answer) => answer.isCorrect)
            .map((answer) => answer.id) || []
    }

    const getUserAnswerIds = (question) => {
        const answer = userAnswers[question.id]

        if (question.type === 'multiple_choice') {
            return Array.isArray(answer) ? answer : []
        }

        if (question.type === 'open') return []

        return answer ? [answer] : []
    }

    const arraysEqual = (firstArray, secondArray) => {
        if (firstArray.length !== secondArray.length) return false

        const firstSorted = [...firstArray].sort()
        const secondSorted = [...secondArray].sort()

        return firstSorted.every((item, index) => item === secondSorted[index])
    }

    const isQuestionCorrect = (question) => {
        if (question.type === 'open') {
            const result = getOpenAnswerResult(question.id)
            return getOpenScore(result) >= 0.7
        }

        return arraysEqual(getCorrectAnswerIds(question), getUserAnswerIds(question))
    }

    const getAnswerTextById = (question, answerId) => {
        const answer = question.answers?.find((item) => item.id === answerId)

        if (!answer) return getTranslatedText('noAnswer')

        if (question.type === 'true_false') {
            const answerText = String(answer.text).trim().toLowerCase()

            if (answerText === 'true' || answerText === 'prawda') {
                return getTranslatedText('trueAnswer')
            }

            if (answerText === 'false' || answerText === 'fałsz' || answerText === 'falsz') {
                return getTranslatedText('falseAnswer')
            }
        }

        return answer.text
    }

    const getCorrectAnswersText = (question) => {
        return getCorrectAnswerIds(question)
            .map((answerId) => getAnswerTextById(question, answerId))
            .join(', ')
    }

    const getUserAnswersText = (question) => {
        if (question.type === 'open') {
            return userAnswers[question.id] || getTranslatedText('noAnswer')
        }

        const userAnswerIds = getUserAnswerIds(question)

        if (userAnswerIds.length === 0) {
            return getTranslatedText('noAnswer')
        }

        return userAnswerIds
            .map((answerId) => getAnswerTextById(question, answerId))
            .join(', ')
    }

    const renderQuestionTypeText = (type) => {
        if (type === 'single_choice') return getTranslatedText('singleChoiceQuestionType')
        if (type === 'multiple_choice') return getTranslatedText('multipleChoiceQuestionType')
        if (type === 'true_false') return getTranslatedText('trueFalseQuestionType')
        if (type === 'open') return getTranslatedText('openQuestionTypeLong')

        return ''
    }

    const handleDelete = () => {
        Alert.alert(getTranslatedText('deletingTest'), getTranslatedText('deleteTestQuestion'), [
            {
                text: getTranslatedText('cancel'),
                style: 'cancel'
            },
            {
                text: getTranslatedText('delete'),
                onPress: async () => {
                    try {
                        await deleteTestResult(testResultId, userToken)
                        navigation.goBack()
                    } catch (error) {
                        console.log('Deleting test result failed:', error.message)
                    }
                }
            }
        ])
    }

    const renderAnswerBadge = (question) => {
        if (question.type === 'open') {
            const result = getOpenAnswerResult(question.id)
            const score = getOpenScore(result)

            return (
                <View
                    style={{
                        backgroundColor: score >= 0.7 ? '#2EAD5B' : score >= 0.4 ? '#D99A2B' : '#D94A4A',
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 10
                    }}
                >
                    <Text style={{ color: '#fff' }}>
                        {score}/1 {getTranslatedText('pointsShort')}
                    </Text>
                </View>
            )
        }

        const correct = isQuestionCorrect(question)

        return (
            <View
                style={{
                    backgroundColor: correct ? '#2EAD5B' : '#D94A4A',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 10
                }}
            >
                <Text style={{ color: '#fff' }}>
                    {correct ? getTranslatedText('correct') : getTranslatedText('incorrect')}
                </Text>
            </View>
        )
    }

    const renderQuestionSummary = (question, index) => {
        const correct = isQuestionCorrect(question)
        const isOpen = question.type === 'open'
        const openResult = getOpenAnswerResult(question.id)

        return (
            <View
                key={question.id}
                style={{
                    ...styles.eventView,
                    width: '100%',
                    padding: 16,
                    marginBottom: 18,
                    alignItems: 'stretch',
                    borderRadius: 8
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                backgroundColor: theme.primary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                {index + 1}
                            </Text>
                        </View>

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ color: theme.textSecondary, fontSize: 14, flex: 1 }}
                        >
                            {renderQuestionTypeText(question.type)}
                        </Text>
                    </View>

                    {renderAnswerBadge(question)}
                </View>

                <Text style={{ color: theme.textPrimary, fontSize: 18, marginBottom: 14 }}>
                    {question.question}
                </Text>

                <View
                    style={{
                        backgroundColor: theme.secondary,
                        borderColor: theme.textSecondary,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 10
                    }}
                >
                    <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
                        {getTranslatedText('yourAnswer')}
                    </Text>

                    <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                        {getUserAnswersText(question)}
                    </Text>
                </View>

                {!isOpen && !correct ? (
                    <View
                        style={{
                            backgroundColor: theme.secondary,
                            borderColor: '#2EAD5B',
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 10
                        }}
                    >
                        <Text style={{ color: '#2EAD5B', marginBottom: 6 }}>
                            {getTranslatedText('correctAnswer')}
                        </Text>

                        <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                            {getCorrectAnswersText(question)}
                        </Text>
                    </View>
                ) : null}

                {isOpen ? (
                    <>
                        <View
                            style={{
                                backgroundColor: theme.secondary,
                                borderColor: theme.textSecondary,
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
                                {getTranslatedText('expectedAnswer')}
                            </Text>

                            <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                                {question.expectedAnswer}
                            </Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: theme.secondary,
                                borderColor: theme.primary,
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ color: theme.primary, marginBottom: 6 }}>
                                {getTranslatedText('aiScore')}
                            </Text>

                            <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                                {openResult?.feedback || getTranslatedText('noScore')}
                            </Text>
                        </View>
                    </>
                ) : null}

                {question.explanation ? (
                    <View style={{ marginTop: 4 }}>
                        <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
                            {getTranslatedText('explanation')}
                        </Text>

                        <Text style={{ color: theme.textPrimary, fontSize: 15 }}>
                            {question.explanation}
                        </Text>
                    </View>
                ) : null}
            </View>
        )
    }

    if (loading) {
        return (
            <SafeareaNoNav>
                <View style={styles.headerBackground}>
                    <Text style={styles.headerText}>{getTranslatedText('testResultTitle')}</Text>
                </View>

                <View style={{ ...styles.viewContainer, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
                        {getTranslatedText('loadingData')}
                    </Text>
                </View>
            </SafeareaNoNav>
        )
    }

    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>{getTranslatedText('testResultTitle')}</Text>
            </View>

            <ScrollView>
                <View style={styles.viewContainer}>
                    <View
                        style={{
                            width: '100%',
                            marginBottom: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <GoBackButton />

                        <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="delete-outline" size={30} color={theme.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            width: '100%',
                            backgroundColor: theme.secondary,
                            borderColor: theme.textSecondary,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 18,
                            marginBottom: 24
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="clipboard-check-outline"
                                size={34}
                                color={theme.primary}
                                style={{ marginRight: 12 }}
                            />

                            <View>
                                <Text style={{ color: theme.textPrimary, fontSize: 24 }}>
                                    {testResult?.score}/{testResult?.maxScore} {getTranslatedText('pointsShort')}
                                </Text>

                                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                                    {getTranslatedText('resultText')}: {testResult?.percentage}%
                                </Text>
                            </View>
                        </View>

                        {testResult?.subject?.name ? (
                            <Text style={{ color: theme.textSecondary, marginTop: 14 }}>
                                {testResult.subject.name}
                            </Text>
                        ) : null}
                    </View>

                    <View style={{ width: '100%' }}>
                        <Text style={{ ...styles.headlineText, marginBottom: 14 }}>
                            {getTranslatedText('answersText')}
                        </Text>

                        {questions.map((question, index) => renderQuestionSummary(question, index))}
                    </View>
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}