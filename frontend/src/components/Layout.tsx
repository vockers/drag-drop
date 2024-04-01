import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <>
        <div className="bg-blue-500 flex flex-col items-center">
            <NavBar />
            <Outlet />
        </div>
        <Footer />
        </>
    );
}
