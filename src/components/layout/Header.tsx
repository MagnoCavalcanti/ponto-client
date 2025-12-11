import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { CircleUserRound, LogOut, Settings } from "lucide-react";

const Header = () => {
        return (
                <header className="px-15 py-4 border-b-gray-100 border-b-2 flex flex-row items-center justify-between">
                        <h1 className="text-2xl font-bold">Sistema Ponto</h1>

                        <div>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem >
                                        <NavigationMenuTrigger className="flex flex-row items-center gap-3">
                                            <CircleUserRound /> MeuUsuario
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <button type="button" className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex flex-row items-center gap-3"><Settings size={16} />Configuração</button>
                                            <button type="button" className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex flex-row items-center gap-3"><LogOut size={18}/> Sair</button>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                </header>
        );
}

export default Header;