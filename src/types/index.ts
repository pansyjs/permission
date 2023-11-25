export type PermissionCode = string;

export type Operator = 'and' | 'or' | 'not';

export interface Expression {
  operator: Operator;
  permissions: Authority[];
}

export type Authority = PermissionCode | Expression | string | undefined;
