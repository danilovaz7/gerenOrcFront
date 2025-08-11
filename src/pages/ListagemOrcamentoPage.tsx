import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
    Form,
    Form as HForm,
    Select,
    SelectItem,
} from '@heroui/react';

import type { Usuario } from '../interfaces/Usuario';
import type { Orcamento } from "../interfaces/Orcamento";
import { OrcamentoCard } from '../components/OrcamentoCard.tsx';
import { useSearchParams } from 'react-router';
import { Controller, FormProvider, useForm } from 'react-hook-form';

export type FormValues = Omit<Orcamento, 'id'>;

// Tipo do formulário de edição do modal
type EditFormValues = {
    id: number;
    status: string;
};

function ListagemOrcamentoPage() {
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario | undefined>();
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [searchParams] = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const pacienteId = searchParams.get('usuario_id');
    const [idOrcamento, setIdOrcamento] = useState<number | undefined>();
    const [, setOrcamento] = useState<Orcamento | undefined>();

    // estado local pra controlar a seleção do select (ajuda com comportamento assíncrono)
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // formik para busca por nome
    const formik = useFormik({
        initialValues: {
            nome: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/orcamentos?nome=${encodeURIComponent(values.nome)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const orcamentoResponse = await response.json();
                setOrcamentos(orcamentoResponse);
            } catch (err) {
                console.error(err);
            }
        }
    });

    // form do modal (edição)
    const methodsEdit = useForm<EditFormValues>({
        defaultValues: { id: 0, status: '' }
    });

    const {
        handleSubmit: handleSubmitEdit,
        control,
        reset,
    } = methodsEdit;

    // busca dados do usuário logado (dependências token e user.id)
    useEffect(() => {
        async function pegaUsuario() {
            if (!user?.id) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Erro ao buscar usuário');
                const usuarioAtual = await response.json();
                setUsuario(usuarioAtual);
            } catch (err) {
                console.error(err);
            }
        }
        pegaUsuario();
    }, [token, user?.id]);

    // busca lista de orçamentos (opcionalmente filtrando por usuario_id query param)
    useEffect(() => {
        async function pegaOrcamentos() {
            try {
                const url = new URL(`${import.meta.env.VITE_API_URL}/orcamentos`);
                if (pacienteId) url.searchParams.set('usuario_id', pacienteId);
                const response = await fetch(url.toString(), {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Erro ao buscar orçamentos');
                const data: Orcamento[] = await response.json();
                setOrcamentos(data);
            } catch (err) {
                console.error(err);
            }
        }
        pegaOrcamentos();
    }, [token, pacienteId]);

    // quando idOrcamento muda, busca o orçamento específico e abre o modal após carregar
    useEffect(() => {
        if (!idOrcamento) return;
        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/orcamentos/${idOrcamento}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Erro ao buscar orçamento');
                const data: Orcamento = await res.json();

                setOrcamento(data);

                const statusString = String(data.status ?? '');
                // Preenche o formulário de edição e o estado local do select, e só depois abre
                reset({ id: data.id ?? 0, status: statusString });
                setSelectedStatus(statusString);
                onOpen();
            } catch (err) {
                console.error(err);
            }
        })();
    }, [idOrcamento, token, reset, onOpen]);

    // função de fechamento do modal (limpa o estado relacionado)
    function handleClose() {
        onClose();
        setIdOrcamento(undefined);
        setOrcamento(undefined);
        setSelectedStatus('');
    }

    // submit do modal -> atualiza no servidor e localmente
    const onSubmitUpdate = async (values: EditFormValues) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/orcamentos/${values.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: values.status })
            });

            if (!res.ok) throw new Error('Falha ao atualizar orçamento');

            // atualiza item localmente sem refazer toda a lista
            setOrcamentos(prev => prev.map(o => (o.id === values.id ? { ...o, status: values.status } : o)));

            handleClose();
        } catch (err) {
            console.error(err);
            // aqui você pode exibir um toast/alerta para o usuário
        }
    };


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
                        orcamentos.map((orcamentoItem) => (
                            <OrcamentoCard key={orcamentoItem.id}
                            id_orcamento={orcamentoItem.id}
                            qtd_procedimentos={orcamentoItem.procedimentosCount}
                            status={orcamentoItem.status}
                            dt_criacao={orcamentoItem.createdAt}
                            valor_total={orcamentoItem.valor_total}
                            onclick={() => {
                                setIdOrcamento(orcamentoItem.id);
                            } }
                            metodo_pag={orcamentoItem.forma_pagamento} 
                            usuario_id_tipo={usuario?.id} />
                        ))
                    )}
                </div>
            </div>

            <Modal className='bg-[#e5ded8]' isOpen={isOpen} size={'3xl'} onClose={handleClose}>
                <ModalContent className='text-black max-h-[80vh] overflow-y-auto'>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Editar Orçamento</ModalHeader>
                            <ModalBody className="flex h-full flex-col  items-center p-2">
                                <FormProvider {...methodsEdit}>
                                    <HForm onSubmit={handleSubmitEdit(onSubmitUpdate)} className="w-[100%] flex flex-col gap-10 p-6 sm:p-10">
                                        <section className="flex flex-wrap gap-2 w-full">
                                            <Controller
                                                name="id"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="ID do Orçamento"
                                                        isDisabled
                                                        className="w-[100%]"
                                                        value={String(field.value ?? '')}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                       
                                                        selectedKeys={selectedStatus ? new Set([selectedStatus]) : new Set()}
                                                       
                                                        onSelectionChange={(keys: any) => {
                                                            let value = "";
                                                            if (typeof keys === "string") {
                                                                value = keys;
                                                            } else if (keys instanceof Set) {
                                                                value = Array.from(keys)[0] ?? "";
                                                            } else if (Array.isArray(keys)) {
                                                                value = keys[0] ?? "";
                                                            } else {
                                                                value = String(keys ?? "");
                                                            }
                                                            setSelectedStatus(value);
                                                            field.onChange(value);
                                                        }}
                                                        label="Status do procedimento"
                                                        className="w-[100%]"
                                                    >
                                                        <SelectItem className='text-black' key="Aguardando pagamento">Aguardando pagamento</SelectItem>
                                                        <SelectItem className='text-black' key="pago">Pago</SelectItem>
                                                    </Select>
                                                )}
                                            />
                                        </section>

                                        <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
                                            <Button size="lg" type="submit" className="w-[15%] text-white bg-[#7F634B]">
                                                Salvar
                                            </Button>
                                        </div>
                                    </HForm>
                                </FormProvider>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>

    )
}

export default ListagemOrcamentoPage;
