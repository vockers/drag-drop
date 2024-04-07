import { AuthenticationContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function LogoutButton() {
    const { setAuthState } = useContext(AuthenticationContext);

    const logout = () => {
        setAuthState({ user: null });
        localStorage.removeItem("user");
    }

    return (
        <button onClick={logout} className="px-3 border-2 rounded hover:bg-slate-200 border-blue-500 p-1 text-blue-600 font-medium">LOGOUT</button>
    );
}