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

    const gridCols = usuario_id_tipo === 1
        ? 'grid-cols-[1fr_2fr_1fr_1fr_1fr_auto]' // com nome paciente
        : 'grid-cols-[2fr_1fr_1fr_1fr_auto]';       // sem nome paciente

    return (
        <div className={`grid ${gridCols} gap-4 w-full text-white border border-[#9B7F67] items-center bg-[#9B7F67] p-3 rounded-md hover:bg-[#E3DCD4] hover:text-black`}>
            {
                usuario_id_tipo === 1 ?
                    <p className="text-left truncate">Nome paciente: {nome_cliente}</p>
                    : null
            }
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
            <div className="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-white hover:text-gray-800"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7h2l1-2h12l1 2h2a1 1 0 011 1v12a1 1 0 01-1 1H3
                         a1 1 0 01-1-1V8a1 1 0 011-1z"
                    />
                    <circle cx="12" cy="13" r="4" />
                </svg>
                <span className="text-sm truncate">Antes | Depois</span>
            </div>
            {
                usuario_id_tipo === 1 ?
                    <p onClick={onclick} className="col-end-7 text-right underline cursor-pointer">
                        Atualizar
                    </p>
                    : null
            }

        </div>
    );
}
