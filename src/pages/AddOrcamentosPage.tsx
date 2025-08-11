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
    useWatch,
    useController
} from "react-hook-form";
import { parseDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import type { Usuario } from "../interfaces/Usuario";

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
    validade: string;
    valor_parcelado?: string;
    num_parcelas?: number;
    valor_total: number;
    arquivo_pdf: string;
    procedimentos: ProcedimentoForm[];
};

function UsuarioAutocomplete({
    control,
    name,
    usuarios
}: {
    control: any;
    name: string;
    usuarios: Usuario[];
}) {
    const { field, fieldState } = useController({ control, name, rules: { required: "Obrigatório" } });
    const [query, setQuery] = useState(usuarios.find(u => u.id === field.value)?.nome || "");
    const [filtered, setFiltered] = useState<Usuario[]>([]);

    useEffect(() => {
        const q = query.toLowerCase();
        setFiltered(
            usuarios.filter(u => u.nome.toLowerCase().includes(q)).slice(0, 5)
        );
    }, [query, usuarios]);

    return (
        <div className="relative w-full sm:w-[40%]">
            <Input
                value={query}
                label="Pesquisar paciênte..."
                isRequired
                errorMessage={fieldState.error?.message}
                onChange={(e) => {
                    setQuery(e.target.value);
                    field.onChange(0);
                }}
            />
            {filtered.length > 0 && query && (
                <ul className="absolute bg-white border z-10 w-full max-h-40 overflow-auto rounded">
                    {filtered.map((u) => (
                        <li
                            key={u.id}
                            onClick={() => {
                                field.onChange(u.id);
                                setQuery(u.nome);
                                setFiltered([]);
                            }}
                            className="p-2 text-black hover:bg-gray-200 cursor-pointer"
                        >
                            {u.nome}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


function AddOrcamentosPage() {
    const { token, user } = useTokenStore();
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((data: Usuario[]) => setUsuarios(data))
            .catch(console.error);
    }, [token]);

    const methods = useForm<FormValues>({
        defaultValues: {
            usuario_id: user?.id ?? 0,
            forma_pagamento: "",
            valor_total: 0,
            num_parcelas: 1,
            valor_parcelado: "",
            validade: "",
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

    const valorTotal = useWatch({ control, name: "valor_total" }) as number;
    const numParcelas = useWatch({ control, name: "num_parcelas" }) as number | undefined;

    function formatCurrency(value: number) {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    }

    useEffect(() => {
        const total = Number(valorTotal) || 0;
        const parcelas = Number(numParcelas) || 0;

        if (!parcelas || parcelas <= 0 || total <= 0) {
            setValue("valor_parcelado", "");
            return;
        }

        // valor por parcela (simples, com duas casas)
        const parcelaValor = Math.round((total / parcelas) * 100) / 100; // arredonda para centavos
        const formatted = `${parcelas}x de ${formatCurrency(parcelaValor)}`;

        setValue("valor_parcelado", formatted);
    }, [valorTotal, numParcelas, setValue]);


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
        <div className="flex w-[100%] sm:w-[70%] h-full flex-col items-center p-4">
            <FormProvider {...methods}>
                <HForm
                    className="w-full flex flex-col gap-6 bg-[rgba(155,127,103,0.1)] p-4 rounded"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="usuario_id"
                        control={control}
                        render={() => (
                            <UsuarioAutocomplete control={control} name="usuario_id" usuarios={usuarios} />
                        )}
                    />

                    {fields.map((item, index) => (
                        <div
                            key={item.id}
                            className="w-full bg-[rgba(155,127,103,0.5)] p-2 rounded flex flex-wrap gap-3"
                        >
                            <Controller name={`procedimentos.${index}.nome_procedimento`} control={control} rules={{ required: "Obrigatório" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="w-full sm:w-[73%]"
                                        label="Nome do procedimento"
                                        isRequired
                                    />
                                )}
                            />
                            <Controller name={`procedimentos.${index}.valor_procedimento`} control={control} rules={{ required: "Obrigatório" }}
                                render={({ field }) => (
                                    <NumberInput
                                        {...field}
                                        className="w-[50%] sm:w-[10%]"
                                        label="Valor"
                                        isRequired
                                    />
                                )}
                            />
                            <Controller name={`procedimentos.${index}.dt_realizacao`} control={control} rules={{ required: "Obrigatório" }}
                                render={({ field }) => (
                                    <DateInput
                                        className="w-[45%] sm:w-[15%]"
                                        value={field.value ? parseDate(field.value) : null}
                                        onChange={v => field.onChange(v?.toString() ?? "")}
                                        label="Data de realização"
                                        isRequired
                                    />
                                )}
                            />

                            <Controller name={`procedimentos.${index}.obs_procedimento`} control={control}
                                render={({ field }) => (
                                    <Input {...field} label="Observação (opcional)" />
                                )}
                            />

                            <button type="button" onClick={() => remove(index)} className="w-[40%] sm:w-[12%] bg-[#7F634B] text-white rounded">
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
                        <Controller name={`validade`} control={control} rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <DateInput
                                    className="w-[45%] sm:w-[20%]"
                                    value={field.value ? parseDate(field.value) : null}
                                    onChange={v => field.onChange(v?.toString() ?? "")}
                                    label="Data de validade"
                                    isRequired
                                />
                            )}
                        />

                        <Controller
                            name="forma_pagamento" control={control} rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    className="w-[60%] sm:w-[20%]"
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
                            name="valor_total" control={control}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    className="w-[60%] sm:w-[20%]"
                                    label="Valor Total"
                                    isDisabled
                                    value={field.value}
                                />
                            )}
                        />

                        <div className="flex justify-start items-center w-full sm:w-[40%] gap-5">
                            <Controller
                                name="num_parcelas"
                                control={control}
                                render={({ field }) => (
                                    <NumberInput
                                        {...field}
                                        className="w-[55%] sm:w-[35%]"
                                        label="Número de parcelas"
                                        min={1}
                                        onChange={(v) => field.onChange(Number(v))}
                                    />
                                )}
                            />

                            <Controller name={`valor_parcelado`} control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="w-[60%] sm:w-[40%]"
                                        label="Valor parcelado"
                                        isDisabled
                                    />
                                )}
                            />
                        </div>

                    </div>

                    <Button size="lg" type="submit" className="bg-[#7F634B] text-white w-[10%] self-center">
                        Salvar
                    </Button>
                </HForm>
            </FormProvider>
        </div>
    );
}

export default AddOrcamentosPage;
