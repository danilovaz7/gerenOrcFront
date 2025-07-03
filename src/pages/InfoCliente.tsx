import { useNavigate, useParams } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, Checkbox, CheckboxGroup, DateInput, Form, Input, NumberInput, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
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
            anamnese: {
                comp_trat_odon: usuario?.anamnese?.comp_trat_odon ?? false,
                comp_trat_odon_obs: usuario?.anamnese?.comp_trat_odon_obs ?? '',
                em_trat_medico: usuario?.anamnese?.em_trat_medico ?? false,
                em_trat_medico_obs: usuario?.anamnese?.em_trat_medico_obs ?? '',
                transfusao: usuario?.anamnese?.transfusao ?? false,
                transfusao_obs: usuario?.anamnese?.transfusao_obs ?? '',
                doenca_grave: usuario?.anamnese?.doenca_grave ?? false,
                doenca_grave_obs: usuario?.anamnese?.doenca_grave_obs ?? '',
                alergia_geral: usuario?.anamnese?.alergia_geral ?? false,
                alergia_geral_obs: usuario?.anamnese?.alergia_geral_obs ?? '',
                hospitalizado: usuario?.anamnese?.hospitalizado ?? false,
                hospitalizado_obs: usuario?.anamnese?.hospitalizado_obs ?? '',
                submetido_cirurgia: usuario?.anamnese?.submetido_cirurgia ?? false,
                cirurgia_obs: usuario?.anamnese?.cirurgia_obs ?? '',
                recebeu_anestesia: usuario?.anamnese?.recebeu_anestesia ?? false,
                comp_anestesia: usuario?.anamnese?.comp_anestesia ?? false,
                comp_anestesia_obs: usuario?.anamnese?.comp_anestesia_obs ?? '',
                dor_dente: usuario?.anamnese?.dor_dente ?? false,
                dor_dente_obs: usuario?.anamnese?.dor_dente_obs ?? '',
                protese_cardiaca: usuario?.anamnese?.protese_cardiaca ?? false,
                protese_cardiaca_obs: usuario?.anamnese?.protese_cardiaca_obs ?? '',
                sangramento_anormal: usuario?.anamnese?.sangramento_anormal ?? false,
                sangramento_anormal_obs: usuario?.anamnese?.sangramento_anormal_obs ?? '',
                tomando_medicamento: usuario?.anamnese?.tomando_medicamento ?? false,
                tomando_medicamento_obs: usuario?.anamnese?.tomando_medicamento_obs ?? '',
                cond_diabetes: usuario?.anamnese?.cond_diabetes ?? false,
                cond_dist_renais: usuario?.anamnese?.cond_dist_renais ?? false,
                cond_dormir: usuario?.anamnese?.cond_dormir ?? false,
                cond_coracao: usuario?.anamnese?.cond_coracao ?? false,
                cond_pressao: usuario?.anamnese?.cond_pressao ?? false,
                cond_ulcera: usuario?.anamnese?.cond_ulcera ?? false,
                cond_alergia: usuario?.anamnese?.cond_alergia ?? false,
                cond_vitaminas: usuario?.anamnese?.cond_vitaminas ?? false,
                cond_hormonio: usuario?.anamnese?.cond_hormonio ?? false,
                cond_anticoagulante: usuario?.anamnese?.cond_anticoagulante ?? false,
                cond_sist_nervoso: usuario?.anamnese?.cond_sist_nervoso ?? false,
                cond_artrite: usuario?.anamnese?.cond_artrite ?? false,
                cond_anticonvulsivante: usuario?.anamnese?.cond_anticonvulsivante ?? false,
                cond_dor_cabeca: usuario?.anamnese?.cond_dor_cabeca ?? false,
                alergia_med: usuario?.anamnese?.alergia_med ?? false,
                alergia_med_obs: usuario?.anamnese?.alergia_med_obs ?? '',
                alerg_penincilina: usuario?.anamnese?.alerg_penincilina ?? false,
                tomou_benzetacil: usuario?.anamnese?.tomou_benzetacil ?? false,
                alerg_sulfa: usuario?.anamnese?.alerg_sulfa ?? false,
                tomou_bactrim: usuario?.anamnese?.tomou_bactrim ?? false,
                alerg_ass: usuario?.anamnese?.alerg_ass ?? false,
                alerg_anestesico_loc: usuario?.anamnese?.alerg_anestesico_loc ?? false,
                pressao_tipo: usuario?.anamnese?.pressao_tipo ?? '',
                sint_dor_cabeca: usuario?.anamnese?.sint_dor_cabeca ?? false,
                sint_tontura: usuario?.anamnese?.sint_tontura ?? false,
                sint_nauseas: usuario?.anamnese?.sint_nauseas ?? false,
                sint_dor_nuca: usuario?.anamnese?.sint_dor_nuca ?? false,
                sint_palpitacoes: usuario?.anamnese?.sint_palpitacoes ?? false,
                sint_zumbidos: usuario?.anamnese?.sint_zumbidos ?? false,
                sint_perda_memoria: usuario?.anamnese?.sint_perda_memoria ?? false,
                sint_perda_equilibrio: usuario?.anamnese?.sint_perda_equilibrio ?? false,
                diabetico: usuario?.anamnese?.diabetico ?? '',
                diab_familia: usuario?.anamnese?.diab_familia ?? false,
                emagreceu: usuario?.anamnese?.emagreceu ?? false,
                come_muito: usuario?.anamnese?.come_muito ?? false,
                urina_freq: usuario?.anamnese?.urina_freq ?? false,
                muita_sede: usuario?.anamnese?.muita_sede ?? false,
                prob_respiratorio: usuario?.anamnese?.prob_respiratorio ?? false,
                resp_asma: usuario?.anamnese?.resp_asma ?? false,
                resp_bronquite: usuario?.anamnese?.resp_bronquite ?? false,
                resp_tosse: usuario?.anamnese?.resp_tosse ?? false,
                resp_tb: usuario?.anamnese?.resp_tb ?? false,
                prob_cardiaco: usuario?.anamnese?.prob_cardiaco ?? '',
                card_dor_peito: usuario?.anamnese?.card_dor_peito ?? false,
                card_dor_costas: usuario?.anamnese?.card_dor_costas ?? false,
                card_cansa: usuario?.anamnese?.card_cansa ?? false,
                card_arritmia: usuario?.anamnese?.card_arritmia ?? false,
                card_sopro: usuario?.anamnese?.card_sopro ?? false,
                card_dorme_altura: usuario?.anamnese?.card_dorme_altura ?? false,
                card_incha_pe: usuario?.anamnese?.card_incha_pe ?? false,
                prob_articulacoes: usuario?.anamnese?.prob_articulacoes ?? false,
                gravida: usuario?.anamnese?.gravida ?? false,
                anticoncepcional: usuario?.anamnese?.anticoncepcional ?? false,
                sangra_facil: usuario?.anamnese?.sangra_facil ?? false,
                hemofilico: usuario?.anamnese?.hemofilico ?? false,
                sinusite: usuario?.anamnese?.sinusite ?? false,
                prob_estomago: usuario?.anamnese?.prob_estomago ?? false,
                xerostomia: usuario?.anamnese?.xerostomia ?? false,
                dengue: usuario?.anamnese?.dengue ?? false,
                estressado: usuario?.anamnese?.estressado ?? false,
                abriu_boca: usuario?.anamnese?.abriu_boca ?? false,
                autoimune: usuario?.anamnese?.autoimune ?? false,
                possui_HIV: usuario?.anamnese?.possui_HIV ?? false,
                leucemia: usuario?.anamnese?.leucemia ?? false,
                epilepsia: usuario?.anamnese?.epilepsia ?? false,
                toma_anticoag: usuario?.anamnese?.toma_anticoag ?? false,
                marca_passo: usuario?.anamnese?.marca_passo ?? false,
                anemia: usuario?.anamnese?.anemia ?? '',
                vicio: usuario?.anamnese?.vicio ?? false,
                fuma: usuario?.anamnese?.fuma ?? false,
                bebe: usuario?.anamnese?.bebe ?? false,
                range_dentes: usuario?.anamnese?.range_dentes ?? false,
                aperta_dentes: usuario?.anamnese?.aperta_dentes ?? false,
                usa_palito: usuario?.anamnese?.usa_palito ?? false,
                usa_drogas: usuario?.anamnese?.usa_drogas ?? false,
                usa_drogas_obs: usuario?.anamnese?.usa_drogas_obs ?? '',
                gu_problema: usuario?.anamnese?.gu_problema ?? false,
                gu_insuficiencia: usuario?.anamnese?.gu_insuficiencia ?? false,
                gu_calculo: usuario?.anamnese?.gu_calculo ?? false,
                gu_infeccao: usuario?.anamnese?.gu_infeccao ?? false,
                gu_doenca_venerea: usuario?.anamnese?.gu_doenca_venerea ?? false,
                hepa: usuario?.anamnese?.hepa ?? '',
                hepa_obs: usuario?.anamnese?.hepa_obs ?? '',
                outra_doenca: usuario?.anamnese?.outra_doenca ?? '',
                diarreia_cronica: usuario?.anamnese?.diarreia_cronica ?? false,
                febre_const: usuario?.anamnese?.febre_const ?? false,
                sudorese: usuario?.anamnese?.sudorese ?? false,
                cancer_pele: usuario?.anamnese?.cancer_pele ?? false,
                diabetes_desc: usuario?.anamnese?.diabetes_desc ?? false,
                probl_cicatriz: usuario?.anamnese?.probl_cicatriz ?? false,
                doenca_cont: usuario?.anamnese?.doenca_cont ?? false,
                baixa_imun: usuario?.anamnese?.baixa_imun ?? false,
                dermatite: usuario?.anamnese?.dermatite ?? false,

                familia_info: usuario?.anamnese?.familia_info ?? '',
            },
            examesComplementares: {
                id: usuario?.examesComplementares?.id ?? 0,
                usuario_id: usuario?.examesComplementares?.usuario_id ?? 0,
                peso: usuario?.examesComplementares?.peso ?? 0,
                data_peso: usuario?.examesComplementares?.data_peso ?? '',
                tipo_sanguineo: usuario?.examesComplementares?.tipo_sanguineo ?? '',
                pressao: usuario?.examesComplementares?.pressao ?? '',
                data_pressao: usuario?.examesComplementares?.data_pressao ?? '',
            },
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
                className="w-[95%] sm:w-[80%] flex flex-col justify-center items-start text-center  gap-6 bg-[rgba(155,127,103,0.26)]  p-6 sm:p-10 "
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

                {/*            DADOS COMPLEMENTARES           */}
                <h1 className="items-center">Dados complementares</h1>

                <div className="flex w-full flex-col gap-2">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">
                            Teve complicação durante
                            tratamento odontológico?
                        </p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.comp_trat_odon)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.comp_trat_odon", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.comp_trat_odon_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.comp_trat_odon_obs}
                        name="anamnese.comp_trat_odon_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">No momento está em tratamento médico?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.em_trat_medico)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.em_trat_medico", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.em_trat_medico_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.em_trat_medico_obs}
                        name="anamnese.em_trat_medico_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Já fez transfusões de sangue?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.transfusao)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.transfusao", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.transfusao_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.transfusao_obs}
                        name="anamnese.transfusao_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Tem ou teve alguma doença grave?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.doenca_grave)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.doenca_grave", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.doenca_grave_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.doenca_grave_obs}
                        name="anamnese.doenca_grave_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Tem alguma alergia geral?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.alergia_geral)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.alergia_geral", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.alergia_geral_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.alergia_geral_obs}
                        name="anamnese.alergia_geral_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja foi hospitalizado?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.hospitalizado)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.hospitalizado", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.hospitalizado_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.hospitalizado_obs}
                        name="anamnese.hospitalizado_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja foi submetido a cirurgia?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.submetido_cirurgia)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.submetido_cirurgia", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.cirurgia_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.cirurgia_obs}
                        name="anamnese.cirurgia_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja recebeu anestesia?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.recebeu_anestesia)}
                            onValueChange={(val) =>
                                formik.setFieldValue(
                                    "anamnese.recebeu_anestesia",
                                    val === "true"
                                )
                            }
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Teve complicações com a anestesia?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.comp_anestesia)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.comp_anestesia", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.comp_anestesia_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.comp_anestesia_obs}
                        name="anamnese.comp_anestesia_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Sente dor em algum dente?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.dor_dente)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.dor_dente", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.dor_dente_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.dor_dente_obs}
                        name="anamnese.dor_dente_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">É portador de prótese cardíaca?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.protese_cardiaca)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.protese_cardiaca", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.protese_cardiaca_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.protese_cardiaca_obs}
                        name="anamnese.protese_cardiaca_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Ja apresentou sangramento anormal associado com extração, cirurgia ou trauma?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.sangramento_anormal)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.sangramento_anormal", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.sangramento_anormal_obs", "");
                                }
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.sangramento_anormal_obs}
                        name="anamnese.sangramento_anormal_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                {/*            ANAMNESE          
                <h1 className="items-center">Anamnese</h1>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Esta tomando algum medicamento?</p>
                        <RadioGroup orientation="horizontal" value={selected} onValueChange={setSelected}>
                            <Radio value="sim">Sim</Radio>
                            <Radio value="nao">Não</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        name=""
                        placeholder="Qual(is)?..."
                        type="text"
                    />
                    <CheckboxGroup
                        color="warning"
                        value={selected2}
                        onValueChange={setSelected2}
                        orientation="horizontal"
                    >
                        <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
                        <Checkbox value="sydney">Sydney</Checkbox>
                        <Checkbox value="san-francisco">San Francisco</Checkbox>
                        <Checkbox value="rio-de-janeiro">Rio de Janeiro</Checkbox>
                        <Checkbox value="tokyo">Tokyo</Checkbox>
                        <Checkbox value="london">London</Checkbox>
                        <Checkbox value="paris">Paris</Checkbox>
                        <Checkbox value="berlin">Berlin</Checkbox>
                        <Checkbox value="madrid">Madrid</Checkbox>
                        <Checkbox value="rome">Rome</Checkbox>
                        <Checkbox value="moscow">Moscow</Checkbox>
                        <Checkbox value="beijing">Beijing</Checkbox>
                    </CheckboxGroup>
                </div>
 */}
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
