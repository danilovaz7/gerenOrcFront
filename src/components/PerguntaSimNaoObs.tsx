
import { Radio, RadioGroup, Input } from '@heroui/react'
import { useController, type Control } from 'react-hook-form'
import type { FormValues } from '../pages/InfoCliente.tsx'

interface Props {
  control: Control<FormValues>
  name: string         
  nameObs: string      
  label: string
  rules?: { required?: boolean | string }
}

export function PerguntaSimNaoObs({ control, name, nameObs, label, rules }: Props) {
  const { field: radioField } = useController({ control, name, rules })
  const { field: obsField }   = useController({ control, name: nameObs })
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between w-[40%] items-center">
        <p className="text-black text-lg">{label}</p>
        <RadioGroup
          orientation="horizontal"
          value={String(radioField.value)}
          onValueChange={v => {
            const bool = v === 'true'
            radioField.onChange(bool)
            if (!bool) obsField.onChange('') 
          }}
        >
          <Radio value="true">Sim</Radio>
          <Radio value="false">Não</Radio>
        </RadioGroup>
      </div>
      <Input
        name={obsField.name}
        value={typeof obsField.value === 'string' ? obsField.value : ''}
        onBlur={obsField.onBlur}
        onChange={e => obsField.onChange(e.target.value)}
        placeholder="Se sim, qual?"
        className="w-full"
        errorMessage={rules?.required && obsField.value === '' ? String(rules.required) : undefined}
      />
    </div>
  )
}
