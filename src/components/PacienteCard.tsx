import { useNavigate } from "react-router";

interface PacienteCardProps {
    id: number;
    nome: string;
    orcamentosCount: number;
    procedimentosCount: number;
    ultimo_retorno: string;
}

 function formatDateOnly(dateStr: string) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

function PacienteCard({ id, nome, orcamentosCount, procedimentosCount, ultimo_retorno }: PacienteCardProps) {
    const navigate = useNavigate();
    return (
        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-[2fr_1fr_1fr_1fr_auto]
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
            <p>Nome: {nome}</p>
            <p className="hover:cursor-pointer" onClick={() => { navigate(`/listagem-orcamentos?usuario_id=${id}`); }}>Ver orçamentos {`(${orcamentosCount})`}</p>
            <p className="hover:cursor-pointer" onClick={() => { navigate(`/listagem-procedimentos?usuario_id=${id}`); }}>Ver procedimentos {`(${procedimentosCount})`}</p>
            <p>Dt último retorno: {ultimo_retorno ? formatDateOnly(ultimo_retorno) : "N/a"}</p>
            <p className="underline hover:cursor-pointer" onClick={() => { navigate(`/listagem-clientes/${id}`); }}>Ver Mais</p>
        </div>

    );
}

export default PacienteCard;
