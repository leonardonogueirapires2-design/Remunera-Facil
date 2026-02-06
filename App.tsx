import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { Statement } from './components/Statement';
import { AppConfig, DateSelection } from './types';
import { getBusinessDays, months } from './utils/helpers';
import { Download, Calendar } from 'lucide-react';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export default function App() {
  const [date, setDate] = useState<DateSelection>({
    month: currentMonth,
    year: currentYear
  });

  const [businessDays, setBusinessDays] = useState(getBusinessDays(currentYear, currentMonth));

  const [config, setConfig] = useState<AppConfig>({
    salary: 1800,
    refectoryDaily: 24,
    refectoryDays: businessDays, // Init with calculated
    useCalculatedDays: true,
    healthPlan: 550,
    lifeInsurance: 150,
    plrEnabled: false,
    plrAnnual: 18000,
    vaEnabled: true, // Enabled by default now as it is fixed
    vaMonthly: 200, // Fixed at 200
    others: [
      { id: 'sys_wellhub', name: 'Auxílio Wellhub (Gympass)', value: 30, fixed: true },
      { id: 'sys_dep_health', name: 'Plano de Saúde - Dep. (Filho 5 anos)', value: 220, fixed: true }
    ]
  });

  // Recalculate business days when date changes
  useEffect(() => {
    const days = getBusinessDays(date.year, date.month);
    setBusinessDays(days);
    
    // Auto-update refectory days if flag is true
    if (config.useCalculatedDays) {
        setConfig(prev => ({ ...prev, refectoryDays: days }));
    }
  }, [date.month, date.year]); // Dependency on date only

  // If user toggles back to calculated days, sync immediately
  useEffect(() => {
    if (config.useCalculatedDays && config.refectoryDays !== businessDays) {
        setConfig(prev => ({ ...prev, refectoryDays: businessDays }));
    }
  }, [config.useCalculatedDays, businessDays]);


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12 print:pb-0 print:bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 print:mt-0 print:px-0">
        {/* Date Selector Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100 print:hidden">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-700">
                <Calendar className="w-5 h-5" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <select 
                    value={date.month}
                    onChange={(e) => setDate({ ...date, month: Number(e.target.value) })}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border font-medium text-slate-700"
                >
                    {months.map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                    ))}
                </select>
                <select
                    value={date.year}
                    onChange={(e) => setDate({ ...date, year: Number(e.target.value) })}
                    className="block w-24 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border font-medium text-slate-700"
                >
                    {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        <ConfigPanel 
            config={config} 
            onChange={setConfig} 
            calculatedBusinessDays={businessDays}
        />

        <div className="mt-6">
            <Statement config={config} date={date} />
        </div>

        <div className="mt-8 text-center text-slate-500 text-xs print:mt-12 print:text-left">
            <p>Este extrato tem finalidade meramente informativa e de simulação, não substituindo o holerite oficial ou documentos legais da empresa.</p>
            <p className="mt-1">Gerado automaticamente pelo sistema RemuneraFácil em {new Date().toLocaleDateString('pt-BR')}.</p>
        </div>
      </main>
    </div>
  );
}