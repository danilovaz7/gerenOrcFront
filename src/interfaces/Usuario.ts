export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  dt_nascimento: string;
  rg: string;
  cpf: string;
  id_tipo_usuario: number;
  estado_civil: string;
  sexo: string;
  endereco: string;
  num_endereco: string;
  complemento: string;
  cidade: string;
  bairro: string;
  cep: string;
  naturalidade: string;
  nacionalidade: string;
  raca: string;
  telefone: string;
  celular: string;
  profissao: string;
  local_trabalho: string;
  instagram: string;
  facebook: string;
  ic_ativo: boolean;
}