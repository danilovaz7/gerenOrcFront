import { Input, Radio, RadioGroup } from "@heroui/react";



interface PerguntaCRespProps {
    pergunta: string;
    OnValueChangeRadio: (val: string) => void;
    valueStringRadio: string;
    OnValueChangeInput: {
        (e: React.ChangeEvent<any>): void;
        <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    };
    valueStringInput: string;
    inputName: string;

}

function PerguntaCResp({ pergunta, valueStringRadio, valueStringInput, inputName, OnValueChangeRadio, OnValueChangeInput }: PerguntaCRespProps) {

    return (

        <div className="flex w-full flex-col gap-2">
            <div className="flex justify-between w-[60%]">
                <p className="text-black text-lg">{pergunta}</p>
                <RadioGroup
                    orientation="horizontal"
                    value={valueStringRadio}
                    onValueChange={OnValueChangeRadio}
                >
                    <Radio value="true">Sim</Radio>
                    <Radio value="false">Não</Radio>
                </RadioGroup>
            </div>
            <Input
                className="w-[100%]"
                errorMessage=""
                onChange={OnValueChangeInput}
                value={valueStringInput}
                name={inputName}
                placeholder="Qual?..."
                type="text"
            />
        </div>
    );
}

export default PerguntaCResp;
