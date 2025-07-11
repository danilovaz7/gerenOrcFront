import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import {
    Button,
    Form as HForm,
    DateInput,
    Input,
    NumberInput,
    Select,
    SelectItem
} from "@heroui/react";

import {
    Controller,
    FormProvider,
    useForm,
    useFieldArray,
    useWatch
} from "react-hook-form";
import { parseDate } from "@internationalized/date";
import { useEffect } from "react";

type ProcedimentoForm = {
    nome_procedimento: string;
    valor_procedimento: number;
    dt_realizacao: string;
    obs_procedimento?: string;
    num_retorno: number
    status_retorno: string;
};

type FormValues = {
    usuario_id: number;
    forma_pagamento: string;
    valor_total: number;
    arquivo_pdf: string;
    procedimentos: ProcedimentoForm[];
};

function AddOrcamentos() {
    const { token, user } = useTokenStore();
    const navigate = useNavigate();

    const methods = useForm<FormValues>({
        defaultValues: {
            usuario_id: user?.id ?? 0,
            forma_pagamento: "",
            valor_total: 0,
            arquivo_pdf: "",
            procedimentos: []
        }
    });
    const {
        handleSubmit,
        control,
        formState: { },
        setValue
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "procedimentos"
    });

    const procedimentos = useWatch({
        control,
        name: "procedimentos"
    }) as ProcedimentoForm[];


    useEffect(() => {
        const total = procedimentos.reduce(
            (sum, p) => sum + (Number(p.valor_procedimento) || 0),
            0
        );
        setValue("valor_total", total);
    }, [procedimentos, setValue]);

    const onSubmit = async (values: FormValues) => {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/orcamentos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            }
        );
        if (res.ok) navigate("/home");
    };

    return (
        <div className="flex w-[70%] h-full flex-col items-center p-4">
            <FormProvider {...methods}>
                <HForm
                    className="w-full flex flex-col gap-6 bg-[rgba(155,127,103,0.1)] p-4 rounded"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="usuario_id"
                        control={control}
                        rules={{ required: "Obrigatório" }}
                        render={({ field }) => (
                            <NumberInput
                                {...field}
                                className="w-[20%]"
                                label="ID do Usuário"
                                isRequired
                            />
                        )}
                    />
                    {fields.map((item, index) => (
                        <div
                            key={item.id}
                            className="bg-red-200 w-full p-4 rounded flex flex-wrap gap-3"
                        >
                            <Controller
                                name={`procedimentos.${index}.nome_procedimento`}
                                control={control}
                                rules={{ required: "Obrigatório" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="w-[60%]"
                                        label="Nome do procedimento"
                                        isRequired
                                    />
                                )}
                            />

                            <Controller
                                name={`procedimentos.${index}.valor_procedimento`}
                                control={control}
                                rules={{ required: "Obrigatório" }}
                                render={({ field }) => (
                                    <NumberInput
                                        {...field}
                                        className="w-[10%]"
                                        label="Valor"
                                        isRequired
                                    />
                                )}
                            />

                            <Controller
                                name={`procedimentos.${index}.dt_realizacao`}
                                control={control}
                                rules={{ required: "Obrigatório" }}
                                render={({ field }) => (
                                    <DateInput
                                        className="w-[15%]"
                                        value={field.value ? parseDate(field.value) : null}
                                        onChange={v => field.onChange(v?.toString() ?? "")}
                                        label="Data de realização"
                                        isRequired
                                    />
                                )}
                            />

                            <Controller
                                name={`procedimentos.${index}.obs_procedimento`}
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} label="Observação (opcional)" />
                                )}
                            />

                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="w-[12%] bg-[#7F634B] text-white rounded"
                            >
                                Remover
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => append({
                            nome_procedimento: "",
                            valor_procedimento: 0,
                            dt_realizacao: "",
                            obs_procedimento: "",
                            num_retorno: 0,
                            status_retorno: "aguardando procedimento"
                        })}
                        className="bg-[#7F634B] text-white px-4 py-2 rounded self-start"
                    >
                        + Adicionar procedimento
                    </button>

                    <div className="flex w-full flex-col gap-4">
                        <Controller
                            name="forma_pagamento"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    className="w-[20%]"
                                    label="Forma de pagamento"
                                    isRequired
                                >
                                    <SelectItem key="boleto" className="text-black">Boleto</SelectItem>
                                    <SelectItem key="cartão" className="text-black">Cartão</SelectItem>
                                    <SelectItem key="pix" className="text-black">PIX</SelectItem>
                                </Select>
                            )}
                        />

                        <Controller
                            name="valor_total"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    className="w-[20%]"
                                    label="Valor Total"
                                    isDisabled
                                    value={field.value}
                                />
                            )}
                        />
                    </div>

                    <Button
                        size="lg"
                        type="submit"
                        className="bg-[#7F634B] text-white w-[10%] self-center"
                    >
                        Salvar
                    </Button>
                </HForm>
            </FormProvider>
        </div>
    );
}

export default AddOrcamentos;
