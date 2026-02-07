interface FuncionarioResponse {
    id: number;
    nome: string;
    cargo?: string;
    grupo?: string;
    matricula: number;
    empresaId: number;
    cpf: string;
}

interface DispositivoResponse {
    id: number;
    nome: string;
    user: string;
    password: string;
    ip: string;
    porta: number;
    empresaId: number;
}

export type { FuncionarioResponse, DispositivoResponse };