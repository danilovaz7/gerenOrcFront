import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, Form, Input } from "@heroui/react";


import type { Usuario } from '../interfaces/Usuario';
import type { Orcamento } from "../interfaces/Orcamento";
import { OrcamentoCard } from '../components/OrcamentoCard.tsx';
import { useSearchParams } from 'react-router';


function ListagemOrcamentoPage() {
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [searchParams] = useSearchParams();
    const pacienteId = searchParams.get('usuario_id');

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
        async function pegaOrcamentos() {
            const url = new URL(`${import.meta.env.VITE_API_URL}/orcamentos`);
            if (pacienteId) {
                url.searchParams.set('usuario_id', pacienteId);
            }
            const response = await fetch(url.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data: Orcamento[] = await response.json();
            setOrcamentos(data);
        }
        pegaOrcamentos();
    }, [token, pacienteId]);

    const formik = useFormik({
        initialValues: {
            nome: '',
        },
        onSubmit: async (values) => {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/orcamentos?nome=${values.nome}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            const orcamentoResponse = await response.json()
            setOrcamentos(orcamentoResponse)
        }
    });

    return (
        <div className="flex h-full flex-col justify-start gap-4 items-center w-screen">
            {
                usuario?.id_tipo_usuario === 1 ?
                    <Form
                        className="w-[95%] sm:w-[80%] flex flex-col justify-center rounded-md bg-[rgba(155,127,103,0.26)]  p-2 sm:p-5 "
                        onSubmit={formik.handleSubmit}
                        onReset={formik.handleReset}
                    >
                        <div className="w-full gap-12 flex justify-start items-center">
                            <Input
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
                    : null
            }


            <div className="w-[90%] flex flex-col p-4 gap-5 justify-center items-center bg-[rgba(155,127,103,0.26)] rounded-sm">

                <div className="flex flex-col gap-5 p-5 justify-center bg-[rgba(155,127,103,0.26)] w-full">
                    {orcamentos.length === 0 ? (
                        <div className='flex flex-col w-full justify-center items-center gap-5'>
                            <h2 className="text-center text-3xl text-[#75614e]"> Parece que você ainda não tem orçamentos</h2>
                            <p className='text-lg text-[#75614e]'>Faça seu orçamento com a doutora primeiro!</p>
                        </div>
                    ) : (
                        orcamentos.map((orcamento, index) => (
                            <OrcamentoCard key={index}
                                id_orcamento={orcamento.id}
                                qtd_procedimentos={orcamento.procedimentosCount}
                                dt_criacao={orcamento.createdAt}
                                valor_total={orcamento.valor_total}
                                metodo_pag={orcamento.forma_pagamento} />
                        ))
                    )}
                </div>
            </div>

        </div>

    )
}

export default ListagemOrcamentoPage