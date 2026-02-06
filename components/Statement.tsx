import React from 'react';
import { AppConfig, DateSelection } from '../types';
import { formatCurrency, months } from '../utils/helpers';
import { Wallet, Utensils, Heart, PlusCircle, CalendarDays } from 'lucide-react';

interface StatementProps {
  config: AppConfig;
  date: DateSelection;
}

export const Statement: React.FC<StatementProps> = ({ config, date }) => {
  // Calculations
  const refectoryTotal = config.refectoryDaily * config.refectoryDays;
  const plrMonthly = config.plrEnabled ? config.plrAnnual / 12 : 0;
  const vaTotal = config.vaEnabled ? config.vaMonthly : 0;
  const othersTotal = config.others.reduce((acc, item) => acc + item.value, 0);

  const totalMonthly = config.salary + refectoryTotal + config.healthPlan + config.lifeInsurance + plrMonthly + vaTotal + othersTotal;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header of the printed page (only visible in print) */}
      <div className="hidden print:block mb-8 border-b-2 border-blue-900 pb-4">
        <h1 className="text-2xl font-bold text-blue-900">Extrato de Remuneração Total</h1>
        <p className="text-sm text-slate-600">Referência: {months[date.month]} / {date.year}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
        
        {/* Remuneração Direta */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between print:break-inside-avoid">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-700">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Remuneração Direta</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-600">
                <span>Salário Base</span>
                <span className="font-semibold text-slate-900">{formatCurrency(config.salary)}</span>
              </div>
               {config.plrEnabled && (
                <div className="flex justify-between items-center text-slate-600">
                    <span>PLR (Estimado/Mensalizado)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(plrMonthly)}</span>
                </div>
               )}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Subtotal</span>
            <span className="font-bold text-lg text-green-700">{formatCurrency(config.salary + plrMonthly)}</span>
          </div>
        </div>

        {/* Alimentação */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between print:break-inside-avoid">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Alimentação</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-600">
                <div className="flex flex-col">
                    <span>Refeitório</span>
                    <span className="text-xs text-slate-400">({config.refectoryDays} dias x {formatCurrency(config.refectoryDaily)})</span>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(refectoryTotal)}</span>
              </div>
              {config.vaEnabled && (
                <div className="flex justify-between items-center text-slate-600">
                    <span>Vale Alimentação</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(config.vaMonthly)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Subtotal</span>
            <span className="font-bold text-lg text-orange-700">{formatCurrency(refectoryTotal + vaTotal)}</span>
          </div>
        </div>

        {/* Saúde */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between print:break-inside-avoid">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg text-red-700">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Saúde e Proteção</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-600">
                <span>Plano de Saúde (Empresa)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(config.healthPlan)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Seguro de Vida</span>
                <span className="font-semibold text-slate-900">{formatCurrency(config.lifeInsurance)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Subtotal</span>
            <span className="font-bold text-lg text-red-700">{formatCurrency(config.healthPlan + config.lifeInsurance)}</span>
          </div>
        </div>

        {/* Outros Benefícios */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between print:break-inside-avoid">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Outros Benefícios</h3>
            </div>
            <div className="space-y-3">
                {config.others.length > 0 ? (
                    config.others.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-slate-600">
                            <span>{item.name}</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 italic">Nenhum benefício adicional cadastrado.</p>
                )}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Subtotal</span>
            <span className="font-bold text-lg text-purple-700">{formatCurrency(othersTotal)}</span>
          </div>
        </div>
      </div>

      {/* Total Geral */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-lg p-8 text-white print:bg-none print:bg-white print:border-2 print:border-blue-900 print:text-blue-900 print:shadow-none print:break-inside-avoid">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full print:bg-blue-100 print:text-blue-900">
                    <CalendarDays className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Total Mensal Estimado</h2>
                    <p className="text-blue-200 print:text-slate-600">Soma de salário e benefícios para {months[date.month]}/{date.year}</p>
                </div>
            </div>
            <div className="text-4xl font-extrabold tracking-tight">
                {formatCurrency(totalMonthly)}
            </div>
        </div>
      </div>
    </div>
  );
};