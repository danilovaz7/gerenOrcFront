
import React from "react";
import { Controller, type Control } from "react-hook-form";
import { type FormValues } from "../pages/InfoCliente.tsx";
import { Checkbox, Input, Radio, RadioGroup } from "@heroui/react";
import CheckboxGroupCliente from "./CheckboxGroupCliente.tsx";
import { PerguntaSimNao } from "./PerguntaSimNao.tsx";
import { PerguntaSimNaoObs } from "./PerguntaSimNaoObs.tsx";
import type { Path } from "react-hook-form";

export interface ExamesComplementaresProps {
    control: Control<FormValues>;

}

const condFields = ["cond_diabetes", "cond_dist_renais", "cond_dormir", "cond_pressao", "cond_ulcera", "cond_alergia",
    "cond_vitaminas", "cond_hormonio", "cond_anticoagulante", "cond_sist_nervoso", "cond_artrite", "cond_anticonvulsivante",
    "cond_dor_cabeca"] as const;
const alergFields = ["alerg_penincilina", "alerg_sulfa", "alerg_ass", "alerg_anestesico_loc"] as const;
const sintFields = [
    "sint_dor_cabeca", "sint_tontura", "sint_nauseas", "sint_dor_nuca", "sint_palpitacoes",
    "sint_zumbidos", "sint_perda_memoria", "sint_perda_equilibrio"
] as const;
const cardFields = [
    "card_dor_peito", "card_dor_costas", "card_cansa", "card_arritmia",
    "card_sopro", "card_dorme_altura", "card_incha_pe"
] as const;
const respFields = ["resp_asma", "resp_bronquite", "resp_tosse", "resp_tb"] as const;
const vicioFields = ["fuma", "bebe", "range_dentes", "aperta_dentes", "usa_palito"] as const;
const guFields = ["gu_insuficiencia", "gu_calculo", "gu_infeccao", "gu_doenca_venerea"] as const;
const doencasFields = [
    "diarreia_cronica", "febre_const", "sudorese", "cancer_pele", "diabetes_desc",
    "probl_cicatriz", "doenca_cont", "baixa_imun", "dermatite"
] as const;

const perguntasComObs: {
  name: Path<FormValues>;
  nameObs: Path<FormValues>;
  label: string;
}[] = [
  { name: "anamnese.comp_trat_odon", nameObs: "anamnese.comp_trat_odon_obs", label: "Teve complicação durante tratamento odontológico?" },
  { name: "anamnese.em_trat_medico", nameObs: "anamnese.em_trat_medico_obs", label: "No momento está em tratamento médico?" },
  { name: "anamnese.transfusao", nameObs: "anamnese.transfusao_obs", label: "Já fez transfusão de sangue?" },
  { name: "anamnese.doenca_grave", nameObs: "anamnese.doenca_grave_obs", label: "Tem ou teve alguma doença grave?" },
  { name: "anamnese.alergia_geral", nameObs: "anamnese.alergia_geral_obs", label: "Tem alguma alergia geral?" },
  { name: "anamnese.hospitalizado", nameObs: "anamnese.hospitalizado_obs", label: "Já foi hospitalizado?" },
  { name: "anamnese.submetido_cirurgia", nameObs: "anamnese.cirurgia_obs", label: "Já fez cirurgia?" },
  { name: "anamnese.comp_anestesia", nameObs: "anamnese.comp_anestesia_obs", label: "Teve complicações após anestesia?" },
  { name: "anamnese.dor_dente", nameObs: "anamnese.dor_dente_obs", label: "Tem dor de dente frequente?" },
  { name: "anamnese.protese_cardiaca", nameObs: "anamnese.protese_cardiaca_obs", label: "Possui prótese cardíaca?" },
  { name: "anamnese.sangramento_anormal", nameObs: "anamnese.sangramento_anormal_obs", label: "Já apresentou sangramento anormal associado com extração, cirurgia ou trauma?" },
];


