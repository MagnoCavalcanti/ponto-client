import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChartPie, Clock, Users } from "lucide-react"
import { useState } from "react"
import { reqLogin } from "@/services/auth"
import { useNavigate, useParams } from "react-router"




const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const { empresa } = useParams()
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await reqLogin(empresa || '', { username: username, password: password });
            
            localStorage.setItem('accessToken', token.access_token);

            navigate(`/${empresa}/dashboard`);

        } catch (error: any) {
            setErrorMessage(error.message); 
        }
    }

    return (
        <main id="login-page" className="grid grid-cols-2 h-screen w-screen">
            <section id="left" className="flex flex-col justify-center items-start gap-6 px-25">

                <div id="brand"> 
                    {/* Coloque aqui o logo da empresa ou do sistema */}
                </div>

                <div id="title">
                    <h1 className="text-2xl font-semibold">Bem-vindo!</h1>
                    <p className="text-sm">Entre com suas credenciais para acessar o sistema</p>
                </div>

                <form method="post" action="" className="text-base w-full gap-3 flex flex-col" onSubmit={handleLogin}>
                    {errorMessage && <div className="text-red-500 text-sm bg-red-200 p-2 rounded text-center border border-red-500 w-9/10">{errorMessage}</div>}
                    <div className="flex flex-col gap-2 text-sm font-semibold">
                        <label htmlFor="username">Usuário</label>
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuário" className="w-9/10 h-10 border-2 border-gray pl-4"/>
                    </div>
                    <div className="flex flex-col gap-2 text-sm font-semibold">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" value={password}   onChange={(e) => setPassword(e.target.value)} placeholder="senha" className="w-9/10 h-10 border-2 border-gray pl-4"/>
                    </div>
                    <div id="row-actions" className="flex items-center gap-2 mt-2">
                        <Checkbox id="remember-me" className="border-black"/>
                        <Label htmlFor="remember-me">Lembrar-me</Label>
                    </div>
                    <button type="submit" className="mt-4 bg-[#000000] text-white px-4 py-2 rounded w-9/10">Entrar</button>
                </form>
                
            </section>
            <section id="right" className="bg-[#111828] text-white flex flex-col justify-center items-start gap-4 pl-35">
                <div className="text-white flex gap-4">
                    <div className="bg-white h-10 w-10 flex items-center justify-center"><ChartPie color="#000" /></div>
                    <div>
                        <h3 className="text-base font-semibold">Dashboard Completo</h3>
                        <p className="text-sm font-thin text-[#9CA3AF]">Visualize todos os dados importantes</p>
                    </div>
                </div>
                <div className="text-white flex gap-4">
                    <div className="bg-white h-10 w-10 flex items-center justify-center"><Users absoluteStrokeWidth color="#000"/></div>
                    <div>
                        <h3 className="text-base font-semibold">Gestão de Equipe</h3>
                        <p className="text-sm font-thin text-[#9CA3AF]">Controle completo dos horários dos funcionários</p>
                    </div>
                </div>
                <div className="text-white flex gap-4">
                    <div className="bg-white h-10 w-10 flex items-center justify-center"><Clock absoluteStrokeWidth color="#000" /></div>
                    <div>
                        <h3 className="text-base font-semibold">Gerência de Registros</h3>
                        <p className="text-sm font-thin text-[#9CA3AF]">Gerencie todos os registros de ponto com facilidade</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Login