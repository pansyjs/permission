import { compile } from './compiler';

import type { Authority, Expression, PermissionCode } from '../types';

function isPermissionCode(authority: Authority) {
  return typeof authority === 'string';
}

function _hasPermission(authority: Authority, permissions: Record<PermissionCode, number> = {}): boolean {
  if (!!authority) {
    if (isPermissionCode(authority)) {
      return !!permissions[authority as PermissionCode];
    } else {
      const operator = (authority as Expression).operator;
      const acl = (authority as Expression).permissions;
      if (operator === 'and') {
        return acl.every((c) => _hasPermission(c, permissions));
      } else if (operator === 'or') {
        return acl.some((c) => _hasPermission(c, permissions));
      } else if (operator === 'not') {
        return !_hasPermission(acl?.[0], permissions);
      } else {
        return false;
      }
    }
  } else {
    return true;
  }
}

export const hasPermission = (_authority: Authority, permissions: Record<PermissionCode, number> = {}) => {
  let has = false;

  try {
    const authority = compile(_authority);
    has = _hasPermission(authority, permissions);
  } catch (error) {
    console.error('权限表达式编译错误------>>>');
  }

  return has;
};
