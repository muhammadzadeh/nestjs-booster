import { ControllerType } from './common.enums';

export const TENANT_CONFIG = {
  USER: {
    type: ControllerType.USER,
    name: 'User',
    route: '/user',
  },
  ADMIN: {
    type: ControllerType.ADMIN,
    name: 'Admin',
    route: '/admin',
  },
  COMMON: {
    type: ControllerType.COMMON,
    name: 'Common',
    route: '/common',
  },
};


export const MIN_PAGE_NUMBER = 1;
export const MIN_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MAX_INT = 2147483647;