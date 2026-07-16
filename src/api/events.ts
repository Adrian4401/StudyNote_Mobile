import { API_URLS } from './urls';

interface EventParams {
    title: string;
    description: string;
    deadline: Date;
    subjectId: string;
    classId: string;
    noteIds: number[];
    token: string;
}

export async function getAllEvents(token: string) {
    const response = await fetch(API_URLS.EVENT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })

    const text = await response.text()
    console.log('GET EVENTS STATUS: ', response.status)
    console.log('GET EVENTS RESPONSE: ', text)

    const data = text ? JSON.parse(text) : null

    if(!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot get events')
    }

    return data
}

export async function getEvent(id: number, token: string) {
    const response = await fetch(`${API_URLS.EVENT}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })

    const text = await response.text()
    console.log('GET EVENT STATUS: ', response.status)
    console.log('GET EVENT RESPONSE: ', text)

    const data = text ? JSON.parse(text) : null

    if(!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot get event')
    }

    return data
}

export async function addEvent({
    title,
    description,
    deadline,
    subjectId,
    classId,
    noteIds,
    token,
}: EventParams) {
    const response = await fetch(API_URLS.EVENT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title,
            description,
            deadline,
            subjectId,
            classId,
            noteIds,
        }),
    });

    const text = await response.text();
    console.log('ADD EVENT STATUS:', response.status);
    console.log('ADD EVENT RESPONSE:', text);

    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(data?.errorCode || data?.message || 'Cannot add event');
    }

    return data;
}