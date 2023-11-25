import { hasPermission } from './';

const permissionCodes = {
  deviceAdmin: 1,
  deviceDetail: 1,
  deviceSetting: 1,
  recognition: 1,
  targetVehicle: 1,
};

describe('hasPermission', () => {
  test('验证单个权限', () => {
    expect(hasPermission('deviceAdmin', permissionCodes)).toBe(true);
    expect(hasPermission('userAdmin', permissionCodes)).toBe(false);
  });

  test('验证权限不存在时，可使用 ! 处理', () => {
    expect(hasPermission('!deviceAdmin', permissionCodes)).toBe(false);
    expect(hasPermission('!userAdmin', permissionCodes)).toBe(true);
  });

  test('验证两个权限必须同时存在时，使用 & 处理', () => {
    expect(hasPermission('deviceAdmin & deviceDetail', permissionCodes)).toBe(true);
    expect(hasPermission('deviceAdmin & userAdmin', permissionCodes)).toBe(false);
  });

  test('验证两个权限码只要一个存在时，使用 | 处理', () => {
    expect(hasPermission('deviceAdmin | deviceDetail', permissionCodes)).toBe(true);
    expect(hasPermission('deviceAdmin | userAdmin', permissionCodes)).toBe(true);
    expect(hasPermission('userDetail | userAdmin', permissionCodes)).toBe(false);
  });

  test('使用小括号提升验证优先级', () => {
    expect(hasPermission('(deviceAdmin|deviceDetail)&userAdmin', permissionCodes)).toBe(false);
  });
});
