

import { useEffect, useState } from 'react';
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
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Filter,
} from 'lucide-react';
import { useParams } from 'react-router';
import { getRegistrosPorData } from '@/services/registros';
import type { RegistroResponse } from '@/types/response';


const Registros = () => {
  const { empresa } = useParams<{ empresa: string }>();
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cálculo da paginação
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const registrosPaginados = registros.slice(indiceInicio, indiceFim);
  const totalPaginas = Math.ceil(registros.length / itensPorPagina);
  const [filtroData, setFiltroData] = useState(new Date().toISOString().split('T')[0]); // Data atual no formato YYYY-MM-DD
  


  useEffect(() => {
    const carregarRegistros = async () => {
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
        const dados = await getRegistrosPorData(empresa, token, filtroData);
        setRegistros(Array.isArray(dados) ? dados : []);
        } catch (err) {
          console.error('Erro ao carregar registros:', err);
          setError('Não foi possível carregar os registros. Tente novamente.');
          setRegistros([]);
        } finally {
          setLoading(false);
        }
    }
    carregarRegistros();
  }, [empresa, filtroData]);
  

  return (
    <div className="h-screen bg-gray-50 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-5 shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Registros de Ponto
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie os registros de ponto dos funcionários
          </p>
        </div>

        

        {/* Main Content */}
        <Card className="flex flex-col overflow-hidden max-h-110">
          <CardHeader className="shrink-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Últimos Registros</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Histórico completo de registros de ponto
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col px-6">
            {/* Filtros */}
            <div className="mb-4 flex gap-3 shrink-0">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                />
              </div>
              <Button variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Table */}
            {loading && (
                <div className="text-center py-10">
                  <p className="text-gray-500">Carregando registros...</p>
                </div>
            )}
              
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
            )}

            {!loading && !error && 
            (<div className="rounded-md border flex-1 overflow-y-auto overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosPaginados.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-gray-500"
                      >
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    registrosPaginados.map((registro) => {
                      
                      return (
                        <TableRow key={registro.nsr}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                {registro.funcionario
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              {registro.funcionario}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(registro.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </TableCell>
                          
                          <TableCell className="font-mono">
                            {registro.hora}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>)}

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4 shrink-0">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{indiceInicio + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(indiceFim, registros.length)}
                </span>{' '}
                de <span className="font-medium">{registros.length}</span> registros
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaAtual === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                    (pagina) => (
                      <Button
                        key={pagina}
                        variant={paginaAtual === pagina ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaginaAtual(pagina)}
                        className="w-10"
                      >
                        {pagina}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
                  }
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registros;