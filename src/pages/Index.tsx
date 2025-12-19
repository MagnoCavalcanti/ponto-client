import { useLocation, useParams } from "react-router"
import ErrorPage from "./ErrorPage"
import Header from "@/components/layout/Header"
import SideBar from "@/components/layout/SideBar"
import Dashboard from "./Dashboard"
import Funcionarios from "./Funcionarios"
import Registros from "./Registros"
import { Settings } from "lucide-react"
import Dispositivos from "./Dispositivos"


const Index = () => {
    const { empresa } = useParams()
    const location = useLocation()
    

    const renderPage = () => {
        switch(location.pathname){
            case `/${empresa}/dashboard`:
                  return <Dashboard />;

            case `/${empresa}/funcionarios`:
                  return <Funcionarios />;
                  
            case `/${empresa}/registros`:
                  return <Registros />;
            
            case `/${empresa}/dispositivos`:
                  return <Dispositivos />;

            case `/${empresa}/settings`:
                  return <Settings />;

            default:
                return <ErrorPage/>//retirar depois, já que é redundante
        }
    }
    return (
    <div className="min-h-screen min-w-screen bg-background ">
      <Header />
      <div className="flex">
        <aside className="w-48 bg-card border-r border-border shadow-soft">
          <SideBar />
        </aside>
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default Index;