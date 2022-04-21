const initCategory = {
  category: [],
  optCategory: [],
  expandedCategory: [],
  lastCategoryId: null,
};

export const categoryReducer = (state = initCategory, action) => {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...state,
        category: action.value,
      };
    case "SET_OPTION_CATEGORY":
      return {
        ...state,
        optCategory: action.value,
      };
    case "SET_EXPANDED_CATEGORY":
      return {
        ...state,
        expandedCategory: action.value,
      };

    case "SET_LAST_CATEGORY_ID":
      return {
        ...state,
        lastCategoryId: action.value,
      };

    default:
      return state;
  }
};
