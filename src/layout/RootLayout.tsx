
import { Outlet, useNavigate } from "react-router";
import { useTokenStore } from "../hooks/useTokenStore";

export function RootLayout() {

    const navigate = useNavigate();
    const { setToken, setUser } = useTokenStore();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(undefined);
        setUser(undefined);
        navigate('/');
    }

    return (
        <div className=' w-screen h-screen flex flex-col justify-between items-center'>
            <div className="p-10 bg-[#7F634B] w-screen flex ">
                <div className="w-[50%]">
                    <img className="w-[20%]" src="../src/assets/logoClaro.PNG" alt="" />
                </div>

                <div className="w-[50%] flex gap-14 flex-col">
                    <div className="flex justify-end">
                        <img onClick={handleLogout} className="w-8" src="../src/assets/logoutIcon.png" alt="" />
                    </div>
                    <div className="flex text-md justify-end gap-5">
                        <p>Home</p>
                        <p>|</p>
                        <p>Procedimentos</p>
                        <p>|</p>
                        <p>Orçamentos</p>
                        <p>|</p>
                        <p>Clientes</p>

                    </div>
                </div>
            </div>

            <Outlet />


            <div className="p-10 bg-[#7F634B] w-screen">

            </div>
        </div>
    );
}