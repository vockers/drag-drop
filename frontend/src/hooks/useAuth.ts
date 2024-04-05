import { AuthenticationContext } from "@/context/AuthContext"
import axios from "axios";
import { useContext } from "react"

const useAuth = () => {
    const {user, error, loading, setAuthState} = useContext(AuthenticationContext)

    const login = async ({username, password}: {username: string, password: string}) => {
        setAuthState({user: null, loading: true, error: null});

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                username,
                password
            });
            setAuthState({
                user: response.data,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setAuthState({
                user: null,
                loading: false,
                error: error.response.data.error
            });
        }
    }

    const signup = async ({username, password}: {username: string, password: string}) => {
        setAuthState({user: null, loading: true, error: null});

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
                username,
                password
            });
            setAuthState({
                user: response.data,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setAuthState({
                user: null,
                loading: false,
                error: error.response.data.error
            });
        }
    }

    return {
        login,
        signup,
    }
}

export default useAuth;