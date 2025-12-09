import axiosSystem from "./axios";
import type { LoginRequest } from "../types/requests";

export const reqLogin = async (empresa: string, loginData: LoginRequest) => {
    try{
        const response = await axiosSystem.post(
            `/auth/${empresa}/login`, 
            loginData,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );
        return response.data;
    }catch(error: any){
        // Trate o erro aqui, se necessário
        const detail = error?.response?.data?.detail || error?.response?.data || error.message;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
}
