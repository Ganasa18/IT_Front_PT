const initUser = {
  users: [],
  modalOpenExport: false,
  userArea: [],
  userRole: [],
  userDepartement: [],
  userImport: null,
};

export const userReducer = (state = initUser, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        users: action.value,
      };
    case "SET_USER_MODAL_EXPORT":
      return {
        ...state,
        modalOpenExport: action.value,
      };
    case "SET_USER_AREA":
      return {
        ...state,
        userArea: action.value,
      };
    case "SET_USER_ROLE":
      return {
        ...state,
        userRole: action.value,
      };
    case "SET_USER_DEPARTEMENT":
      return {
        ...state,
        userDepartement: action.value,
      };
    case "SET_USER_FILE":
      return {
        ...state,
        userImport: action.value,
      };
    default:
      return state;
  }
};
