import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";

import type { Usuario } from '../interfaces/Usuario';
import type { Procedimento } from "../interfaces/Procedimento";
import { ProcedimentoHome } from "../components/ProcedimentoHome";

function HomePage() {
  const { token, user } = useTokenStore();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [procedimentos, setProcediementos] = useState<Procedimento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(r => r.json())
      .then((data: Usuario) => setUsuario(data))
      .catch(console.error);
  }, [token, user?.id]);

  useEffect(() => {
    if (!usuario) return;

    const params = new URLSearchParams();
    if (usuario.id_tipo_usuario === 2) {
      params.set('usuario_id', usuario.id.toString());
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/proximos-procedimentos?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    )
      .then(r => r.json())
      .then((data: Procedimento[]) => setProcediementos(data))
      .catch(console.error);
  }, [token, usuario]);

  if (!usuario) {
    return <p className="text-center mt-8">Carregando...</p>;
  }

  return (
    <div className="flex flex-col items-center w-full px-4 py-6 gap-8">
  
      <div className="w-[100%] sm:w-[70%] flex flex-col">
        <div className="w-full p-4 text-center bg-[#9B7F67] rounded-t-lg">
          <p className="text-base sm:text-lg md:text-xl text-white font-semibold">Lista de retornos próximos</p>
        </div>
          <div className="flex flex-col gap-5 p-5 justify-center bg-[rgba(155,127,103,0.26)] w-full">
          {procedimentos.length === 0 ? (
            <div className='flex flex-col w-full justify-center items-center gap-5'>
              <h2 className="text-center text-3xl text-[#75614e]"> Parece que você ainda não tem procedimentos</h2>
              <p className='text-lg text-[#75614e]'>Faça seu orçamento com a doutora primeiro!</p>
            </div>
          ) : (
            procedimentos
              .filter(p => p.orcamento?.usuario)
              .map((procedimento, idx) => (
                <ProcedimentoHome
                  key={idx}
                  cliente={procedimento.orcamento!.usuario!.nome}
                  procedimento_nome={procedimento.nome_procedimento}
                  dt_retorno={procedimento.dt_realizacao}
                  num_retorno={procedimento.num_retorno}
                />
              ))
          )}
        </div>
      </div>

      <div className="w-[70%]  flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        {usuario.id_tipo_usuario === 2 && (
          <>
            <button
              onClick={() => navigate(`/listagem-procedimentos?usuario_id=${usuario.id}`)}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              VER PROCEDIMENTOS
            </button>
            <button
              onClick={() => navigate(`/listagem-orcamentos?usuario_id=${usuario.id}`)}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              VER ORÇAMENTOS
            </button>
          </>
        )}

        {usuario.id_tipo_usuario === 1 && (
          <>
            <button
              onClick={() => navigate('/listagem-procedimentos')}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              VER PROCEDIMENTOS
            </button>
            <button
              onClick={() => navigate('/listagem-orcamentos')}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              VER ORÇAMENTOS
            </button>
            <button
              onClick={() => navigate('/listagem-clientes')}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              VER CLIENTES
            </button>
            <button
              onClick={() => navigate('/add-cliente')}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              ADICIONAR CLIENTE
            </button>
            <button
              onClick={() => navigate('/add-orcamento')}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              ADICIONAR ORÇAMENTO
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;