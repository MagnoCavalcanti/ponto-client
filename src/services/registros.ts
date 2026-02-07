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

export { getRegistrosPorData };