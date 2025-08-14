import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, Form, Input } from "@heroui/react";


import type { Usuario } from '../interfaces/Usuario';
import PacienteCard from "../components/PacienteCard";


function ListagemClientesPage() {
    const { token, user } = useTokenStore();
    const [, setUsuario] = useState<Usuario>();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        async function pegaUsuario() {
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
        pegaUsuario();
    }, []);

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            const usuariosResponse = await response.json()
            setUsuarios(usuariosResponse)

        }
        pegaUsuarios();
    }, []);


    const formik = useFormik({
        initialValues: {
            nome: '',
        },
        onSubmit: async (values) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios?nome=${values.nome}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })


            const usuariosResponse = await response.json()
            console.log('usuariosResponse', usuariosResponse)
            setUsuarios(usuariosResponse)
        }
    });



    return (
        <div className="flex h-full flex-col justify-start gap-4 items-center w-screen">
            <Form
                className="w-[95%] sm:w-[80%] flex flex-col justify-center rounded-md bg-[rgba(155,127,103,0.26)]  p-2 sm:p-5 "
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
            >
                <div className="w-full gap-6 sm:gap-12 flex sm:flex-row flex-col justify-start items-center">
                    <Input
                        isRequired
                        className="w-[90%]"
                        errorMessage="Insira um nome válido"
                        onChange={formik.handleChange}
                        value={formik.values.nome}
                        name="nome"
                        label="Nome completo do paciente"
                        labelPlacement="outside"
                        placeholder="José da Silva Santos..."
                        type="text"
                    />

                    <Button size="lg" className="w-[10%] text-white bg-[#7F634B]" type="submit">
                        Enviar
                    </Button>
                </div>
            </Form>

            <div className="w-[90%] flex flex-col p-4 gap-5 justify-center items-center bg-[rgba(155,127,103,0.26)] rounded-sm">
                {usuarios.map((usuario, index) => {
                    return (
                       <PacienteCard id={usuario.id} key={index} nome={usuario.nome} orcamentosCount={usuario.orcamentosCount} procedimentosCount={usuario.procedimentosCount} ultimo_retorno={usuario.ultimoRetorno} />
                    );
                })}
            </div>

        </div>

    )
}

export default ListagemClientesPage
