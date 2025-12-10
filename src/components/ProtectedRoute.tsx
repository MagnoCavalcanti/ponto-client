import { useEffect } from "react"
import { useParams } from "react-router"
import { useNavigate } from "react-router"
import type { ReactNode } from "react"
import { reqVerifyToken } from "@/services/auth"


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { empresa } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
           navigate(`/${empresa}`); 
        } 
        const TokenIsValid = async () =>{
            const isValid = await reqVerifyToken(token!);
            if(!isValid){
                navigate(`/${empresa}`);
                token && localStorage.removeItem('accessToken');
            }
        }
        TokenIsValid();

    }, [empresa]);
    return <>{children}</>;
}

export default ProtectedRoute;