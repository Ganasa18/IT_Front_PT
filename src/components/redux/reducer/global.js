const initGlobalState = {
  isLoading: true,
};

export const globalReducer = (state = initGlobalState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.value,
      };
    default:
      return state;
  }
};
