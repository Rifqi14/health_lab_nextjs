import assets from 'public/index';

export const SidebarIcon = {
  'registrasi-lab-partner': `${assets.SidebarLab.src}`,
  'user-management': `${assets.SidebarUserManagement.src}`,
  'role-management': `${assets.SidebarRoleManagement.src}`,
  'master-corporate': `${assets.SidebarMasterCorporate.src}`,
  'transaction-payment-code': `${assets.SidebarTransaction.src}`,
  'master-cooperation-termId': `${assets.SidebarKerjasama.src}`,
  'lab-partner-transaction': `${assets.SidebarLabTransaction.src}`
};
export const SideBarList = [
  {
    id: 1,
    icon: assets.SidebarRoleManagement,
    title: 'Role Management',
    link: 'role-management',
    moduleCode: 'role-management'
  },
  {
    id: 2,
    icon: assets.SidebarUserManagement,
    title: 'User Management',
    link: 'user-management',
    moduleCode: 'user-management'
  },
  {
    id: 3,
    icon: assets.SidebarMasterCorporate,
    title: 'Master Corporate',
    link: 'master-corporate',
    moduleCode: 'master-corporate'
  },
  {
    id: 4,
    icon: assets.SidebarTransaction,
    title: 'Transaction Payment Code',
    link: 'transaction-payment-code',
    moduleCode: 'transaction-payment-code'
  },
  {
    id: 5,
    icon: assets.SidebarKerjasama,
    title: 'Master Ketentuan Kerjasama',
    link: 'master-ketentuan-kerjasama',
    moduleCode: 'master-cooperation-termId'
  },
  {
    id: 6,
    icon: assets.SidebarLab,
    title: 'Registrasi Lab Partner',
    link: 'registrasi-lab-partner',
    moduleCode: 'registrasi-lab-partner'
  },
  {
    id: 7,
    icon: assets.SidebarLabTransaction,
    title: 'Lab Partner Transaction',
    link: 'lab-partner-transaction',
    moduleCode: 'lab-partner-transaction'
  }
];

export const SIDEBAR_MODULE = 'SIDEBAR_MODULE';
export const SIDEBAR_UNALLOWED_MODULE = 'SIDEBAR_UNALLOWED_MODULE';
export const SIDEBAR = 'SIDEBAR';
export const CHANGE_SIDEBAR_MODE = 'CHANGE_SIDEBAR_MODE';
