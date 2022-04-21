const initRole = {
  roles: [],
};

export const rolesReducer = (state = initRole, action) => {
  switch (action.type) {
    case "SET_ROLES":
      return {
        ...state,
        roles: action.value,
      };
    default:
      return state;
  }
};
