export interface Foto {
  id: number;
  key?: string;        // s3_key do banco — pode vir como `s3_key` no backend, ajuste se necessário
  url: string;         // url assinada
  ordem?: number;
  ativo?: boolean;
  createdAt?: string;  // se o backend enviar timestamps
  updatedAt?: string;
}