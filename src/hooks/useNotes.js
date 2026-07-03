import { useCallback, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllNotes } from '../api/notes'

export const useNotes = () => {
    const { userToken } = useAuth()
    const [notes, useNotes] = useState([])

    const loadNotes = useCallback(async () => {
        if (!userToken) return

        try {
            const data = await getAllNotes(userToken)
            useNotes(data)
        } catch (error) {
            console.log('Loading subjects failed:', error.message)
        }
    }, [userToken])

    return {
        notes,
        loadNotes,
    }
}