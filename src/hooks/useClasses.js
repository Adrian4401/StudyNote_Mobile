import { useCallback, useState } from 'react'
import { getAllClasses } from '../api/classes'
import { useAuth } from '../context/AuthContext'

export const useClasses = () => {
    const { userToken } = useAuth()
    const [classes, setClasses] = useState([])

    const loadClasses = useCallback(async () => {
        if (!userToken) return

        try {
            const data = await getAllClasses(userToken)
            setClasses(data)
        } catch (error) {
            console.log('Loading subjects failed:', error.message)
        }
    }, [userToken])

    return {
        classes,
        loadClasses,
    }
}