
import { Radio, RadioGroup } from '@heroui/react'
import { useController, type Control } from 'react-hook-form'
import type { FormValues } from '../pages/InfoCliente.tsx'

interface Props {
  control: Control<FormValues>
  name: string
  label: string
  rules?: { required?: boolean | string }
}


export function PerguntaSimNao({ control, name, label, rules }: Props) {
  const { field } = useController({ control, name, rules })
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between w-[40%] items-center">
        <p className="text-black text-lg">{label}</p>
        <RadioGroup
          orientation="horizontal"
          value={String(field.value)}
          onValueChange={v => field.onChange(v === 'true')}
        >
          <Radio value="true">Sim</Radio>
          <Radio value="false">Não</Radio>
        </RadioGroup>
      </div>
    </div>
  )
}
