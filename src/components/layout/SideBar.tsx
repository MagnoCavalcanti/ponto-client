import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";


const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { empresa } = location.pathname.split("/").length > 2 ? { empresa: location.pathname.split("/")[1] } : { empresa: "" };

    const menuItems = [
        {
        title: "Dashboard",
        href: "/dashboard",
        active: location.pathname === `/${empresa}/dashboard`
        },
        {
        title: "Funcionários",
        href: "/funcionarios",
        active: location.pathname === `/${empresa}/funcionarios` || location.pathname.startsWith(`/${empresa}/funcionarios/`)
        },
        {
        title: "Registros de Ponto",
        href: "/registros",
        active: location.pathname === `/${empresa}/registros`
        },
        {
        title: "Dispositivos REP",
        href: "/dispositivos",
        active: location.pathname === `/${empresa}/dispositivos`
        }
    ];

    return (
        <div className={cn("pb-12 min-h-screen")}>
        <div className="space-y-4 py-4">
            <div className="px-3 py-2">
            <div className="space-y-1">
                {menuItems.map((item, index) => (
                <Button
                    key={index}
                    variant={item.active ? "secondary" : "ghost"}
                    className={cn(
                    "w-full justify-start",
                    item.active && "bg-gradient-primary text-primary-foreground hover:bg-gradient-primary"
                    )}
                    onClick={() => navigate(item.href)}
                >
                    {item.title}
                </Button>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
};

export default SideBar;