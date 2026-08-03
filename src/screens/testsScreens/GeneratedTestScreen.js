import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLanguage } from '../../context/LanguageContext'
import appLanguage from '../../utils/languages'
import { createStyles } from '../../styles'
import { SafeareaNoNav } from '../../components/SafeArea'
import { GoBackButton, MakeButton } from '../../components/Buttons'

export default function GeneratedTestScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { test } = route.params

    const { theme } = useDarkMode()
    const styles = createStyles(theme)

    const { language } = useLanguage()
    const getTranslatedText = (key) => appLanguage[language][key]

    const questions = test?.questions || []

    const [userAnswers, setUserAnswers] = useState({})

    const getAnswerText = (question, answer) => {
        if (question.type !== 'true_false') return answer.text

        if (answer.text === 'true') return 'Prawda'
        if (answer.text === 'false') return 'Fałsz'

        return answer.text
    }

    const handleSingleAnswer = (questionId, answerId) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answerId
        }))
    }

    const handleMultipleAnswer = (questionId, answerId) => {
        setUserAnswers((prev) => {
            const currentAnswers = prev[questionId] || []

            if (currentAnswers.includes(answerId)) {
                return {
                    ...prev,
                    [questionId]: currentAnswers.filter((id) => id !== answerId)
                }
            }

            return {
                ...prev,
                [questionId]: [...currentAnswers, answerId]
            }
        })
    }

    const handleOpenAnswer = (questionId, value) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: value
        }))
    }

    const isAnswerSelected = (question, answerId) => {
        const currentAnswer = userAnswers[question.id]

        if (question.type === 'multiple_choice') {
            return Array.isArray(currentAnswer) && currentAnswer.includes(answerId)
        }

        return currentAnswer === answerId
    }

    const handleFinishTest = () => {
        navigation.navigate('TestSummaryScreen', {
            questions,
            userAnswers
        })
    }

    const renderClosedAnswer = (question, answer) => {
        const selected = isAnswerSelected(question, answer.id)

        return (
            <TouchableOpacity
                key={answer.id}
                activeOpacity={0.8}
                onPress={() => {
                    if (question.type === 'multiple_choice') {
                        handleMultipleAnswer(question.id, answer.id)
                    } else {
                        handleSingleAnswer(question.id, answer.id)
                    }
                }}
                style={{
                    backgroundColor: selected ? theme.primary : theme.secondary,
                    borderColor: selected ? theme.primary : theme.textSecondary,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 14,
                    marginTop: 10
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons
                        name={
                            selected
                                ? 'checkbox-marked-circle'
                                : 'checkbox-blank-circle-outline'
                        }
                        size={22}
                        color={selected ? '#fff' : theme.textSecondary}
                        style={{ marginRight: 10 }}
                    />

                    <Text
                        style={{
                            flex: 1,
                            color: selected ? '#fff' : theme.textPrimary,
                            fontSize: 16
                        }}
                    >
                        {getAnswerText(question, answer)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderOpenAnswer = (question) => {
        return (
            <TextInput
                value={userAnswers[question.id] || ''}
                onChangeText={(value) => handleOpenAnswer(question.id, value)}
                placeholder="Wpisz odpowiedź..."
                placeholderTextColor={theme.textSecondary}
                multiline
                style={{
                    minHeight: 120,
                    backgroundColor: theme.secondary,
                    color: theme.textPrimary,
                    borderColor: theme.textSecondary,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 14,
                    marginTop: 12,
                    textAlignVertical: 'top',
                    fontSize: 16
                }}
            />
        )
    }

    const renderQuestionTypeInfo = (type) => {
        if (type === 'single_choice') return 'Jednokrotny wybór'
        if (type === 'multiple_choice') return 'Wielokrotny wybór'
        if (type === 'true_false') return 'Prawda / fałsz'
        if (type === 'open') return 'Pytanie otwarte'

        return ''
    }

    return (
        <SafeareaNoNav>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>Test</Text>
            </View>

            <ScrollView>
                <View style={styles.viewContainer}>
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <GoBackButton />
                    </View>

                    <View style={{ width: '100%' }}>
                        <Text style={{ ...styles.headlineText, marginBottom: 6 }}>
                            Rozwiąż test
                        </Text>

                        <Text style={{ ...styles.littleText, marginBottom: 20 }}>
                            Liczba pytań: {questions.length}
                        </Text>

                        {questions.map((question, index) => (
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
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10
                                    }}
                                >
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
                                        style={{
                                            color: theme.textSecondary,
                                            fontSize: 14,
                                            flex: 1
                                        }}
                                    >
                                        {renderQuestionTypeInfo(question.type)}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        color: theme.textPrimary,
                                        fontSize: 18,
                                        marginBottom: 8
                                    }}
                                >
                                    {question.question}
                                </Text>

                                {question.type === 'open'
                                    ? renderOpenAnswer(question)
                                    : question.answers.map((answer) =>
                                        renderClosedAnswer(question, answer)
                                    )}
                            </View>
                        ))}

                        <View style={{ width: '100%', marginTop: 10, marginBottom: 30 }}>
                            <MakeButton onPress={handleFinishTest} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeareaNoNav>
    )
}