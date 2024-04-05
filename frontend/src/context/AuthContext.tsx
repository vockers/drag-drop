import { Dispatch, SetStateAction, createContext, useState } from "react";

interface User {
    id: number;
    username: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface AuthContextProps extends AuthState {
    setAuthState: Dispatch<SetStateAction<AuthState>>;
}

export const AuthenticationContext = createContext<AuthContextProps>({
    user: null,
    loading: false,
    error: null,
    setAuthState: () => {},
});

export default function AuthContext({children}: {children: React.ReactNode}) {
    const [authState, setAuthState] = useState<AuthState>({
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
        loading: false,
        error: null,
    });

    return (
        <AuthenticationContext.Provider value={{...authState, setAuthState}}>
            {children}
        </AuthenticationContext.Provider>
    );
}