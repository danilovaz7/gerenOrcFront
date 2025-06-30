import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    dt_nascimento: string;
    rg: string;
    cpf: string;
    id_tipo_usuario: number;
    estado_civil: string;
    sexo: string;
    endereco: string;
    num_endereco: string;
    complemento: string;
    cidade: string;
    bairro: string;
    cep: string;
    naturalidade: string;
    nacionalidade: string;
    raca: string;
    telefone: string;
    celular: string;
    profissao: string;
    local_trabalho: string;
    instagram: string;
    facebook: string;
    ic_ativo: boolean;
}


function HomePage() {
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const usuarioAtual = await response.json();
            setUsuario(usuarioAtual);

        }
        pegaUsuarios();
    }, [user, token]);

    return (
        <div className="flex h-full flex-col justify-start gap-16 items-center w-screen p-2">
            <div className="flex w-[70%] flex-col items-start mt-16">
                <div className="flex w-full p-5 justify-center bg-[#9B7F67]">
                    <p className="text-2xl">Lista de retornos próximos</p>
                </div>
                <div className="flex flex-col gap-5 p-5 justify-center bg-[rgba(155,127,103,0.26)] w-full">
                    <div className="w-[100%] justify-around p-2 flex rounded-md bg-[#9B7F67]">
                        <p>Cliente : ZXCZXC XVCSZZ</p>
                        <p>Procedimento: ZXCZXCZCIJN ANCIASIDNI</p>
                        <p>Data de retorno: 12/03/25</p>
                        <p>Numero do retorno: 2</p>
                    </div>
                    <div className="w-[100%] justify-around p-2 flex rounded-md bg-[#9B7F67]">
                        <p>Cliente : ZXCZXC XVCSZZ</p>
                        <p>Procedimento: ZXCZXCZCIJN ANCIASIDNI</p>
                        <p>Data de retorno: 12/03/25</p>
                        <p>Numero do retorno: 2</p>
                    </div>
                    <div className="w-[100%] justify-around p-2 flex rounded-md bg-[#9B7F67]">
                        <p>Cliente : ZXCZXC XVCSZZ</p>
                        <p>Procedimento: ZXCZXCZCIJN ANCIASIDNI</p>
                        <p>Data de retorno: 12/03/25</p>
                        <p>Numero do retorno: 2</p>
                    </div>

                </div>
            </div>
            <div className="flex w-[60%] gap-5 justify-around flex-wrap items-center p-2">
                <div className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                    <p>VER PROCEDIMENTOS</p>
                </div>
                <div className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                    <p>VER PROCEDIMENTOS</p>
                </div>
                <div className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                    <p>VER PROCEDIMENTOS</p>
                </div>
                <div className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                    <p>VER PROCEDIMENTOS</p>
                </div>
                <div className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                    <p>VER PROCEDIMENTOS</p>
                </div>

            </div>

        </div>

    )
}

export default HomePage
