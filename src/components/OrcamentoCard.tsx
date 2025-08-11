import { useState, type MouseEventHandler } from 'react';


interface OrcamentoProps {
  id_orcamento: number;
  qtd_procedimentos: number;
  dt_criacao: string;
  valor_total: number;
  status: string;
  metodo_pag: string;
  usuario_id_tipo: number | undefined;
  onclick?: MouseEventHandler<HTMLParagraphElement>;
}

export function OrcamentoCard({
  id_orcamento,
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
    try {
      setLoadingPdf(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orcamento/${id_orcamento}/pdf`);
      if (!res.ok) throw new Error('Erro ao obter PDF');
      const { url } = await res.json();
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      alert('Não foi possível carregar o PDF.');
    } finally {
      setLoadingPdf(false);
    }
  };

  const statusInfo: Record<string, { label: string; color: string }> = {
    'Aguardando pagamento': { label: 'Aguardando pagamento', color: 'bg-yellow-500' },
    pago: { label: 'Pago', color: 'bg-green-500' }
  };
  const { label, color } = statusInfo[status] || { label: status, color: 'bg-gray-500' };





  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center bg-[#9B7F67] text-white p-4 rounded-md border border-[#9B7F67] hover:bg-[#E3DCD4] hover:text-black transition-colors">
        <span className="flex-1 text-sm sm:text-base">ID: {id_orcamento}</span>
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
          <p onClick={onclick} className="underline cursor-pointer self-end text-right sm:col-end-7 bg-[#4d3c2d] p-2 rounded-lg">
            Atualizar
          </p>
        )}
      </div>


    </>



  );
}
