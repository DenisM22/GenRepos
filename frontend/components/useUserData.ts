import {useEffect, useState} from 'react';
import {userApi} from "@/app/api/api";
import {User} from "@/app/types/models";

const useUserData = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            const savedUser = JSON.parse(sessionStorage.getItem('user') || '{}')
            setUser(savedUser)
        } else
            fetchUserInfo()
    }, [])

    const fetchUserInfo = async () => {
        try {
            const userResponse = await userApi.getCurrentUser();
            setUser(userResponse.data);
            sessionStorage.setItem('user', JSON.stringify(userResponse.data))
        } catch (error) {
            console.warn('Не удалось получить пользователя:', error);
            sessionStorage.removeItem('user');
            setUser(null);
        }
    }

    return user
}

export default useUserData
