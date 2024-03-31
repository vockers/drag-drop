import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <>
        <div className="bg-blue-500 h-full flex flex-col items-center px-5">
            <NavBar />
            <Outlet />
        </div>
        <Footer />
        </>
    );
}
