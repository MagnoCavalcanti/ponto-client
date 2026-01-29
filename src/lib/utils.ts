import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarCPF(cpf: string): string {
  // Remove tudo que não é dígito
  const apenasNumeros = cpf.replace(/\D/g, '');
  
  // Aplica a máscara xxx.xxx.xxx-xx
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
