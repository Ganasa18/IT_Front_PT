const initDepartement = {
  departement: [],
  expandedDepartement: [],
  lastDepartementId: null,
};

export const dapartementReducer = (state = initDepartement, action) => {
  switch (action.type) {
    case "SET_DEPARTEMENT":
      return {
        ...state,
        departement: action.value,
      };
    case "SET_EXPANDED_DEPARTEMENT":
      return {
        ...state,
        expandedDepartement: action.value,
      };
    case "SET_LAST_DEPARTEMENT_ID":
      return {
        ...state,
        lastDepartementId: action.value,
      };

    default:
      return state;
  }
};
