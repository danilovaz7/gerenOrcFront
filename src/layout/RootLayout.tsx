
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function RootLayout() {

    return (
        <div className=' w-screen min-h-screen gap-10 flex flex-col justify-between items-center'>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}