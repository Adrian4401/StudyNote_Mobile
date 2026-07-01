import { API_URLS } from './urls';

interface NoteParams {
    title: string,
    body: string,
    subjectId: string,
    classId: string,
    token: string
}

export async function getAllNotes ( token: string ) {
    const response = await fetch(API_URLS.NOTE, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    console.log('GET ALL NOTES STATUS:', response.status)
    console.log('GET ALL NOTES RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot get all notes`)
    }

    return data || []
}

export async function getNote ( id: number, token: string ) {
    const response = await fetch(`${API_URLS.NOTE}/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    console.log('GET NOTE STATUS:', response.status)
    console.log('GET NOTE RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot get note`)
    } 

    return data
}

export async function addNote ( { title, body, subjectId, classId, token }: NoteParams ) {
    const response = await fetch(API_URLS.NOTE, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            title,
            body,
            subjectId,
            classId
        })
    })

    const text = await response.text()
    console.log('ADD NOTE STATUS: ', response.status)
    console.log('ADD NOTE RESPONSE: ', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot add note')
    }

    return data
}

export async function updateNote (id: number, title: string, body: string, subjectId: number, classId: number, token: string) {
    const response = await fetch(`${API_URLS.NOTE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            title,
            body,
            subjectId,
            classId
        }),
    })

    const text = await response.text()
    console.log('EDIT NOTE STATUS: ', response.status)
    console.log('EDIT NOTE RESPONSE: ', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot edit note')
    }

    return data
}

export async function deleteNote (id: number, token: string) {
    const response = await fetch(`${API_URLS.NOTE}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })

    const text = await response.text()
    console.log('DELETE NOTE STATUS: ', response.status)
    console.log('DELETE NOTE RESPONSE: ', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot delete note')
    }

    return data
}