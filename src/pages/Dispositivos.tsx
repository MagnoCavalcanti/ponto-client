

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
import { Monitor, Wifi } from 'lucide-react';
import { getDispositivos } from '@/services/dispositivos';
import type { DispositivoResponse } from '@/types/response';

const Dispositivos = () => {
  const { empresa } = useParams();
  const [dispositivos, setDispositivos] = useState<DispositivoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispositivoSelecionado, setDispositivoSelecionado] =
    useState<DispositivoResponse | null>(null);

  useEffect(() => {
    const carregarDispositivos = async () => {
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
        const dados = await getDispositivos(empresa, token);
        setDispositivos(Array.isArray(dados) ? dados : []);
      } catch (err) {
        console.error('Erro ao carregar dispositivos:', err);
        setError('Não foi possível carregar os dispositivos. Tente novamente.');
        setDispositivos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarDispositivos();
  }, [empresa]);

  return (
    <div className="h-screen bg-gray-50 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="mb-5 shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Dispositivos REP
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie e monitore os dispositivos de registro de ponto
          </p>
        </div>

        

        {/* Main Content - Grid Layout */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden max-h-110 h-110"
        >
          {/* Tabela de Dispositivos */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            <CardHeader className="shrink-0">
              <CardTitle>Lista de Dispositivos</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Clique em um dispositivo para ver detalhes
              </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col p-6">
              {loading && (
                <div className="text-center py-10">
                  <p className="text-gray-500">Carregando dispositivos...</p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {!loading && !error && (
              <div className="rounded-md border flex-1 overflow-y-auto overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Porta</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dispositivos.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-10 text-gray-500"
                        >
                          Nenhum dispositivo encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      dispositivos.map((dispositivo) => (
                        <TableRow
                          key={dispositivo.id}
                          onClick={() => setDispositivoSelecionado(dispositivo)}
                          className={`cursor-pointer hover:bg-gray-50 ${
                            dispositivoSelecionado?.id === dispositivo.id
                              ? 'bg-blue-50'
                              : ''
                          }`}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Monitor className="h-8 w-8 text-blue-600" />
                              <div>
                                <div className="font-semibold">
                                  {dispositivo.nome}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {dispositivo.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{dispositivo.ip}</TableCell>
                          <TableCell>{dispositivo.porta}</TableCell>
                          <TableCell>{dispositivo.user}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Informações */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="shrink-0">
              <CardTitle>Informações do Dispositivo</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              {!dispositivoSelecionado ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Monitor className="h-16 w-16 mb-4" />
                  <p className="text-center">
                    Selecione um dispositivo na tabela para ver os detalhes
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Informações Gerais */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Informações Gerais
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">ID</label>
                        <p className="font-medium">
                          {dispositivoSelecionado.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Nome</label>
                        <p className="font-medium">
                          {dispositivoSelecionado.nome}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Usuário</label>
                        <p className="font-medium">
                          {dispositivoSelecionado.user}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações de Conexão */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Configurações de Conexão
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">
                          Endereço IP
                        </label>
                        <p className="font-medium font-mono">
                          {dispositivoSelecionado.ip}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Porta
                        </label>
                        <p className="font-medium">
                          {dispositivoSelecionado.porta}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Senha
                        </label>
                        <p className="font-medium font-mono text-gray-400">
                          {dispositivoSelecionado.password ? '•'.repeat(dispositivoSelecionado.password.length) : '••••••'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="space-y-2 pt-4">
                    <Button className="w-full">
                      <Monitor className="h-4 w-4 mr-2" />
                      Configurar Dispositivo
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Wifi className="h-4 w-4 mr-2" />
                      Testar Conexão
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dispositivos;