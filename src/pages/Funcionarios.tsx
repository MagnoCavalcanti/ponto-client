import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, FileDown, Plus, Search, SquarePen } from 'lucide-react';

// Tipos
interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: string;
}

export default function Funcionarios() {
  const [funcionarios] = useState<Funcionario[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      cargo: 'Desenvolvedor Senior',
      departamento: 'Tecnologia',
      status: 'ativo',
      dataAdmissao: '2022-01-15',
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      cargo: 'Gerente de Projetos',
      departamento: 'Gestão',
      status: 'ativo',
      dataAdmissao: '2021-03-10',
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      cargo: 'Designer UX',
      departamento: 'Design',
      status: 'ativo',
      dataAdmissao: '2023-05-20',
    },
    {
      id: '4',
      nome: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      cargo: 'Analista de RH',
      departamento: 'Recursos Humanos',
      status: 'inativo',
      dataAdmissao: '2020-07-08',
    },
  ]);

  const [filtro, setFiltro] = useState('');

  const funcionariosFiltrados = funcionarios.filter(
    (func) =>
      func.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      func.email.toLowerCase().includes(filtro.toLowerCase()) ||
      func.cargo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 hidden-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciamento de Funcionários
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie e visualize informações dos funcionários da empresa
          </p>
        </div>

        

        {/* Main Content */}
        <Card className="shadow-soft ">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Lista de Funcionários</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Visualize e gerencie todos os funcionários cadastrados
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <FileDown />
                  Exportar
                </Button>
                <Button>
                  <Plus />
                  Novo Funcionário
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                   type="text"
                  placeholder="Buscar funcionário..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-auto max-h-68">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Data de Admissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        Nenhum funcionário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    funcionariosFiltrados.map((funcionario) => (
                      <TableRow key={funcionario.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {funcionario.nome
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            {funcionario.nome}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {funcionario.email}
                        </TableCell>
                        <TableCell>{funcionario.cargo}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {funcionario.departamento}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            funcionario.dataAdmissao
                          ).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              funcionario.status === 'ativo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {funcionario.status === 'ativo'
                              ? 'Ativo'
                              : 'Inativo'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye></Eye>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <SquarePen />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
