import { useEffect, useState, type MouseEventHandler } from 'react';
import { useTokenStore } from '../hooks/useTokenStore';
import { useNavigate } from 'react-router';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import type { Usuario } from '../interfaces/Usuario';

interface OrcamentoProps {
  id_orcamento: number;
  qtd_procedimentos: number;
  dt_criacao: string;
  id_paciente: number;
  valor_total: number;
  status: string;
  metodo_pag: string;
  usuario_id_tipo: number | undefined;
  onclick?: MouseEventHandler<HTMLParagraphElement>;
}

export function OrcamentoCard({
  id_orcamento,
  id_paciente,
  qtd_procedimentos,
  dt_criacao,
  status,
  valor_total,
  metodo_pag,
  usuario_id_tipo,
  onclick,
}: OrcamentoProps) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const formatDate = new Date(dt_criacao).toLocaleDateString('pt-BR');

  const handleVerPdf = async () => {
    const newWin = window.open('', '_blank');

    if (newWin) {
      setLoadingPdf(true);
    } else {
      setLoadingPdf(true);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orcamento/${id_orcamento}/pdf`);
      if (!res.ok) throw new Error('Erro ao obter PDF');
      const { url } = await res.json();

      if (newWin) {
        newWin.location.href = url;
      } else {
        try {
          await navigator.clipboard.writeText(url);
          alert('O navegador bloqueou abertura automática. O link foi copiado para a área de transferência. Cole no Safari para abrir.');
        } catch (e) {
          window.prompt('Abra este link no navegador (copie e cole):', url);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar PDF:', err);
      try { newWin?.close(); } catch (e) { /* ignore */ }
      alert('Não foi possível carregar o PDF.');
    } finally {
      setLoadingPdf(false);
    }
  };


  const [usuario, setUsuario] = useState<Usuario | undefined>();
  const { token } = useTokenStore();


  useEffect(() => {
    async function pegaUsuario() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id_paciente}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const usuarioAtual = await response.json();
        setUsuario(usuarioAtual);
      } catch (err) {
        console.error(err);
      }
    }
    pegaUsuario();
  }, [token, id_paciente]);


  const navigate = useNavigate();

  async function deletarOrc() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/orcamentos/${id_orcamento}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    if (res.ok) navigate("/home");
  }

  const statusInfo: Record<string, { label: string; color: string }> = {
    'Aguardando pagamento': { label: 'Aguardando pagamento', color: 'bg-yellow-500' },
    Pago: { label: 'Pago', color: 'bg-green-500' }
  };
  const { label, color } = statusInfo[status] || { label: status, color: 'bg-gray-500' };
  const { isOpen, onOpen, onClose } = useDisclosure();
  function handleClose() {
    onClose();
  }


  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center bg-[#9B7F67] text-white p-4 rounded-md border border-[#9B7F67] hover:bg-[#E3DCD4] hover:text-black transition-colors">
        <span className="flex-1 text-sm sm:text-base">ID: {id_orcamento}</span>
        <span className="flex-1 text-sm sm:text-base">
          Paciente: {usuario?.nome}
        </span>
        <div className="flex sm:flex-1 items-center gap-3">
          <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
          <span className="text-sm whitespace-nowrap">{label}</span>
        </div>
        <span className="flex-1 text-sm sm:text-base">
          Qtd procedimentos: ({qtd_procedimentos})
        </span>
        <span className="flex-1 text-sm sm:text-base">Data: {formatDate}</span>
        <span className="flex-1 text-sm sm:text-base">
          Valor: R${valor_total.toFixed(2)}
        </span>
        <span className="flex-1 text-sm sm:text-base">Método: {metodo_pag}</span>
        <button
          onClick={handleVerPdf}
          disabled={loadingPdf}
          className="mt-2 sm:mt-0 self-end sm:self-auto text-sm underline bg-[#4d3c2d] disabled:opacity-50"
        >
          {loadingPdf ? 'Carregando...' : 'Ver PDF'}
        </button>
        {usuario_id_tipo === 1 && onclick && (
          <>
            <p onClick={onclick} className="underline cursor-pointer self-end text-right sm:col-end-7 bg-[#4d3c2d] p-2 rounded-lg">
              Atualizar
            </p>

            <button
              onClick={onOpen}
              className="mt-2 sm:mt-0 self-end sm:self-auto text-sm underline bg-[#831b14] disabled:opacity-50"
            >
              Deletar
            </button>
          </>
        )}

      </div>

      <Modal className='bg-[#e5ded8]' isOpen={isOpen} size={'2xl'} onClose={handleClose}>
        <ModalContent className='text-black max-h-[80vh] overflow-y-auto'>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar Orçamento</ModalHeader>
              <ModalBody className="flex h-full flex-col text-center gap-10 items-center p-2">
                <p className='text-xl'>Tem certeza que deseja deletar o orçamento {id_orcamento}</p>
                <div className='flex w-full justify-center items-center gap-10'>
                  <button
                    onClick={deletarOrc}
                    disabled={loadingPdf}
                    className="mt-2 sm:mt-0 self-end sm:self-auto text-md  text-white bg-[#4d3c2d] disabled:opacity-50"
                  >
                    Sim
                  </button>
                  <button
                    onClick={handleClose}
                    className="mt-2 sm:mt-0 self-end sm:self-auto text-md  text-white bg-[#4d3c2d] disabled:opacity-50"
                  >
                    Não
                  </button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>



  );
}
