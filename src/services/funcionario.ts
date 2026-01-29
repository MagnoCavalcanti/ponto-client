import axiosSystem from "./axios";
import type { FuncionarioResponse } from "../types/response";

const getFuncionarios = async (empresa: string, token: string): Promise<FuncionarioResponse[]> => {
    const response = await axiosSystem.get<FuncionarioResponse[]>(`/${empresa}/funcionarios`, {
        
        headers: { Authorization: `Bearer ${token}` },
            
    });
    return response.data;
}

export { getFuncionarios };