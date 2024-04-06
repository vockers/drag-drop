import { Outlet } from "react-router-dom";
import NavBar from "./components/Navbar";

export default function Layout() {
    return (
        <div className="min-h-svh bg-blue-500 flex flex-col items-center">
            <NavBar />
            <Outlet />
        </div>
    );
}
