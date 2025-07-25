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

  // 1) Busca dados do usuário logado
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

  // 2) Busca próximos procedimentos,
  //    enviando nome apenas se id_tipo_usuario === 2
  useEffect(() => {
    if (!usuario) return;

    const params = new URLSearchParams();
    if (usuario.id_tipo_usuario === 2) {
      params.set('nome', usuario.nome);
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
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex h-full flex-col justify-start gap-16 items-center w-screen p-2">
      <div className="flex w-[70%] flex-col items-start">
        <div className="flex w-full p-5 justify-center bg-[#9B7F67]">
          <p className="text-lg">Lista de retornos próximos</p>
        </div>
        <div className="flex flex-col gap-5 p-5 justify-center bg-[rgba(155,127,103,0.26)] w-full">
          {procedimentos
            .filter(p => p.orcamento?.usuario)
            .map((procedimento, idx) => (
              <ProcedimentoHome
                key={idx}
                cliente={procedimento.orcamento!.usuario!.nome}
                procedimento_nome={procedimento.nome_procedimento}
                dt_retorno={new Date(procedimento.dt_realizacao)
                  .toLocaleDateString('pt-BR')}
                num_retorno={procedimento.num_retorno}
              />
            ))}
        </div>
      </div>
      <div className="flex w-[60%] gap-5 justify-around flex-wrap items-center p-2">
        {
          usuario.id_tipo_usuario === 2 ?
            <>
              <button onClick={() => navigate(`/listagem-procedimentos?nome=${usuario.nome}`)} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>VER PROCEDIMENTOS</p>
              </button>
              <button onClick={() => navigate(`/listagem-orcamentos?nome=${usuario.nome}`)} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>VER ORÇAMENTOS</p>
              </button>
            </> : null
        }

        {
          usuario.id_tipo_usuario === 1 ?
            <>
              <button onClick={() => navigate('/listagem-procedimentos')} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>VER PROCEDIMENTOS</p>
              </button>
              <button onClick={() => navigate('/listagem-orcamentos')} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>VER ORÇAMENTOS</p>
              </button>
              <button onClick={() => navigate('/listagem-clientes')} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>VER CLIENTES</p>
              </button>
              <button onClick={() => navigate('/add-cliente')} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>ADICIONAR CLIENTE</p>
              </button>
              <button onClick={() => navigate('/add-orcamento')} className="w-[30%] flex justify-center p-2 rounded-lg bg-[#9B7F67]">
                <p>ADICIONAR ORÇAMENTO</p>
              </button>
            </> : null
        }

      </div>
    </div>
  );
}

export default HomePage;
