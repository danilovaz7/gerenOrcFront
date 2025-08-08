export interface Procedimento {
    id: number;
    dt_realizacao: string;
    dt_ultimo_retorno: string;
    foto_antes: string;
    foto_depois: string;
    usuario_id: number;
    orcamento_id: number;
    nome_procedimento: string;
    obs_procedimento: string;
    num_retorno: number;
    status_retorno: string;
    valor_procedimento: number;
    orcamento: {
        usuario: {
            nome:string;
        }
    } 
    createdAt: string;
    updatedAt: string;
}
