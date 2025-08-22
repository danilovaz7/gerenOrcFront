import type { Foto } from './Foto.ts';

export interface Procedimento {
  id: number;
  dt_realizacao: string;
  dt_ultimo_retorno: string;
  fotos: Foto[];                // <-- aqui
  usuario_id: number;
  orcamento_id: number;
  nome_procedimento: string;
  obs_procedimento: string;
  num_retorno: number;
  status_retorno: string;
  valor_procedimento: number;
  orcamento: {
    usuario: {
      nome: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}