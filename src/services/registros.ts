import type { RegistroResponse } from "@/types/response";
import axiosSystem from "./axios";

const getRegistrosPorData = async (empresa: string, token: string, data: string): Promise<RegistroResponse[]> => {
    console.log(data);
    
    const response = await axiosSystem.get<{ registros: RegistroResponse[] }>(`/${empresa}/ponto/data/${data}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Resposta da API de registros por data:', response.data);
    return response.data.registros;
}

const getRegistrosPorFuncionario = async (
    empresa: string, 
    token: string, 
    cpf: string,
    dataInicio?: string,
    dataFim?: string
): Promise<RegistroResponse[]> => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    const queryString = params.toString();
    const url = `/${empresa}/ponto/funcionario/${cpf}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosSystem.get<{ registros: RegistroResponse[] }>(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data.registros;
}

export { getRegistrosPorData, getRegistrosPorFuncionario };