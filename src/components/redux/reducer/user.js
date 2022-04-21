const initUser = {
  users: [],
};

export const userReducer = (state = initUser, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        users: action.value,
      };
    default:
      return state;
  }
};