export const ExamesComplementares: React.FC<ExamesComplementaresProps> = ({ control }) => {
    return (
        <section className="space-y-6">
            {perguntasComObs.map(({ name, nameObs, label }) => (
                <PerguntaSimNaoObs
                    key={name}
                    control={control}
                    name={name}
                    nameObs={nameObs}
                    label={label}
                />
            ))}
            <h2 className="text-3xl font-semibold text-center text-black">Anamnese</h2>
            <PerguntaSimNaoObs
                control={control}
                name="anamnese.tomando_medicamento"
                nameObs="anamnese.tomando_medicamento_obs"
                label="Está tomando algum medicamento?"
            />
            <CheckboxGroupCliente control={control} array={condFields} >
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
            </CheckboxGroupCliente>
            <PerguntaSimNaoObs
                control={control}
                name="anamnese.alergia_med"
                nameObs="anamnese.alergia_med_obs"
                label="Tem alergia a algum medicamento?"
            />
            <CheckboxGroupCliente control={control} array={alergFields} >
                <Checkbox value="alerg_penincilina">Penincelina</Checkbox>
                <Checkbox value="alerg_sulfa">Sulfa</Checkbox>
                <Checkbox value="alerg_ass">ASS - Ácido Acetil Salicítico</Checkbox>
                <Checkbox value="alerg_anestesico_loc">Anestesico local</Checkbox>
            </CheckboxGroupCliente>
            <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between w-full sm:w-[50%] items-center">
                    <p className="text-black text-md sm:text-lg">Sua pressão é:</p>
                    <Controller
                        name="anamnese.pressao_tipo"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                orientation="horizontal"
                                value={String(field.value)}
                                onValueChange={val => field.onChange(val)}
                            >
                                <Radio value="Baixa">Baixa</Radio>
                                <Radio value="Alta">Alta</Radio>
                                <Radio value="Normal">Normal</Radio>
                                <Radio value="Não sabe">Não sabe</Radio>
                            </RadioGroup>
                        )}
                    />
                </div>
            </div>
            <div className="w-full flex flex-col">
                <p className="text-black text-md sm:text-lg">Assinale caso apresente algum dos sintomas abaixo: </p>
                <CheckboxGroupCliente control={control} array={sintFields} >
                    <Checkbox value="sint_dor_cabeca">Dor de cabeça</Checkbox>
                    <Checkbox value="sint_tontura">Tontura</Checkbox>
                    <Checkbox value="sint_nauseas">Nauseas</Checkbox>
                    <Checkbox value="sint_dor_nuca">Dor na nuca</Checkbox>
                    <Checkbox value="sint_palpitacoes">Palpitações</Checkbox>
                    <Checkbox value="sint_zumbidos">Zumbidos</Checkbox>
                    <Checkbox value="sint_perda_memoria">Perda de memória</Checkbox>
                    <Checkbox value="sint_perda_equilibrio">Perda de equilibrio</Checkbox>
                </CheckboxGroupCliente>
            </div>

            <Controller
                name="anamnese.diabetico"
                control={control}
                render={({ field }) => (
                    <div className="flex justify-between w-full sm:w-[50%] items-center">
                        <p className="text-black text-md sm:text-lg">É diabético?</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={String(field.value)}
                            onValueChange={val => field.onChange(val)}
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    </div>
                )}
            />
            <PerguntaSimNao
                control={control}
                name="anamnese.diab_familia"
                label="Tem diabético na família?"
            />
            <PerguntaSimNao
                control={control}
                name="anamnese.emagreceu"
                label="Emagreceu muito ultimamente?"
            />
            <PerguntaSimNao
                control={control}
                name="anamnese.come_muito"
                label="Come muito?"
            />
            <PerguntaSimNao
                control={control}
                name="anamnese.urina_freq"
                label="Urina com frequência?"
            />
            <PerguntaSimNao
                control={control}
                name="anamnese.muita_sede"
                label="Tem muita sede?"
            />
            <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between w-full sm:w-[40%] items-center">
                    <p className="text-black text-md sm:text-lg">Apresenta problemas respiratórios?</p>
                    <Controller
                        name="anamnese.prob_respiratorio"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                orientation="horizontal"
                                value={String(field.value)}
                                onValueChange={v => field.onChange(v === 'true')}
                            >
                                <Radio value="true">Sim</Radio>
                                <Radio value="false">Não</Radio>
                            </RadioGroup>
                        )}
                    />
                </div>
                <CheckboxGroupCliente control={control} array={respFields} >
                    <Checkbox value="resp_asma">Asma</Checkbox>
                    <Checkbox value="resp_bronquite">Bronquite</Checkbox>
                    <Checkbox value="resp_tosse">Tosse frequênte</Checkbox>
                    <Checkbox value="resp_tb">Tuberculose</Checkbox>
                </CheckboxGroupCliente>
            </div>
            <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between w-full sm:w-[50%] items-center">
                    <p className="text-black text-md sm:text-lg">Tem problemas cardíacos?</p>
                    <Controller
                        name="anamnese.prob_cardiaco"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                orientation="horizontal"
                                value={String(field.value)}
                                onValueChange={v => field.onChange(v)}
                            >
                                <Radio value="SIM">Sim</Radio>
                                <Radio value="NÃO">Não</Radio>
                                <Radio value="NÃO SABE">Não sabe</Radio>
                            </RadioGroup>
                        )}
                    />
                </div>
                <CheckboxGroupCliente control={control} array={cardFields} >
                    <Checkbox value="card_dor_peito">Dor no peito</Checkbox>
                    <Checkbox value="card_dor_costas">Dor nas costas</Checkbox>
                    <Checkbox value="card_cansa">Cnsa com facilidade</Checkbox>
                    <Checkbox value="card_arritmia">Arritimia</Checkbox>
                    <Checkbox value="card_sopro">Sopro</Checkbox>
                    <Checkbox value="card_dorme_altura">Dorme com a cabeça alta</Checkbox>
                    <Checkbox value="card_incha_pe">Pés incham com frequência</Checkbox>
                </CheckboxGroupCliente>
            </div>
            <PerguntaSimNao control={control} name="anamnese.prob_articulacoes" label="Tem problemas nas articulações?" />
            <PerguntaSimNao control={control} name="anamnese.gravida" label="Está grávida?" />
            <PerguntaSimNao control={control} name="anamnese.anticoncepcional" label="Usa anticoncepcional?" />
            <PerguntaSimNao control={control} name="anamnese.sangra_facil" label="Sangra fácil?" />
            <PerguntaSimNao control={control} name="anamnese.hemofilico" label="É hemofílico?" />
            <PerguntaSimNao control={control} name="anamnese.sinusite" label="Tem sinusite?" />
            <PerguntaSimNao control={control} name="anamnese.prob_estomago" label="Tem problemas de estômago?" />
            <PerguntaSimNao control={control} name="anamnese.xerostomia" label="Tem xerostomia?" />
            <PerguntaSimNao control={control} name="anamnese.dengue" label="Teve dengue?" />
            <PerguntaSimNao control={control} name="anamnese.estressado" label="É estressado(a)?" />
            <PerguntaSimNao control={control} name="anamnese.abriu_boca" label="Dificuldade para abrir a boca?" />
            <PerguntaSimNao control={control} name="anamnese.autoimune" label="Doença autoimune?" />
            <PerguntaSimNao control={control} name="anamnese.possui_HIV" label="Possui HIV?" />
            <PerguntaSimNao control={control} name="anamnese.leucemia" label="Leucemia?" />
            <PerguntaSimNao control={control} name="anamnese.epilepsia" label="Epilepsia?" />
            <PerguntaSimNao control={control} name="anamnese.toma_anticoag" label="Toma anticoagulante?" />
            <PerguntaSimNao control={control} name="anamnese.marca_passo" label="Portador de marca‑passo?" />
            <div className="flex justify-between w-full sm:w-[50%] items-center">
                <p className="text-black text-md sm:text-lg">Tem anemia?</p>
                <Controller
                    name="anamnese.anemia"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            orientation="horizontal"
                            value={String(field.value)}
                            onValueChange={val => field.onChange(val)}
                        >
                            <Radio value="SIM">Sim</Radio>
                            <Radio value="NÃO">Não</Radio>
                            <Radio value="NÃO SABE">Não sabe</Radio>
                        </RadioGroup>
                    )}
                />
            </div>
            <PerguntaSimNao control={control} name="anamnese.vicio" label="Possui algum vício?" />
            <CheckboxGroupCliente control={control} array={vicioFields} >
                <Checkbox value="fuma">Fuma</Checkbox>
                <Checkbox value="bebe">Bebe</Checkbox>
                <Checkbox value="range_dentes">Range os dentes</Checkbox>
                <Checkbox value="aperta_dentes">Aperta os dentes</Checkbox>
                <Checkbox value="usa_palito">Palito</Checkbox>
            </CheckboxGroupCliente>
            <PerguntaSimNaoObs
                control={control}
                name="anamnese.usa_drogas"
                nameObs="anamnese.usa_drogas_obs"
                label="Usa drogas?"
            />
            <PerguntaSimNao
                control={control}
                name="anamnese.gu_problema"
                label="Possui problemas Gênito‑urinários?"
            />
            <CheckboxGroupCliente control={control} array={guFields} >
                <Checkbox value="gu_insuficiencia">Insuficiência</Checkbox>
                <Checkbox value="gu_calculo">Cálculo renal</Checkbox>
                <Checkbox value="gu_infeccao">Infecções urinarias</Checkbox>
                <Checkbox value="gu_doenca_venerea">Doença venérea</Checkbox>
            </CheckboxGroupCliente>
            <div className="flex flex-col gap-2">
                <Controller
                    name="anamnese.hepa"
                    control={control}
                    rules={{ required: "Obrigatório" }}
                    render={({ field, fieldState }) => (
                        <>
                            <div className="flex justify-between w-full sm:w-[50%] items-center">
                                <p className="text-black text-md sm:text-lg">Tem ou teve Hepatite?</p>
                                <RadioGroup
                                    orientation="horizontal"
                                    value={String(field.value)}
                                    onValueChange={v => field.onChange(v)}
                                >
                                    <Radio value="SIM">Sim</Radio>
                                    <Radio value="NÃO">Não</Radio>
                                    <Radio value="NÃO SABE">Não sabe</Radio>
                                </RadioGroup>
                            </div>
                            {field.value === "SIM" && (
                                <Controller
                                    name="anamnese.hepa_obs"
                                    control={control}
                                    rules={{ required: "Qual hepatite?" }}
                                    render={({ field, fieldState }) => {
                                        const { name, ref, onBlur, onChange, value } = field;
                                        return (
                                            <Input
                                                name={name}
                                                ref={ref}
                                                label="Qual hepatite?"
                                                placeholder="Descreva qual hepatite"
                                                className="w-full"
                                                errorMessage={fieldState.error?.message}
                                                value={value ?? ''}
                                                onBlur={onBlur}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const v = e.target.value;
                                                    onChange(v === '' ? null : v);
                                                }}
                                            />
                                        );
                                    }}
                                />
                            )}
                            {fieldState.error && (
                                <span className="text-red-600 text-sm">{fieldState.error.message}</span>
                            )}
                        </>
                    )}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Controller
                    name="anamnese.outra_doenca"
                    control={control}
                    render={({ field }) => (
                        <div className="flex justify-between w-full sm:w-[50%] items-center">
                            <p className="text-black text-md sm:text-lg">Tem outra doença?</p>
                            <RadioGroup
                                orientation="horizontal"
                                value={String(field.value)}
                                onValueChange={v => field.onChange(v)}
                            >
                                <Radio value="SIM">Sim</Radio>
                                <Radio value="NÃO">Não</Radio>
                                <Radio value="NÃO SABE">Não sabe</Radio>
                            </RadioGroup>
                        </div>
                    )}
                />
                <CheckboxGroupCliente control={control} array={doencasFields} >
                    <Checkbox value="diarreia_cronica">Diarreia crônica</Checkbox>
                    <Checkbox value="febre_const">Frebre constante</Checkbox>
                    <Checkbox value="sudorese">Sudorese</Checkbox>
                    <Checkbox value="cancer_pele">Câncer de pele</Checkbox>
                    <Checkbox value="diabetes_desc">Diabetes descompensada</Checkbox>
                    <Checkbox value="probl_cicatriz">Problemas com cicatrização</Checkbox>
                    <Checkbox value="doenca_cont">Doença contagiosa</Checkbox>
                    <Checkbox value="baixa_imun">Baixa imunidade</Checkbox>
                    <Checkbox value="dermatite">Dermatite</Checkbox>
                </CheckboxGroupCliente>
            </div>
        </section>
    );
};

export default ExamesComplementares;
