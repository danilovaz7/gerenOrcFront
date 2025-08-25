import React from "react";
import { Controller, type Control } from "react-hook-form";
import { DateInput, Input, NumberInput } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { CalendarIcon, type FormValues } from "../pages/InfoCliente"; // ajuste nome/caminho se necessário

export interface ExamesComplementaresProps {
  control: Control<FormValues>;
}

export const ExamesComplementares: React.FC<ExamesComplementaresProps> = ({ control }) => {
  return (
    <section className="w-full flex flex-col justify-center gap-10">
      <h2 className="text-3xl text-black text-center font-semibold">Exames Complementares</h2>

      <div className="flex w-full flex-row gap-4">
        <Controller
          name="examesComplementares.peso"
          control={control}
          rules={{
            min: { value: 0, message: "Peso deve ser positivo" }
          }}
          render={({ field, fieldState }) => {
            const { name, ref, onBlur, onChange, value } = field;

            // value pode ser number | undefined
            return (
              <NumberInput
                name={name}
                ref={ref}
                className="w-[50%] sm:w-[12%]"
                label="Peso (em Kg)"
                labelPlacement="outside"
                placeholder="1Kg..."
                errorMessage={fieldState.error?.message}
                value={value == null ? undefined : value} // number | undefined
                onBlur={onBlur}
                onChange={(v: any) => {
                  // a lib pode passar number ou string; normalizamos para number | undefined
                  if (v == null) {
                    onChange(undefined);
                    return;
                  }
                  if (typeof v === 'number') {
                    onChange(Number.isNaN(v) ? undefined : v);
                    return;
                  }
                  if (typeof v === 'string') {
                    const s = v.trim();
                    if (s === '') { onChange(undefined); return; }
                    const n = Number(s);
                    onChange(Number.isNaN(n) ? undefined : n);
                    return;
                  }
                  const n = Number(v);
                  onChange(Number.isNaN(n) ? undefined : n);
                }}
              />
            );
          }}
        />

        <Controller
          name="examesComplementares.data_peso"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              value={field.value ? parseDate(field.value) : null}
              onChange={v => field.onChange(v?.toString() ?? '')} // string ou ''
              className="w-[45%] sm:w-[20%]"
              label="Data medição"
              labelPlacement="outside"
              placeholderValue={new CalendarDate(1995, 11, 6)}
              endContent={<CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="flex w-full flex-row gap-4">
        <Controller
          name="examesComplementares.tipo_sanguineo"
          control={control}
          render={({ field, fieldState }) => {
            const { name, ref, onBlur, onChange, value } = field;
            return (
              <Input
                name={name}
                ref={ref}
                className="w-[40%] sm:w-[10%]"
                label="Tipo sanguíneo"
                labelPlacement="outside"
                placeholder="A+..."
                errorMessage={fieldState.error?.message}
                value={value ?? ''} // sempre string para Input
                onBlur={onBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} // '' fica ''
              />
            );
          }}
        />
      </div>

      <div className="flex w-full flex-row gap-4">
        <Controller
          name="examesComplementares.pressao"
          control={control}
          render={({ field, fieldState }) => {
            const { name, ref, onBlur, onChange, value } = field;
            return (
              <Input
                name={name}
                ref={ref}
                className="w-[50%] sm:w-[12%]"
                label="Pressão (em mmHg)"
                labelPlacement="outside"
                placeholder="120/80..."
                errorMessage={fieldState.error?.message}
                value={value ?? ''}
                onBlur={onBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
              />
            );
          }}
        />

        <Controller
          name="examesComplementares.data_pressao"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              value={field.value ? parseDate(field.value) : null}
              onChange={v => field.onChange(v?.toString() ?? '')}
              className="w-[45%] sm:w-[20%]"
              label="Data medição"
              labelPlacement="outside"
              placeholderValue={new CalendarDate(1995, 11, 6)}
              endContent={<CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>
    </section>
  );
};

export default ExamesComplementares;
