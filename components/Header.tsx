import React from 'react';
import { User, CreditCard, Briefcase } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white p-6 shadow-md print:bg-white print:text-blue-900 print:border-b-2 print:border-blue-900">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Extrato de Remuneração Total
          </h1>
          <p className="text-blue-200 text-sm mt-1 print:text-blue-800">
            Demonstrativo simplificado de benefícios e salários
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm bg-blue-800/50 p-3 rounded-lg border border-blue-700/50 print:bg-transparent print:border-0 print:p-0 print:justify-end">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-300 print:text-blue-900" />
            <div>
              <span className="block text-xs text-blue-300 uppercase font-semibold print:text-slate-500">Colaborador</span>
              <span className="font-medium">Marcos Almeida</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-300 font-mono text-xs print:text-slate-500">MATRÍCULA</span>
            <span className="font-medium">123456</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-300 print:text-blue-900" />
            <div>
              <span className="block text-xs text-blue-300 uppercase font-semibold print:text-slate-500">Cargo</span>
              <span className="font-medium">Operador de Produção</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};