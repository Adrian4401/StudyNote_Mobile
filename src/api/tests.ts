import { API_URLS } from './urls'

interface GenerateSubjectTestParams {
    subjectId: number | string
    noteIds: Array<number | string>
    questionsCount: number
    questionTypes: string[]
    token: string
}

export async function generateSubjectTest({
    subjectId,
    noteIds,
    questionsCount,
    questionTypes,
    token
}: GenerateSubjectTestParams) {
    const response = await fetch(`${API_URLS.TEST}/subject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            subjectId,
            noteIds,
            questionsCount,
            questionTypes
        })
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