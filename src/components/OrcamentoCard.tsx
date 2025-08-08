import { useState } from 'react';

interface OrcamentoProps {
  id_orcamento: number;
  qtd_procedimentos: number;
  dt_criacao: string;
  valor_total: number;
  metodo_pag: string;
}

export function OrcamentoCard({
  id_orcamento,
  qtd_procedimentos,
  dt_criacao,
  valor_total,
  metodo_pag,
}: OrcamentoProps) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const formatDate = new Date(dt_criacao).toLocaleDateString('pt-BR');

  const handleVerPdf = async () => {
    try {
      setLoadingPdf(true);
      const res = await fetch( `${import.meta.env.VITE_API_URL}/orcamento/${id_orcamento}/pdf`);
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

  return (
    <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center bg-[#9B7F67] text-white p-4 rounded-md border border-[#9B7F67] hover:bg-[#E3DCD4] hover:text-black transition-colors">
      <span className="flex-1 text-sm sm:text-base">ID: {id_orcamento}</span>
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
    </div>
  );
}
