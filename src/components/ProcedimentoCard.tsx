import type { MouseEventHandler } from "react";

interface Props {
    nome_cliente: string;
    procedimento_nome: string;
    dt_realizacao: string;
    status: string;
    num_retorno: number;
    usuario_id_tipo: number | undefined;
    onclick: MouseEventHandler<HTMLParagraphElement> | undefined;
}

export function ProcedimentoCard({ nome_cliente, procedimento_nome, dt_realizacao, num_retorno, status, usuario_id_tipo, onclick }: Props) {
    const statusInfo: Record<typeof status, { label: string; color: string }> = {
        'aguardando procedimento': { label: 'Aguardando procedimento', color: 'bg-blue-500' },
        finalizado: { label: 'Finalizado', color: 'bg-green-500' },
        retorno: { label: 'Retorno', color: 'bg-yellow-500' }
    };
    const { label, color } = statusInfo[status];

    function formatDateOnly(dateStr: string) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    return (
        <div
            className="
                grid
                grid-cols-[1fr_2fr_1fr_1fr_1fr_auto]
                gap-4
                w-full
                text-white
                border border-[#9B7F67]
                items-center
                bg-[#9B7F67]
                p-3
                rounded-md
                hover:bg-[#E3DCD4]
                hover:text-black
            "
        >
           
                <p className="text-left truncate">Nome paciente: {nome_cliente}</p>
        

            <p className="truncate">Procedimento: {procedimento_nome}</p>

            <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                <span className="whitespace-nowrap text-sm">{label}</span>
            </div>

            <p className="text-center whitespace-nowrap">
                Data: {formatDateOnly(dt_realizacao)}
            </p>

            <p className="truncate">
                N° retorno: {num_retorno === 0 ? 'N/a' : num_retorno}
            </p>

            <p onClick={onclick} className="col-end-7 text-right underline cursor-pointer">
                Ver Mais
            </p>
        </div>
    );
}
