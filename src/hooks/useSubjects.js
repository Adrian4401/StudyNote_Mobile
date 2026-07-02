import { useCallback, useState } from 'react'
import { getAllSubjects } from '../api/subjects'
import { useAuth } from '../context/AuthContext'

export const useSubjects = () => {
    const { userToken } = useAuth()
    const [subjects, setSubjects] = useState([])

    const loadSubjects = useCallback(async () => {
        if (!userToken) return

        try {
            const data = await getAllSubjects(userToken)
            setSubjects(data)
        } catch (error) {
            console.log('Loading subjects failed:', error.message)
        }
    }, [userToken])

    return {
        subjects,
        loadSubjects,
    }
}