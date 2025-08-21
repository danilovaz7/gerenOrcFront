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
  const [aniversariantes, setAniversariantes] = useState<Usuario[]>([]);
  const [loadingAniversariantes, setLoadingAniversariantes] = useState(false);
  const [anivError, setAnivError] = useState<string | null>(null);
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

  // --------- novo useEffect: busca aniversariantes do mês (apenas admin view) ----------
  useEffect(() => {
    // só busca se usuário está carregado e for admin (id_tipo_usuario === 1)
    if (!usuario || usuario.id_tipo_usuario !== 1) {
      setAniversariantes([]);
      return;
    }

    const controller = new AbortController();
    async function fetchAniversariantes() {
      try {
        setLoadingAniversariantes(true);
        setAnivError(null);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/aniversariantes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Erro ao buscar aniversariantes');
        }
        const data: Usuario[] = await res.json();
        setAniversariantes(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Erro ao buscar aniversariantes:', err);
        setAnivError(err.message || 'Erro desconhecido');
        setAniversariantes([]);
      } finally {
        setLoadingAniversariantes(false);
      }
    }

    fetchAniversariantes();
    return () => controller.abort();
  }, [token, usuario]);

  // helpers
  function getAgeFromDate(dt?: string | null) {
    if (!dt) return null;
    const birth = new Date(dt);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function formatDayMonth(dt?: string | null) {
    if (!dt) return '--/--';
    try {
      return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return '--/--';
    }
  }
  console.log(aniversariantes)

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
                  paciente={procedimento.orcamento!.usuario!.nome}
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
              VER PACIENTES
            </button>
            <button
              onClick={() => navigate('/add-cliente')}
              className="w-full sm:w-1/2 md:w-1/3 py-3 rounded-lg bg-[#9B7F67] text-white font-medium"
            >
              ADICIONAR PACIENTE
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

      {usuario.id_tipo_usuario === 1 && (
        <div className="w-[100%] sm:w-[60%] flex flex-col">
          <div className="w-full p-4 text-center bg-[#9B7F67] rounded-t-lg">
            <p className="text-base sm:text-lg md:text-xl text-white font-semibold">Lista de aniversariantes do mês</p>
          </div>
          <div className="flex flex-col gap-5 p-5 justify-center bg-[rgba(155,127,103,0.26)] w-full">
            {loadingAniversariantes ? (
              <div className='flex justify-center items-center py-6'>Carregando aniversariantes...</div>
            ) : anivError ? (
              <div className='text-red-600'>{anivError}</div>
            ) : aniversariantes.length === 0 ? (
              <div className='flex flex-col w-full justify-center items-center gap-5'>
                <h2 className="text-center text-3xl text-[#75614e]">Esse mês não tem aniversário</h2>
                <p>Nenhum cliente cadastrado faz aniversário neste mês</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3 w-full">
                {aniversariantes.map(a => {
                  const idade = getAgeFromDate(a.dt_nascimento);
                  return (
                    <li key={a.id} className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center p-3 bg-white/80 rounded shadow-sm">
                      <div>
                        <p className="text-lg font-medium text-[#4a3f35]">{a.nome}</p>
                        <p className="text-sm text-[#6b5f57]">Aniversário: {formatDayMonth(a.dt_nascimento)} {idade !== null ? `· ${idade} anos` : ''}</p>
                      </div>
                      <div className="text-sm text-[#6b5f57]">
                        {a.email ?? ''}
                      </div>
                      <div className="text-sm text-[#6b5f57]">
                        {a.celular !== null ? `Telefone: ${a.celular}` : ''}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
