import { Radio, RadioGroup } from "@heroui/react";


interface PerguntaSIMNAOProps {
    valueString: string;
    pergunta: string;
    OnValueChange: (val: string) => void;

}

function PerguntaSIMNAO({ valueString, pergunta, OnValueChange}: PerguntaSIMNAOProps) {

    return (
       <div className="flex w-full flex-col gap-4 ">
                    <div className="flex justify-between w-[40%]">
                        <p className="text-black text-lg">{pergunta}</p>
                        <RadioGroup
                            orientation="horizontal"
                            value={valueString}
                            onValueChange={OnValueChange}
                        >
                            <Radio value="true">Sim</Radio>
                            <Radio value="false">Não</Radio>
                        </RadioGroup>
                    </div>
                </div>
    );
}

export default PerguntaSIMNAO;
