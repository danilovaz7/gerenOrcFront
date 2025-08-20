// src/components/InfoUsuarioCampos.tsx
import React from "react";
import { Controller, type Control } from "react-hook-form";
import { Input } from "@heroui/react";
import type { FormValues } from "../pages/InfoCliente.tsx";

export interface InfoUsuarioCamposProps {
  control: Control<FormValues>;
  name:
  | "nome"
  | "email"
  | "dt_nascimento"
  | "rg"
  | "cpf"
  | "estado_civil"
  | "sexo"
  | "filhos"
  | "cep"
  | "endereco"
  | "num_endereco"
  | "complemento"
  | "cidade"
  | "bairro"
  | "nacionalidade"
  | "naturalidade"
  | "raca"
  | "telefone"
  | "celular"
  | "profissao"
  | "local_trabalho"
  | "instagram"
  | "facebook";
  label: string;
  className: string;
  usuario_id_tipo: number | undefined;
  errorMessage: string | undefined;
}

export const InfoUsuarioCampos: React.FC<InfoUsuarioCamposProps> = ({
  control,
  errorMessage,
  label,
  usuario_id_tipo,
  className,
  name,
}) => {
  const numericFields = ["filhos", "num_endereco"] as const;

  const apenasLeitura = usuario_id_tipo === 2;
  console.log("leitura apenas? ", apenasLeitura)

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Obrigatório" }}
      render={({ field }) => {
        const { name: fieldName, ref, onBlur, onChange: fieldOnChange, value } =
          field;

        const isNumberField = (numericFields as readonly string[]).includes(
          fieldName
        );

        function handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
        function handleChange(v: number | string): void;
        function handleChange(arg: React.ChangeEvent<HTMLInputElement> | number | string) {
          if (typeof arg === "object" && "target" in arg) {
            const v = arg.target.value;
            if (isNumberField) {
              if (v === "") {
                fieldOnChange(undefined);
                return;
              }
              const n = Number(v);
              if (!Number.isNaN(n)) fieldOnChange(n);
              else fieldOnChange(undefined);
            } else {
              fieldOnChange(v === "" ? undefined : v);
            }
            return;
          }

          if (isNumberField) {
            if (arg === "" || arg == null) {
              fieldOnChange(undefined);
              return;
            }
            const n = typeof arg === "number" ? arg : Number(arg);
            if (!Number.isNaN(n)) fieldOnChange(n);
            else fieldOnChange(undefined);
          } else {
            fieldOnChange(arg == null ? undefined : String(arg));
          }
        }

        return (
          <Input
            name={fieldName}
            ref={ref}
            className={className}
            label={label}
            errorMessage={errorMessage}
            value={value == null ? "" : String(value)}
            onBlur={onBlur}
            onChange={handleChange}
            readOnly={apenasLeitura}
            isReadOnly={apenasLeitura}
            disabled={apenasLeitura}
            aria-disabled={apenasLeitura}
          />
        );
      }}
    />
  );
};

export default InfoUsuarioCampos;
