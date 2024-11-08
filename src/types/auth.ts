export interface User {
  id: string;
  email: string;
  plan: 'basic' | 'plus' | 'pro';
  usageThisMonth: number;
  lastUsageReset: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const PLAN_LIMITS = {
  basic: 100,
  plus: 500,
  pro: Infinity
};