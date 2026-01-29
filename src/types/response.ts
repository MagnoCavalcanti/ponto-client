interface FuncionarioResponse {
    id: number;
    nome: string;
    cargo?: string;
    grupo?: string;
    matricula: number;
    empresaId: number;
    cpf: string;
}

export type { FuncionarioResponse };