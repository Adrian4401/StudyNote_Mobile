import { API_URLS } from './urls'

interface GenerateSubjectTestParams {
    subjectId: number | string
    noteIds: Array<number | string>
    questionsCount: number
    questionTypes: string[]
    token: string
    aiModel?: string
}

interface CheckOpenAnswersParams {
    openAnswers: {
        questionId: string
        question: string
        expectedAnswer: string
        userAnswer: string
    }[]
    token: string
    aiModel?: string
}

interface SaveTestResultParams {
    title?: string
    subjectId: number | string
    noteIds: Array<number | string>
    score: number
    maxScore: number
    percentage: number
    questions: any[]
    userAnswers: Record<string, any>
    openAnswersResults: any[]
    token: string
}

export async function generateSubjectTest({
    subjectId,
    noteIds,
    questionsCount,
    questionTypes,
    token,
    aiModel
}: GenerateSubjectTestParams) {
    const response = await fetch(`${API_URLS.TEST}/subject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subjectId, noteIds, questionsCount, questionTypes, aiModel })
    })

    const text = await response.text()
    console.log('GENERATE TEST STATUS:', response.status)
    console.log('GENERATE TEST RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot generate test')
    }

    return data
}

export async function checkOpenAnswers({ openAnswers, token, aiModel }: CheckOpenAnswersParams) {
    const response = await fetch(`${API_URLS.TEST}/check-open-answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ openAnswers, aiModel })
    })

    const text = await response.text()
    console.log('CHECK OPEN ANSWERS STATUS:', response.status)
    console.log('CHECK OPEN ANSWERS RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot check open answers')
    }

    return data
}

export async function getTestHistory(token: string) {
    const response = await fetch(`${API_URLS.TEST}/history`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot get test history')
    }

    return data || []
}

export async function getTestResult(id: number | string, token: string) {
    const response = await fetch(`${API_URLS.TEST}/history/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot get test result')
    }

    return data
}

export async function saveTestResult({
    title,
    subjectId,
    noteIds,
    score,
    maxScore,
    percentage,
    questions,
    userAnswers,
    openAnswersResults,
    token
}: SaveTestResultParams) {
    const response = await fetch(`${API_URLS.TEST}/history`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            title,
            subjectId,
            noteIds,
            score,
            maxScore,
            percentage,
            questions,
            userAnswers,
            openAnswersResults
        })
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot save test result')
    }

    return data
}

export async function deleteTestResult(id: number | string, token: string) {
    const response = await fetch(`${API_URLS.TEST}/history/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot delete test result')
    }

    return data
}