import React, { useState } from 'react';
import { AppConfig, OtherBenefit } from '../types';
import { Settings, Plus, Trash2, RefreshCcw, Calculator, Lock } from 'lucide-react';
import { generateId } from '../utils/helpers';

interface ConfigPanelProps {
  config: AppConfig;
  onChange: (newConfig: AppConfig) => void;
  calculatedBusinessDays: number;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange, calculatedBusinessDays }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newBenefitName, setNewBenefitName] = useState('');
  const [newBenefitValue, setNewBenefitValue] = useState('');

  const updateConfig = <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const handleAddBenefit = () => {
    if (newBenefitName && newBenefitValue) {
      const value = parseFloat(newBenefitValue.replace(',', '.'));
      if (!isNaN(value)) {
        const newBenefit: OtherBenefit = {
          id: generateId(),
          name: newBenefitName,
          value: value,
          fixed: false
        };
        updateConfig('others', [...config.others, newBenefit]);
        setNewBenefitName('');
        setNewBenefitValue('');
      }
    }
  };

  const handleRemoveBenefit = (id: string) => {
    updateConfig('others', config.others.filter(b => b.id !== id));
  };

  const resetToDefaults = () => {
    onChange({
      salary: 1800,
      refectoryDaily: 24,
      refectoryDays: calculatedBusinessDays,
      useCalculatedDays: true,
      healthPlan: 550,
      lifeInsurance: 150,
      plrEnabled: false,
      plrAnnual: 18000,
      vaEnabled: true,
      vaMonthly: 200,
      others: [
        { id: 'sys_wellhub', name: 'Auxílio Wellhub (Gympass)', value: 30, fixed: true },
        { id: 'sys_dep_health', name: 'Plano de Saúde - Dep. (Filho 5 anos)', value: 220, fixed: true }
      ]
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden no-print">
      <div 
        className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Parâmetros de Cálculo
        </h2>
        <span className="text-sm text-blue-600 font-medium">{isOpen ? 'Ocultar' : 'Editar'}</span>
      </div>

      {isOpen && (
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Remuneração Base */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Base</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                Salário Base (R$)
                <Lock className="w-3 h-3 text-slate-400" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={config.salary}
                  disabled
                  className="w-full rounded-md border-slate-200 bg-slate-100 text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Refeitório */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Refeitório</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  Valor/Dia (R$)
                  <Lock className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="number"
                  value={config.refectoryDaily}
                  disabled
                  className="w-full rounded-md border-slate-200 bg-slate-100 text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dias</label>
                <div className="flex items-center gap-2">
                    <input
                    type="number"
                    value={config.refectoryDays}
                    onChange={(e) => {
                        updateConfig('refectoryDays', Number(e.target.value));
                        updateConfig('useCalculatedDays', false);
                    }}
                    className={`w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${config.useCalculatedDays ? 'bg-slate-100 text-slate-500' : ''}`}
                    />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <button 
                    onClick={() => {
                        updateConfig('refectoryDays', calculatedBusinessDays);
                        updateConfig('useCalculatedDays', true);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded border ${config.useCalculatedDays ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <Calculator className="w-3 h-3" />
                    Usar dias úteis ({calculatedBusinessDays})
                </button>
            </div>
          </div>

          {/* Saúde */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Saúde</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  Custeio Empresa (R$)
                  <Lock className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="number"
                  value={config.healthPlan}
                  disabled
                  className="w-full rounded-md border-slate-200 bg-slate-100 text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  Seguro de Vida (R$)
                  <Lock className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="number"
                  value={config.lifeInsurance}
                  disabled
                  className="w-full rounded-md border-slate-200 bg-slate-100 text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* PLR */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                PLR
                <label className="inline-flex items-center cursor-pointer" title="Simular inclusão">
                    <input 
                        type="checkbox" 
                        checked={config.plrEnabled} 
                        onChange={(e) => updateConfig('plrEnabled', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </h3>
            <div className={config.plrEnabled ? '' : 'opacity-50 pointer-events-none'}>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                Valor Anual Estimado (R$)
                <Lock className="w-3 h-3 text-slate-400" />
              </label>
              <input
                type="number"
                value={config.plrAnnual}
                disabled
                className="w-full rounded-md border-slate-200 bg-slate-100 text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Mensalizado: R$ {(config.plrAnnual / 12).toFixed(2)}</p>
            </div>
          </div>

          {/* Vale Alimentação */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                Vale Alimentação
                <label className="inline-flex items-center cursor-pointer" title="Habilitar benefício">
                    <input 
                        type="checkbox" 
                        checked={config.vaEnabled} 
                        onChange={(e) => updateConfig('vaEnabled', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </h3>
            <div className={config.vaEnabled ? '' : 'opacity-50 pointer-events-none'}>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                Valor Mensal (R$)
                <Lock className="w-3 h-3 text-slate-400" />
              </label>
              <input
                type="number"
                value={config.vaMonthly}
                disabled
                className="w-full rounded-md border-slate-200 bg-slate-100 text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-not-allowed"
              />
            </div>
          </div>

           {/* Outros Benefícios */}
           <div className="md:col-span-2 lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Outros Benefícios</h3>
            <div className="space-y-2">
                {config.others.map(item => (
                    <div key={item.id} className={`flex items-center gap-2 p-2 rounded border ${item.fixed ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="flex-1 text-sm font-medium text-slate-700 truncate">{item.name}</span>
                        <span className="text-sm text-slate-600">R$ {item.value.toFixed(2)}</span>
                        {item.fixed ? (
                             <Lock className="w-4 h-4 text-blue-300" />
                        ) : (
                            <button onClick={() => handleRemoveBenefit(item.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={newBenefitName}
                        onChange={(e) => setNewBenefitName(e.target.value)}
                        className="w-full rounded-l-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                    />
                </div>
                <div className="w-24">
                    <input
                        type="number"
                        placeholder="Valor"
                        value={newBenefitValue}
                        onChange={(e) => setNewBenefitValue(e.target.value)}
                        className="w-full border-y border-l-0 border-r-0 border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                    />
                </div>
                <button
                    onClick={handleAddBenefit}
                    className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
            <button 
                onClick={resetToDefaults}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
                <RefreshCcw className="w-4 h-4" />
                Resetar para padrões
            </button>
        </div>
      )}
    </div>
  );
};