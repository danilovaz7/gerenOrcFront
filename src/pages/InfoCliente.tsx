// src/pages/InfoClientes.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useForm, Controller, FormProvider,} from "react-hook-form";
import InfoUsuarioCampos from "../components/InfoUsuarioCampos.tsx";

import {
  Button,
  Input,
  DateInput,
  Select,
  SelectItem,
  Form as HForm,
} from "@heroui/react";
import {  parseDate } from "@internationalized/date";
import type { Usuario } from '../interfaces/Usuario';

import ExamesComplementares from "../components/ExamesComplementaresCliente";
import AnamneseCliente from "../components/AnamneseCliente";



export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg aria-hidden="true" fill="none" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <path d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58..." fill="currentColor" />
  </svg>
);

export type FormValues = Omit<Usuario, 'id'> & {
  anamnese: Record<string, boolean | string>;
  examesComplementares: Record<string, string | number>;
};

export default function InfoClientes() {
  const { token } = useTokenStore();
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    defaultValues: {
      nome: "",
      email: "",
      dt_nascimento: "",
      rg: "",
      cpf: "",
      estado_civil: "",
      sexo: "",
      filhos: 0,
      cep: "",
      endereco: "",
      num_endereco: "",
      complemento: "",
      cidade: "",
      bairro: "",
      nacionalidade: "",
      naturalidade: "",
      raca: "",
      telefone: "",
      celular: "",
      profissao: "",
      local_trabalho: "",
      instagram: "",
      facebook: "",
      anamnese: {} as Record<string, any>,
      examesComplementares: {} as Record<string, any>
    }
  });

  const {
    reset,
    handleSubmit,
    control,
    register,
    setValue,
    getValues,
    formState: { errors }
  } = methods;

  useEffect(() => {
    async function fetchUsuario() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${idUsuario}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json() as Usuario;
      setUsuario(data);

      reset({
        nome: data.nome ?? '',
        email: data.email ?? '',
        dt_nascimento: data.dt_nascimento ?? '',
        rg: data.rg ?? '',
        cpf: data.cpf ?? '',
        estado_civil: data.estado_civil ?? '',
        sexo: data.sexo ?? '',
        filhos: data.filhos ?? 0,
        cep: data.cep ?? '',
        endereco: data.endereco ?? '',
        num_endereco: data.num_endereco ?? '',
        complemento: data.complemento ?? '',
        cidade: data.cidade ?? '',
        bairro: data.bairro ?? '',
        naturalidade: data.naturalidade ?? '',
        nacionalidade: data.nacionalidade ?? '',
        raca: data.raca ?? '',
        telefone: data.telefone ?? '',
        celular: data.celular ?? '',
        profissao: data.profissao ?? '',
        local_trabalho: data.local_trabalho ?? '',
        instagram: data.instagram ?? '',
        facebook: data.facebook ?? '',
        anamnese: {
          comp_trat_odon: data.anamnese?.comp_trat_odon ?? false,
          comp_trat_odon_obs: data.anamnese?.comp_trat_odon_obs ?? '',
          em_trat_medico: data.anamnese?.em_trat_medico ?? false,
          em_trat_medico_obs: data.anamnese?.em_trat_medico_obs ?? '',
          transfusao: data.anamnese?.transfusao ?? false,
          transfusao_obs: data.anamnese?.transfusao_obs ?? '',
          doenca_grave: data.anamnese?.doenca_grave ?? false,
          doenca_grave_obs: data.anamnese?.doenca_grave_obs ?? '',
          alergia_geral: data.anamnese?.alergia_geral ?? false,
          alergia_geral_obs: data.anamnese?.alergia_geral_obs ?? '',
          hospitalizado: data.anamnese?.hospitalizado ?? false,
          hospitalizado_obs: data.anamnese?.hospitalizado_obs ?? '',
          submetido_cirurgia: data.anamnese?.submetido_cirurgia ?? false,
          cirurgia_obs: data.anamnese?.cirurgia_obs ?? '',
          recebeu_anestesia: data.anamnese?.recebeu_anestesia ?? false,
          comp_anestesia: data.anamnese?.comp_anestesia ?? false,
          comp_anestesia_obs: data.anamnese?.comp_anestesia_obs ?? '',
          dor_dente: data.anamnese?.dor_dente ?? false,
          dor_dente_obs: data.anamnese?.dor_dente_obs ?? '',
          protese_cardiaca: data.anamnese?.protese_cardiaca ?? false,
          protese_cardiaca_obs: data.anamnese?.protese_cardiaca_obs ?? '',
          sangramento_anormal: data.anamnese?.sangramento_anormal ?? false,
          sangramento_anormal_obs: data.anamnese?.sangramento_anormal_obs ?? '',
          tomando_medicamento: data.anamnese?.tomando_medicamento ?? false,
          tomando_medicamento_obs: data.anamnese?.tomando_medicamento_obs ?? '',
          cond_diabetes: data.anamnese?.cond_diabetes ?? false,
          cond_dist_renais: data.anamnese?.cond_dist_renais ?? false,
          cond_dormir: data.anamnese?.cond_dormir ?? false,
          cond_coracao: data.anamnese?.cond_coracao ?? false,
          cond_pressao: data.anamnese?.cond_pressao ?? false,
          cond_ulcera: data.anamnese?.cond_ulcera ?? false,
          cond_alergia: data.anamnese?.cond_alergia ?? false,
          cond_vitaminas: data.anamnese?.cond_vitaminas ?? false,
          cond_hormonio: data.anamnese?.cond_hormonio ?? false,
          cond_anticoagulante: data.anamnese?.cond_anticoagulante ?? false,
          cond_sist_nervoso: data.anamnese?.cond_sist_nervoso ?? false,
          cond_artrite: data.anamnese?.cond_artrite ?? false,
          cond_anticonvulsivante: data.anamnese?.cond_anticonvulsivante ?? false,
          cond_dor_cabeca: data.anamnese?.cond_dor_cabeca ?? false,
          alergia_med: data.anamnese?.alergia_med ?? false,
          alergia_med_obs: data.anamnese?.alergia_med_obs ?? '',
          alerg_penincilina: data.anamnese?.alerg_penincilina ?? false,
          tomou_benzetacil: data.anamnese?.tomou_benzetacil ?? false,
          alerg_sulfa: data.anamnese?.alerg_sulfa ?? false,
          tomou_bactrim: data.anamnese?.tomou_bactrim ?? false,
          alerg_ass: data.anamnese?.alerg_ass ?? false,
          alerg_anestesico_loc: data.anamnese?.alerg_anestesico_loc ?? false,
          pressao_tipo: data.anamnese?.pressao_tipo ?? 'Baixa',
          sint_dor_cabeca: data.anamnese?.sint_dor_cabeca ?? false,
          sint_tontura: data.anamnese?.sint_tontura ?? false,
          sint_nauseas: data.anamnese?.sint_nauseas ?? false,
          sint_dor_nuca: data.anamnese?.sint_dor_nuca ?? false,
          sint_palpitacoes: data.anamnese?.sint_palpitacoes ?? false,
          sint_zumbidos: data.anamnese?.sint_zumbidos ?? false,
          sint_perda_memoria: data.anamnese?.sint_perda_memoria ?? false,
          sint_perda_equilibrio: data.anamnese?.sint_perda_equilibrio ?? false,
          diabetico: data.anamnese?.diabetico ?? 'NÃO SABE',
          diab_familia: data.anamnese?.diab_familia ?? false,
          emagreceu: data.anamnese?.emagreceu ?? false,
          come_muito: data.anamnese?.come_muito ?? false,
          urina_freq: data.anamnese?.urina_freq ?? false,
          muita_sede: data.anamnese?.muita_sede ?? false,
          prob_respiratorio: data.anamnese?.prob_respiratorio ?? false,
          resp_asma: data.anamnese?.resp_asma ?? false,
          resp_bronquite: data.anamnese?.resp_bronquite ?? false,
          resp_tosse: data.anamnese?.resp_tosse ?? false,
          resp_tb: data.anamnese?.resp_tb ?? false,
          prob_cardiaco: data.anamnese?.prob_cardiaco ?? 'NÃO SABE',
          card_dor_peito: data.anamnese?.card_dor_peito ?? false,
          card_dor_costas: data.anamnese?.card_dor_costas ?? false,
          card_cansa: data.anamnese?.card_cansa ?? false,
          card_arritmia: data.anamnese?.card_arritmia ?? false,
          card_sopro: data.anamnese?.card_sopro ?? false,
          card_dorme_altura: data.anamnese?.card_dorme_altura ?? false,
          card_incha_pe: data.anamnese?.card_incha_pe ?? false,
          prob_articulacoes: data.anamnese?.prob_articulacoes ?? false,
          gravida: data.anamnese?.gravida ?? false,
          anticoncepcional: data.anamnese?.anticoncepcional ?? false,
          sangra_facil: data.anamnese?.sangra_facil ?? false,
          hemofilico: data.anamnese?.hemofilico ?? false,
          sinusite: data.anamnese?.sinusite ?? false,
          prob_estomago: data.anamnese?.prob_estomago ?? false,
          xerostomia: data.anamnese?.xerostomia ?? false,
          dengue: data.anamnese?.dengue ?? false,
          estressado: data.anamnese?.estressado ?? false,
          abriu_boca: data.anamnese?.abriu_boca ?? false,
          autoimune: data.anamnese?.autoimune ?? false,
          possui_HIV: data.anamnese?.possui_HIV ?? false,
          leucemia: data.anamnese?.leucemia ?? false,
          epilepsia: data.anamnese?.epilepsia ?? false,
          toma_anticoag: data.anamnese?.toma_anticoag ?? false,
          marca_passo: data.anamnese?.marca_passo ?? false,
          anemia: data.anamnese?.anemia ?? 'NÃO SABE',
          vicio: data.anamnese?.vicio ?? false,
          fuma: data.anamnese?.fuma ?? false,
          bebe: data.anamnese?.bebe ?? false,
          range_dentes: data.anamnese?.range_dentes ?? false,
          aperta_dentes: data.anamnese?.aperta_dentes ?? false,
          usa_palito: data.anamnese?.usa_palito ?? false,
          usa_drogas: data.anamnese?.usa_drogas ?? false,
          usa_drogas_obs: data.anamnese?.usa_drogas_obs ?? '',
          gu_problema: data.anamnese?.gu_problema ?? false,
          gu_insuficiencia: data.anamnese?.gu_insuficiencia ?? false,
          gu_calculo: data.anamnese?.gu_calculo ?? false,
          gu_infeccao: data.anamnese?.gu_infeccao ?? false,
          gu_doenca_venerea: data.anamnese?.gu_doenca_venerea ?? false,
          hepa: data.anamnese?.hepa ?? 'NÃO SABE',
          hepa_obs: data.anamnese?.hepa_obs ?? 'NÃO SABE',
          outra_doenca: data.anamnese?.outra_doenca ?? 'NÃO SABE',
          diarreia_cronica: data.anamnese?.diarreia_cronica ?? false,
          febre_const: data.anamnese?.febre_const ?? false,
          sudorese: data.anamnese?.sudorese ?? false,
          cancer_pele: data.anamnese?.cancer_pele ?? false,
          diabetes_desc: data.anamnese?.diabetes_desc ?? false,
          probl_cicatriz: data.anamnese.probl_cicatriz ?? false,
          doenca_cont: data.anamnese.doenca_cont ?? false,
          baixa_imun: data.anamnese?.baixa_imun ?? false,
          dermatite: data.anamnese?.dermatite ?? false,
          familia_info: data.anamnese?.familia_info ?? '',
        },
        examesComplementares: {
          id: data.examesComplementares.id ?? 0,
          usuario_id: data.examesComplementares.usuario_id ?? 0,
          peso: data.examesComplementares.peso ?? 0,
          data_peso: data.examesComplementares.data_peso ?? '',
          tipo_sanguineo: data.examesComplementares.tipo_sanguineo ?? '',
          pressao: data.examesComplementares.pressao ?? '',
          data_pressao: data.examesComplementares?.data_pressao ?? '',
        },
      });
    }
    fetchUsuario();
  }, [idUsuario, token, reset]);

  const onSubmit = async (values: FormValues) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/usuarios/${idUsuario}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      }
    );
    if (res.ok) navigate('/home');
  };

  return (
    <div className="flex h-full flex-col items-center p-2">
      <FormProvider {...methods}>
        <HForm
          className="w-[95%] sm:w-[80%] flex flex-col gap-10 bg-[rgba(155,127,103,0.26)] p-6 sm:p-10"
          onSubmit={handleSubmit(onSubmit)}
        >

          <section className="flex flex-wrap gap-2">
            <InfoUsuarioCampos control={control} name={"nome"} label={"Nome completo"} className={"w-full"} errorMessage={errors.nome?.message} />
            <Controller
              name="dt_nascimento"
              control={control}
              rules={{ required: "Obrigatório" }}
              render={({ field }) => (
                <DateInput
                  value={field.value ? parseDate(field.value) : null}
                  onChange={v => field.onChange(v?.toString() ?? "")}
                  label="Data de nascimento"
                  endContent={<CalendarIcon />}
                  isRequired
                  errorMessage={errors.dt_nascimento?.message}
                  className="w-[10%]"
                />
              )}
            />
            <InfoUsuarioCampos control={control} name={"rg"} label={"RG"} className={"w-[20%]"} errorMessage={errors.rg?.message} />
            <InfoUsuarioCampos control={control} name={"cpf"} label={"CPF"} className={"w-[20%]"} errorMessage={errors.cpf?.message} />
            <InfoUsuarioCampos control={control} name={"estado_civil"} label={"Estado civil"} className={"w-[20%]"} errorMessage={errors.estado_civil?.message} />
            <InfoUsuarioCampos control={control} name={"sexo"} label={"Sexo"} className={"w-[15%]"} errorMessage={errors.sexo?.message} />
            <Controller
              name="filhos" control={control} render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Filhos"
                  isRequired
                  errorMessage={errors.filhos?.message}
                  className="w-[12%]"
                />
              )}
            />
            <InfoUsuarioCampos control={control} name={"cep"} label={"CEP"} className={"w-[20%]"} errorMessage={errors.cep?.message} />
            <InfoUsuarioCampos control={control} name={"endereco"} label={"Endereço"} className={"w-[62%]"} errorMessage={errors.endereco?.message} />
            <InfoUsuarioCampos control={control} name={"num_endereco"} label={"N°"} className={"w-[6%]"} errorMessage={errors.num_endereco?.message} />
            <InfoUsuarioCampos control={control} name={"complemento"} label={"Complemento"} className={"w-[10%]"} errorMessage={errors.complemento?.message} />
            <InfoUsuarioCampos control={control} name={"cidade"} label={"Cidade"} className={"w-[20%]"} errorMessage={errors.cidade?.message} />
            <InfoUsuarioCampos control={control} name={"bairro"} label={"Bairro"} className={"w-[20%]"} errorMessage={errors.bairro?.message} />
            <InfoUsuarioCampos control={control} name={"nacionalidade"} label={"Nacionalidade"} className={"w-[20%]"} errorMessage={errors.nacionalidade?.message} />
            <InfoUsuarioCampos control={control} name={"naturalidade"} label={"Naturalidade"} className={"w-[20%]"} errorMessage={errors.naturalidade?.message} />
            <Controller
              name="raca"
              control={control}
              render={({ field }) => (
                <Select
                  selectedKeys={field.value ? new Set([field.value]) : new Set()}
                  onSelectionChange={keys => field.onChange(Array.from(keys)[0])}
                  label="Raça"
                  className="w-[17%]"
                >
                  <SelectItem key="branca">Branca</SelectItem>
                  <SelectItem key="amarela">Amarela</SelectItem>
                  <SelectItem key="negra">Negra</SelectItem>
                  <SelectItem key="outra">Outra</SelectItem>
                </Select>
              )}
            />
            <InfoUsuarioCampos control={control} name={"telefone"} label={"Telefone residencial"} className={"w-[20%]"} errorMessage={errors.telefone?.message} />
            <InfoUsuarioCampos control={control} name={"celular"} label={"Celular"} className={"w-[20%]"} errorMessage={errors.celular?.message} />
            <InfoUsuarioCampos control={control} name={"profissao"} label={"Profissão"} className={"w-[20%]"} errorMessage={errors.profissao?.message} />
            <InfoUsuarioCampos control={control} name={"local_trabalho"} label={"Local de trabalho"} className={"w-[38%]"} errorMessage={errors.local_trabalho?.message} />
            <InfoUsuarioCampos control={control} name={"email"} label={"Email"} className={"w-[58%]"} errorMessage={errors.email?.message} />
            <InfoUsuarioCampos control={control} name={"instagram"} label={"Instagram"} className={"w-[20%]"} errorMessage={errors.instagram?.message} />
            <InfoUsuarioCampos control={control} name={"facebook"} label={"Facebook"} className={"w-[20%]"} errorMessage={errors.facebook?.message} />
          </section>

          <AnamneseCliente control={control} />
          <ExamesComplementares control={control} />

          <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
            <Button size="lg" className="w-[15%] text-white bg-[#7F634B]" type="submit">
              Salvar
            </Button>
          </div>
        </HForm>
      </FormProvider>
    </div>
  );
}
