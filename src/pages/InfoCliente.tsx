import { useNavigate, useParams } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, DateInput, Form, Input, NumberInput, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";

import type { Usuario } from '../interfaces/Usuario';
import React from "react";

export const CalendarIcon = (props: any) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"
            fill="currentColor"
        />
        <path
            clipRule="evenodd"
            d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);

function InfoClientes() {
    const { token } = useTokenStore();
    const { idUsuario } = useParams();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const navigate = useNavigate();
     const [selected, setSelected] = React.useState("london");


    useEffect(() => {
        async function pegaUsuario() {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${idUsuario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setUsuario(data);
            }
        }
        pegaUsuario();
    }, [idUsuario, token]);

    console.log(usuario)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nome: usuario?.nome ?? '',
            email: usuario?.email ?? '',
            dt_nascimento: usuario?.dt_nascimento ?? '',
            rg: usuario?.rg ?? '',
            cpf: usuario?.cpf ?? '',
            estado_civil: usuario?.estado_civil ?? '',
            sexo: usuario?.sexo ?? '',
            filhos: usuario?.filhos ?? 0,
            cep: usuario?.cep ?? '',
            endereco: usuario?.endereco ?? '',
            num_endereco: usuario?.num_endereco ?? '',
            complemento: usuario?.complemento ?? '',
            cidade: usuario?.cidade ?? '',
            bairro: usuario?.bairro ?? '',
            naturalidade: usuario?.naturalidade ?? '',
            nacionalidade: usuario?.nacionalidade ?? '',
            raca: usuario?.raca ?? '',
            telefone: usuario?.telefone ?? '',
            celular: usuario?.celular ?? '',
            profissao: usuario?.profissao ?? '',
            local_trabalho: usuario?.local_trabalho ?? '',
            instagram: usuario?.instagram ?? '',
            facebook: usuario?.facebook ?? '',
        },
        onSubmit: async (values) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });
            if (res.ok) navigate('/home');
        },
    });

    if (!usuario) {
        return <div>Carregando informações do usuário…</div>;
    }

    return (
        <div className="flex h-full flex-col justify-start gap-16  items-center w-screen p-2">
            <Form
                className="w-[95%] sm:w-[80%] flex flex-col justify-center items-center  gap-6 bg-[rgba(155,127,103,0.26)]  p-6 sm:p-10 "
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
            >
                <h1 className="items-center">Identificação do paciente</h1>
                <Input
                    isRequired
                    errorMessage="Coloque um nome válido"
                    onChange={formik.handleChange}
                    value={formik.values.nome}
                    name="nome"
                    label="Nome completo"
                    labelPlacement={'outside'}
                    placeholder="José da Silva Santos..."
                    type="text"

                />
                <div className="w-full gap-12 flex justify-start items-center">
                    <DateInput
                        isRequired
                        className="w-[20%]"
                        value={
                            formik.values.dt_nascimento
                                ? parseDate(formik.values.dt_nascimento)
                                : null
                        }
                        onChange={(value: CalendarDate | null) => {
                            formik.setFieldValue(
                                'dt_nascimento',
                                value ? value.toString() : ''
                            );
                        }}
                        name="dt_nascimento"
                        label="Data de nascimento"
                        labelPlacement="outside"
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        endContent={
                            <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um rg válido"
                        onChange={formik.handleChange}
                        value={formik.values.rg}
                        name="rg"
                        label="RG"
                        labelPlacement="outside"
                        placeholder="99999999999..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um cpf válido"
                        onChange={formik.handleChange}
                        value={formik.values.cpf}
                        name="cpf"
                        label="CPF"
                        labelPlacement="outside"
                        placeholder="34055948123..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um estado civil valido"
                        onChange={formik.handleChange}
                        value={formik.values.estado_civil}
                        name="estado_civil"
                        label="Estado civil"
                        labelPlacement="outside"
                        placeholder="Solteiro..."
                        type="text"
                    />
                    <Select
                        isRequired
                        label="Sexo"
                        labelPlacement="outside"
                        className="w-[20%]"
                        selectedKeys={
                            formik.values.sexo
                                ? new Set([formik.values.sexo])
                                : new Set()
                        }
                        onSelectionChange={(keys) => {
                            const selec = Array.from(keys)[0] as string;
                            formik.setFieldValue('sexo', selec);
                        }}
                    >
                        <SelectItem className="text-black" key="masc">Masculino</SelectItem>
                        <SelectItem className="text-black" key="fem">Feminino</SelectItem>
                        <SelectItem className="text-black" key="outro">Outro</SelectItem>
                    </Select>
                    <NumberInput
                        isRequired
                        className="w-[12%]"
                        errorMessage="Insira um valor valido"
                        onChange={formik.handleChange}
                        value={formik.values.filhos}
                        name="filhos"
                        label="Filhos"
                        labelPlacement="outside"
                        placeholder="1..."

                    />
                </div>

                <div className="w-full gap-12 flex justify-start items-center">
                    <Input
                        isRequired
                        className="w-[15%]"
                        errorMessage="Insira um CEP válido"
                        onChange={formik.handleChange}
                        value={formik.values.cep}
                        name="cep"
                        label="CEP"
                        labelPlacement="outside"
                        placeholder="11030405..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[60%]"
                        errorMessage="Insira um endereco válido"
                        onChange={formik.handleChange}
                        value={formik.values.endereco}
                        name="endereco"
                        label="Endereço"
                        labelPlacement="outside"
                        placeholder="Rua amarela..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[10%]"
                        errorMessage="Insira um numero  valido"
                        onChange={formik.handleChange}
                        value={formik.values.num_endereco}
                        name="num_endereco"
                        label="N°"
                        labelPlacement="outside"
                        placeholder="12..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[15%]"
                        errorMessage="Insira um complemento  valido"
                        onChange={formik.handleChange}
                        value={formik.values.complemento}
                        name="complemento"
                        label="Complemento"
                        labelPlacement="outside"
                        placeholder="Apto 12..."
                        type="text"
                    />
                </div>

                <div className="w-full gap-12 flex justify-start items-center">
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um Cidade válido"
                        onChange={formik.handleChange}
                        value={formik.values.cidade}
                        name="cidade"
                        label="Cidade"
                        labelPlacement="outside"
                        placeholder="Santos..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um bairro válido"
                        onChange={formik.handleChange}
                        value={formik.values.bairro}
                        name="bairro"
                        label="Bairro"
                        labelPlacement="outside"
                        placeholder="Ponta da Praia..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira uma nacionalidade  valido"
                        onChange={formik.handleChange}
                        value={formik.values.nacionalidade}
                        name="nacionalidade"
                        label="Nacionalidade"
                        labelPlacement="outside"
                        placeholder="Brasileiro..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira uma naturalidade  valido"
                        onChange={formik.handleChange}
                        value={formik.values.naturalidade}
                        name="naturalidade"
                        label="Naturalidade"
                        labelPlacement="outside"
                        placeholder="Brasil..."
                        type="text"
                    />
                    <Select
                        isRequired
                        label="Raça"
                        labelPlacement="outside"
                        selectedKeys={
                            formik.values.raca
                                ? new Set([formik.values.raca])
                                : new Set()
                        }
                        onSelectionChange={(keys) => {
                            const selec = Array.from(keys)[0] as string;
                            formik.setFieldValue('raca', selec);
                        }}
                    >
                        <SelectItem className="text-black" key="branca">Branca</SelectItem>
                        <SelectItem className="text-black" key="amarela">Amarela</SelectItem>
                        <SelectItem className="text-black" key="negra">Negra</SelectItem>
                        <SelectItem className="text-black" key="outra">Outra</SelectItem>
                    </Select>
                </div>

                <div className="w-full gap-12 flex justify-start items-center">
                    <Input
                        isRequired
                        className="w-[15%]"
                        errorMessage="Insira um telefone válido"
                        onChange={formik.handleChange}
                        value={formik.values.telefone}
                        name="telefone"
                        label="Telefone residencial"
                        labelPlacement="outside"
                        placeholder="32325467..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[15%]"
                        errorMessage="Insira um celular válido"
                        onChange={formik.handleChange}
                        value={formik.values.celular}
                        name="celular"
                        label="Celular"
                        labelPlacement="outside"
                        placeholder="13 991029359..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira uma profissão  valido"
                        onChange={formik.handleChange}
                        value={formik.values.profissao}
                        name="profissao"
                        label="Profissão"
                        labelPlacement="outside"
                        placeholder="Bombeiro..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[50%]"
                        errorMessage="Insira uma local de trabalho  valido"
                        onChange={formik.handleChange}
                        value={formik.values.local_trabalho}
                        name="local_trabalho"
                        label="Local de trabalho"
                        labelPlacement="outside"
                        placeholder="Brasil..."
                        type="text"
                    />

                </div>

                <div className="w-full gap-12 flex justify-start items-center">
                    <Input
                        isRequired
                        className="w-[60%]"
                        errorMessage="Insira uma email  valido"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        name="email"
                        label="Email"
                        labelPlacement="outside"
                        placeholder="exemplo@gmail.com..."
                        type="text"
                    />

                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um instagram válido"
                        onChange={formik.handleChange}
                        value={formik.values.instagram}
                        name="instagram"
                        label="Instagram "
                        labelPlacement="outside"
                        placeholder="doutora_camila..."
                        type="text"
                    />
                    <Input
                        isRequired
                        className="w-[20%]"
                        errorMessage="Insira um facebook válido"
                        onChange={formik.handleChange}
                        value={formik.values.facebook}
                        name="facebook"
                        label="Facebook"
                        labelPlacement="outside"
                        placeholder="Camila Leutz..."
                        type="text"
                    />
                </div>
                <h1 className="items-center">Dados complementares</h1>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Teve complicação durante tratamento odontologico?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">No momento está em tratamento médico?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Já fez transfusões de sangue?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Por quê?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Tem ou teve alguma doença grave?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Tem alguma alergia geral?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja foi hospitalizado?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Por quê?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja foi submetido a cirurgia?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Teve complicação durante tratamento asdasdasdasdasdodontologico?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Sente dor em algum dente?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">É portador de prótese cardíaca?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja apresentou sangramento anormal associado com extração, cirurgia ou trauma?</p>
                        <RadioGroup orientation="horizontal"  value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
                    <Button size="lg" className="w-[15%] text-white bg-[#7F634B]" type="submit">
                        Salvar
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default InfoClientes;
