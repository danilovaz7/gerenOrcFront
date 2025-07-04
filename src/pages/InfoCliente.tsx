import { useNavigate, useParams } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, Checkbox, CheckboxGroup, DateInput, Form, Input, NumberInput, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";

import type { Usuario } from '../interfaces/Usuario';
import PerguntaSIMNAO from "../components/PerguntaSIMNAO";
import PerguntaCResp from "../components/PerguntaCResp";


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

    const condFields = ["cond_diabetes", "cond_dist_renais", "cond_dormir", "cond_pressao", "cond_ulcera", "cond_alergia",
        "cond_vitaminas", "cond_hormonio", "cond_anticoagulante", "cond_sist_nervoso", "cond_artrite", "cond_anticonvulsivante",
        "cond_dor_cabeca"];

    const alergFields = ["alerg_penincilina", "alerg_sulfa", "alerg_ass", "alerg_anestesico_loc"];

    const sintFields = ["sint_dor_cabeca", "sint_tontura", "sint_nauseas", "sint_dor_nuca", "sint_palpitacoes", "sint_zumbidos",
        "sint_perda_memoria", "sint_perda_equilibrio",];

    const cardFields = ["card_dor_peito", "card_dor_costas", "card_cansa", "card_arritmia", "card_sopro", "card_dorme_altura",
        "card_incha_pe"];

    const respFields = ["resp_asma", "resp_bronquite", "resp_tosse", "resp_tb"];

    const vicioFields = ["fuma", "bebe", "range_dentes", "aperta_dentes", "usa_palito"];

    const guFields = ["gu_insuficiencia", "gu_calculo", "gu_infeccao", "gu_doenca_venerea"];

    const doencasFields = ["diarreia_cronica", "febre_const", "sudorese", "cancer_pele", "diabetes_desc", "probl_cicatriz",
        "doenca_cont", "baixa_imun", "dermatite"];



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
            console.log(values)

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
                className="w-[95%] sm:w-[80%] flex flex-col justify-center items-start text-center  gap-10 bg-[rgba(155,127,103,0.26)]  p-6 sm:p-10 "
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
                <PerguntaCResp
                    pergunta={"Teve complicação durante tratamento odontológico?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.comp_trat_odon_obs}
                    valueStringRadio={String(formik.values.anamnese.comp_trat_odon)} inputName={"anamnese.comp_trat_odon_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.comp_trat_odon", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.comp_trat_odon_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"No momento está em tratamento médico?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.em_trat_medico_obs}
                    valueStringRadio={String(formik.values.anamnese.em_trat_medico)} inputName={"anamnese.em_trat_medico_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.em_trat_medico", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.em_trat_medico_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"Já fez transfusões de sangue?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.transfusao_obs}
                    valueStringRadio={String(formik.values.anamnese.transfusao)} inputName={"anamnese.transfusao_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.transfusao", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.transfusao_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"Tem ou teve alguma doença grave?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.doenca_grave_obs}
                    valueStringRadio={String(formik.values.anamnese.doenca_grave)} inputName={"anamnese.doenca_grave_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.doenca_grave", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.doenca_grave_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"Tem alguma alergia geral?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.alergia_geral_obs}
                    valueStringRadio={String(formik.values.anamnese.alergia_geral)} inputName={"anamnese.alergia_geral_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.alergia_geral", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.alergia_geral_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"Ja foi hospitalizado?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.hospitalizado_obs}
                    valueStringRadio={String(formik.values.anamnese.hospitalizado)} inputName={"anamnese.hospitalizado_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.hospitalizado", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.hospitalizado_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"Ja foi submetido a cirurgia?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.cirurgia_obs}
                    valueStringRadio={String(formik.values.anamnese.submetido_cirurgia)} inputName={"anamnese.cirurgia_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.submetido_cirurgia", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.cirurgia_obs", "");
                        }
                    }} />

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

                <PerguntaCResp
                    pergunta={"Sente dor em algum dente?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.dor_dente_obs}
                    valueStringRadio={String(formik.values.anamnese.dor_dente)} inputName={"anamnese.dor_dente_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.dor_dente", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.dor_dente_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"É portador de prótese cardíaca?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.protese_cardiaca_obs}
                    valueStringRadio={String(formik.values.anamnese.protese_cardiaca)} inputName={"anamnese.protese_cardiaca_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.protese_cardiaca", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.protese_cardiaca_obs", "");
                        }
                    }} />

                <PerguntaCResp
                    pergunta={"Ja apresentou sangramento anormal associado com extração, cirurgia ou trauma?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.sangramento_anormal_obs}
                    valueStringRadio={String(formik.values.anamnese.sangramento_anormal)} inputName={"anamnese.sangramento_anormal_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.sangramento_anormal", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.sangramento_anormal_obs", "");
                        }
                    }} />

                {/*            ANAMNESE       */}
                <h1 className="items-center">Anamnese</h1>
                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Esta tomando algum medicamento?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.tomando_medicamento)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.tomando_medicamento", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.tomando_medicamento_obs", "");
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
                        value={formik.values.anamnese.tomando_medicamento_obs}
                        name="anamnese.tomando_medicamento_obs"
                        placeholder="Qual(is)?..."
                        type="text"
                    />
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={condFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            condFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="cond_diabetes">Diabetes</Checkbox>
                        <Checkbox value="cond_dist_renais">Distúrbios renais</Checkbox>
                        <Checkbox value="cond_dormir">Dormir</Checkbox>
                        <Checkbox value="cond_coracao">Coração</Checkbox>
                        <Checkbox value="cond_pressao">Pressão</Checkbox>
                        <Checkbox value="cond_ulcera">Úlcera</Checkbox>
                        <Checkbox value="cond_alergia">Alergia</Checkbox>
                        <Checkbox value="cond_vitaminas">Vitaminas</Checkbox>
                        <Checkbox value="cond_hormonio">Hormônio</Checkbox>
                        <Checkbox value="cond_anticoagulante">Anticoagulante</Checkbox>
                        <Checkbox value="cond_sist_nervoso">Sistema nervoso</Checkbox>
                        <Checkbox value="cond_artrite">Artrite</Checkbox>
                        <Checkbox value="cond_anticonvulsivante">Anticonvulsionante</Checkbox>
                        <Checkbox value="cond_dor_cabeca">Dor de cabeça</Checkbox>
                    </CheckboxGroup>
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Tem alergia a algum medicamento?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.alergia_med)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.alergia_med", bool);
                                if (!bool) {
                                    formik.setFieldValue("anamnese.alergia_med_obs", "");
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
                        value={formik.values.anamnese.alergia_med_obs}
                        name="anamnese.alergia_med_obs"
                        placeholder="Qual(is)?..."
                        type="text"
                    />
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={alergFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            alergFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="alerg_penincilina">Penincelina</Checkbox>
                        <Checkbox value="alerg_sulfa">Sulfa</Checkbox>
                        <Checkbox value="alerg_ass">ASS - Ácido Acetil Salicítico</Checkbox>
                        <Checkbox value="alerg_anestesico_loc">Anestesico local</Checkbox>
                    </CheckboxGroup>
                </div>

                <div className="flex w-full flex-col gap-4">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Sua pressão é:</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={formik.values.anamnese.pressao_tipo}
                            onValueChange={(val: string) =>
                                formik.setFieldValue("anamnese.pressao_tipo", val)
                            }
                        >
                            <Radio value="Baixa">Baixa</Radio>
                            <Radio value="Alta">Alta</Radio>
                            <Radio value="Normal">Normal</Radio>
                            <Radio value="Não sabe">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[60%]">
                        <p className="text-black text-lg">Assinale caso apresente algum dos sintomas abaixo:</p>
                    </div>
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={sintFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            sintFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="sint_dor_cabeca">Dor de cabeça</Checkbox>
                        <Checkbox value="sint_tontura">Tontura</Checkbox>
                        <Checkbox value="sint_nauseas">Nauseas</Checkbox>
                        <Checkbox value="sint_dor_nuca">Dor na nuca</Checkbox>
                        <Checkbox value="sint_palpitacoes">Palpitações</Checkbox>
                        <Checkbox value="sint_zumbidos">Zumbidos</Checkbox>
                        <Checkbox value="sint_perda_memoria">Perda de memória</Checkbox>
                        <Checkbox value="sint_perda_equilibrio">Perda de equilibrio</Checkbox>
                    </CheckboxGroup>
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">É diabético?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.diabetico)}
                            onValueChange={(val: string) =>
                                formik.setFieldValue("anamnese.diabetico", val)
                            }
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.diab_familia)} pergunta={"Tem diabetico na familia?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.diab_familia", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.emagreceu)} pergunta={"Emagresceu muito ultimamente?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.emagreceu", bool);
                }} />


                <PerguntaSIMNAO valueString={String(formik.values.anamnese.come_muito)} pergunta={"Come muito?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.come_muito", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.urina_freq)} pergunta={"Urina com frequência?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.urina_freq", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.muita_sede)} pergunta={"Tem muita sede?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.muita_sede", bool);
                }} />

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Apresenta problemas respiratórios?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.prob_respiratorio)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.prob_respiratorio", bool);
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={respFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            respFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="resp_asma">Asma</Checkbox>
                        <Checkbox value="resp_bronquite">Bronquite</Checkbox>
                        <Checkbox value="resp_tosse">Tosse frequênte</Checkbox>
                        <Checkbox value="resp_tb">Tuberculose</Checkbox>
                    </CheckboxGroup>
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Tem problemas cardíacos?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.prob_cardiaco)}
                            onValueChange={(val: string) =>
                                formik.setFieldValue("anamnese.prob_cardiaco", val)
                            }
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={cardFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            cardFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="card_dor_peito">Dor no peito</Checkbox>
                        <Checkbox value="card_dor_costas">Dor nas costas</Checkbox>
                        <Checkbox value="card_cansa">Cnsa com facilidade</Checkbox>
                        <Checkbox value="card_arritmia">Arritimia</Checkbox>
                        <Checkbox value="card_sopro">Sopro</Checkbox>
                        <Checkbox value="card_dorme_altura">Dorme com a cabeça alta</Checkbox>
                        <Checkbox value="card_incha_pe">Pés incham com frequência</Checkbox>
                    </CheckboxGroup>
                </div>

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.prob_articulacoes)} pergunta={"Tem problemas nas articulações?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.prob_articulacoes", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.gravida)} pergunta={"Está grávida?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.gravida", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.anticoncepcional)} pergunta={"Usa anticoncepcional?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.anticoncepcional", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.sangra_facil)} pergunta={"Costuma sangrar muito quando se machuca?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.sangra_facil", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.hemofilico)} pergunta={"É hemofilico?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.hemofilico", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.sinusite)} pergunta={"Tem sinusite?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.sinusite", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.prob_estomago)} pergunta={"Tem problemas de estômago?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.prob_estomago", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.xerostomia)} pergunta={"Tem xerostomia?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.xerostomia", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.dengue)} pergunta={"Teve dengue?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.dengue", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.estressado)} pergunta={"É estressado(a)?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.estressado", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.abriu_boca)} pergunta={"Tem dificuldade para abrir a boca?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.abriu_boca", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.autoimune)} pergunta={"Possui alguma doença autoimune?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.autoimune", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.possui_HIV)} pergunta={"Possui HIV?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.possui_HIV", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.leucemia)} pergunta={"Leucemia?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.leucemia", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.epilepsia)} pergunta={"Eplepsia?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.epilepsia", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.toma_anticoag)} pergunta={"Toma anticoagulante?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.toma_anticoag", bool);
                }} />

                <PerguntaSIMNAO valueString={String(formik.values.anamnese.marca_passo)} pergunta={"Portador de marca-passo?"} OnValueChange={(val) => {
                    const bool = val === "true";
                    formik.setFieldValue("anamnese.marca_passo", bool);
                }} />

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Tem anemia?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.anemia)}
                            onValueChange={(val: string) =>
                                formik.setFieldValue("anamnese.anemia", val)
                            }
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Possui algum vício?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.vicio)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.vicio", bool);
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={vicioFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            vicioFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="fuma">Fuma</Checkbox>
                        <Checkbox value="bebe">Bebe</Checkbox>
                        <Checkbox value="range_dentes">Range os dentes</Checkbox>
                        <Checkbox value="aperta_dentes">Aperta os dentes</Checkbox>
                        <Checkbox value="usa_palito">Palito</Checkbox>
                    </CheckboxGroup>
                </div>

                <PerguntaCResp
                    pergunta={"Usa drogas?"} OnValueChangeInput={formik.handleChange} valueStringInput={formik.values.anamnese.usa_drogas_obs}
                    valueStringRadio={String(formik.values.anamnese.usa_drogas)} inputName={"anamnese.usa_drogas_obs"}
                    OnValueChangeRadio={(val) => {
                        const bool = val === "true";
                        formik.setFieldValue("anamnese.usa_drogas", bool);
                        if (!bool) {
                            formik.setFieldValue("anamnese.usa_drogas_obs", "");
                        }
                    }} />

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Possui problemas Gênito-urinarios?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.gu_problema)}
                            onValueChange={(val) => {
                                const bool = val === "true";
                                formik.setFieldValue("anamnese.gu_problema", bool);
                            }}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={guFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            guFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="gu_insuficiencia">Insuficiência</Checkbox>
                        <Checkbox value="gu_calculo">Cálculo renal</Checkbox>
                        <Checkbox value="gu_infeccao">Infecções urinarias</Checkbox>
                        <Checkbox value="gu_doenca_venerea">Doença venérea</Checkbox>
                    </CheckboxGroup>
                </div>


                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Tem ou teve Hepatite?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.hepa)}
                            onValueChange={(val: string) => {
                                formik.setFieldValue("anamnese.hepa", val)
                                if (val === 'Não' || val === "Não sabe") {
                                    formik.setFieldValue("anamnese.hepa_obs", "");
                                }
                            }
                            }
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        value={formik.values.anamnese.hepa_obs}
                        name="anamnese.hepa_obs"
                        placeholder="Qual?..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">Tem alguma doença?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(formik.values.anamnese.outra_doenca)}
                            onValueChange={(val: string) =>
                                formik.setFieldValue("anamnese.outra_doenca", val)
                            }
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                    <CheckboxGroup
                        color="warning"
                        orientation="horizontal"
                        value={doencasFields.filter(key => formik.values.anamnese[key as keyof typeof formik.values.anamnese] === true)}
                        onValueChange={(selected: string[]) => {
                            doencasFields.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, false)
                            );
                            selected.forEach(key =>
                                formik.setFieldValue(`anamnese.${key}`, true)
                            );
                        }}
                    >
                        <Checkbox value="diarreia_cronica">Diarreia crônica</Checkbox>
                        <Checkbox value="febre_const">Frebre constante</Checkbox>
                        <Checkbox value="sudorese">Sudorese</Checkbox>
                        <Checkbox value="cancer_pele">Câncer de pele</Checkbox>
                        <Checkbox value="diabetes_desc">Diabetes descompensada</Checkbox>
                        <Checkbox value="probl_cicatriz">Problemas com cicatrização</Checkbox>
                        <Checkbox value="doenca_cont">Doença contagiosa</Checkbox>
                        <Checkbox value="baixa_imun">Baixa imunidade</Checkbox>
                        <Checkbox value="dermatite">Dermatite</Checkbox>
                    </CheckboxGroup>
                </div>

                <div className="flex w-full flex-col gap-4 ">
                    <Input
                        className="w-[100%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        label='Outras informações que julta importante, familiar tambem'
                        labelPlacement="outside"
                        value={formik.values.anamnese.familia_info}
                        name="anamnese.familia_info"
                        placeholder="..."
                        type="text"
                    />
                </div>

                {/*            Exames complementares       */}
                <h1 className="items-center">Exames complementares</h1>
                <div className="flex w-full flex-row gap-4 ">
                      <NumberInput
                        className="w-[12%]"
                        errorMessage="Insira um valor valido"
                        onChange={formik.handleChange}
                        value={formik.values.examesComplementares.peso}
                        name="examesComplementares.peso"
                        label="Peso (em Kg)"
                        labelPlacement="outside"
                        placeholder="1Kg..."
                    />
                    <DateInput
                        className="w-[20%]"
                        value={
                            formik.values.examesComplementares.data_peso
                                ? parseDate(formik.values.examesComplementares.data_peso)
                                : null
                        }
                        onChange={(value: CalendarDate | null) => {
                            formik.setFieldValue(
                                'examesComplementares.data_peso',
                                value ? value.toString() : ''
                            );
                        }}
                        name="examesComplementares.data_peso"
                        label="Data medição"
                        labelPlacement="outside"
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        endContent={
                            <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                </div>
                 <div className="flex w-full flex-row gap-4 ">
                      <Input
                        className="w-[10%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        label='Tipo sanguíneo'
                        labelPlacement="outside"
                        value={formik.values.examesComplementares.tipo_sanguineo}
                        name="examesComplementares.tipo_sanguineo"
                        placeholder="A..."
                        type="text"
                    />
                </div>

                <div className="flex w-full flex-row gap-4 ">
                       <Input
                        className="w-[12%]"
                        errorMessage=""
                        onChange={formik.handleChange}
                        label='Pressão (em mmHg)'
                        labelPlacement="outside"
                        value={formik.values.examesComplementares.pressao}
                        name="examesComplementares.pressao"
                        placeholder="120/80 mmHg..."
                        type="text"
                    />
                    <DateInput
                        className="w-[20%]"
                        value={
                            formik.values.examesComplementares.data_pressao
                                ? parseDate(formik.values.examesComplementares.data_pressao)
                                : null
                        }
                        onChange={(value: CalendarDate | null) => {
                            formik.setFieldValue(
                                'examesComplementares.data_pressao',
                                value ? value.toString() : ''
                            );
                        }}
                        name="examesComplementares.data_pressao"
                        label="Data medição"
                        labelPlacement="outside"
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        endContent={
                            <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
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
