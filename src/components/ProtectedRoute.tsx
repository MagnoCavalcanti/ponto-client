import { useEffect } from "react"
import { useParams } from "react-router"
import { useNavigate } from "react-router"
import type { ReactNode } from "react"


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { empresa } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
           navigate(`/${empresa}`); 
        } 
    }, [empresa]);
    return <>{children}</>;
}

export default ProtectedRoute;