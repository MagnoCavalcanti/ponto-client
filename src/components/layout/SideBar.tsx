import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Calendar, Clock4, LayoutDashboard, Users } from "lucide-react";


const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { empresa } = location.pathname.split("/").length > 2 ? { empresa: location.pathname.split("/")[1] } : { empresa: "" };

    const menuItems = [
        {
        title: "Dashboard",
        href: `/${empresa}/dashboard`,
        active: location.pathname === `/${empresa}/dashboard`,
        icon: <LayoutDashboard />
        },
        {
        title: "Funcionários",
        href: `/${empresa}/funcionarios`,
        active: location.pathname === `/${empresa}/funcionarios` || location.pathname.startsWith(`/${empresa}/funcionarios/`),
        icon: <Users />
        },
        {
        title: "Registros de Ponto",
        href: `/${empresa}/registros`,
        active: location.pathname === `/${empresa}/registros`,
        icon: <Calendar />
        },
        {
        title: "Dispositivos REP",
        href: `/${empresa}/dispositivos`,
        active: location.pathname === `/${empresa}/dispositivos`,
        icon: <Clock4 />
        }
    ];

    return (
        <div className="pb-12 h-full">
        <div className="space-y-4 py-4">
            <div className="px-3 py-2">
            <div className="space-y-1 ">
                {menuItems.map((item, index) => (
                <Button
                    key={index}
                    variant={item.active ? "secondary" : "ghost"}
                    className={cn(
                    "w-full justify-start",
                    item.active && "bg-[#171717] text-white hover:bg-[#171717]"
                    )}
                    onClick={() => navigate(item.href)}
                >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
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