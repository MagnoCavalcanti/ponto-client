

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
import { Monitor, Wifi, WifiOff, MapPin, Calendar } from 'lucide-react';

// Tipos
interface Dispositivo {
  id: string;
  nome: string;
  numeroSerie: string;
  modelo: string;
  localizacao: string;
  status: 'online' | 'offline';
  ultimaSincronizacao: string;
  versaoFirmware: string;
  ip: string;
  registrosHoje: number;
}

const Dispositivos = () => {
  const [dispositivos] = useState<Dispositivo[]>([
    {
      id: '1',
      nome: 'REP - Entrada Principal',
      numeroSerie: 'REP-2024-001',
      modelo: 'REP Pro 3000',
      localizacao: 'Recepção - 1º Andar',
      status: 'online',
      ultimaSincronizacao: '2024-12-19T10:30:00',
      versaoFirmware: 'v2.5.1',
      ip: '192.168.1.100',
      registrosHoje: 45,
    },
    {
      id: '2',
      nome: 'REP - Departamento TI',
      numeroSerie: 'REP-2024-002',
      modelo: 'REP Pro 3000',
      localizacao: 'TI - 2º Andar',
      status: 'online',
      ultimaSincronizacao: '2024-12-19T10:28:00',
      versaoFirmware: 'v2.5.1',
      ip: '192.168.1.101',
      registrosHoje: 12,
    },
    {
      id: '3',
      nome: 'REP - Produção',
      numeroSerie: 'REP-2024-003',
      modelo: 'REP Pro 2500',
      localizacao: 'Galpão - Térreo',
      status: 'online',
      ultimaSincronizacao: '2024-12-19T10:25:00',
      versaoFirmware: 'v2.4.8',
      ip: '192.168.1.102',
      registrosHoje: 38,
    },
    {
      id: '4',
      nome: 'REP - RH',
      numeroSerie: 'REP-2024-004',
      modelo: 'REP Pro 3000',
      localizacao: 'RH - 3º Andar',
      status: 'offline',
      ultimaSincronizacao: '2024-12-19T08:15:00',
      versaoFirmware: 'v2.5.0',
      ip: '192.168.1.103',
      registrosHoje: 0,
    },
  ]);

  const [dispositivoSelecionado, setDispositivoSelecionado] =
    useState<Dispositivo | null>(null);

  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

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
              <div className="rounded-md border flex-1 overflow-y-auto overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registros Hoje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dispositivos.map((dispositivo) => (
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
                                {dispositivo.numeroSerie}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{dispositivo.modelo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {dispositivo.localizacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dispositivo.status === 'online'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {dispositivo.status === 'online' ? (
                              <Wifi className="h-3 w-3 mr-1" />
                            ) : (
                              <WifiOff className="h-3 w-3 mr-1" />
                            )}
                            {dispositivo.status === 'online'
                              ? 'Online'
                              : 'Offline'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {dispositivo.registrosHoje}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
                  {/* Status Badge */}
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        dispositivoSelecionado.status === 'online'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {dispositivoSelecionado.status === 'online' ? (
                        <Wifi className="h-4 w-4 mr-2" />
                      ) : (
                        <WifiOff className="h-4 w-4 mr-2" />
                      )}
                      {dispositivoSelecionado.status === 'online'
                        ? 'Online'
                        : 'Offline'}
                    </span>
                  </div>

                  {/* Informações Gerais */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Informações Gerais
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Nome</label>
                        <p className="font-medium">
                          {dispositivoSelecionado.nome}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Número de Série
                        </label>
                        <p className="font-medium font-mono">
                          {dispositivoSelecionado.numeroSerie}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Modelo</label>
                        <p className="font-medium">
                          {dispositivoSelecionado.modelo}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Localização
                        </label>
                        <p className="font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {dispositivoSelecionado.localizacao}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações Técnicas */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Informações Técnicas
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
                          Versão do Firmware
                        </label>
                        <p className="font-medium">
                          {dispositivoSelecionado.versaoFirmware}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Última Sincronização
                        </label>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatarDataHora(
                            dispositivoSelecionado.ultimaSincronizacao
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Estatísticas
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <label className="text-xs text-blue-600 font-medium">
                          Registros Hoje
                        </label>
                        <p className="text-2xl font-bold text-blue-900">
                          {dispositivoSelecionado.registrosHoje}
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