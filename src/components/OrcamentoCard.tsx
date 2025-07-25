interface Props {
    id_orcamento: number;
    qtd_procedimentos: number;
    dt_criacao: string;
    valor_total: number;
    metodo_pag: string;
}

export function OrcamentoCard({ id_orcamento, qtd_procedimentos, dt_criacao, valor_total, metodo_pag }: Props) {

    return (
        <div
            className="
                grid
                grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]
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
            <p>ID orçamento: {id_orcamento}</p>
            <p>Qtd procedimentos: {`(${qtd_procedimentos})`}</p>
            <p>Data criação: {new Date(dt_criacao).toLocaleDateString('pt-BR')}</p>
            <p>Valor total: {`R$${valor_total}`}</p>
            <p>Método: {metodo_pag}</p>
            <p className="underline">Ver Mais</p>
        </div>
    );
}
