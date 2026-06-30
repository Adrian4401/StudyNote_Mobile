import { API_URLS } from './urls';

interface ClassParams {
    name: string,
    token: string
}

export async function getAllClasses ( token: string ) {
    const response = await fetch(API_URLS.CLASS, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    console.log('GET ALL CLASSES STATUS:', response.status)
    console.log('GET ALL CLASSES RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot get all classes`)
    } 

    return data
}

export async function getClass( id: number, token: string ) {
    const response = await fetch(`${API_URLS.CLASS}/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const text = await response.text()
    console.log('GET ALL CLASSES STATUS:', response.status)
    console.log('GET ALL CLASSES RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot get all classes`)
    } 

    return data
}

export async function addClass({ name, token }: ClassParams) {
    const response = await fetch(API_URLS.CLASS, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    })

    const text = await response.text()
    console.log('ADD CLASS STATUS:', response.status)
    console.log('ADD CLASS RESPONSE:', text)

    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || `Cannot add class`)
    } 

    return data
}

export async function updateClass(id: number, updatingClass: string, token: string) {
    const response = await fetch(`${API_URLS.CLASS}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: updatingClass }),
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot edit class')
    }

    return data
}

export async function deleteClass(id: number, token: string) {
    const response = await fetch(`${API_URLS.CLASS}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot delete class')
    }

    return data
}