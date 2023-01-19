import {
  ROLE_ALERT,
  ROLE_CREATE,
  ROLE_DELETE,
  ROLE_FETCH_ACCESS_MODULES,
  ROLE_FETCH_DATATABLE,
  ROLE_FETCH_DETAIL,
  ROLE_FETCH_EXTENSION_STATUS_DATA,
  ROLE_FETCH_SELECT_LIST,
  ROLE_FETCH_SELECT_LIST_ROLE_TYPE,
  ROLE_UPDATE
} from '@constants/Role';

const initState = {
  initialValue: {
    code: '',
    name: '',
    roleType: '',
    listModuleCode: []
  },
  roleDetail: {
    statusData: '',
    createdBy: '',
    createdDt: '',
    updatedBy: '',
    updatedDt: '',
    roleCode: '',
    roleName: '',
    roleDescription: '',
    roleType: '',
    roleModules: [
      {
        roleModuleId: '',
        statusData: '',
        moduleCode: '',
        moduleName: '',
        createdDt: '',
        roleModuleScopes: []
      }
    ]
  },
  dataTable: {
    totalItem: 0,
    totalFilteredItem: 0,
    items: []
  },
  roleModules: [],
  selectList: [],
  selectListRoleType: [],
  extension: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const roleReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case ROLE_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case ROLE_FETCH_SELECT_LIST:
      return { ...state, selectList: payload };
    case ROLE_FETCH_SELECT_LIST_ROLE_TYPE:
      return { ...state, selectListRoleType: payload };
    case ROLE_FETCH_EXTENSION_STATUS_DATA:
      return { ...state, extension: payload };
    case ROLE_FETCH_DETAIL:
      return { ...state, roleDetail: payload };
    case ROLE_FETCH_ACCESS_MODULES:
      return { ...state, roleModules: payload };
    case ROLE_ALERT:
      return { ...state, alert: payload };
    case ROLE_CREATE:
      return {
        ...state,
        initialValue: { code: '', name: '', roleType: '', listModuleCode: [] }
      };

    default:
      return state;
  }
};

export default roleReducers;
