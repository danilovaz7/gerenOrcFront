export interface Orcamento {
  id: number;
  usuario_id: number;
  forma_pagamento: string;
  status:string;
  validade: string;
  valor_total: number;
  arquivo_pdf: string;
  procedimentosCount: number;
  createdAt: string;
  updatedAt: string;
}
