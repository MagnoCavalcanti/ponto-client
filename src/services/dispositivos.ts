import type { DispositivoResponse } from "@/types/response";
import axiosSystem from "./axios";

const getDispositivos = async (empresa: string, token: string): Promise<DispositivoResponse[]> => {
    const response = await axiosSystem.get<{ relogios: DispositivoResponse[] }>(`/${empresa}/relogios`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Resposta da API de dispositivos:', response.data);
    return response.data.relogios;
}

export { getDispositivos };