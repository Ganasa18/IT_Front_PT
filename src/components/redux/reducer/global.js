const initGlobalState = {
  isLoading: true,
  isModalTicketReq: false,
  commentTicket: null,
  userOnly: null,
};

export const globalReducer = (state = initGlobalState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.value,
      };
    case "SET_MODAL_REQUEST":
      return {
        ...state,
        isModalTicketReq: action.value,
      };
    case "SET_COMMENT_REQUEST":
      return {
        ...state,
        commentTicket: action.value,
      };
    case "SET_USER_REQUEST":
      return {
        ...state,
        userOnly: action.value,
      };
    default:
      return state;
  }
};
