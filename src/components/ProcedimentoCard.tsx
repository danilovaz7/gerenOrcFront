import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import type { MouseEventHandler } from "react";


interface Props {
    nome_paciente: string;
    procedimento_nome: string;
    dt_realizacao: string;
    status: string;
    foto_antes: string;
    foto_depois: string;
    num_retorno: number;
    usuario_id_tipo: number | undefined;
    onclick?: MouseEventHandler<HTMLParagraphElement>;
}

function formatDateOnly(dateStr: string) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

export function ProcedimentoCard({
    nome_paciente,
    procedimento_nome,
    dt_realizacao,
    num_retorno,
    foto_antes,
    foto_depois,
    status,
    usuario_id_tipo,
    onclick,
}: Props) {

    const statusInfo: Record<string, { label: string; color: string }> = {
        'Aguardando procedimento': { label: 'Aguardando', color: 'bg-blue-500' },
        Finalizado: { label: 'Finalizado', color: 'bg-green-500' },
        Retorno: { label: 'Retorno', color: 'bg-yellow-500' },
    };
    const { label, color } = statusInfo[status] || { label: status, color: 'bg-gray-500' };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const gridCols = usuario_id_tipo === 1
        ? 'sm:grid-cols-[1fr_2fr_1fr_1fr_auto]'
        : 'sm:grid-cols-[2fr_1fr_1fr_1fr_auto]';

    return (
        <>
            <div className={`grid grid-cols-1 ${gridCols} gap-4 w-full text-white border border-[#9B7F67] items-center bg-[#9B7F67] p-3 rounded-md hover:bg-[#E3DCD4] hover:text-black transition-colors duration-150`}>
                {usuario_id_tipo === 1 && (
                    <p className="truncate">Nome: {nome_paciente}</p>
                )}
                <p className="truncate">Procedimento: {procedimento_nome}</p>

                <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm whitespace-nowrap">{label}</span>
                </div>

                <p className="truncate whitespace-nowrap">Data: {formatDateOnly(dt_realizacao)}</p>
                <p className="truncate">N° retorno: {num_retorno === 0 ? 'N/A' : num_retorno}</p>

                <div onClick={() => { onOpen() }} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white hover:text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1-2h12l1 2h2a1 1 0 011 1v12a1 1 0 01-1 1H3
                         a1 1 0 01-1-1V8a1 1 0 011-1z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span className="text-sm truncate">Antes | Depois</span>
                </div>

                {usuario_id_tipo === 1 && onclick && (
                    <p onClick={onclick} className="underline cursor-pointer text-right sm:col-end-7">
                        Atualizar
                    </p>
                )}
            </div>
                
            <Modal className='bg-[#e5ded8]' isOpen={isOpen} size={'3xl'} onClose={onClose}>
                <ModalContent className='text-black max-h-[80vh] overflow-y-auto'>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Antes e Depois procedimento</ModalHeader>
                            <ModalBody className="flex h-full flex-col  items-center p-2">
                                <div className='w-full flex flex-col sm:flex-row gap-5 p-2'>
                                    <div className=' w-full sm:w-[50%] flex flex-col justify-center items-center rounded-md bg-[#9B7F67] gap-2 p-2'>
                                        {
                                            foto_antes ? <img className='w-full h-auto object-contain rounded-md' src={foto_antes} alt="" />
                                            : <div className='w-full h-96 rounded-md object-contain bg-black'></div>
                                        }
                                        <p className="text-white text-lg">Antes</p>
                                    </div>
                                    <div className=' w-full sm:w-[50%] flex flex-col justify-center items-center rounded-md bg-[#9B7F67]  gap-2 p-2'>
                                        {
                                            foto_depois ? <img className='w-full h-auto object-contain rounded-md' src={foto_depois} alt="" />
                                            : <div className='w-full h-96 rounded-md object-contain bg-black'></div>
                                        }
                                        <p className="text-white text-lg">Depois</p>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>

    );
}
