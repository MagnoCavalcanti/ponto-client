import KPI from "@/components/custom/kpi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users } from "lucide-react";



const Dashboard = () => {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold ">Dashboard</h2>
                <p className="text-sm font-light mb-4">Visão geral dos registros de ponto.</p>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
                {/* Linha 1: KPIs ocupando 4 colunas */}
                <KPI title="Total Funcionários" value="150" action={<Users/>}/>
                <KPI title="Total Funcionários" value="150" action={<Users/>}/>
                <KPI title="Total Funcionários" value="150" action={<Users/>}/>
                <KPI title="Total Funcionários" value="150" action={<Users/>}/>

                {/* Linha 2: Tabela ocupando 3 colunas */}
                <Card className="col-span-3 px-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>John Doe</TableCell>
                                <TableCell> Administrador</TableCell>
                                <TableCell> Ativo </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Jane Smith</TableCell>
                                <TableCell> Funcionário</TableCell>
                                <TableCell> Inativo </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table> 
                </Card>

                {/* Linha 2: Card de ações ocupando 1 coluna */}
                <Card className="py-6 h-fit">
                    <CardHeader>
                        <CardTitle>Ações rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full">Atualizar Registros</Button>
                        <Button className="w-full" variant="outline">Adicionar Dispositivo</Button>
                        <Button className="w-full" variant="outline">Configurações de Ponto</Button>
                    </CardContent>
                </Card>
            </div>
            
        </>
    );
}

export default Dashboard;