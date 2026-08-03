import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLanguage } from '../../context/LanguageContext'
import appLanguage from '../../utils/languages'
import { createStyles } from '../../styles'
import { SafeareaNoNav } from '../../components/SafeArea'
import { GoBackButton } from '../../components/Buttons'

export default function TestSummaryScreen() {
    const navigation = useNavigation()
    const route = useRoute()

    const {
        questions = [],
        userAnswers = {},
        openAnswersResults = []
    } = route.params || {}

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage()
    const getTranslatedText = (key) => appLanguage[language][key]

    const getOpenAnswerResult = (questionId) => {
        return openAnswersResults.find((result) => result.questionId === questionId)
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

        if (question.type === 'open') {
            return []
        }

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
            return (result?.score || 0) >= 0.7
        }

        const correctAnswerIds = getCorrectAnswerIds(question)
        const userAnswerIds = getUserAnswerIds(question)

        return arraysEqual(correctAnswerIds, userAnswerIds)
    }

    const closedQuestions = questions.filter((question) => question.type !== 'open')
    const openQuestions = questions.filter((question) => question.type === 'open')

    const closedPoints = closedQuestions.filter(isQuestionCorrect).length

    const openPoints = openQuestions.reduce((sum, question) => {
        const result = getOpenAnswerResult(question.id)
        return sum + (result?.score || 0)
    }, 0)

    const correctCount = closedPoints + openPoints
    const maxPoints = closedQuestions.length + openQuestions.length
    const percent = maxPoints > 0 ? Math.round((correctCount / maxPoints) * 100) : 0

    const getAnswerTextById = (question, answerId) => {
        const answer = question.answers?.find((item) => item.id === answerId)

        if (!answer) return 'Brak odpowiedzi'

        if (question.type === 'true_false') {
            if (answer.text === 'true') return 'Prawda'
            if (answer.text === 'false') return 'Fałsz'
        }

        return answer.text
    }

    const getCorrectAnswersText = (question) => {
        const correctAnswerIds = getCorrectAnswerIds(question)

        return correctAnswerIds
            .map((answerId) => getAnswerTextById(question, answerId))
            .join(', ')
    }

    const getUserAnswersText = (question) => {
        if (question.type === 'open') {
            return userAnswers[question.id] || 'Brak odpowiedzi'
        }

        const userAnswerIds = getUserAnswerIds(question)

        if (userAnswerIds.length === 0) {
            return 'Brak odpowiedzi'
        }

        return userAnswerIds
            .map((answerId) => getAnswerTextById(question, answerId))
            .join(', ')
    }

    const renderAnswerBadge = (question) => {
        if (question.type === 'open') {
            const result = getOpenAnswerResult(question.id)
            const score = result?.score || 0

            return (
                <View style={{
                    backgroundColor: score >= 0.7 ? '#2EAD5B' : score >= 0.4 ? '#D99A2B' : '#D94A4A',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 10
                }}>
                    <Text style={{ color: '#fff' }}>
                        {score}/1 pkt
                    </Text>
                </View>
            )
        }

        const correct = isQuestionCorrect(question)

        return (
            <View style={{
                backgroundColor: correct ? '#2EAD5B' : '#D94A4A',
                borderRadius: 8,
                paddingVertical: 6,
                paddingHorizontal: 10
            }}>
                <Text style={{ color: '#fff' }}>
                    {correct ? 'Poprawna' : 'Błędna'}
                </Text>
            </View>
        )
    }

    const renderQuestionTypeText = (type) => {
        if (type === 'single_choice') return 'Jednokrotny wybór'
        if (type === 'multiple_choice') return 'Wielokrotny wybór'
        if (type === 'true_false') return 'Prawda / fałsz'
        if (type === 'open') return 'Pytanie otwarte'

        return ''
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
                    alignItems: 'stretch'
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            backgroundColor: theme.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 10
                        }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                {index + 1}
                            </Text>
                        </View>

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                color: theme.textSecondary,
                                fontSize: 14,
                                flex: 1
                            }}
                        >
                            {renderQuestionTypeText(question.type)}
                        </Text>
                    </View>

                    {renderAnswerBadge(question)}
                </View>

                <Text style={{
                    color: theme.textPrimary,
                    fontSize: 18,
                    marginBottom: 14
                }}>
                    {question.question}
                </Text>

                <View style={{
                    backgroundColor: theme.secondary,
                    borderColor: theme.textSecondary,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 10
                }}>
                    <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
                        Twoja odpowiedź
                    </Text>

                    <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                        {getUserAnswersText(question)}
                    </Text>
                </View>

                {!isOpen && !correct ? (
                    <View style={{
                        backgroundColor: theme.secondary,
                        borderColor: '#2EAD5B',
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 10
                    }}>
                        <Text style={{ color: '#2EAD5B', marginBottom: 6 }}>
                            Poprawna odpowiedź
                        </Text>

                        <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                            {getCorrectAnswersText(question)}
                        </Text>
                    </View>
                ) : null}

                {isOpen ? (
                    <>
                        <View style={{
                            backgroundColor: theme.secondary,
                            borderColor: theme.textSecondary,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 10
                        }}>
                            <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
                                Oczekiwana odpowiedź
                            </Text>

                            <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                                {question.expectedAnswer}
                            </Text>
                        </View>

                        <View style={{
                            backgroundColor: theme.secondary,
                            borderColor: theme.primary,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 10
                        }}>
                            <Text style={{ color: theme.primary, marginBottom: 6 }}>
                                Ocena AI
                            </Text>

                            <Text style={{ color: theme.textPrimary, fontSize: 16 }}>
                                {openResult?.feedback || 'Brak oceny'}
                            </Text>
                        </View>
                    </>
                ) : null}

                {question.explanation ? (
                    <View style={{ marginTop: 4 }}>
                        <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
                            Wyjaśnienie
                        </Text>

                        <Text style={{ color: theme.textPrimary, fontSize: 15 }}>
                            {question.explanation}
                        </Text>
                    </View>
                ) : null}
            </View>
        )
    }

    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>Wynik testu</Text>
            </View>

            <ScrollView>
                <View style={styles.viewContainer}>
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <GoBackButton />
                    </View>

                    <View style={{
                        width: '100%',
                        backgroundColor: theme.secondary,
                        borderColor: theme.textSecondary,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 18,
                        marginBottom: 24
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="clipboard-check-outline"
                                size={34}
                                color={theme.primary}
                                style={{ marginRight: 12 }}
                            />

                            <View>
                                <Text style={{ color: theme.textPrimary, fontSize: 24 }}>
                                    {correctCount.toFixed(1)}/{maxPoints} pkt
                                </Text>

                                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                                    Wynik: {percent}%
                                </Text>
                            </View>
                        </View>

                        {openQuestions.length > 0 ? (
                            <Text style={{
                                color: theme.textSecondary,
                                marginTop: 14,
                                fontSize: 14
                            }}>
                                Pytania otwarte zostały ocenione przez AI.
                            </Text>
                        ) : null}
                    </View>

                    <View style={{ width: '100%' }}>
                        <Text style={{ ...styles.headlineText, marginBottom: 14 }}>
                            Odpowiedzi
                        </Text>

                        {questions.map((question, index) =>
                            renderQuestionSummary(question, index)
                        )}
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('SubjectTestScreen')}
                        style={{
                            width: '100%',
                            backgroundColor: theme.primary,
                            borderRadius: 8,
                            padding: 14,
                            alignItems: 'center',
                            marginBottom: 30
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16 }}>
                            Wygeneruj kolejny test
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}