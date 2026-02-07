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

interface RegistroResponse {
    nsr: number;
    cpf_funcionario: string;
    funcionario: string;
    empresa_id: number;
    relogio_id: number;
    data: string;
    hora: string;
    tipo: 'E' | 'S';
}

export type { FuncionarioResponse, DispositivoResponse, RegistroResponse };