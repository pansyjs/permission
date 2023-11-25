import type { Authority, Expression } from '../types';

export const and = (...permissions: Authority[]): Expression => ({
  operator: 'and',
  permissions: permissions,
});

export const or = (...permissions: Authority[]): Expression => ({
  operator: 'or',
  permissions: permissions,
});

export const not = (permission: Authority): Expression => ({
  operator: 'not',
  permissions: [permission],
});
