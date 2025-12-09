import axiosSystem from "./axios";


export async function verificarEmpresa(empresa: string): Promise<boolean> {
    try {
        const response = await axiosSystem.get(`/empresas/${empresa}`);
        return response.status === 200;
    } catch (error: any) {
        console.log('❌ Erro ao verificar empresa:', error.response?.status, error.message);
        return false;
    }
}