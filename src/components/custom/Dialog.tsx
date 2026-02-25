import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Clock, Plus, X } from 'lucide-react'
import type { RegistroResponse } from '@/types/response'
import { Input } from '../ui/input';
import { useState } from 'react';
import { postRegistro } from '@/services/registros';
import { useParams } from 'react-router';

interface RegistroAgrupado {
  data: string;
  registros: RegistroResponse[];
  entrada?: string;
  saida?: string;
  horasTrabalhadas?: string;
}

interface DialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dia: RegistroAgrupado | null;
}
 
const DialogCustom: React.FC<DialogProps> = ({ open, setOpen, dia }) => {
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [novoRegistro, setNovoRegistro] = useState<{ hora: string; tipo: 'E' | 'S' }>({
        hora: '',
        tipo: 'E'
    });
    const { empresa } = useParams<{ empresa: string }>();
    const token = localStorage.getItem('accessToken') || '';

    if (!dia) return null;

    const formatarData = (data: string) => {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const formatarDiaSemana = (data: string) => {
        const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const date = new Date(data + 'T00:00:00');
        return diasSemana[date.getDay()];
    };

    // Valida se o dia está completo (entrada + saída)
    const estaCompleto = dia.entrada && dia.saida;

    // Determina qual tipo de registro está faltando
    const registroFaltante = !dia.entrada ? 'E' : !dia.saida ? 'S' : null;

    const handleAdicionarRegistro = () => {
        // Limpa o formulário sem salvar em lugar nenhum
        if (!empresa || !token) return;

        const date = new Date(`${dia.data}T${novoRegistro.hora}:00`).toISOString();

        const horaISO = date.split('T')[1].substring(0, 8); // Extrai apenas a parte da hora no formato HH:MM

        postRegistro(empresa, token, { cpf_funcionario: dia.registros[0].cpf_funcionario, empresa_id: dia.registros[0].empresa_id, relogio_id: dia.registros[0].relogio_id, data: dia.data, hora: horaISO, tipo: novoRegistro.tipo });
        setNovoRegistro({ hora: '', tipo: 'E' });
        setShowAddForm(false);
    };

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel 
                        transition
                        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl transition-all data-closed:opacity-0 data-closed:scale-95 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    >
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-xl font-semibold text-gray-900">
                                        {formatarData(dia.data)}
                                    </DialogTitle>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatarDiaSemana(dia.data)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            {/* Resumo do Dia */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className={`rounded-lg p-4 ${dia.entrada ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                    <p className={`text-sm font-medium mb-1 ${dia.entrada ? 'text-green-600' : 'text-yellow-600'}`}>
                                        Entrada
                                    </p>
                                    <p className={`text-2xl font-bold ${dia.entrada ? 'text-green-700' : 'text-yellow-700'}`}>
                                        {dia.entrada || '-'}
                                    </p>
                                </div>
                                <div className={`rounded-lg p-4 ${dia.saida ? 'bg-red-50' : 'bg-yellow-50'}`}>
                                    <p className={`text-sm font-medium mb-1 ${dia.saida ? 'text-red-600' : 'text-yellow-600'}`}>
                                        Saída
                                    </p>
                                    <p className={`text-2xl font-bold ${dia.saida ? 'text-red-700' : 'text-yellow-700'}`}>
                                        {dia.saida || '-'}
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm text-blue-600 font-medium mb-1">Total</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {dia.horasTrabalhadas || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Alerta de Registro Incompleto */}
                            {!estaCompleto && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800 font-medium mb-3">
                                        ⚠️ Registro incompleto. Falta{' '}
                                        <span className="font-semibold">
                                            {!dia.entrada ? 'entrada' : 'saída'}
                                        </span>
                                    </p>
                                    
                                    {!showAddForm && (
                                        <button
                                            onClick={() => setShowAddForm(true)}
                                            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium text-sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar {!dia.entrada ? 'Entrada' : 'Saída'}
                                        </button>
                                    )}

                                    {/* Formulário para Adicionar Registro */}
                                    {showAddForm && (
                                        <div className="mt-4 p-4 bg-white border border-yellow-300 rounded-lg">
                                            <div className="flex gap-3 items-end">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Horário {!dia.entrada ? 'Entrada' : 'Saída'}
                                                    </label>
                                                    <Input
                                                        type="time"
                                                        value={novoRegistro.hora}
                                                        onChange={(e) =>
                                                            setNovoRegistro({
                                                                ...novoRegistro,
                                                                hora: e.target.value,
                                                                tipo: registroFaltante || 'E'
                                                            })
                                                        }
                                                        placeholder="HH:MM"
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleAdicionarRegistro}
                                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowAddForm(false);
                                                            setNovoRegistro({ hora: '', tipo: 'E' });
                                                        }}
                                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                * Esse registro não será salvo. Use apenas para visualizar como ficaria o dia.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Lista de Todos os Registros */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Registros do Dia ({dia.registros.length})
                                </h3>
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {dia.registros.map((registro, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    registro.tipo === 'E' ? 'bg-green-500' : 'bg-red-500'
                                                }`} />
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {registro.hora}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {registro.tipo === 'E' ? 'Entrada' : 'Saída'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-6 py-4">
                            <button
                                onClick={() => {setOpen(false); setShowAddForm(false); setNovoRegistro({ hora: '', tipo: 'E' })}}
                                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Fechar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default DialogCustom