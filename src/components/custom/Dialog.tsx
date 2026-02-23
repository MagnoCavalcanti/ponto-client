import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Clock } from 'lucide-react'
import type { RegistroResponse } from '@/types/response'

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
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            {/* Resumo do Dia */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-sm text-green-600 font-medium mb-1">Entrada</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {dia.entrada || '-'}
                                    </p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <p className="text-sm text-red-600 font-medium mb-1">Saída</p>
                                    <p className="text-2xl font-bold text-red-700">
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
                                onClick={() => setOpen(false)}
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