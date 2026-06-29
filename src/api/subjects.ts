import { API_URLS } from './urls';

interface SubjectParams {
    subject: string,
    token: string
}

export async function getAllSubjects ( token: string ) {
    const response = await fetch(API_URLS.SUBJECT, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    console.log('GET ALL SUBJECTS STATUS:', response.status)
    console.log('GET ALL SUBJECTS RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot get all subjects`)
    } 

    return data
}

export async function getSubject ( id: number, token: string ) {
    const response = await fetch(`${API_URLS.SUBJECT}/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    console.log('GET ALL SUBJECTS STATUS:', response.status)
    console.log('GET ALL SUBJECTS RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot get all subjects`)
    } 

    return data
}

export async function addSubject ({ subject, token }: SubjectParams) {
    const response = await fetch(API_URLS.SUBJECT, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: subject })
    })

    const text = await response.text()
    console.log('ADD SUBJECT STATUS:', response.status)
    console.log('ADD SUBJECT RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot add subject`)
    } 

    return data
}

export async function updateSubject(id: number, subject: string, token: string) {
    const response = await fetch(`${API_URLS.SUBJECT}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: subject }),
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot edit subject')
    }

    return data
}

export async function deleteSubject(id: number, token: string) {
    const response = await fetch(`${API_URLS.SUBJECT}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot delete subject')
    }

    return data
}