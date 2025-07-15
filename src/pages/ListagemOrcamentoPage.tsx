import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";

import type { Usuario } from '../interfaces/Usuario';
import type { Orcamento } from "../interfaces/Orcamento";

function ListagemOrcamentoPage() {
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);


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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orcamentos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            const orcamentosResponse = await response.json()
            setOrcamentos(orcamentosResponse)

        }
        pegaOrcamentos();
    }, []);

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
            console.log('orcamentoResponse', orcamentoResponse)
            setOrcamentos(orcamentoResponse)
        }
    });



    return (
        <div className="flex h-full flex-col justify-start gap-4 items-center w-screen">
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

            <div className="w-[90%] flex flex-col p-4 gap-5 justify-center items-center bg-[rgba(155,127,103,0.26)] rounded-sm">
                {orcamentos.map((orcamento, index) => {
                    return (
                        <div key={index} className="flex w-full text-white justify-between border border-[#9B7F67] items-center bg-[#9B7F67] p-3 rounded-md hover:bg-[#E3DCD4]   hover:text-black">
                            <p>ID orçamento: {orcamento.id}</p>
                            <p>Qtd procedimentos: {`(${orcamento.procedimentosCount})`}</p>
                            <p>Data criação: {new Date(orcamento.createdAt).toLocaleDateString('pt-BR')}</p>
                            <p>Valor total: {`R$${orcamento.valor_total}`}</p>
                            <p>Método: {orcamento.forma_pagamento}</p>
                            <p className="underline">Ver Mais</p>
                        </div>
                    );
                })}
            </div>

        </div>

    )
}

export default ListagemOrcamentoPage
