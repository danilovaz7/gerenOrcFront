import { Radio, RadioGroup } from "@heroui/react";
import { useController, type Control, type Path } from "react-hook-form";
import type { FormValues } from "../pages/InfoCliente.tsx";

interface Props {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label: string;
  rules?: { required?: boolean | string };
}

export function PerguntaSimNao({ control, name, label, rules }: Props) {
  const { field } = useController({ control, name, rules });

  const radioValue = field.value === true ? "true" : "false";

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between w-full sm:w-[40%] items-center">
        <p className="text-black text-sm sm:text-lg">{label}</p>
        <RadioGroup
          orientation="horizontal"
          value={radioValue}
          onValueChange={(v) => field.onChange(v === "true")}
        >
          <Radio value="true">Sim</Radio>
          <Radio value="false">Não</Radio>
        </RadioGroup>
      </div>
    </div>
  );
}
