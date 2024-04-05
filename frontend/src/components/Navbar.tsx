import useAuth from "@/hooks/useAuth";
import SignupModal from "./SignupModal";
import { useContext } from "react";
import { AuthenticationContext } from "@/context/AuthContext";

export default function NavBar() {
    const { logout } = useAuth();
    const { user } = useContext(AuthenticationContext);

    return (
        <div className="w-full flex justify-center bg-slate-50 shadow-sm mb-5">
            <nav className="w-full max-w-screen-md px-6 py-3 flex justify-between">
                <div className="flex gap-3">
                    <i className="fa fa-layer-group text-slate-500 text-3xl self-center"></i>
                    <span className="text-lg text-slate-600 self-center font-medium">Drag'n Drop</span>
                </div>
                <div className="h-full flex gap-2">
                    {user ?
                        <button onClick={logout} className="px-3 border-2 rounded hover:bg-slate-200 border-blue-500 p-1 text-blue-600 font-medium">LOGOUT</button>
                        :
                        <>
                        <button className="px-3 border-2 rounded hover:bg-slate-200 border-blue-500 p-1 text-blue-600 font-medium">LOGIN</button>
                        <SignupModal />
                        </>
                    }
                </div>
            </nav>
        </div>
    );
}