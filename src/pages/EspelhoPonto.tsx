import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
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
  ArrowLeft, 
  Calendar, 
  Clock, 
  Download, 
  User,
  FileText 
} from 'lucide-react';
import { getRegistrosPorFuncionario } from '@/services/registros';
import { getFuncionarios } from '@/services/funcionario';
import type { RegistroResponse, FuncionarioResponse } from '@/types/response';
import { formatarCPF } from '@/lib/utils';
import DialogCustom from '@/components/custom/Dialog';

interface RegistroAgrupado {
  data: string;
  registros: RegistroResponse[];
  entrada?: string;
  saida?: string;
  horasTrabalhadas?: string;
}

export default function EspelhoPonto() {
  const { empresa, funcionarioId } = useParams<{ empresa: string; funcionarioId: string }>();
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState<FuncionarioResponse | null>(null);
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [registrosAgrupados, setRegistrosAgrupados] = useState<RegistroAgrupado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<RegistroAgrupado | null>(null);

  // Filtros de período
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const [dataInicio, setDataInicio] = useState(primeiroDiaMes.toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(hoje.toISOString().split('T')[0]);

  useEffect(() => {
    const carregarDados = async () => {
      if (!empresa || !funcionarioId) return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Token de autenticação não encontrado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar dados do funcionário
        const todosFuncionarios = await getFuncionarios(empresa, token);
        const funcEncontrado = todosFuncionarios.find(
          (f) => f.id.toString() === funcionarioId
        );

        if (!funcEncontrado) {
          setError('Funcionário não encontrado.');
          setLoading(false);
          return;
        }

        setFuncionario(funcEncontrado);

        // Buscar registros do funcionário
        const registrosFuncionario = await getRegistrosPorFuncionario(
          empresa,
          token,
          funcEncontrado.cpf,
          dataInicio,
          dataFim
        );

        setRegistros(registrosFuncionario);
        agruparRegistrosPorData(registrosFuncionario);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar os dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [empresa, funcionarioId, dataInicio, dataFim]);

  const agruparRegistrosPorData = (regs: RegistroResponse[]) => {
    const grupos: { [key: string]: RegistroResponse[] } = {};

    regs.forEach((registro) => {
      const data = registro.data;
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(registro);
    });

    const agrupados: RegistroAgrupado[] = Object.keys(grupos)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((data) => {
        const registrosDia = grupos[data].sort((a, b) => a.hora.localeCompare(b.hora));
        const entrada = registrosDia.find((r) => r.tipo === 'E')?.hora;
        const saida = registrosDia.reverse().find((r) => r.tipo === 'S')?.hora;
        
        let horasTrabalhadas: string | undefined;
        if (entrada && saida) {
          const [hE, mE] = entrada.split(':').map(Number);
          const [hS, mS] = saida.split(':').map(Number);
          const minutosEntrada = hE * 60 + mE;
          const minutosSaida = hS * 60 + mS;
          const diferencaMinutos = minutosSaida - minutosEntrada;
          const horas = Math.floor(diferencaMinutos / 60);
          const minutos = diferencaMinutos % 60;
          horasTrabalhadas = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
        }

        return {
          data,
          registros: registrosDia,
          entrada,
          saida,
          horasTrabalhadas,
        };
      });

    setRegistrosAgrupados(agrupados);
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDiaSemana = (data: string) => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const date = new Date(data + 'T00:00:00');
    return diasSemana[date.getDay()];
  };

  const calcularTotalHoras = () => {
    let totalMinutos = 0;
    registrosAgrupados.forEach((dia) => {
      if (dia.horasTrabalhadas) {
        const [h, m] = dia.horasTrabalhadas.split(':').map(Number);
        totalMinutos += h * 60 + m;
      }
    });
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  };

  const handleAbrirDialog = (dia: RegistroAgrupado) => {
    setDiaSelecionado(dia);
    setOpen(true);
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/${empresa}/funcionarios`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Funcionários
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Espelho de Ponto
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize o histórico completo de registros do funcionário
          </p>
        </div>

        {/* Loading e Error States */}
        {loading && (
          <Card>
            <CardContent className="py-10">
              <p className="text-center text-gray-500">Carregando dados...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && funcionario && (
          <>
            {/* Card de Informações do Funcionário */}
            <Card className="mb-6 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Funcionário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nome</p>
                    <p className="font-medium">{funcionario.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">CPF</p>
                    <p className="font-medium">{formatarCPF(funcionario.cpf)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Matrícula</p>
                    <p className="font-medium">{funcionario.matricula}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cargo</p>
                    <p className="font-medium">{funcionario.cargo || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total de Registros</p>
                      <p className="text-2xl font-bold">{registros.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dias Trabalhados</p>
                      <p className="text-2xl font-bold">{registrosAgrupados.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total de Horas</p>
                      <p className="text-2xl font-bold">{calcularTotalHoras()}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card de Registros */}
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Registros de Ponto</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Histórico detalhado de entradas e saídas
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros de Período */}
                <div className="mb-6 flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Início
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Fim
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Tabela de Registros */}
                <div className="rounded-md border overflow-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Dia</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Saída</TableHead>
                        <TableHead>Horas Trabalhadas</TableHead>
                        <TableHead className="text-center">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrosAgrupados.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-10 text-gray-500"
                          >
                            Nenhum registro encontrado no período selecionado
                          </TableCell>
                        </TableRow>
                      ) : (
                        registrosAgrupados.map((dia, index) => (
                          <TableRow 
                            key={index} 
                            onClick={() => handleAbrirDialog(dia)}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {formatarData(dia.data)}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {formatarDiaSemana(dia.data)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {dia.entrada ? (
                                <span className="text-green-600 font-medium">
                                  {dia.entrada}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {dia.saida ? (
                                <span className="text-red-600 font-medium">
                                  {dia.saida}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {dia.horasTrabalhadas ? (
                                <span className="font-semibold text-blue-600">
                                  {dia.horasTrabalhadas}h
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-sm text-gray-500">
                                {dia.registros.length} registro(s)
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Dialog Dinâmico */}
      <DialogCustom open={open} setOpen={setOpen} dia={diaSelecionado} />
    </div>
  );
}
