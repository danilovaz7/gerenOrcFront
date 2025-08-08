
import React from "react";
import { Controller, type Control } from "react-hook-form";
import { CheckboxGroup } from "@heroui/react";
import type { FormValues } from "../pages/InfoCliente.tsx";

export interface CheckboxGroupClienteProps {
  control: Control<FormValues>;
  array: readonly string[];
  children: React.ReactNode;
}

export const CheckboxGroupCliente: React.FC<CheckboxGroupClienteProps> = ({ control, array, children }) => {
  return (
    <Controller
      name="anamnese"
      control={control}
      render={({ field }) => (
        <CheckboxGroup
          orientation="horizontal"
          value={array.filter(k => !!field.value[k])}
          onValueChange={sel => {
            const updated = { ...field.value };
            array.forEach(k => updated[k] = sel.includes(k));
            field.onChange(updated);
          }}
        >
          {children}
        </CheckboxGroup>
      )}
    />
  );
};

export default CheckboxGroupCliente;
