import { useNavigate } from "react-router";
import { useTokenStore } from "../hooks/useTokenStore";
import { useEffect, useState } from "react";
import type { Usuario } from "../interfaces/Usuario";


function Navbar() {
    const navigate = useNavigate();
    const { setToken, setUser } = useTokenStore();
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(undefined);
        setUser(undefined);
        navigate('/');
    }

    useEffect(() => {
        (async () => {
            const resp = await fetch(
                `${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            setUsuario(await resp.json());
        })();
    }, [token, user?.id]);


    return (
        <div className="p-10 bg-[#7F634B] w-screen flex ">
            <div className="w-[50%]">
                <img className="w-[20%]" src="../src/assets/logoClaro.PNG" alt="" />
            </div>

            <div className="w-[50%] flex gap-14 flex-col">
                <div className="flex justify-end">
                    <img onClick={handleLogout} className="w-8" src="../src/assets/logoutIcon.png" alt="" />
                </div>
                <div className="flex text-md justify-end gap-5">
                    <p onClick={() => { navigate('/home'); }}>Home</p>
                    <p>|</p>
                    {
                        usuario?.id_tipo_usuario === 2 ?
                            <>
                                <p onClick={() => { navigate(`/listagem-procedimentos?usuario_id=${usuario.id}`); }}>Procedimentos</p>
                                <p>|</p>
                                <p onClick={() => { navigate(`/listagem-orcamentos?usuario_id=${usuario.id}`); }}>Orçamentos</p>
                                <p>|</p>
                            </>
                            :
                            <>
                                <p onClick={() => { navigate('/listagem-procedimentos'); }}>Procedimentos</p>
                                <p>|</p>
                                <p onClick={() => { navigate('/listagem-orcamentos'); }}>Orçamentos</p>
                                <p>|</p>
                            </>
                    }
                    {
                        usuario?.id_tipo_usuario === 1 ?
                            <p onClick={() => { navigate('/listagem-clientes'); }}>Clientes</p>
                            :
                            <p onClick={() => { navigate(`/listagem-clientes/${usuario?.id}`); }}>Meus Dados</p>
                    }


                </div>
            </div>
        </div>
    );
}

export default Navbar;
