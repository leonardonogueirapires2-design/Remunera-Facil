export interface OtherBenefit {
  id: string;
  name: string;
  value: number;
  fixed?: boolean;
}

export interface AppConfig {
  salary: number;
  refectoryDaily: number;
  refectoryDays: number;
  useCalculatedDays: boolean;
  healthPlan: number;
  lifeInsurance: number;
  plrEnabled: boolean;
  plrAnnual: number;
  vaEnabled: boolean;
  vaMonthly: number;
  others: OtherBenefit[];
}

export interface DateSelection {
  month: number; // 0-11
  year: number;
}