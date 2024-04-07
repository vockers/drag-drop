import { Dispatch, SetStateAction, createContext, useState } from "react";

interface User {
    id: number;
    username: string;
}

interface AuthState {
    user: User | null;
}

interface AuthContextProps extends AuthState {
    setAuthState: Dispatch<SetStateAction<AuthState>>;
}

export const AuthenticationContext = createContext<AuthContextProps>({
    user: null,
    setAuthState: () => {},
});

export default function AuthContext({children}: {children: React.ReactNode}) {
    const [authState, setAuthState] = useState<AuthState>({
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
    });

    return (
        <AuthenticationContext.Provider value={{...authState, setAuthState}}>
            {children}
        </AuthenticationContext.Provider>
    );
}