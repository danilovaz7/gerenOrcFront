interface Props {
    cliente: string
    procedimento_nome: string
    dt_retorno: string
    num_retorno: number
}

export function ProcedimentoHome({ cliente, procedimento_nome, dt_retorno, num_retorno }: Props) {
    function formatDateOnly(dateStr: string) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    return (
        <div
            className="
    grid
    grid-cols-1
    sm:grid-cols-[1fr_2fr_1fr_auto]
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
    transition-colors duration-150
  "
        >
            <p>Cliente : {cliente}</p>
            <p>Procedimento: {procedimento_nome}</p>
            <p>Data de retorno: {formatDateOnly(dt_retorno)}</p>
            <p>Numero do retorno: {num_retorno}</p>
        </div>
    )
}
