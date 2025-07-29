import { useNavigate } from "react-router";
import { useTokenStore } from "../hooks/useTokenStore";
import { useEffect, useState } from "react";
import type { Usuario } from "../interfaces/Usuario";

function Navbar() {
    const navigate = useNavigate();
    const { setToken, setUser, token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(undefined);
        setUser(undefined);
        navigate('/');
    }

    useEffect(() => {
        if (!user?.id || !token) return;
        (async () => {
            const resp = await fetch(
                `${import.meta.env.VITE_API_URL}/usuarios/${user.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsuario(await resp.json());
        })();
    }, [token, user?.id]);

    const links = [
        { label: 'Home', path: '/home' },
        { label: 'Procedimentos', path: usuario?.id_tipo_usuario === 2 ? `/listagem-procedimentos?usuario_id=${usuario.id}` : '/listagem-procedimentos' },
        { label: 'Orçamentos', path: usuario?.id_tipo_usuario === 2 ? `/listagem-orcamentos?usuario_id=${usuario.id}` : '/listagem-orcamentos' },
        { label: usuario?.id_tipo_usuario === 1 ? 'Clientes' : 'Meus Dados', path: usuario?.id_tipo_usuario === 1 ? '/listagem-clientes' : `/listagem-clientes/${usuario?.id}` }
    ];

    return (
        <nav className="bg-[#7F634B] w-full px-4 py-4 relative">
            <div className=" mx-auto flex items-end justify-between p-5">

                <div className="flex-shrink-0">
                    <img src="../src/assets/logoClaro.PNG" alt="Logo" className="h-20 w-auto md:h-32" />
                </div>

                <ul className="hidden md:flex items-center space-x-6 text-white">
                    {links.map((link, idx) => (
                        <li key={idx} onClick={() => navigate(link.path)} className="cursor-pointer hover:underline">
                            {link.label}
                        </li>
                    ))}
                    <li onClick={handleLogout} className="cursor-pointer hover:underline text-red-300">
                        Sair
                    </li>
                </ul>

                <button
                    className="md:hidden  text-white focus:outline-none"
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    <svg className="h-6 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden absolute top-30 right-8 w-44 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <ul className="flex flex-col">
                        {links.map((link, idx) => (
                            <li
                                key={`mobile-link-${idx}`}
                                onClick={() => { navigate(link.path); setMenuOpen(false); }}
                                className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                            >
                                {link.label}
                            </li>
                        ))}
                        <li
                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                            className="px-4 py-2  text-red-600 hover:bg-gray-100 cursor-pointer"
                        >
                            Sair
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
