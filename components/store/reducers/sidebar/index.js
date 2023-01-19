import assets from "@/public/index";
import {CHANGE_SIDEBAR_MODE} from "@constants/Sidebar";

const {
  SIDEBAR_MODULE,
  SIDEBAR_UNALLOWED_MODULE,
  SIDEBAR
} = require('@constants/Sidebar');

const initState = {
  modules: [],
  unAllowedModules: [],
  sideBar: [],
  allowedSidebar: [],
  active: true,
};

const sidebarReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case SIDEBAR_MODULE:
      return { ...state, modules: payload };
    case SIDEBAR_UNALLOWED_MODULE:
      return { ...state, unAllowedModules: payload };
    case SIDEBAR:
      return { ...state, sideBar: payload };
    case 'ALLOWED_SIDEBAR':
      const moduleCodes = payload.map(item => item.moduleCode);
      const sideBarList = [
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
          moduleCode: 'master-lab-partner'
        },
        {
          id: 7,
          icon: assets.SidebarLabTransaction,
          title: 'Lab Partner Transaction',
          link: 'lab-partner-transaction',
          moduleCode: 'lab-partner-transaction'
        }
      ]
      const allowedSidebar = sideBarList.filter(item => moduleCodes.includes(item.moduleCode));
      return { ...state, allowedSidebar: allowedSidebar };
    case CHANGE_SIDEBAR_MODE:
      console.log(payload)
      return { ...state, active: payload };

    default:
      return state;
  }
};

export default sidebarReducers;
