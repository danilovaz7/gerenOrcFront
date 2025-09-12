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

    setLoadingPdf(true);
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
      {/* GRID container: min-w-0 é importante para permitir truncamento dentro do grid */}
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-2 items-center bg-[#9B7F67] text-white p-4 rounded-md border border-[#9B7F67] hover:bg-[#E3DCD4] hover:text-black transition-colors min-w-0">
        {/* ID */}
        <span className="sm:col-span-1 text-sm sm:text-base truncate min-w-0">
          <strong>ID:</strong> {id_orcamento}
        </span>

        {/* Paciente — ocupa mais espaço em sm */}
        <span className="sm:col-span-3 text-sm sm:text-base truncate min-w-0">
          <strong>Paciente:</strong> <span className="truncate">{usuario?.nome ?? '—'}</span>
        </span>

        {/* Status */}
        <div className="sm:col-span-2 flex items-center gap-3">
          <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
          <span className="text-sm whitespace-nowrap truncate">{label}</span>
        </div>

        {/* Qtd procedimentos */}
        <span className="sm:col-span-1 text-sm sm:text-base truncate min-w-0">
          <strong>Qtd:</strong> ({qtd_procedimentos})
        </span>

        {/* Data */}
        <span className="sm:col-span-1 text-sm sm:text-base truncate min-w-0">
          <strong>Data:</strong> {formatDate}
        </span>

        {/* Valor e método (em telas pequenas podem quebrar em linhas separadas) */}
        <span className="sm:col-span-1 text-sm sm:text-base truncate min-w-0">
          <strong>Valor:</strong> R${valor_total.toFixed(2)}
        </span>

        {/* Método de pagamento (ocupa 1 coluna, mas em sm a distribuição fica melhor) */}
        <span className="sm:col-span-1 text-sm sm:text-base truncate min-w-0">
          <strong>Método:</strong> {metodo_pag}
        </span>

        {/* Botões — em sm ocupa 1 coluna à direita (alinha à direita) */}
        <div className="sm:col-span-1 flex gap-2 justify-end items-center w-full">
          <button
            onClick={handleVerPdf}
            disabled={loadingPdf}
            className="text-sm underline bg-[#4d3c2d] disabled:opacity-50 px-2 py-1 rounded"
          >
            {loadingPdf ? 'Carregando...' : 'Ver PDF'}
          </button>

          {usuario_id_tipo === 1 && onclick && (
            <>
              <p onClick={onclick} className="underline cursor-pointer text-right bg-[#4d3c2d] p-2 rounded-lg whitespace-nowrap">
                Atualizar
              </p>

              <button
                onClick={onOpen}
                className="text-sm underline bg-[#831b14] disabled:opacity-50 px-2 py-1 rounded"
              >
                Deletar
              </button>
            </>
          )}
        </div>
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
