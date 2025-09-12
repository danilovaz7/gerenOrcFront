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
      if (newWin) newWin.location.href = url;
      else {
        try {
          await navigator.clipboard.writeText(url);
          alert('O navegador bloqueou abertura automática. Link copiado para a área de transferência.');
        } catch {
          window.prompt('Abra este link no navegador (copie e cole):', url);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar PDF:', err);
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
  function handleClose() { onClose(); }

  return (
    <>
      {/* Responsive:
           - mobile (default): coluna (vertical) com itens full-width
           - sm+ (telas grandes): linha única igual à versão aprovada
      */}
      <div className="flex flex-col justify-between sm:flex-row sm:flex-nowrap items-start sm:items-center gap-3 sm:gap-4 bg-[#9B7F67] text-base p-4 rounded-md border border-[#9B7F67] hover:bg-[#E3DCD4] hover:text-black transition-colors">
        {/* Linha/Item: esquerda (ID). No mobile ocupa full width; no desktop não encolhe */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-2">
          <span className="text-base sm:flex-shrink-0 min-w-[70px]">
            <strong>ID:</strong> {id_orcamento}
          </span>

          {/* Em mobile fazemos o paciente na mesma "linha" do ID (para economizar espaço),
              mas ele também pode aparecer em linha separada. Aqui mantemos responsivo. */}
          <span className="text-base sm:flex-shrink-0 sm:min-w-[140px] sm:max-w-[240px] truncate sm:ml-2">
            <strong>Paciente:</strong>{' '}
            <span className="truncate">{usuario?.nome ?? '—'}</span>
          </span>
        </div>

        {/* Em telas pequenas cada bloco abaixo ocupa full width (w-full). Em sm volta a ser inline */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="flex items-center gap-2 text-base whitespace-nowrap">
            <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
            <span className="truncate">{label}</span>
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-base whitespace-nowrap">
            <strong>Qtd:</strong> ({qtd_procedimentos})
          </span>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-base whitespace-nowrap">
            <strong>Data:</strong> {formatDate}
          </span>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-base whitespace-nowrap">
            <strong>Valor:</strong> R${valor_total.toFixed(2)}
          </span>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-base whitespace-nowrap">
            <strong>Método:</strong> {metodo_pag}
          </span>
        </div>

        {/* Botões: em mobile ficam full-width (stacked horizontalmente com wrap),
            em desktop ficam à direita sem encolher */}
        <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap gap-2 justify-start sm:justify-end items-center">
          <button
            onClick={handleVerPdf}
            disabled={loadingPdf}
            className="w-full sm:w-auto text-base underline bg-[#4d3c2d] disabled:opacity-50 px-3 py-1 rounded"
          >
            {loadingPdf ? 'Carregando...' : 'Ver PDF'}
          </button>

          {usuario_id_tipo === 1 && onclick && (
            <>
              <p
                onClick={onclick}
                className="w-full sm:w-auto underline cursor-pointer text-base bg-[#4d3c2d] p-2 rounded-lg text-center sm:text-left"
              >
                Atualizar
              </p>

              <button
                onClick={onOpen}
                className="w-full sm:w-auto text-base underline bg-[#831b14] disabled:opacity-50 px-3 py-1 rounded"
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
