import { useNavigate } from "react-router";

interface CardPacienteProps {
    id: number;
    index: number;
    nome: string;

}

function CardPaciente({ index, id, nome, }: CardPacienteProps) {
    const navigate = useNavigate();
    return (
        <div key={index} className="flex w-full text-white justify-between border border-[#9B7F67] items-center bg-[#9B7F67] p-3 rounded-md hover:bg-[#E3DCD4]   hover:text-black">
            <p>Nome: {nome}</p>
            <p>Ver oçamentos {'(X)'}</p>
            <p>Ver procedimentos {'(X)'}</p>
            <p>Dt ultimo retorno: {'12/03/2025'}</p>
            <p onClick={() => { navigate(`/listagem-clientes/${id}`); }} className="underline">Ver Mais</p>
        </div>

    );
}

export default CardPaciente;
