import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
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
import { getFuncionarios } from '@/services/funcionario';
import type { FuncionarioResponse } from '@/types/response';
import { formatarCPF } from '@/lib/utils';

export default function Funcionarios() {
  const { empresa } = useParams();
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponse[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarFuncionarios = async () => {
      if (!empresa) return;
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Token de autenticação não encontrado.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const dados = await getFuncionarios(empresa, token);
        setFuncionarios(dados);
      } catch (err) {
        console.error('Erro ao carregar funcionários:', err);
        setError('Não foi possível carregar os funcionários. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarFuncionarios();
  }, [empresa]);

  const funcionariosFiltrados = funcionarios.filter(
    (func) =>
      func.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      func.cpf.toLowerCase().includes(filtro.toLowerCase()) ||
      (func.cargo && func.cargo.toLowerCase().includes(filtro.toLowerCase())) ||
      func.matricula.toString().includes(filtro)
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
            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-10">
                <p className="text-gray-500">Carregando funcionários...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
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
                    <TableHead>CPF</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
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
                          {formatarCPF(funcionario.cpf)}
                        </TableCell>
                        <TableCell>{funcionario.matricula}</TableCell>
                        <TableCell>
                          {funcionario.cargo || '-'}
                        </TableCell>
                        <TableCell>
                          {funcionario.grupo ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {funcionario.grupo}
                            </span>
                          ) : (
                            '-'
                          )}
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
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
