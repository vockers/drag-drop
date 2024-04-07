import SignupModal from "./SignupModal";
import { useContext } from "react";
import { AuthenticationContext } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
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
                        <LogoutButton />
                        :
                        <>
                            <LoginModal />
                            <SignupModal />
                        </>
                    }
                </div>
            </nav>
        </div>
    );
}