const initArea = {
  area: [],
};

export const areaReducer = (state = initArea, action) => {
  switch (action.type) {
    case "SET_AREA":
      return {
        ...state,
        area: action.value,
      };

    default:
      return state;
  }
};
