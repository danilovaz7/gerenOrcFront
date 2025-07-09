// src/components/PerguntaSimNaoObs.tsx
import React from "react";
import { Controller, type Control } from "react-hook-form";
import { Input } from "@heroui/react";
import type { FormValues } from "../pages/InfoCliente.tsx";

export interface InfoUsuarioCamposProps {
    control: Control<FormValues>;
    name: 'nome' | 'email' | 'dt_nascimento' | 'rg' | 'cpf' | 'estado_civil' | 'sexo' | 'filhos' | 'cep' | 'endereco' | 'num_endereco' | 'complemento' | 'cidade' | 'bairro' | 'nacionalidade' | 'naturalidade' | 'raca' | 'telefone' | 'celular' | 'profissao' | 'local_trabalho' | 'instagram' | 'facebook';
    label: string;
    className: string;
    errorMessage: string | undefined;
}

export const InfoUsuarioCampos: React.FC<InfoUsuarioCamposProps> = ({ control,errorMessage, label, className, name }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: "Obrigatório" }}
            render={({ field }) => (
                <Input
                    {...field}
                    label={label}
                    isRequired
                    errorMessage={errorMessage}
                    className={className}
                />
            )}
        />
    );
};

export default InfoUsuarioCampos;
