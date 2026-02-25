
interface LoginRequest {
    username: string;
    password: string;
}

interface RegistroRequest {
    cpf_funcionario: string;
    empresa_id: number;
    relogio_id: number;
    data: string;
    hora: string;
    tipo: 'E' | 'S';
}


export type { LoginRequest, RegistroRequest };