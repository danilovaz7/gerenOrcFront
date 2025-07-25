import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Button, DateInput, Form, Input, NumberInput, Select, SelectItem, Form as HForm, } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";


import type { Usuario } from '../interfaces/Usuario';
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import InfoUsuarioCampos from "../components/InfoUsuarioCampos";

export const CalendarIcon = (props: any) => {
    return (
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
};


export type FormValues = Omit<Usuario, 'id'> & {
    anamnese: Record<string, boolean | string>;
    examesComplementares: Record<string, string | number>;
};

function AddClientesPage() {
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const navigate = useNavigate();

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
            id_tipo_usuario: 2

        }
    });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = methods;

    // Observa o CEP
  const cepValue = useWatch({ control, name: 'cep' });

  // Ao mudar o CEP, busca no ViaCEP e completa endereço
  useEffect(() => {
    const fetchEndereco = async () => {
      const cepLimpo = cepValue?.replace(/\D/g, '');
      if (cepLimpo && cepLimpo.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setValue('endereco', data.logradouro || '');
            setValue('bairro', data.bairro || '');
            setValue('cidade', data.localidade || '');
          }
        } catch (err) {
          console.error('Erro ao buscar endereço do CEP', err);
        }
      }
    };
    fetchEndereco();
  }, [cepValue, setValue]);

    const onSubmit = async (values: FormValues) => {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(values)
        });

        if (resposta.ok) {
            navigate('/home');
        }
    };



    return (
        <div className="flex h-full flex-col justify-start gap-16 items-center w-screen p-2">
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
                       <Controller
                            name="sexo"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    selectedKeys={field.value ? new Set([field.value]) : new Set()}
                                    onSelectionChange={keys => field.onChange(Array.from(keys)[0])}
                                    label="Sexo"
                                    className="w-[15%]"
                                >
                                    <SelectItem className="text-black" key="masc">Masculino</SelectItem>
                                    <SelectItem className="text-black" key="fem">Feminino</SelectItem>
                                    <SelectItem className="text-black" key="outro">Outro</SelectItem>
                                </Select>
                            )}
                        />
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
                                    <SelectItem className="text-black" key="branca">Branca</SelectItem>
                                    <SelectItem className="text-black" key="amarela">Amarela</SelectItem>
                                    <SelectItem className="text-black" key="negra">Negra</SelectItem>
                                    <SelectItem className="text-black" key="outra">Outra</SelectItem>
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
                        <Controller
                            name="id_tipo_usuario"
                            control={control}
                            defaultValue={2}        
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                    </section>

                    <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
                        <Button size="lg" className="w-[15%] text-white bg-[#7F634B]" type="submit">
                            Salvar
                        </Button>
                    </div>
                </HForm>
            </FormProvider>
        </div>

    )
}

export default AddClientesPage
